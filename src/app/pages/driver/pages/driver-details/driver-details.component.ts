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
import { DriverCdlService } from '@pages/driver/pages/driver-modals/driver-cdl-modal/services/driver-cdl.service';
import { DetailsDataService } from '@shared/services/details-data.service';
import { ConfirmationActivationService } from '@shared/components/ta-shared-modals/confirmation-activation-modal/services/confirmation-activation.service';

// enums
import { DriverDetailsStringEnum } from '@pages/driver/pages/driver-details/enums/driver-details-string.enum';
import { TableStringEnum } from '@shared/enums/table-string.enum';

// pipes
import { NameInitialsPipe } from '@shared/pipes/name-initials.pipe';

// store
import { DriversMinimalListStore } from '@pages/driver/state/driver-details-minimal-list-state/driver-minimal-list.store';
import { DriversMinimalListQuery } from '@pages/driver/state/driver-details-minimal-list-state/driver-minimal-list.query';
import { DriversDetailsListQuery } from '@pages/driver/state/driver-details-list-state/driver-details-list.query';
import { DriversItemStore } from '@pages/driver/state/driver-details-state/driver-details.store';

// models
import { DetailsDropdownOptions } from '@pages/driver/pages/driver-details/models/details-dropdown-options.model';
import { DriverDetailsConfig } from '@pages/driver/pages/driver-details/models/driver-details-config.model';
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
    public driverDetailsConfig: DriverDetailsConfig[] = [];

    public currentIndex: number = 0;

    //////////////

    public driverStatus: boolean;
    public data: any;
    public showInc: boolean;
    public hasDangerCDL: boolean;
    public arrayCDL: any[] = [];
    public arrayMedical: any[] = [];
    public arrayMvrs: any[] = [];
    public hasDangerMedical: boolean;
    public hasDangerMvr: boolean;
    public driverId: number = null;
    public driverObject: any;
    public driversList: any = this.driverMinimalQuery.getAll();

    public isActiveCdl: boolean;
    public dataCdl: any;
    public cdlActiveId: number;

    private newDriverId: number;

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
        private DetailsDataService: DetailsDataService,
        private cdlService: DriverCdlService,
        private confirmationActivationService: ConfirmationActivationService,

        // store
        private driverMinimimalListStore: DriversMinimalListStore,
        private driverMinimalQuery: DriversMinimalListQuery,
        private driverDQuery: DriversDetailsListQuery,
        private driversItemStore: DriversItemStore,

        // pipes
        private nameInitialsPipe: NameInitialsPipe
    ) {}

    ngOnInit() {
        this.getStoreData();

        this.getDriverData();

        this.confirmationSubscribe();

        this.confirmationActivationSubscribe();

        this.handleDriverIdRouteChange();
    }

    public trackByIdentity(index: number): number {
        return index;
    }

    private confirmationSubscribe(): void {
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res) => {
                    switch (res.type) {
                        case DriverDetailsStringEnum.DELETE:
                            this.deleteDriverById(res.data.id);

                            break;
                        case 'activate':
                            if (
                                res?.cdlStatus &&
                                res?.cdlStatus == 'Activate'
                            ) {
                                this.activateCdl(res.data.id);
                            }
                            break;
                        case 'info':
                            if (res.cdlStatus === 'New') {
                                let driverId = res.data.data.id
                                    ? res.data.data.id
                                    : res.data.driver.id;
                                this.deactivateCdl(res.data.id, driverId);

                                if (
                                    this.DetailsDataService.cdlId !=
                                        res.data.id ||
                                    res?.data?.newCdlID
                                ) {
                                    let newCdlId = res?.data?.newCdlID
                                        ? res?.data?.newCdlID
                                        : this.DetailsDataService.cdlId;
                                    setTimeout(() => {
                                        this.activateCdl(newCdlId);
                                    }, 1000);
                                }
                            } else {
                                this.activateCdl(res.data.id);
                            }
                            break;
                        default:
                            break;
                    }
                },
            });
    }

    private confirmationActivationSubscribe(): void {
        this.confirmationActivationService.getConfirmationActivationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                this.changeDriverStatus(res.data.id);
            });
    }

    private getStoreData(): void {
        const storeData$ = this.driversItemStore._select((state) => state);

        storeData$.subscribe((state) => {
            const newDriverData = { ...state.entities[this.newDriverId] };

            if (!this.isEmpty(newDriverData)) {
                this.DetailsDataService.setNewData(newDriverData);

                this.getDetailsConfig(newDriverData);
                this.getDetailsOptions(newDriverData.status);
            }
        });
    }

    private getDriverData(): void {
        const dataId = this.activatedRoute.snapshot.params.id;

        const driverData = {
            ...this.driversItemStore?.getValue()?.entities[dataId],
        };

        this.getDetailsConfig(driverData);
    }

    public getDetailsOptions(status: number): void {
        this.detailsDropdownOptions =
            DriverDetailsHelper.getDetailsDropdownOptions(status);

        ///////////////////////////////

        this.isActiveCdl = false;
        this.cdlActiveId = 0;
        /*  data?.cdls?.map((item) => {
            if (item.status == 1) {
                this.cdlActiveId = item.id;
             
                this.isActiveCdl = true;
            } else {
         
                this.isActiveCdl = false;
            }
        }); */
    }

    public getDetailsConfig(driverData: any) {
        console.log('driverData', driverData);
        this.DetailsDataService.setNewData(driverData);

        this.driverObject = driverData;

        this.getDetailsOptions(driverData.status);
        this.checkExpiration(driverData);

        if (!driverData?.status) {
            this.driverStatus = true;
            this.showInc = true;
        } else {
            this.driverStatus = false;
            this.showInc = false;
        }

        this.driverDetailsConfig = DriverDetailsHelper.getDriverDetailsConfig(
            driverData,
            this.driverStatus,
            this.hasDangerCDL,
            this.hasDangerMedical,
            this.hasDangerMvr
        );

        this.driverId = driverData?.id;
    }

    private handleDriverIdRouteChange(): void {
        this.detailsPageDriverService.pageDetailChangeId$
            .pipe(takeUntil(this.destroy$))
            .subscribe((id) => {
                let query;

                if (this.driverDQuery.hasEntity(id)) {
                    query = this.driverDQuery.selectEntity(id).pipe(take(1));

                    query.subscribe((res: DriverResponse) => {
                        this.currentIndex = this.driversList.findIndex(
                            (driver: DriverResponse) => driver.id === res.id
                        );

                        this.newDriverId = id;

                        if (this.cdlActiveId > 0)
                            this.getCdlById(this.cdlActiveId);

                        this.getDetailsOptions(res.status);
                        this.getDetailsConfig(res);

                        if (
                            this.router.url.includes(
                                DriverDetailsStringEnum.DETAILS
                            )
                        ) {
                            this.router.navigate([
                                `/list/driver/${res.id}/details`,
                            ]);
                        }
                    });
                } else {
                    this.newDriverId = id;

                    this.router.navigate([`/list/driver/${id}/details`]);
                }

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
                avatarImg: this.driverObject.avatar,
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

    //////////////////////////////////////////////////////////////////////

    public isEmpty(obj: Record<string, any>): boolean {
        return Object.keys(obj).length === 0;
    }

    checkExpiration(data: any) {
        this.hasDangerCDL = false;
        this.hasDangerMedical = false;
        this.hasDangerMvr = false;
        this.arrayCDL = [];
        this.arrayMedical = [];
        this.arrayMvrs = [];

        data?.cdls?.map((el) => {
            if (moment(el.expDate).isAfter(moment())) {
                this.arrayCDL.push(false);
            }
            if (moment(el.expDate).isBefore(moment())) {
                this.arrayCDL.push(true);
            }
        });

        data?.medicals?.map((el) => {
            if (moment(el.expDate).isAfter(moment())) {
                this.arrayMedical.push(false);
            }
            if (moment(el.expDate).isBefore(moment())) {
                this.arrayMedical.push(true);
            }
        });

        if (data.mvrs?.length > 0) {
            data?.mvrs.map((el) => {
                if (moment(el.issueDate).isAfter(moment())) {
                    this.arrayMedical.push(false);
                }
                if (moment(el.issueDate).isBefore(moment())) {
                    this.arrayMedical.push(true);
                }
            });
        }
        if (this.arrayCDL.includes(false)) {
            this.hasDangerCDL = false;
        } else {
            this.hasDangerCDL = true;
        }
        if (this.arrayMedical.includes(false)) {
            this.hasDangerMedical = false;
        } else {
            this.hasDangerMedical = true;
        }
    }

    public getCdlById(id: number) {
        this.cdlService
            .getCdlById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => (this.dataCdl = item));
    }

    private deactivateCdl(id: number, driverId: number) {
        this.cdlService
            .deactivateCdlById(id, driverId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({});
    }

    private activateCdl(id: number) {
        this.cdlService
            .activateCdlById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({});
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
