import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil, take } from 'rxjs';

// Services
import { BrokerService } from '@pages/customer/services/broker.service';
import { DetailsDataService } from '@shared/services/details-data.service';
import { DropDownService } from '@shared/services/drop-down.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { DetailsPageService } from '@shared/services/details-page.service';
import { ConfirmationMoveService } from '@shared/components/ta-shared-modals/confirmation-move-modal/services/confirmation-move.service';
import { ConfirmationActivationService } from '@shared/components/ta-shared-modals/confirmation-activation-modal/services/confirmation-activation.service';

// Store
import { BrokerMinimalListStore } from '@pages/customer/state/broker-details-state/broker-minimal-list-state/broker-minimal-list.store';
import { BrokerDetailsStore } from '@pages/customer/state/broker-details-state/broker-details.store';
import { BrokerMinimalListQuery } from '@pages/customer/state/broker-details-state/broker-minimal-list-state/broker-minimal-list.query';
import { BrokerDetailsListQuery } from '@pages/customer/state/broker-details-state/broker-details-list-state/broker-details-list.query';

// Pipes
import { SumArraysPipe } from '@shared/pipes/sum-arrays.pipe';

// Models
import { BrokerResponse } from 'appcoretruckassist';

// Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { BrokerDetailsStringEnum } from '@pages/customer/pages/broker-details/enums/broker-details-string.enum';

// Svg Routes
import { BrokerDetailsSvgRoutes } from '@pages/customer/pages/broker-details/utils/svg-routes/broker-details-svg-routes';

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
        private brokerService: BrokerService,
        private detailsPageService: DetailsPageService,
        private dropDownService: DropDownService,
        private tableService: TruckassistTableService,
        private confirmationService: ConfirmationService,
        private DetailsDataService: DetailsDataService,
        private confirmationMoveService: ConfirmationMoveService,
        private confirmationActivationService: ConfirmationActivationService,

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
        this.confirmationSubscribe();

        this.actionAnimationSubscribe();

        this.detailsPageChange();

        this.getBrokerStoreData();
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
                nameDefault: BrokerDetailsStringEnum.BROKER_DETAIL,
                template: BrokerDetailsStringEnum.GENERAL,
                data: data,
            },
            {
                id: 1,
                nameDefault: BrokerDetailsStringEnum.LOAD,
                template: BrokerDetailsStringEnum.LOAD_2,
                icon: true,
                hasArrowDown: false,
                length: data?.loadStops?.loads?.data?.length ?? 0,
                hasCost: true,
                hide: true,
                hasArrow: false,
                brokerLoadDrop: false,
                customText: TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                total: totalCost,
                icons: [
                    {
                        id: Math.random() * 1000,
                        icon: BrokerDetailsSvgRoutes.clockIcon,
                        name: BrokerDetailsStringEnum.CLOCK,
                    },
                    {
                        id: Math.random() * 1000,
                        icon: BrokerDetailsSvgRoutes.searchIcon,
                        name: BrokerDetailsStringEnum.SEARCH,
                    },

                    {
                        id: Math.random() * 1000,
                        icon: BrokerDetailsSvgRoutes.brokerUserIcon,
                        name: BrokerDetailsStringEnum.BROKER_USER,
                    },
                    {
                        id: Math.random() * 1000,
                        icon: BrokerDetailsSvgRoutes.halfCircleIcon,
                        name: BrokerDetailsStringEnum.HALF_CIRCLE,
                    },
                    {
                        id: Math.random() * 1000,
                        icon: BrokerDetailsSvgRoutes.locationIcon,
                        name: BrokerDetailsStringEnum.LOCATION,
                    },
                    {
                        id: Math.random() * 1000,
                        icon: BrokerDetailsSvgRoutes.dollarIcon,
                        name: BrokerDetailsStringEnum.DOLLAR,
                    },
                ],
                data: data,
            },
            {
                id: 2,
                nameDefault: BrokerDetailsStringEnum.CONTACT,
                template: BrokerDetailsStringEnum.CONTACT_2,
                length: data?.brokerContacts?.length ?? 0,
                hide: false,
                icon: true,
                hasCost: false,
                hasArrow: false,
                icons: [
                    {
                        id: Math.random() * 1000,
                        icon: BrokerDetailsSvgRoutes.searchIcon,
                    },
                ],
                data: data,
            },
            {
                id: 3,
                nameDefault: BrokerDetailsStringEnum.REVIEW,
                template: BrokerDetailsStringEnum.REVIEW_2,
                length: data?.ratingReviews?.length ?? 0,
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
                    title: TableStringEnum.EDIT_2,
                    name: TableStringEnum.EDIT,
                    svg: BrokerDetailsSvgRoutes.editIcon,
                    show: true,
                    iconName: TableStringEnum.EDIT,
                },
                {
                    title: TableStringEnum.BORDER,
                },
                {
                    title: TableStringEnum.CREATE_LOAD_2,
                    name: TableStringEnum.CREATE_LOAD,
                    svg: BrokerDetailsSvgRoutes.plusIcon,
                    show: true,
                    blueIcon: true,
                    iconName: BrokerDetailsStringEnum.IC_PLUS,
                    hide: true,
                },
                {
                    title: TableStringEnum.ADD_CONTRACT_2,
                    name: TableStringEnum.CONTRACT,
                    svg: BrokerDetailsSvgRoutes.avatarIcon,
                    show: true,
                    iconName: TableStringEnum.ADD_CONTACT,
                },
                {
                    title: TableStringEnum.WRITE_REVIEW_2,
                    name: TableStringEnum.REVIEW,
                    svg: BrokerDetailsSvgRoutes.reviewIcon,
                    show: true,
                    iconName: TableStringEnum.WRITE_REVIEW,
                },
                {
                    title: data?.ban
                        ? TableStringEnum.REMOVE_FROM_BAN_LIST
                        : TableStringEnum.MOVE_TO_BAN_LIST_2,
                    name: data?.ban
                        ? TableStringEnum.REMOVE_FROM_BAN_LIST_2
                        : TableStringEnum.MOVE_TO_BAN,
                    svg: BrokerDetailsSvgRoutes.disableStatusIcon,
                    show: true,
                    iconName: BrokerDetailsStringEnum.CHANGE_STATUS,
                },
                {
                    title: data?.dnu
                        ? TableStringEnum.REMOVE_FROM_DNU_LIST
                        : TableStringEnum.MOVE_TO_DNU_LIST_2,
                    name: data?.dnu
                        ? TableStringEnum.REMOVE_FROM_DNU_LIST_2
                        : TableStringEnum.MOVE_TO_DNU,
                    svg: BrokerDetailsSvgRoutes.disableStatusIcon,
                    deactivate: true,
                    show: true,
                    redIcon: true,
                    iconName: BrokerDetailsStringEnum.CHANGE_STATUS,
                },
                {
                    title: TableStringEnum.BORDER,
                    hide: true,
                },
                {
                    title: TableStringEnum.SHARE_2,
                    name: TableStringEnum.SHARE,
                    svg: BrokerDetailsSvgRoutes.shareIcon,
                    show: true,
                    iconName: TableStringEnum.SHARE,
                    hide: true,
                },
                {
                    title: TableStringEnum.PRINT_2,
                    name: TableStringEnum.PRINT,
                    svg: BrokerDetailsSvgRoutes.printIcon,
                    show: true,
                    iconName: TableStringEnum.PRINT,
                    hide: true,
                },
                {
                    title: TableStringEnum.BORDER,
                },
                {
                    title: TableStringEnum.CLOSE_BUSINESS_2,
                    name: TableStringEnum.CLOSE_BUSINESS,
                    svg: BrokerDetailsSvgRoutes.closeBusinessIcon,
                    redIcon: true,
                    show: true,
                    iconName: TableStringEnum.CLOSE_BUSINESS,
                },
                {
                    title: TableStringEnum.DELETE_2,
                    name: TableStringEnum.DELETE_ITEM,
                    type: TableStringEnum.TRUCK,
                    text: BrokerDetailsStringEnum.DELETE_TRUCK_TEXT,
                    svg: BrokerDetailsSvgRoutes.deleteIcon,
                    danger: true,
                    show: true,
                    redIcon: true,
                    iconName: TableStringEnum.DELETE,
                },
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
            event.type == TableStringEnum.CONTRACT ||
            event.type == TableStringEnum.EDIT ||
            event.type == TableStringEnum.REVIEW
        ) {
            eventType = TableStringEnum.EDIT;
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
            TableStringEnum.BROKER
        );
    }

    public onModalAction(event: any) {
        if (event == BrokerDetailsStringEnum.LOAD) {
            return false;
        }
        let eventObject = {
            data: undefined,
            id: this.brokerId,
            type: TableStringEnum.EDIT,
            openedTab: event,
        };

        setTimeout(() => {
            this.dropDownService.dropActionsHeaderShipperBroker(
                eventObject,
                this.brokerObject,
                TableStringEnum.BROKER
            );
        }, 100);
    }

    /**Function return id */
    public identity(index: number, item: any): number {
        return item.id;
    }

    public changeBrokerStatus(id: number): void {
        this.brokerService
            .changeBrokerStatus(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    private confirmationSubscribe(): void {
        // Confirmation Subscribe
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res) => {
                    switch (res.type) {
                        case TableStringEnum.DELETE:
                            if (res.template === TableStringEnum.BROKER) {
                                this.deleteBrokerById(res.id);
                            }
                            break;

                        case TableStringEnum.INFO:
                            if (
                                res.template === TableStringEnum.BROKER &&
                                res.subType === TableStringEnum.BAN_LIST
                            ) {
                                this.moveRemoveBrokerToBan(res.id);
                            }
                            if (
                                res.template === TableStringEnum.BROKER &&
                                res.subType === TableStringEnum.DNU
                            ) {
                                this.moveRemoveBrokerToDnu(res.id);
                            }
                            break;

                        case TableStringEnum.ACTIVATE:
                        case TableStringEnum.DEACTIVATE:
                            this.changeBrokerStatus(res?.id);
                            break;

                        default:
                            break;
                    }
                },
            });

        // Move to Ban/Dnu subscribe
        this.confirmationMoveService.getConfirmationMoveData$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) {
                    if (res.subType === TableStringEnum.BAN) {
                        this.moveRemoveBrokerToBan(res.data.id);
                    } else {
                        this.moveRemoveBrokerToDnu(res.data.id);
                    }
                }
            });

        // Open / Close Business subscribe
        this.confirmationActivationService.getConfirmationActivationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) {
                    if (res.template === TableStringEnum.INFO) {
                        this.changeBrokerStatus(res.data.id);
                    }
                }
            });
    }

    private actionAnimationSubscribe(): void {
        this.tableService.currentActionAnimation
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res?.animation) {
                    this.brokerInitConfig(res.data);
                    this.cdRef.detectChanges();
                }
            });
    }

    private detailsPageChange(): void {
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
                                `/list/customer/${res.id}/broker-details`,
                            ]);
                            this.cdRef.detectChanges();
                        },
                    });
                } else {
                    this.newBrokerId = id;
                    this.router.navigate([
                        `/list/customer/${id}/broker-details`,
                    ]);
                    this.cdRef.detectChanges();
                }
            });
    }

    private getBrokerStoreData(): void {
        const brokerId = this.activated_route.snapshot.params.id;
        const brokerData = {
            ...this.BrokerItemStore?.getValue()?.entities[brokerId],
        };
        this.brokerInitConfig(brokerData);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.tableService.sendActionAnimation({});
    }
}
