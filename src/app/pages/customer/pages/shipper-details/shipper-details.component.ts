import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, take, takeUntil } from 'rxjs';

// Services
import { ShipperService } from '@pages/customer/services/shipper.service';
import { DetailsPageService } from '@shared/services/details-page.service';
import { NotificationService } from '@shared/services/notification.service';
import { DetailsDataService } from '@shared/services/details-data.service';
import { DropDownService } from '@shared/services/drop-down.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';

// Store
import { ShipperMinimalListStore } from '@pages/customer/state/shipper-state/shipper-details-state/shipper-minimal-list-state/shipper-minimal-list.store';
import { ShipperDetailsListStore } from '@pages/customer/state/shipper-state/shipper-details-state/shipper-details-list-state/shipper-details-list.store';
import { ShipperDetailsStore } from '@pages/customer/state/shipper-state/shipper-details-state/shipper-details.store';
import { ShipperMinimalListQuery } from '@pages/customer/state/shipper-state/shipper-details-state/shipper-minimal-list-state/shipper-minimal-list.query';
import { ShipperDetailsListQuery } from '@pages/customer/state/shipper-state/shipper-details-state/shipper-details-list-state/shipper-details-list.query';

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
    public newShipperId: any = 0;
    public shipperConfigData: any;
    public businessOpen: boolean;
    constructor(
        // Ref
        private cdRef: ChangeDetectorRef,

        // Router
        private activated_route: ActivatedRoute,
        private router: Router,

        // Services
        private shipperService: ShipperService,
        private notificationService: NotificationService,
        private detailsPageService: DetailsPageService,
        private dropDownService: DropDownService,
        private tableService: TruckassistTableService,
        private confirmationService: ConfirmationService,
        private DetailsDataService: DetailsDataService,

        // Store
        private shipperMinimalStore: ShipperMinimalListStore,
        private shipperStore: ShipperDetailsListStore,
        private shipperDetailsStore: ShipperDetailsStore,
        private shipperMinimalQuery: ShipperMinimalListQuery,
        private slq: ShipperDetailsListQuery
    ) {
        let storeData$ = this.shipperDetailsStore._select((state) => state);
        storeData$.subscribe((state) => {
            let newShipData = { ...state.entities[this.newShipperId] };
            if (!this.isEmpty(newShipData)) {
                this.shipperConf(newShipData);
            }
        });
    }

    ngOnInit(): void {
        // Confirmation Subscribe
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res) => {
                    switch (res.type) {
                        case 'delete': {
                            if (res.template === 'shipper') {
                                this.deleteShipperById(res?.id);
                            }
                            break;
                        }
                        case 'deactivate':
                        case 'activate': {
                            if (res.template === 'Shipper') {
                                this.changeShipperStatus(res?.id);
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
                if (res?.animation) {
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
                        this.newShipperId = res.id;
                        this.shipperConf(res);
                        this.router.navigate([
                            `/list/customer/${res.id}/shipper-details`,
                        ]);
                        this.cdRef.detectChanges();
                    },
                    error: () => {},
                });
            });

        let shipperId = this.activated_route.snapshot.params.id;
        let shipperData = {
            ...this.shipperDetailsStore?.getValue()?.entities[shipperId],
        };
        this.shipperConf(shipperData);
    }

    public isEmpty(obj: Record<string, any>): boolean {
        return Object.keys(obj).length === 0;
    }

    public shipperConf(data: any) {
        this.shipperConfigData = data;
        this.DetailsDataService.setNewData(data);
        this.currentIndex = this.shipperList.findIndex(
            (shipper) => shipper.id === data.id
        );

        this.businessOpen = data?.status ? true : false;

        // calling api every time
        //this.getShipperById(data.id);
        this.shipperConfig = [
            {
                id: 0,
                nameDefault: 'Shipper Detail',
                template: 'general',
                data: data,
            },
            {
                id: 1,
                nameDefault: 'Load',
                template: 'load',
                icon: true,
                length: data?.loadStops?.length ? data.loadStops.length : 0,
                hide: true,
                hasArrow: false,
                hasSearch: true,
                searchPlaceholder: 'Load',
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
                hasSearch: true,
                searchPlaceholder: 'Contacts',
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
                            `/list/customer/${
                                this.shipperList[this.currentIndex].id
                            }/shipper-details`,
                        ]);
                    }
                },
                error: () => {
                    this.router.navigate(['/list/customer']);
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
        let eventType = '';
        if (
            event.type == 'Contact' ||
            event.type == 'edit' ||
            event.type == 'Review'
        ) {
            eventType = 'edit';
        } else {
            eventType = event.type;
        }

        let eventObject = {
            data: undefined,
            id: event.id,
            type: eventType,
            openedTab: event.type,
        };

        let shipperData = this.shipperObject
            ? this.shipperObject
            : this.shipperConfigData;
        setTimeout(() => {
            this.dropDownService.dropActionsHeaderShipperBroker(
                eventObject,
                shipperData,
                'shipper'
            );
        }, 100);
    }

    public onModalAction(event: any) {
        let eventObject = {
            data: undefined,
            id: this.shipperId,
            type: 'edit',
            openedTab: event,
        };
        setTimeout(() => {
            console.log(this.shipperObject, 'shipperobj')
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
                    iconName: 'edit',
                },
                {
                    title: 'border',
                },
                {
                    title: 'Add Contact',
                    name: 'Contact',
                    svg: 'assets/svg/truckassist-table/customer/contact-column-avatar.svg',
                    show: true,
                    iconName: 'add-contact',
                },
                {
                    title: 'Write Review',
                    name: 'Review',
                    svg: 'assets/svg/common/review-pen.svg',
                    show: true,
                    iconName: 'write-review',
                },
                {
                    title: 'border',
                },
                {
                    title: 'Share',
                    name: 'share',
                    svg: 'assets/svg/common/share-icon.svg',
                    show: true,
                    iconName: 'share',
                },
                {
                    title: 'Print',
                    name: 'print',
                    svg: 'assets/svg/common/ic_fax.svg',
                    show: true,
                    iconName: 'print',
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
                    iconName: 'close-business',
                },
                {
                    title: 'Delete',
                    name: 'delete-item',
                    svg: 'assets/svg/common/ic_trash_updated.svg',
                    redIcon: true,
                    show: true,
                    iconName: 'delete',
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

    public changeShipperStatus(id: number) {
        this.shipperService.changeShipperStatus(id);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.tableService.sendActionAnimation({});
    }
}
