import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil, take } from 'rxjs';

// Services
import { BrokerService } from '../../services/broker.service';
import { DetailsDataService } from 'src/app/shared/services/details-data.service';
import { DropDownService } from 'src/app/shared/services/drop-down.service';
import { TruckassistTableService } from 'src/app/shared/services/truckassist-table.service';
import { ConfirmationService } from 'src/app/core/components/modals/confirmation-modal/state/state/services/confirmation.service';
import { DetailsPageService } from 'src/app/shared/services/details-page.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

// Store
import { BrokerMinimalListStore } from '../../state/broker-details-state/broker-minimal-list-state/broker-minimal-list.store';
import { BrokerDetailsStore } from '../../state/broker-details-state/broker-details.store';
import { BrokerMinimalListQuery } from '../../state/broker-details-state/broker-minimal-list-state/broker-minimal-list.query';
import { BrokerDetailsListQuery } from '../../state/broker-details-state/broker-details-list-state/broker-details-list.query';

// Pipes
import { SumArraysPipe } from 'src/app/shared/pipes/sum-arrays.pipe';

// Models
import { BrokerResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-broker-details',
    templateUrl: './broker-details.component.html',
    styleUrls: ['./broker-details.component.scss'],
    providers: [DetailsPageService, SumArraysPipe],
})
export class BrokerDetailsComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    public brokerId: number;
    public brokerConfig: any[] = [];
    public brokerDrop: any;
    public brokerObject: any;
    public currentIndex: number = 0;
    public brokerList: any = this.brokerMimialQuery.getAll();
    public newBrokerId: any = 0;
    public brokerConfData: any;
    public businessOpen: boolean;
    constructor(
        // Router
        private activated_route: ActivatedRoute,
        private router: Router,

        // Services
        private notificationService: NotificationService,
        private brokerService: BrokerService,
        private detailsPageService: DetailsPageService,
        private dropDownService: DropDownService,
        private tableService: TruckassistTableService,
        private confirmationService: ConfirmationService,
        private DetailsDataService: DetailsDataService,

        // Store
        private brokerMinimalStore: BrokerMinimalListStore,
        private BrokerItemStore: BrokerDetailsStore,
        private brokerMimialQuery: BrokerMinimalListQuery,
        private bdlq: BrokerDetailsListQuery,

        // Pipes
        private sumArr: SumArraysPipe,

        // Ref
        private cdRef: ChangeDetectorRef
    ) {
        let storeData$ = this.BrokerItemStore._select((state) => state);
        storeData$.subscribe((state) => {
            let newBrokerData = { ...state.entities[this.newBrokerId] };
            if (!this.isEmpty(newBrokerData)) {
                this.brokerInitConfig(newBrokerData);
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
                            if (res.template === 'broker') {
                                this.deleteBrokerById(res.id);
                            }
                            break;
                        }
                        case 'info': {
                            if (
                                res.template === 'broker' &&
                                res.subType === 'ban list'
                            ) {
                                this.moveRemoveBrokerToBan(res.id);
                            }
                            if (
                                res.template === 'broker' &&
                                res.subType === 'dnu'
                            ) {
                                this.moveRemoveBrokerToDnu(res.id);
                            }
                            break;
                        }
                        case 'activate':
                        case 'deactivate': {
                            this.changeBrokerStatus(res?.id);
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                },
            });
        this.tableService.currentActionAnimation
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
                if (res.animation) {
                    this.brokerInitConfig(res.data);
                    this.cdRef.detectChanges();
                }
            });
        this.detailsPageService.pageDetailChangeId$
            .pipe(takeUntil(this.destroy$))
            .subscribe((id) => {
                let query;

                if (this.bdlq.hasEntity(id)) {
                    query = this.bdlq.selectEntity(id).pipe(take(1));
                    query.pipe(takeUntil(this.destroy$)).subscribe({
                        next: (res: BrokerResponse) => {
                            this.brokerInitConfig(res);
                            this.newBrokerId = res.id;
                            this.router.navigate([
                                `/customer/${res.id}/broker-details`,
                            ]);
                            this.cdRef.detectChanges();
                        },
                    });
                } else {
                    //query = this.brokerService.getBrokerById(id);
                    this.newBrokerId = id;
                    this.router.navigate([`/customer/${id}/broker-details`]);
                    this.cdRef.detectChanges();
                }
            });

        let brokerId = this.activated_route.snapshot.params.id;
        let brokerData = {
            ...this.BrokerItemStore?.getValue()?.entities[brokerId],
        };
        this.brokerInitConfig(brokerData);
    }

    public isEmpty(obj: Record<string, any>): boolean {
        return Object.keys(obj).length === 0;
    }

    public deleteBrokerById(id: number) {
        let last = this.brokerList.at(-1);
        if (
            last.id ===
            this.brokerMinimalStore.getValue().ids[this.currentIndex]
        ) {
            this.currentIndex = --this.currentIndex;
        } else {
            this.currentIndex = ++this.currentIndex;
        }
        this.brokerService
            .deleteBrokerByIdDetails(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    if (this.brokerMinimalStore.getValue().ids.length >= 1) {
                        this.router.navigate([
                            `/customer/${
                                this.brokerList[this.currentIndex].id
                            }/broker-details`,
                        ]);
                    }
                },
            });
    }

    public brokerInitConfig(data: any) {
        this.brokerConfData = data;
        this.currentIndex = this.brokerList.findIndex(
            (broker) => broker.id === data.id
        );
        this.initTableOptions(data);
        //calling api every time data is loaded
        //this.getBrokerById(data.id);

        this.businessOpen = data?.status ? true : false;

        let totalCost;
        this.DetailsDataService.setNewData(data);
        if (data?.loads?.length) {
            totalCost = this.sumArr.transform(
                data?.loads.map((item) => {
                    return {
                        id: item.id,
                        value: item.totalRate,
                    };
                })
            );
        }

        this.brokerConfig = [
            {
                id: 0,
                nameDefault: 'Broker Detail',
                template: 'general',
                data: data,
            },
            {
                id: 1,
                nameDefault: 'Load',
                template: 'load',
                icon: true,
                hasArrowDown: true,
                length: data?.loadStops?.loads?.data?.length
                    ? data?.loadStops?.loads?.data?.length
                    : 0,
                hasCost: true,
                hide: false,
                hasArrow: true,
                brokerLoadDrop: true,
                customText: 'Revenue',
                total: totalCost,
                icons: [
                    {
                        id: Math.random() * 1000,
                        icon: 'assets/svg/common/ic_clock.svg',
                        name: 'clock',
                    },
                    {
                        id: Math.random() * 1000,
                        icon: 'assets/svg/common/ic_search.svg',
                        name: 'search',
                    },

                    {
                        id: Math.random() * 1000,
                        icon: 'assets/svg/common/ic_broker-user.svg',
                        name: 'broker-user',
                    },
                    {
                        id: Math.random() * 1000,
                        icon: 'assets/svg/common/ic_broker-half-circle.svg',
                        name: 'half-circle',
                    },
                    {
                        id: Math.random() * 1000,
                        icon: 'assets/svg/truckassist-table/location-icon.svg',
                        name: 'location',
                    },
                    {
                        id: Math.random() * 1000,
                        icon: 'assets/svg/common/ic_dollar.svg',
                        name: 'dolar',
                    },
                ],
                data: data,
            },
            {
                id: 2,
                nameDefault: 'Contact',
                template: 'contact',
                length: data?.brokerContacts?.length
                    ? data.brokerContacts.length
                    : 0,
                hide: false,
                icon: true,
                hasCost: false,
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
                hasCost: false,
                hide: false,
                data: data,
                hasArrow: false,
            },
        ];
        this.brokerId = data?.id ? data.id : null;
    }
    public getBrokerById(id: number) {
        this.brokerService
            .getBrokerById(id, true)
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => (this.brokerObject = item));
    }
    /**Function for dots in cards */
    public initTableOptions(data: BrokerResponse): void {
        this.brokerDrop = {
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
                    title: 'Create Load',
                    name: 'create-load',
                    svg: 'assets/svg/common/ic_plus.svg',
                    show: true,
                    blueIcon: true,
                    iconName: 'ic_plus',
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
                    title: data?.ban
                        ? 'Remove from Ban List'
                        : 'Move to Ban list',
                    name: data?.ban ? 'remove-from-ban' : 'move-to-ban',
                    svg: 'assets/svg/common/ic_disable-status.svg',
                    show: true,
                    iconName: 'change-status',
                },
                {
                    title: data?.dnu ? 'Remove from DNU' : 'Move to DNU List',
                    name: data?.dnu ? 'remove-from-dnu' : 'move-to-dnu',
                    svg: 'assets/svg/common/ic_disable-status.svg',
                    deactivate: true,
                    show: true,
                    redIcon: true,
                    iconName: 'change-status',
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
                    type: 'truck',
                    text: 'Are you sure you want to delete truck(s)?',
                    svg: 'assets/svg/common/ic_trash_updated.svg',
                    danger: true,
                    show: true,
                    redIcon: true,
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
    public moveRemoveBrokerToBan(id: number) {
        this.brokerService
            .changeBanStatus(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {},
                error: () => {},
            });
    }
    public moveRemoveBrokerToDnu(id: number) {
        this.brokerService
            .changeDnuStatus(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {},
                error: () => {},
            });
    }
    public onDropActions(event: any) {
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
            id: this.brokerId,
            type: eventType,
            openedTab: event.type,
        };

        let brokerData = this.brokerObject
            ? this.brokerObject
            : this.brokerConfData;

        this.dropDownService.dropActionsHeaderShipperBroker(
            eventObject,
            brokerData,
            'broker'
        );
    }

    public onModalAction(event: any) {
        if (event == 'Load') {
            return false;
        }
        let eventObject = {
            data: undefined,
            id: this.brokerId,
            type: 'edit',
            openedTab: event,
        };

        setTimeout(() => {
            this.dropDownService.dropActionsHeaderShipperBroker(
                eventObject,
                this.brokerObject,
                'broker'
            );
        }, 100);
    }

    /**Function return id */
    public identity(index: number, item: any): number {
        return item.id;
    }

    public changeBrokerStatus(id: any) {
        this.brokerService.changeBrokerStatus(id);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.tableService.sendActionAnimation({});
    }
}
