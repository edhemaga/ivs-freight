import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { ShipperResponse } from 'appcoretruckassist';
import { ShipperTService } from '../state/shipper-state/shipper.service';
import { Subject, take, takeUntil } from 'rxjs';
import { DetailsPageService } from '../../../services/details-page/details-page-ser.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { DetailsDataService } from '../../../services/details-data/details-data.service';
import { DropDownService } from 'src/app/core/services/details-page/drop-down.service';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { ShipperMinimalListQuery } from '../state/shipper-state/shipper-details-state/shipper-minimal-list-state/shipper-minimal.query';
import { ShipperMinimalListStore } from '../state/shipper-state/shipper-details-state/shipper-minimal-list-state/shipper-minimal.store';
import { Confirmation } from '../../modals/confirmation-modal/confirmation-modal.component';
import { ConfirmationService } from '../../modals/confirmation-modal/confirmation.service';
import { ShipperDetailsListQuery } from '../state/shipper-state/shipper-details-state/shipper-details-list-state/shipper-details-list.query';
import { ShipperDetailsListStore } from '../state/shipper-state/shipper-details-state/shipper-details-list-state/shipper-details-list.store';
import { ShipperItemStore } from '../state/shipper-state/shipper-details-state/shipper-details.store';

@Component({
    selector: 'app-shipper-details',
    templateUrl: './shipper-details.component.html',
    styleUrls: ['./shipper-details.component.scss'],
    providers: [DetailsPageService],
})
export class ShipperDetailsComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    public shipperConfig: any[] = [];
    public shipperDrop: any;
    public shipperId: number;
    public shipperObject: any;
    public currentIndex: number = 0;
    public shipperList: any = this.shipperMinimalQuery.getAll();
    constructor(
        private activated_route: ActivatedRoute,
        private router: Router,
        private shipperService: ShipperTService,
        private notificationService: NotificationService,
        private cdRef: ChangeDetectorRef,
        private detailsPageService: DetailsPageService,
        private shipperMinimalStore: ShipperMinimalListStore,
        private dropDownService: DropDownService,
        private tableService: TruckassistTableService,
        private shipperMinimalQuery: ShipperMinimalListQuery,
        private confirmationService: ConfirmationService,
        private slq: ShipperDetailsListQuery,
        private shipperStore: ShipperDetailsListStore,
        private DetailsDataService: DetailsDataService,
        private ShipperItemStore: ShipperItemStore,
    ) {}

    ngOnInit(): void {
        // Confirmation Subscribe
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: Confirmation) => {
                    switch (res.type) {
                        case 'delete': {
                            if (res.template === 'shipper') {
                                this.deleteShipperById(res.id);
                            }
                            break;
                        }

                        default: {
                            break;
                        }
                    }
                },
            });
        this.initTableOptions();
        this.tableService.currentActionAnimation
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
                if (res.animation) {
                    this.shipperConf(res.data);
                    this.initTableOptions();
                    this.cdRef.detectChanges();
                }
            });
        this.detailsPageService.pageDetailChangeId$
            .pipe(takeUntil(this.destroy$))
            .subscribe((id) => {
                let query;
                if (this.slq.hasEntity(id)) {
                    query = this.slq.selectEntity(id).pipe(take(1));
                } else {
                    query = this.shipperService.getShipperById(id);
                }

                query.pipe(takeUntil(this.destroy$)).subscribe({
                    next: (res: any) => {
                        this.shipperConf(res);
                        this.router.navigate([
                            `/customer/${res.id}/shipper-details`,
                        ]);
                        this.cdRef.detectChanges();
                    },
                    error: () => {

                    },
                });
            });
        
        let shipperId = this.activated_route.snapshot.params.id;   
        let shipperData = {
            ...this.ShipperItemStore?.getValue()?.entities[shipperId],
        };
        this.shipperConf(shipperData);
    }

    public shipperConf(data: any) {
        this.DetailsDataService.setNewData(data);
        this.currentIndex = this.shipperList.findIndex(
            (shipper) => shipper.id === data.id
        );
        //this.getShipperById(data.id);
        this.shipperConfig = [
            {
                id: 0,
                nameDefault: 'Shipper Details',
                template: 'general',
                data: data,
            },
            {
                id: 1,
                nameDefault: 'Load',
                template: 'load',
                icon: true,
                // length: data?.loadStops?.length ? data.loadStops.length : 0,
                hide: true,
                hasArrow: true,
                customText: 'Date',
                icons: [
                    {
                        id: Math.random() * 1000,
                        icon: 'assets/svg/common/ic_clock.svg',
                    },
                    {
                        id: Math.random() * 1000,
                        icon: 'assets/svg/common/ic_search.svg',
                    },

                    {
                        id: Math.random() * 1000,
                        icon: 'assets/svg/common/ic_arrow-right-line.svg',
                    },
                    {
                        id: Math.random() * 1000,
                        icon: 'assets/svg/common/ic_arrow-right-line.svg',
                    },
                ],
                data: data,
            },
            {
                id: 2,
                nameDefault: 'Contact',
                template: 'contact',
                length: data?.shipperContacts?.length
                    ? data.shipperContacts.length
                    : 0,
                hide: false,
                icon: true,
                hasArrow: false,
                icons: [
                    {
                        id: Math.random() * 1000,
                        icon: 'assets/svg/common/ic_search.svg',
                    },
                ],
                customText: '',
                data: data,
            },
            {
                id: 3,
                nameDefault: 'Review',
                template: 'review',
                length: data?.reviews?.length ? data.reviews.length : 0,
                customText: 'Date',
                hide: false,
                data: data,
                hasArrow: false,
            },
        ];
        this.shipperId = data?.id ? data.id : null;
    }
    public deleteShipperById(id: number) {
        let last = this.shipperList.at(-1);
        if (
            last.id ===
            this.shipperMinimalStore.getValue().ids[this.currentIndex]
        ) {
            this.currentIndex = --this.currentIndex;
        } else {
            this.currentIndex = ++this.currentIndex;
        }
        this.shipperService
            .deleteShipperByIdDetails(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    if (this.shipperMinimalStore.getValue().ids.length >= 1) {
                        this.router.navigate([
                            `/customer/${
                                this.shipperList[this.currentIndex].id
                            }/shipper-details`,
                        ]);
                    }
                },
                error: () => {
                    this.router.navigate(['/customer']);
                },
            });
    }
    public getShipperById(id: number) {
        this.shipperService
            .getShipperById(id, true)
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => (this.shipperObject = item));
    }
    public onDropActions(event: any) {
        this.getShipperById(event.id);

        let eventObject = {
            data: undefined,
            id: event.id,
            type: 'edit',
            openedTab: event.type,
        }

        setTimeout(() => {
            this.dropDownService.dropActionsHeaderShipperBroker(
                eventObject,
                this.shipperObject,
                'shipper'
            );
        }, 100);
    }

    public onModalAction(event: any){
        let eventObject = {
            data: undefined,
            id: this.shipperObject.id,
            type: 'edit',
            openedTab: event,
        }
        
        setTimeout(() => {
            this.dropDownService.dropActionsHeaderShipperBroker(
                eventObject,
                this.shipperObject,
                'shipper'
            );
        }, 100);
    }

    /**Function for dots in cards */
    public initTableOptions(): void {
        this.shipperDrop = {
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
                    show: true,
                    iconName: 'edit'
                },
                {
                    title: 'border',
                },
                {
                    title: 'Add Contact',
                    name: 'Contact',
                    svg: 'assets/svg/truckassist-table/customer/contact-column-avatar.svg',
                    show: true,
                    iconName: 'add-contact'
                },
                {
                    title: 'Write Review',
                    name: 'write-review',
                    svg: 'assets/svg/common/review-pen.svg',
                    show: true,
                    iconName: 'write-review'
                },
                {
                    title: 'border',
                },
                {
                    title: 'Share',
                    name: 'share',
                    svg: 'assets/svg/common/share-icon.svg',
                    show: true,
                    iconName: 'share'
                },
                {
                    title: 'Print',
                    name: 'print',
                    svg: 'assets/svg/common/ic_fax.svg',
                    show: true,
                    iconName: 'print'
                },
                {
                    title: 'border',
                },
                {
                    title: 'Close Business',
                    name: 'close-business',
                    svg: 'assets/svg/common/close-business-icon.svg',
                    redIcon: true,
                    show: true,
                    iconName: 'close-business'
                },
                {
                    title: 'Delete',
                    name: 'delete-item',
                    svg: 'assets/svg/common/ic_trash_updated.svg',
                    redIcon: true,
                    show: true,
                    iconName: 'delete'
                },

                /*
        {
          title: 'Send Message',
          name: 'dm',
          svg: 'assets/svg/common/ic_dm.svg',
          show: true,
        },
        */
            ],
            export: true,
        };
    }
    /**Function return id */
    public identity(index: number, item: any): number {
        return item.id;
    }
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.tableService.sendActionAnimation({});
    }
}
