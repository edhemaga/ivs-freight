import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, take, takeUntil } from 'rxjs';

// moment
import moment from 'moment';

// services
import { DetailsPageService } from '@shared/services/details-page.service';
import { DropDownService } from '@shared/services/drop-down.service';
import { NotificationService } from '@shared/services/notification.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { TruckService } from '@shared/services/truck.service';
import { ModalService } from '@shared/services/modal.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { DetailsDataService } from '@shared/services/details-data.service';

// store
import { TrucksDetailsListQuery } from '@pages/truck/state/truck-details-list-state/truck-details-list.query';
import { TrucksMinimalListQuery } from '@pages/truck/state/truck-details-minima-list-state/truck-details-minimal.query';
import { TrucksMinimalListStore } from '@pages/truck/state/truck-details-minima-list-state/truck-details-minimal.store';
import { TruckItemStore } from '@pages/truck/state/truck-details-state/truck.details.store';

// components
import { TtRegistrationModalComponent } from '@shared/components/ta-shared-modals/truck-trailer-modals/modals/tt-registration-modal/tt-registration-modal.component';
import { TtFhwaInspectionModalComponent } from '@shared/components/ta-shared-modals/truck-trailer-modals/modals/tt-fhwa-inspection-modal/tt-fhwa-inspection-modal.component';
import { TtTitleModalComponent } from '@shared/components/ta-shared-modals/truck-trailer-modals/modals/tt-title-modal/tt-title-modal.component';

// Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { TruckDetailsEnum } from '@pages/truck/pages/truck-details/enums/truck-details.enum';

// Models
import { TruckDetailsConfig } from '@pages/truck/pages/truck-details/models/truck-details-config.model';
import { TruckDetailsConfigData } from '@pages/truck/pages/truck-details/models/truck-details-config-data.model';

// helpers
import { TruckSortByDateHelper } from '@pages/truck/pages/truck-details/utils/helpers/truck-sort-by-date.helper';

@Component({
    selector: 'app-truck-details',
    templateUrl: './truck-details.component.html',
    styleUrls: ['./truck-details.component.scss'],
    providers: [DetailsPageService],
})
export class TruckDetailsComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    public truckDetailsConfig: TruckDetailsConfig[] = [];
    public dataTest: any;
    registrationLength: number;
    inspectionLength: number;
    titleLength: number;
    public data: any;
    public truckObject: any;
    public truckList: any = this.truckMinimalListQuery.getAll();
    public currentIndex: number = 0;
    public truckId: number;
    public newTruckId: number;
    constructor(
        private truckTService: TruckService,
        private notificationService: NotificationService,
        private activated_route: ActivatedRoute,
        private detailsPageDriverSer: DetailsPageService,
        private modalService: ModalService,
        private router: Router,
        private cdRef: ChangeDetectorRef,
        private truckDetailListQuery: TrucksDetailsListQuery,
        private tableService: TruckassistTableService,
        private dropService: DropDownService,
        private confirmationService: ConfirmationService,
        private truckMinimalListQuery: TrucksMinimalListQuery,
        private truckMinimalStore: TrucksMinimalListStore,
        private DetailsDataService: DetailsDataService,
        private TruckItemStore: TruckItemStore
    ) {
        let storeData$ = this.TruckItemStore._select((state) => state);

        storeData$.subscribe((state) => {
            let newTruckData = { ...state.entities[this.newTruckId] };

            if (!this.isEmpty(newTruckData)) {
                this.DetailsDataService.setNewData(newTruckData);
                this.truckConf(newTruckData);
                this.initTableOptions(newTruckData);
            }
        });
    }

    ngOnInit(): void {
        let dataId = this.activated_route.snapshot.params.id;
        let truckData = {
            ...this.TruckItemStore?.getValue()?.entities[dataId],
        };
        this.initTableOptions(truckData);

        this.tableService.currentActionAnimation
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res?.animation && res?.id === dataId) {
                    this.truckConf(res.data);
                    this.initTableOptions(res.data);
                    this.cdRef.detectChanges();
                }
            });
        // Confirmation Subscribe
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: any) => {
                    switch (res.type) {
                        case TableStringEnum.DELETE: {
                            if (res.template === TableStringEnum.TRUCK) {
                                this.deleteTruckById(res?.id);
                            }
                            break;
                        }
                        case TableStringEnum.ACTIVATE: {
                            if (res.template !== TruckDetailsEnum.VOID_2) {
                                this.changeTruckStatus(res?.id);
                            }
                            break;
                        }
                        case TableStringEnum.DEACTIVATE: {
                            this.changeTruckStatus(res?.id);
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                },
            });
        this.detailsPageDriverSer.pageDetailChangeId$
            .pipe(takeUntil(this.destroy$))
            .subscribe((id) => {
                let query;
                if (this.truckDetailListQuery.hasEntity(id)) {
                    query = this.truckDetailListQuery
                        .selectEntity(id)
                        .pipe(take(1));
                    query.pipe(takeUntil(this.destroy$)).subscribe({
                        next: (res: any) => {
                            this.truckConf(res);
                            this.initTableOptions(res);
                            this.newTruckId = id;
                            if (this.router.url.includes('details')) {
                                this.router.navigate([
                                    `/list/truck/${res.id}/details`,
                                ]);
                            }

                            this.cdRef.detectChanges();
                        },
                        error: () => {},
                    });
                } else {
                    //query = this.truckTService.getTruckById(id);

                    this.newTruckId = id;
                    this.router.navigate([`/list/truck/${id}/details`]);
                    this.cdRef.detectChanges();
                }
            });

        this.truckConf(truckData);
    }

    public isEmpty(obj: Record<string, any>): boolean {
        return Object.keys(obj).length === 0;
    }

    /**Function retrun id */
    public identity(index: number): number {
        return index;
    }
    public print() {
        // do other stuff...
        window.print();
    }

    public deleteTruckById(id: number) {
        let status =
            this.truckObject.status == 0
                ? TableStringEnum.INACTIVE
                : TableStringEnum.ACTIVE;

        let last = this.truckList?.at(-1);
        if (
            last?.id ===
            this.truckMinimalStore.getValue()?.ids[this.currentIndex]
        ) {
            this.currentIndex = --this.currentIndex;
        } else {
            this.currentIndex = ++this.currentIndex;
        }
        this.truckTService
            .deleteTruckByIdDetails(id, status)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    if (this.truckMinimalStore.getValue()?.ids?.length >= 1) {
                        this.router.navigate([
                            `/list/truck/${
                                this.truckList[this.currentIndex].id
                            }/details`,
                        ]);
                    }
                },
                error: () => {
                    this.router.navigate(['/list/truck']);
                },
            });
    }
    public changeTruckStatus(id: number) {
        this.truckTService.changeActiveStatus(id);
        /*
        let status = this.truckObject.status == 0 ? 'inactive' : 'active';
        this.truckTService
            .changeTruckStatus(id, status)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    
                    
                }
            });
        */
    }

    public optionsDrop(event: any) {
        this.dropService.dropActionHeaderTruck(
            event,
            this.truckObject,
            event.id,
            null
        );
    }
    /**Function for dots in cards */
    public initTableOptions(data: any): void {
        this.currentIndex = this.truckList.findIndex(
            (truck) => truck.id === data.id
        );
        this.truckObject = this.truckList.find((truck) => truck.id === data.id);

        this.dataTest = {
            disabledMutedStyle: null,
            toolbarActions: {
                hideViewMode: false,
            },
            config: {
                showSort: true,
                sortBy: '',
                sortDirection: '',
                disabledColumns: [0],
                minWidth: 60,
            },
            actions: [
                {
                    title: TableStringEnum.EDIT_2,
                    name: TableStringEnum.EDIT,
                    svg: TruckDetailsEnum.EDIT_SVG_2,
                    iconName: TableStringEnum.EDIT,
                    show: true,
                    disabled: data.status == 0 ? true : false,
                },
                {
                    title: TruckDetailsEnum.BORDER,
                },
                {
                    title: TableStringEnum.ADD_NEW_2,
                    svg: TruckDetailsEnum.DROPDOWN_ARROW_SVG,
                    iconName: TableStringEnum.ADD_NEW,
                    disabled: data.status == 0 ? true : false,
                    subType: [
                        {
                            subName: TruckDetailsEnum.REGISTRATION,
                            actionName: TruckDetailsEnum.REGISTRATION,
                        },
                        {
                            subName: TruckDetailsEnum.FHWA_INSPECTION,
                            actionName: TruckDetailsEnum.FHWA_INSPECTION,
                        },
                        {
                            subName: TruckDetailsEnum.TITLE_2,
                            actionName: TruckDetailsEnum.TITLE_2,
                        },
                        {
                            subName: TruckDetailsEnum.LEASE_RENT,
                            actionName: TruckDetailsEnum.LEASE_RENT,
                        },
                    ],
                },
                {
                    title: TruckDetailsEnum.BORDER,
                },
                {
                    title: TruckDetailsEnum.BORDER,
                },
                {
                    title:
                        data.status == 0
                            ? TableStringEnum.ACTIVATE_2
                            : TableStringEnum.DEACTIVATE_2,
                    name:
                        data.status == 0
                            ? TableStringEnum.ACTIVATE
                            : TableStringEnum.DEACTIVATE,
                    svg: TruckDetailsEnum.DEACTIVATE_SVG,
                    iconName: TableStringEnum.ACTIVATE_ITEM,
                    activate: data.status == 0 ? true : false,
                    deactivate: data.status == 1 ? true : false,
                    show: data.status == 1 || data.status == 0 ? true : false,
                    redIcon: data.status == 1 ? true : false,
                    blueIcon: data.status == 0 ? true : false,
                },
                {
                    title: TableStringEnum.DELETE_2,
                    name: TableStringEnum.DELETE_ITEM,
                    type: TableStringEnum.TRUCK,
                    svg: TruckDetailsEnum.TRASH_UPDATE_SVG,
                    iconName: TableStringEnum.DELETE,
                    danger: true,
                    show: true,
                    redIcon: true,
                },
            ],
            export: true,
        };
    }

    public onModalAction(action: string): void {
        let dataId = this.activated_route.snapshot.params.id;
        let truckData = {
            ...this.TruckItemStore?.getValue()?.entities[dataId],
        };
        const truck = truckData;

        switch (action.toLowerCase()) {
            case TruckDetailsEnum.REGISTRATION_2: {
                this.modalService.openModal(
                    TtRegistrationModalComponent,
                    { size: TableStringEnum.SMALL },
                    {
                        id: truck.id,
                        payload: truck,
                        type: TableStringEnum.ADD_REGISTRATION,
                        modal: TableStringEnum.TRUCK,
                    }
                );
                break;
            }
            case TruckDetailsEnum.FHWA_INSPECTION_3: {
                this.modalService.openModal(
                    TtFhwaInspectionModalComponent,
                    { size: TableStringEnum.SMALL },
                    {
                        id: truck.id,
                        payload: truck,
                        type: TableStringEnum.ADD_INSPECTION,
                        modal: TableStringEnum.TRUCK,
                    }
                );
                break;
            }
            case TruckDetailsEnum.TITLE: {
                this.modalService.openModal(
                    TtTitleModalComponent,
                    { size: TableStringEnum.SMALL },
                    {
                        id: truck.id,
                        payload: truck,
                        type: TruckDetailsEnum.ADD_TITLE,
                        modal: TableStringEnum.TRUCK,
                    }
                );
                break;
            }
            default: {
                break;
            }
        }
    }

    public truckConf(data: any) {
        this.DetailsDataService.setNewData(data);
        this.truckDetailsConfig = [
            {
                id: 0,
                name: TruckDetailsEnum.TRUCK_DETAIL,
                template: TruckDetailsEnum.GENERAL,
                data: data,
                status: data?.status == 0 ? true : false,
            },
            {
                id: 1,
                name: TruckDetailsEnum.REGISTRATION,
                template: TruckDetailsEnum.REGISTRATION_2,
                length: data?.registrations?.length
                    ? data.registrations.length
                    : 0,
                data: TruckSortByDateHelper.sortObjectsByExpDate(
                    data.registrations
                ),
                status: data?.status == 0 ? true : false,
                isExpired: this.check(data.registrations),
                businessOpen: true,
            },
            {
                id: 2,
                name: TruckDetailsEnum.FHWA_INSPECTION,
                template: TruckDetailsEnum.FHWA_INSPECTION_2,
                length: data?.inspections?.length ? data.inspections.length : 0,
                data: TruckSortByDateHelper.sortObjectsByExpDate(
                    data.inspections
                ),
                status: data?.status == 0 ? true : false,
                isExpired: this.check(data.inspections),
                businessOpen: true,
            },
            {
                id: 3,
                name: TruckDetailsEnum.TITLE_2,
                template: TruckDetailsEnum.TITLE,
                length: data?.titles?.length ? data.titles.length : 0,
                data: TruckSortByDateHelper.sortObjectsByExpDate(data.titles),
                status: data?.status == 0 ? true : false,
                isExpired: this.check(data.titles),
                businessOpen: true,
            },
        ];
        this.truckId = data?.id ? data.id : null;
    }

    public check(data: TruckDetailsConfigData[]): boolean {
        if (data) {
            return data.every((item: TruckDetailsConfigData) => {
                return item.voidedOn || this.isExpired(item.expDate);
            });
        } else return false;
    }

    public isExpired(expDate: string): boolean {
        const currentDateTime = moment().valueOf();
        const expirationDateTime = moment(expDate).valueOf();
        return expirationDateTime < currentDateTime;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
