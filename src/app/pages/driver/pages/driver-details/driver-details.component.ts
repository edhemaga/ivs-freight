import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject, take, takeUntil, tap } from 'rxjs';

// moment
import moment from 'moment';

// components
import { DriverMvrModalComponent } from '@pages/driver/pages/driver-modals/driver-mvr-modal/driver-mvr-modal.component';
import { DriverMedicalModalComponent } from '@pages/driver/pages/driver-modals/driver-medical-modal/driver-medical-modal.component';
import { DriverDrugAlcoholTestModalComponent } from '@pages/driver/pages/driver-modals/driver-drug-alcohol-test-modal/driver-drug-alcohol-test-modal.component';
import { DriverCdlModalComponent } from '@pages/driver/pages/driver-modals/driver-cdl-modal/driver-cdl-modal.component';
import { DriverDetailsItemComponent } from '@pages/driver/pages/driver-details/components/driver-details-item/driver-details-item.component';
import { TaDetailsHeaderComponent } from '@shared/components/ta-details-header/ta-details-header.component';
import { DriverModalComponent } from '@pages/driver/pages/driver-modals/driver-modal/driver-modal.component';
import { ConfirmationActivationModalComponent } from '@shared/components/ta-shared-modals/confirmation-activation-modal/confirmation-activation-modal.component';
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';

// helpers
import { DriverDetailsHelper } from '@pages/driver/pages/driver-details/utils/helpers/driver-details.helper';
import { AvatarColorsHelper } from '@shared/utils/helpers/avatar-colors.helper';

// services
import { ModalService } from '@shared/services/modal.service';
import { DriverService } from '@pages/driver/services/driver.service';
import { DetailsPageService } from '@shared/services/details-page.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { DetailsDataService } from '@shared/services/details-data.service';
import { ConfirmationActivationService } from '@shared/components/ta-shared-modals/confirmation-activation-modal/services/confirmation-activation.service';

// enums
import { DriverDetailsStringEnum } from '@pages/driver/pages/driver-details/enums/driver-details-string.enum';
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { DriverDetailsItemStringEnum } from '@pages/driver/pages/driver-details/components/driver-details-item/enums/driver-details-item-string.enum';
import { eSharedString } from '@shared/enums';

// pipes
import { NameInitialsPipe } from '@shared/pipes/name-initials.pipe';

// store
import {
    DriverMinimalListState,
    DriversMinimalListStore,
} from '@pages/driver/state/driver-details-minimal-list-state/driver-minimal-list.store';
import { DriversMinimalListQuery } from '@pages/driver/state/driver-details-minimal-list-state/driver-minimal-list.query';
import { DriversDetailsListQuery } from '@pages/driver/state/driver-details-list-state/driver-details-list.query';
import { DriversItemStore } from '@pages/driver/state/driver-details-state/driver-details-item.store';

// models
import { DetailsDropdownOptions } from '@shared/models/details-dropdown-options.model';
import { DetailsConfig } from '@shared/models/details-config.model';
import { DriverResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-driver-details',
    templateUrl: './driver-details.component.html',
    styleUrls: ['./driver-details.component.scss'],
    providers: [NameInitialsPipe],
    standalone: true,
    imports: [
        // modules
        CommonModule,

        // components
        DriverDetailsItemComponent,
        TaDetailsHeaderComponent,
    ],
})
export class DriverDetailsComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public detailsDropdownOptions: DetailsDropdownOptions;
    public driverDetailsConfig: DetailsConfig[] = [];

    public currentIndex: number = 0;

    public driversList: DriverMinimalListState;
    public driverObject: DriverResponse;

    public driverId: number;
    public newDriverId: number;

    public isInactive: boolean = false;

    public hasDangerCdl: boolean;
    public hasDangerMedical: boolean;
    public hasDangerMvr: boolean;

    constructor(
        private cdRef: ChangeDetectorRef,

        // router
        private router: Router,
        private activatedRoute: ActivatedRoute,

        // services
        private modalService: ModalService,
        private driverService: DriverService,
        private detailsPageDriverService: DetailsPageService,
        private confirmationService: ConfirmationService,
        private detailsDataService: DetailsDataService,
        private confirmationActivationService: ConfirmationActivationService,

        // store
        private driverMinimimalListStore: DriversMinimalListStore,
        private driverMinimalQuery: DriversMinimalListQuery,
        private driverDetailsQuery: DriversDetailsListQuery,
        private driversItemStore: DriversItemStore,

        // pipes
        private nameInitialsPipe: NameInitialsPipe
    ) {}

    ngOnInit() {
        this.getDriverData();

        this.getStoreData();

        this.getDriversMinimalList();

        this.confirmationSubscribe();

        this.confirmationActivationSubscribe();

        this.handleDriverIdRouteChange();
    }

    public trackByIdentity(index: number): number {
        return index;
    }

    public isEmpty(obj: Record<string, any>): boolean {
        return !Object.keys(obj).length;
    }

    private confirmationSubscribe(): void {
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res) => {
                    if (res?.template === DriverDetailsItemStringEnum.DRIVER) {
                        switch (res.type) {
                            case DriverDetailsStringEnum.DELETE:
                                this.deleteDriverById(res.data.id);

                                break;
                            case DriverDetailsStringEnum.DEACTIVATE:
                                this.changeDriverStatus(res.id);

                                break;
                            default:
                                break;
                        }
                    }
                },
            });
    }

    private confirmationActivationSubscribe(): void {
        this.confirmationActivationService.getConfirmationActivationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) this.changeDriverStatus(res.data.id);
            });
    }

    private getStoreData(): void {
        const storeData$ = this.driversItemStore._select((state) => state);

        storeData$.pipe(takeUntil(this.destroy$)).subscribe((state) => {
            const newDriverData = { ...state.entities[this.newDriverId] };

            if (!this.isEmpty(newDriverData)) {
                this.detailsDataService.setNewData(newDriverData);

                this.getDetailsConfig(newDriverData);
                this.getDetailsOptions(newDriverData.status);
            }
        });
    }

    private getDriversMinimalList(): void {
        this.driversList = this.driverMinimalQuery.getAll();
    }

    private getDriverData(): void {
        const dataId = this.activatedRoute.snapshot.params.id;

        const driverData = {
            ...this.driversItemStore?.getValue()?.entities[dataId],
        };

        this.newDriverId = dataId;

        this.getDetailsConfig(driverData);
    }

    public getDetailsOptions(status: number): void {
        this.detailsDropdownOptions =
            DriverDetailsHelper.getDetailsDropdownOptions(status);
    }

    public getDetailsConfig(driver: DriverResponse): void {
        let driverStatus: boolean;

        if (!driver?.status) {
            driverStatus = true;

            this.isInactive = true;
        } else {
            driverStatus = false;

            this.isInactive = false;
        }

        this.driverId = driver?.id;
        this.driverObject = driver;

        this.detailsDataService.setNewData(driver);

        this.getDetailsOptions(driver.status);
        this.checkExpiration(driver);

        this.driverDetailsConfig = DriverDetailsHelper.getDriverDetailsConfig(
            driver,
            driverStatus,
            this.hasDangerCdl,
            this.hasDangerMedical,
            this.hasDangerMvr
        );
    }

    private handleDriverIdRouteChange(): void {
        this.detailsPageDriverService.pageDetailChangeId$
            .pipe(takeUntil(this.destroy$))
            .subscribe((id) => {
                this.newDriverId = id;

                if (this.driverDetailsQuery.hasEntity(id)) {
                    this.driverDetailsQuery
                        .selectEntity(id)
                        .pipe(take(1), takeUntil(this.destroy$))
                        .subscribe((res: DriverResponse) => {
                            this.currentIndex = this.driversList.findIndex(
                                (driver: DriverResponse) => driver.id === res.id
                            );

                            this.getDetailsOptions(res.status);
                            this.getDetailsConfig(res);

                            if (
                                this.router.url.includes(eSharedString.DETAILS)
                            ) {
                                this.router.navigate([
                                    `/list/driver/${res.id}/details`,
                                ]);
                            }
                        });
                } else this.router.navigate([`/list/driver/${id}/details`]);

                this.cdRef.detectChanges();
            });
    }

    public onDriverActions(event: { id: number; type: string }): void {
        const name =
            this.driverObject?.firstName +
            DriverDetailsStringEnum.EMPTY_STRING +
            this.driverObject?.lastName;

        const mappedEvent = {
            data: {
                ...this.driverObject,
                name,
                /*  avatarImg: this.driverObject.avatar, */
                textShortName: this.nameInitialsPipe.transform(name),
                avatarColor: AvatarColorsHelper.getAvatarColors(
                    this.currentIndex
                ),
            },
        };

        switch (event.type) {
            case DriverDetailsStringEnum.EDIT:
                this.driverService
                    .getDriverById(event.id)
                    .pipe(
                        takeUntil(this.destroy$),
                        tap((driver) => {
                            const editData = {
                                data: {
                                    ...driver,
                                },
                                type: TableStringEnum.EDIT,
                                id: event.id,
                                disableButton: true,
                            };

                            this.modalService.openModal(
                                DriverModalComponent,
                                { size: TableStringEnum.MEDIUM },
                                {
                                    ...editData,
                                    avatarIndex: this.currentIndex,
                                    isDeactivateOnly: true,
                                }
                            );
                        })
                    )
                    .subscribe();

                break;
            case DriverDetailsStringEnum.ACTIVATE:
            case DriverDetailsStringEnum.DEACTIVATE:
                this.modalService.openModal(
                    ConfirmationActivationModalComponent,
                    { size: TableStringEnum.SMALL },
                    {
                        ...mappedEvent,
                        subType: TableStringEnum.DRIVER_1,
                        type:
                            mappedEvent.data.status === 1
                                ? TableStringEnum.DEACTIVATE
                                : TableStringEnum.ACTIVATE,
                        template: TableStringEnum.DRIVER_1,
                        tableType: TableStringEnum.DRIVER,
                    }
                );

                break;
            case DriverDetailsStringEnum.DELETE_ITEM:
                this.modalService.openModal(
                    ConfirmationModalComponent,
                    { size: TableStringEnum.SMALL },
                    {
                        ...mappedEvent,
                        template: TableStringEnum.DRIVER,
                        type: TableStringEnum.DELETE,
                        image: true,
                    }
                );

                break;
            default:
                break;
        }
    }

    public onModalAction(action: string): void {
        switch (action) {
            case DriverDetailsStringEnum.CDL:
                this.modalService.openModal(
                    DriverCdlModalComponent,
                    { size: TableStringEnum.SMALL },
                    {
                        id: this.driverId,
                        type: DriverDetailsStringEnum.NEW_LICENCE,
                    }
                );

                break;
            case DriverDetailsStringEnum.DRUG_AND_ALCOHOL:
                this.modalService.openModal(
                    DriverDrugAlcoholTestModalComponent,
                    { size: TableStringEnum.SMALL },
                    {
                        id: this.driverId,
                        type: DriverDetailsStringEnum.NEW_DRUG,
                    }
                );

                break;
            case DriverDetailsStringEnum.MEDICAL:
                this.modalService.openModal(
                    DriverMedicalModalComponent,
                    { size: TableStringEnum.SMALL },
                    {
                        id: this.driverId,
                        type: DriverDetailsStringEnum.NEW_MEDICAL,
                    }
                );

                break;
            case DriverDetailsStringEnum.MVR:
                this.modalService.openModal(
                    DriverMvrModalComponent,
                    { size: TableStringEnum.SMALL },
                    { id: this.driverId, type: DriverDetailsStringEnum.NEW_MVR }
                );

                break;
            default:
                break;
        }
    }

    private checkExpiration(data: any): void {
        this.hasDangerCdl = false;
        this.hasDangerMedical = false;
        this.hasDangerMvr = false;

        const arrayCdl: boolean[] = [];
        const arrayMedical: boolean[] = [];
        const arrayMvr: boolean[] = [];

        data?.cdls?.map((cdl) => {
            if (moment(cdl.expDate).isAfter(moment())) {
                arrayCdl.push(false);
            }

            if (moment(cdl.expDate).isBefore(moment())) {
                arrayCdl.push(true);
            }
        });

        data?.medicals?.map((medical) => {
            if (moment(medical.expDate).isAfter(moment())) {
                arrayMedical.push(false);
            }

            if (moment(medical.expDate).isBefore(moment())) {
                arrayMedical.push(true);
            }
        });

        data?.mvrs?.map((mvr) => {
            if (moment(mvr.issueDate).isAfter(moment())) {
                arrayMvr.push(false);
            }

            if (moment(mvr.issueDate).isBefore(moment())) {
                arrayMvr.push(true);
            }
        });

        this.hasDangerCdl = !arrayCdl.includes(false);
        this.hasDangerMedical = !arrayMedical.includes(false);
        this.hasDangerMvr = !arrayMvr.includes(false);
    }

    private changeDriverStatus(id: number): void {
        const status = !this.driverObject.status
            ? DriverDetailsStringEnum.INACTIVE
            : DriverDetailsStringEnum.ACTIVE;

        this.driverService
            .changeDriverStatus(id, status)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    private deleteDriverById(id: number): void {
        const status =
            this.driverObject.status == 0
                ? DriverDetailsStringEnum.INACTIVE
                : DriverDetailsStringEnum.ACTIVE;
        const last = this.driversList.at(-1);

        if (
            last.id ===
            this.driverMinimimalListStore.getValue().ids[this.currentIndex]
        ) {
            this.currentIndex = --this.currentIndex;
        } else {
            this.currentIndex = ++this.currentIndex;
        }

        this.driverService
            .deleteDriverByIdDetails(id, status)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    if (
                        this.driverMinimimalListStore.getValue().ids.length >= 1
                    ) {
                        this.router.navigate([
                            `/list//driver/${
                                this.driversList[this.currentIndex].id
                            }/details`,
                        ]);
                    }
                },
                error: () => {
                    this.router.navigate([
                        DriverDetailsStringEnum.LIST_DRIVER_ROUTE,
                    ]);
                },
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
