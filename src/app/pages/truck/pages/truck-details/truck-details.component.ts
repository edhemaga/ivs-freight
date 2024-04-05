import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject, take, takeUntil } from 'rxjs';

// services
import { DetailsPageService } from 'src/app/shared/services/details-page.service';
import { DropDownService } from 'src/app/shared/services/drop-down.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { TruckassistTableService } from 'src/app/shared/services/truckassist-table.service';
import { TruckService } from '../../../../shared/services/truck.service';
import { ModalService } from 'src/app/shared/components/ta-modal/services/modal.service';
import { ConfirmationService } from 'src/app/core/components/modals/ta-confirmation-modal/services/confirmation.service';
import { DetailsDataService } from 'src/app/shared/services/details-data.service';

// store
import { TrucksDetailsListQuery } from '../../state/truck-details-list-state/truck-details-list.query';
import { TrucksMinimalListQuery } from '../../state/truck-details-minima-list-state/truck-details-minimal.query';
import { TrucksMinimalListStore } from '../../state/truck-details-minima-list-state/truck-details-minimal.store';
import { TruckItemStore } from '../../state/truck-details-state/truck.details.store';

// components
import { TtRegistrationModalComponent } from 'src/app/core/components/modals/common-truck-trailer-modals/tt-registration-modal/tt-registration-modal.component';
import { TtFhwaInspectionModalComponent } from 'src/app/core/components/modals/common-truck-trailer-modals/tt-fhwa-inspection-modal/tt-fhwa-inspection-modal.component';
import { TtTitleModalComponent } from 'src/app/core/components/modals/common-truck-trailer-modals/tt-title-modal/tt-title-modal.component';

@Component({
    selector: 'app-truck-details',
    templateUrl: './truck-details.component.html',
    styleUrls: ['./truck-details.component.scss'],
    providers: [DetailsPageService],
})
export class TruckDetailsComponent implements OnInit, OnDestroy {
    // @Input() data:any=null;
    private destroy$ = new Subject<void>();
    public truckDetailsConfig: any[] = [];
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
            .subscribe((res: any) => {
                if (res?.animation) {
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
                        case 'delete': {
                            if (res.template === 'truck') {
                                this.deleteTruckById(res?.id);
                            }
                            break;
                        }
                        case 'activate': {
                            this.changeTruckStatus(res?.id);
                            break;
                        }
                        case 'deactivate': {
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
        let status = this.truckObject.status == 0 ? 'inactive' : 'active';

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
                    title: 'Edit',
                    name: 'edit',
                    svg: 'assets/svg/truckassist-table/dropdown/content/edit.svg',
                    iconName: 'edit',
                    show: true,
                    disabled: data.status == 0 ? true : false,
                },
                {
                    title: 'border',
                },
                {
                    title: 'Add New',
                    svg: 'assets/svg/common/dropdown-arrow.svg',
                    iconName: 'add-new',
                    disabled: data.status == 0 ? true : false,
                    subType: [
                        { subName: 'Registration', actionName: 'Registration' },
                        {
                            subName: 'FHWA Inspection',
                            actionName: 'FHWA Inspection',
                        },
                        { subName: 'Title', actionName: 'Title' },
                        {
                            subName: 'Lease / Rent',
                            actionName: 'Lease / Purchase',
                        },
                    ],
                },
                {
                    title: 'border',
                },
                {
                    title: 'border',
                },
                {
                    title: data.status == 0 ? 'Activate' : 'Deactivate',
                    name: data.status == 0 ? 'activate' : 'deactivate',
                    svg: 'assets/svg/common/ic_deactivate.svg',
                    iconName: 'activate-item',
                    activate: data.status == 0 ? true : false,
                    deactivate: data.status == 1 ? true : false,
                    show: data.status == 1 || data.status == 0 ? true : false,
                    redIcon: data.status == 1 ? true : false,
                    blueIcon: data.status == 0 ? true : false,
                },
                {
                    title: 'Delete',
                    name: 'delete-item',
                    type: 'truck',
                    svg: 'assets/svg/common/ic_trash_updated.svg',
                    iconName: 'delete',
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
            case 'registration': {
                this.modalService.openModal(
                    TtRegistrationModalComponent,
                    { size: 'small' },
                    {
                        id: truck.id,
                        payload: truck,
                        type: 'add-registration',
                        modal: 'truck',
                    }
                );
                break;
            }
            case 'fhwa inspection': {
                this.modalService.openModal(
                    TtFhwaInspectionModalComponent,
                    { size: 'small' },
                    {
                        id: truck.id,
                        payload: truck,
                        type: 'add-inspection',
                        modal: 'truck',
                    }
                );
                break;
            }
            case 'title': {
                this.modalService.openModal(
                    TtTitleModalComponent,
                    { size: 'small' },
                    {
                        id: truck.id,
                        payload: truck,
                        type: 'add-title',
                        modal: 'truck',
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
                name: 'Truck Detail',
                template: 'general',
                data: data,
                status: data?.status == 0 ? true : false,
            },
            {
                id: 1,
                name: 'Registration',
                template: 'registration',
                length: data?.registrations?.length
                    ? data.registrations.length
                    : 0,
                data: data.registrations,
                status: data?.status == 0 ? true : false,
            },
            {
                id: 2,
                name: 'FHWA Inspection',
                template: 'fhwa-insepction',
                length: data?.inspections?.length ? data.inspections.length : 0,
                data: data.inspections,
                status: data?.status == 0 ? true : false,
            },
            {
                id: 3,
                name: 'Title',
                template: 'title',
                length: data?.titles?.length ? data.titles.length : 0,
                data: data.titles,
                status: data?.status == 0 ? true : false,
            },
            {
                id: 4,
            },
        ];
        this.truckId = data?.id ? data.id : null;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
