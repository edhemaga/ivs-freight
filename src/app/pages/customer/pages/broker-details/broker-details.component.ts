import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil, take, forkJoin } from 'rxjs';

// Services
import { BrokerService } from '@pages/customer/services/broker.service';
import { DetailsDataService } from '@shared/services/details-data.service';
import { DropDownService } from '@shared/services/drop-down.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { DetailsPageService } from '@shared/services/details-page.service';
import { ConfirmationMoveService } from '@shared/components/ta-shared-modals/confirmation-move-modal/services/confirmation-move.service';
import { ConfirmationActivationService } from '@shared/components/ta-shared-modals/confirmation-activation-modal/services/confirmation-activation.service';
import { LoadService } from '@shared/services/load.service';
import { ModalService } from '@shared/services/modal.service';
import { CaSearchMultipleStatesService } from 'ca-components';

// Store
import { BrokerMinimalListStore } from '@pages/customer/state/broker-details-state/broker-minimal-list-state/broker-minimal-list.store';
import { BrokerDetailsStore } from '@pages/customer/state/broker-details-state/broker-details.store';
import { BrokerMinimalListQuery } from '@pages/customer/state/broker-details-state/broker-minimal-list-state/broker-minimal-list.query';
import { BrokerDetailsListQuery } from '@pages/customer/state/broker-details-state/broker-details-list-state/broker-details-list.query';

// Pipes
import { SumArraysPipe } from '@shared/pipes/sum-arrays.pipe';

// Models
import { BrokerResponse, LoadBrokerDetailsResponse } from 'appcoretruckassist';
import { FilterOptionsLoad } from '@pages/load/pages/load-table/models/filter-options-load.model';
import { LoadsSortDropdownModel } from '@pages/customer/models/loads-sort-dropdown.model';

// Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { BrokerDetailsStringEnum } from '@pages/customer/pages/broker-details/enums/';
import { LoadFilterStringEnum } from '@pages/load/pages/load-table/enums/load-filter-string.enum';

// Svg Routes
import { BrokerDetailsSvgRoutes } from '@pages/customer/pages/broker-details/utils/svg-routes/';

// Helpers
import { RepairTableDateFormaterHelper } from '@pages/repair/pages/repair-table/utils/helpers/repair-table-date-formater.helper';
import { MethodsGlobalHelper } from '@shared/utils/helpers/methods-global.helper';
import { BrokerDetailsHelper } from '@pages/customer/pages/broker-details/utils/helpers/';

// Constants
import { TableDropdownComponentConstants } from '@shared/utils/constants/table-dropdown-component.constants';

// Components
import { LoadModalComponent } from '@pages/load/pages/load-modal/load-modal.component';

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
    public backLoadFilterQuery: FilterOptionsLoad =
        TableDropdownComponentConstants.SHIPPER_LOADS_BACK_FILTER;
    public brokerLoads: LoadBrokerDetailsResponse[] = [];

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
        private loadService: LoadService,
        private modalService: ModalService,
        private caSearchMultipleStatesService: CaSearchMultipleStatesService,

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

        this.loadsSearchListener();

        this.getLoadStatusFilter();

        this.getLoadDispatcherFilter();

        this.resetTableSelectedRows();

        this.loadServiceListener();
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

        this.DetailsDataService.setNewData(data);

        this.brokerConfig = BrokerDetailsHelper.getBrokerDetailsConfig(
            this.brokerConfData,
            this.backLoadFilterQuery.statusType ?? 4,
            1
        );

        this.brokerId = data?.id ? data.id : null;
        this.backLoadFilterQuery.brokerId = this.brokerId;
        this.loadBackFilter(
            this.backLoadFilterQuery,
            this.backLoadFilterQuery.statusType ?? 4
        );
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
            .subscribe();
    }

    public moveRemoveBrokerToDnu(id: number) {
        this.brokerService
            .changeDnuStatus(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    public onDropActions(event: any) {
        let eventType = '';

        if (
            event.type === TableStringEnum.CONTRACT ||
            event.type === TableStringEnum.EDIT ||
            event.type === TableStringEnum.REVIEW
        ) {
            eventType = TableStringEnum.EDIT;
        } else {
            eventType = event.type;
        }

        const openedTab =
            event.type === TableStringEnum.EDIT
                ? TableStringEnum.BASIC
                : event.type === TableStringEnum.CONTRACT
                ? TableStringEnum.ADDITIONAL
                : TableStringEnum.REVIEW;

        const eventObject = {
            data: undefined,
            id: this.brokerId,
            type: eventType,
            openedTab,
        };

        const brokerData = this.brokerObject
            ? this.brokerObject
            : this.brokerConfData;

        this.dropDownService.dropActionsHeaderShipperBroker(
            eventObject,
            brokerData,
            TableStringEnum.BROKER
        );
    }

    public onModalAction(event: string) {
        if (event == BrokerDetailsStringEnum.LOAD) {
            this.modalService.openModal(LoadModalComponent, {
                size: TableStringEnum.LOAD,
            });
        } else {
            const eventObject = {
                data: undefined,
                id: this.brokerId,
                type: TableStringEnum.EDIT,
                openedTab:
                    event === TableStringEnum.CONTRACT
                        ? TableStringEnum.ADDITIONAL
                        : event,
            };

            setTimeout(() => {
                this.dropDownService.dropActionsHeaderShipperBroker(
                    eventObject,
                    this.brokerObject,
                    TableStringEnum.BROKER
                );
            }, 100);
        }
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
                            if (res.template === TableStringEnum.BROKER)
                                this.deleteBrokerById(res.id);
                            else if (
                                res.template === TableStringEnum.BROKER_CONTACT
                            )
                                this.deleteBrokerContactById(
                                    res.data?.brokerId,
                                    res.id
                                );

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
                        this.moveRemoveBrokerToBan(res.data?.id);
                    } else {
                        this.moveRemoveBrokerToDnu(res.data?.id);
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
                if (
                    res?.animation &&
                    res.animation === LoadFilterStringEnum.UPDATE
                ) {
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

    public setFilter(data): void {
        switch (data?.filterType) {
            case LoadFilterStringEnum.USER_FILTER:
                this.backLoadFilterQuery.dispatcherIds =
                    data.queryParams ?? null;

                this.loadBackFilter(this.backLoadFilterQuery);

                break;
            case LoadFilterStringEnum.STATUS_FILTER:
                this.backLoadFilterQuery.status = data.queryParams ?? null;

                this.loadBackFilter(this.backLoadFilterQuery);

                break;
            case LoadFilterStringEnum.TIME_FILTER:
                if (data.queryParams?.timeSelected) {
                    const { fromDate, toDate } =
                        RepairTableDateFormaterHelper.getDateRange(
                            data.queryParams?.timeSelected,
                            data.queryParams.year ?? null
                        );

                    this.backLoadFilterQuery.dateTo = toDate;
                    this.backLoadFilterQuery.dateFrom = fromDate;
                } else {
                    this.backLoadFilterQuery.dateTo = null;
                    this.backLoadFilterQuery.dateFrom = null;
                }

                this.loadBackFilter(this.backLoadFilterQuery);

                break;
            case LoadFilterStringEnum.MONEY_FILTER:
                this.backLoadFilterQuery.rateFrom =
                    data.queryParams?.firstFormFrom ?? null;
                this.backLoadFilterQuery.rateTo =
                    data.queryParams?.firstFormTo ?? null;

                this.backLoadFilterQuery.paidFrom =
                    data.queryParams?.secondFormFrom ?? null;
                this.backLoadFilterQuery.paidTo =
                    data.queryParams?.secondFormTo ?? null;

                this.backLoadFilterQuery.dueFrom =
                    data.queryParams?.thirdFormFrom ?? null;
                this.backLoadFilterQuery.dueTo =
                    data.queryParams?.thirdFormTo ?? null;

                this.loadBackFilter(this.backLoadFilterQuery);

                break;
            case LoadFilterStringEnum.LOCATION_FILTER:
                this.backLoadFilterQuery.longitude =
                    data.queryParams?.longValue ?? null;
                this.backLoadFilterQuery.latitude =
                    data.queryParams?.latValue ?? null;
                this.backLoadFilterQuery.distance =
                    data.queryParams?.rangeValue ?? null;

                this.loadBackFilter(this.backLoadFilterQuery);

                break;
            default:
                break;
        }
    }

    private loadBackFilter(
        filter: FilterOptionsLoad,
        loadTypeId?: number
    ): void {
        this.brokerService
            .getBrokerLoads(
                filter.loadType,
                filter.statusType,
                filter.status,
                filter.dispatcherIds,
                filter.dispatcherId,
                filter.dispatchId,
                filter.brokerId,
                filter.shipperId,
                filter.loadId,
                filter.dateFrom,
                filter.dateTo,
                filter.revenueFrom,
                filter.revenueTo,
                filter.truckId,
                filter.rateFrom,
                filter.rateTo,
                filter.paidFrom,
                filter.paidTo,
                filter.dueFrom,
                filter.dueTo,
                filter.pickup,
                filter.delivery,
                filter.longitude,
                filter.latitude,
                filter.distance,
                filter.pageIndex,
                filter.pageSize,
                filter.companyId,
                filter.sort,
                filter.searchOne,
                filter.searchTwo,
                filter.searchThree
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) {
                    this.brokerLoads = res.loads.data;
                    this.brokerConfData = {
                        ...this.brokerConfData,
                        loadStops: res,
                    };

                    if (loadTypeId)
                        this.brokerConfig =
                            BrokerDetailsHelper.getBrokerDetailsConfig(
                                this.brokerConfData,
                                loadTypeId
                            );
                }
            });
    }

    private loadsSearchListener(): void {
        this.caSearchMultipleStatesService.currentSearchTableData
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) {
                    const searchEvent = MethodsGlobalHelper.tableSearch(
                        res,
                        this.backLoadFilterQuery
                    );

                    if (searchEvent) {
                        if (searchEvent.action === TableStringEnum.API) {
                            this.loadBackFilter(searchEvent.query);
                        } else if (
                            searchEvent.action === TableStringEnum.STORE
                        ) {
                            this.backLoadFilterQuery.searchOne = null;
                            this.backLoadFilterQuery.searchTwo = null;
                            this.backLoadFilterQuery.searchThree = null;

                            this.loadBackFilter(this.backLoadFilterQuery);
                        }
                    }
                }
            });
    }

    private getLoadStatusFilter(): void {
        forkJoin([
            this.loadService.getLoadStatusFilter(
                LoadFilterStringEnum.PENDING_2
            ),
            this.loadService.getLoadStatusFilter(LoadFilterStringEnum.ACTIVE_2),
            this.loadService.getLoadStatusFilter(LoadFilterStringEnum.CLOSED_2),
        ])
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: ([
                    pendingStatusList,
                    activeStatusList,
                    closedStatusList,
                ]) => {
                    const allStatusList = [
                        ...pendingStatusList,
                        ...activeStatusList,
                        ...closedStatusList,
                    ];

                    const filterOptionsData = {
                        options: allStatusList,
                    };

                    this.tableService.sendLoadStatusFilter(filterOptionsData);
                },
            });
    }

    private getLoadDispatcherFilter(): void {
        forkJoin([
            this.loadService.getLoadDispatcherFilter(
                LoadFilterStringEnum.PENDING_2
            ),
            this.loadService.getLoadDispatcherFilter(
                LoadFilterStringEnum.ACTIVE_2
            ),
            this.loadService.getLoadDispatcherFilter(
                LoadFilterStringEnum.CLOSED_2
            ),
        ])
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: ([
                    pendingDispatchers,
                    activeDispatchers,
                    closedDispatchers,
                ]) => {
                    let allDispatchers = [
                        ...pendingDispatchers,
                        ...activeDispatchers,
                        ...closedDispatchers,
                    ];

                    allDispatchers = allDispatchers.filter(
                        (item, index, array) =>
                            array.findIndex((item2) => item2.id === item.id) ===
                            index
                    );

                    this.tableService.sendActionAnimation({
                        animation: LoadFilterStringEnum.DISPATCH_DATA_UPDATE,
                        data: allDispatchers,
                        id: null,
                    });
                },
            });
    }

    public onDetailsSelectClick(id: number): void {
        if (id) {
            this.backLoadFilterQuery.statusType = id !== 4 ? id : null;

            this.loadBackFilter(this.backLoadFilterQuery, id);
        }
    }

    public onSortAction(event: {
        column: LoadsSortDropdownModel;
        sortDirection: string;
    }): void {
        this.brokerConfig = BrokerDetailsHelper.getBrokerDetailsConfig(
            this.brokerConfData,
            this.backLoadFilterQuery.statusType,
            event.column.id
        );

        this.backLoadFilterQuery.sort = event.sortDirection;

        this.loadBackFilter(this.backLoadFilterQuery);
    }

    private loadServiceListener(): void {
        this.loadService.modalAction$
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.loadBackFilter(this.backLoadFilterQuery);
            });
    }

    private deleteBrokerContactById(brokerId: number, contactId: number): void {
        this.brokerService
            .deleteBrokerContactById(brokerId, contactId)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    private resetTableSelectedRows(): void {
        this.tableService.sendDnuListSelectedRows([]);
        this.tableService.sendBanListSelectedRows([]);
        this.tableService.sendBussinessSelectedRows([]);
        this.tableService.sendRowsSelected([]);
        this.tableService.sendResetSelectedColumns(true);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.tableService.sendActionAnimation({});
    }
}
