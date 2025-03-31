import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, take, takeUntil } from 'rxjs';

// Services
import { ShipperService } from '@pages/customer/services';
import { DetailsPageService } from '@shared/services/details-page.service';
import { DetailsDataService } from '@shared/services/details-data.service';
import { DropDownService } from '@shared/services/drop-down.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { ConfirmationActivationService } from '@shared/components/ta-shared-modals/confirmation-activation-modal/services/confirmation-activation.service';
import {
    CaSearchMultipleStatesService,
    eFilterDropdownEnum,
} from 'ca-components';

// Store
import { ShipperMinimalListStore } from '@pages/customer/state/shipper-state/shipper-details-state/shipper-minimal-list-state/shipper-minimal-list.store';
import { ShipperDetailsStore } from '@pages/customer/state/shipper-state/shipper-details-state/shipper-details.store';
import { ShipperMinimalListQuery } from '@pages/customer/state/shipper-state/shipper-details-state/shipper-minimal-list-state/shipper-minimal-list.query';
import { ShipperDetailsListQuery } from '@pages/customer/state/shipper-state/shipper-details-state/shipper-details-list-state/shipper-details-list.query';

// Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { ShipperDetailsStringEnum } from '@pages/customer/pages/shipper-details/enums';
import { LoadFilterStringEnum } from '@pages/load/pages/load-table/enums/load-filter-string.enum';

// Models
import {
    ShipperContactResponse,
    ShipperLoadStopsResponse,
} from 'appcoretruckassist';
import { FilterOptionsLoad } from '@pages/load/pages/load-table/models/filter-options-load.model';
import { LoadsSortDropdownModel } from '@pages/customer/models/loads-sort-dropdown.model';

// Constants
import { TableDropdownComponentConstants } from '@shared/utils/constants/table-dropdown-component.constants';
import { ShipperLoadsSortDropdownConstants } from '@pages/customer/pages/shipper-details/utils/constants';

// Helpers
import { RepairTableDateFormaterHelper } from '@pages/repair/pages/repair-table/utils/helpers/repair-table-date-formater.helper';
import { MethodsGlobalHelper } from '@shared/utils/helpers/methods-global.helper';

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
    public backLoadFilterQuery: FilterOptionsLoad =
        TableDropdownComponentConstants.SHIPPER_LOADS_BACK_FILTER;
    public shipperLoads: ShipperLoadStopsResponse[] = [];
    public shipperContacts: ShipperContactResponse[] = [];
    public pickupFilterData: { selectedFilter: boolean; filteredArray: any[] } =
        {
            selectedFilter: false,
            filteredArray: [],
        };
    public deliveryFilterData: {
        selectedFilter: boolean;
        filteredArray: any[];
    } = {
        selectedFilter: false,
        filteredArray: [],
    };

    constructor(
        // Ref
        private cdRef: ChangeDetectorRef,

        // Router
        private activated_route: ActivatedRoute,
        private router: Router,

        // Services
        private shipperService: ShipperService,
        private detailsPageService: DetailsPageService,
        private dropDownService: DropDownService,
        private tableService: TruckassistTableService,
        private confirmationService: ConfirmationService,
        private DetailsDataService: DetailsDataService,
        private confirmationActivationService: ConfirmationActivationService,
        private caSearchMultipleStatesService: CaSearchMultipleStatesService,

        // Store
        private shipperMinimalStore: ShipperMinimalListStore,
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
        this.confirmationSubscribe();

        this.currentActionAnimationSubscribe();

        this.pageChangeSubscribe();

        this.initTableOptions();

        this.getShipperConfig();

        this.loadsSearchListener();

        this.resetTableSelectedRows();
    }

    public isEmpty(obj: Record<string, any>): boolean {
        return Object.keys(obj).length === 0;
    }

    public shipperConf(data): void {
        this.shipperConfigData = data;
        this.DetailsDataService.setNewData(data);
        this.currentIndex = this.shipperList.findIndex(
            (shipper) => shipper.id === data.id
        );

        this.businessOpen = data?.status ? true : false;

        this.shipperConfig = [
            {
                id: 0,
                nameDefault: ShipperDetailsStringEnum.SHIPPER_DETAIL,
                template: ShipperDetailsStringEnum.GENERAL,
                data: data,
            },
            {
                id: 1,
                nameDefault: ShipperDetailsStringEnum.LOAD,
                template: ShipperDetailsStringEnum.LOAD_2,
                icon: true,
                length: data?.loadStops?.length ? data.loadStops.length : 0,
                hide: true,
                hasArrow: false,
                hasSearch: true,
                timeFilter: true,
                pickupFilter: true,
                deliveryFilter: true,
                searchPlaceholder: ShipperDetailsStringEnum.LOAD,
                data: data,
                hasSort: true,
                sortDropdown:
                    ShipperLoadsSortDropdownConstants.SHIPPER_LOADS_SORT_DROPDOWN,
            },
            {
                id: 2,
                nameDefault: ShipperDetailsStringEnum.CONTACT,
                template: ShipperDetailsStringEnum.CONTACT_2,
                length: data?.shipperContacts?.length
                    ? data.shipperContacts.length
                    : 0,
                hide: false,
                icon: true,
                hasArrow: false,
                hasSearch: false,
                searchPlaceholder: ShipperDetailsStringEnum.CONTACTS,
                data: data,
            },
            {
                id: 3,
                nameDefault: ShipperDetailsStringEnum.REVIEW,
                template: ShipperDetailsStringEnum.REVIEW_2,
                length: data?.reviews?.length ? data.reviews.length : 0,
                customText: ShipperDetailsStringEnum.DATE,
                hide: false,
                data: data,
                hasArrow: false,
                hasSearch: true,
                searchPlaceholder: ShipperDetailsStringEnum.REVIEW,
            },
        ];
        this.shipperId = data?.id ? data.id : null;
        this.shipperLoads = data?.loadStops;
        this.shipperContacts = data?.shipperContacts;
        this.backLoadFilterQuery.shipperId = this.shipperId;
        this.pickupFilterData = {
            selectedFilter: false,
            filteredArray: this.shipperLoads,
        };
        this.deliveryFilterData = {
            selectedFilter: false,
            filteredArray: this.shipperLoads,
        };
        this.tableService.sendResetSpecialFilters(true);
    }

    public deleteShipperById(id: number): void {
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

    public getShipperById(id: number): void {
        this.shipperService
            .getShipperById(id, true)
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => (this.shipperObject = item));
    }

    public onDropActions(event: any): void {
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
            id: this.shipperId,
            type: eventType,
            openedTab,
        };

        const brokerData = this.shipperObject
            ? this.shipperObject
            : this.shipperConfigData;

        this.dropDownService.dropActionsHeaderShipperBroker(
            eventObject,
            brokerData,
            TableStringEnum.SHIPPER
        );
    }

    public onModalAction(event: any): void {
        const eventObject = {
            data: undefined,
            id: this.shipperId,
            type: TableStringEnum.EDIT,
            openedTab:
                event === TableStringEnum.CONTRACT
                    ? TableStringEnum.ADDITIONAL
                    : event,
        };

        setTimeout(() => {
            this.dropDownService.dropActionsHeaderShipperBroker(
                eventObject,
                this.shipperObject,
                TableStringEnum.SHIPPER
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
                sortBy: TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                sortDirection: TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                disabledColumns: [0],
                minWidth: 60,
            },
            actions: [
                {
                    title: TableStringEnum.EDIT_2,
                    name: TableStringEnum.EDIT,
                    svg: 'assets/svg/truckassist-table/dropdown/content/edit.svg',
                    show: true,
                    iconName: TableStringEnum.EDIT,
                },
                {
                    title: TableStringEnum.BORDER,
                },
                {
                    title: TableStringEnum.ADD_CONTRACT_2,
                    name: TableStringEnum.CONTRACT,
                    svg: 'assets/svg/truckassist-table/customer/contact-column-avatar.svg',
                    show: true,
                    iconName: TableStringEnum.ADD_CONTRACT,
                },
                {
                    title: TableStringEnum.WRITE_REVIEW_2,
                    name: TableStringEnum.REVIEW,
                    svg: 'assets/svg/common/review-pen.svg',
                    show: true,
                    iconName: TableStringEnum.WRITE_REVIEW,
                },
                {
                    title: TableStringEnum.BORDER,
                    hide: true,
                },
                {
                    title: TableStringEnum.SHARE_2,
                    name: TableStringEnum.SHARE,
                    svg: 'assets/svg/common/share-icon.svg',
                    show: true,
                    iconName: TableStringEnum.SHARE,
                    hide: true,
                },
                {
                    title: TableStringEnum.PRINT_2,
                    name: TableStringEnum.PRINT,
                    svg: 'assets/svg/common/ic_fax.svg',
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
                    svg: 'assets/svg/common/close-business-icon.svg',
                    redIcon: true,
                    show: true,
                    iconName: TableStringEnum.CLOSE_BUSINESS,
                },
                {
                    title: TableStringEnum.DELETE_2,
                    name: TableStringEnum.DELETE_ITEM,
                    svg: 'assets/svg/common/ic_trash_updated.svg',
                    redIcon: true,
                    show: true,
                    iconName: TableStringEnum.DELETE,
                },
            ],
            export: true,
        };
    }
    /**Function return id */
    public identity(index: number, item: any): number {
        return item.id;
    }

    public changeShipperStatus(id: number): void {
        this.shipperService
            .changeShipperStatus(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {});
    }

    private confirmationSubscribe(): void {
        // Confirmation Subscribe
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res) => {
                    switch (res.type) {
                        case TableStringEnum.DELETE:
                            if (res.template === TableStringEnum.SHIPPER)
                                this.deleteShipperById(res?.id);
                            else if (
                                res.template === TableStringEnum.SHIPPER_CONTACT
                            )
                                this.deleteShipperContactById(
                                    res.data?.shipperId,
                                    res.id
                                );

                            break;

                        case TableStringEnum.DEACTIVATE:
                        case TableStringEnum.ACTIVATE:
                            if (res.template === TableStringEnum.SHIPPER) {
                                this.changeShipperStatus(res?.id);
                            }
                            break;

                        default:
                            break;
                    }
                },
            });

        // Open / Close Business subscribe
        this.confirmationActivationService.getConfirmationActivationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) {
                    if (res.template === TableStringEnum.INFO) {
                        this.changeShipperStatus(res?.data?.id);
                    }
                }
            });
    }

    private currentActionAnimationSubscribe(): void {
        this.tableService.currentActionAnimation
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res?.animation) {
                    this.shipperConf(res.data);
                    this.initTableOptions();
                    this.cdRef.detectChanges();
                }
            });
    }

    private pageChangeSubscribe(): void {
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
                    next: (res) => {
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
    }

    private getShipperConfig(): void {
        const shipperId = this.activated_route.snapshot.params.id;
        const shipperData = {
            ...this.shipperDetailsStore?.getValue()?.entities[shipperId],
        };
        this.shipperConf(shipperData);
    }

    public setFilter(data): void {
        switch (data?.filterType) {
            case eFilterDropdownEnum.TIME_FILTER:
                this.backLoadFilterQuery = {
                    ...this.backLoadFilterQuery,
                    dateTo: data.queryParams.toDate,
                    dateFrom: data.queryParams.fromDate,
                };
                this.loadBackFilter(this.backLoadFilterQuery);
                break;
            default:
                break;
        }
    }

    private loadBackFilter(filter: FilterOptionsLoad): void {
        this.shipperService
            .getShipperLoads(
                filter.loadType,
                filter.statusType,
                filter.status,
                filter.dispatcherIds,
                filter.dispatcherId,
                filter.dispatchId,
                filter.brokerId,
                filter.shipperId,
                filter.loadId,
                filter.loadIds,
                filter.dateFrom,
                filter.dateTo,
                filter.revenueFrom,
                filter.revenueTo,
                filter.truckId,
                filter.driverId,
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
                    this.shipperLoads = res.loads.data;
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

    public setSpecialFilter(data): void {
        if (data) {
            if (data.data.isReset) {
                if (data.type === LoadFilterStringEnum.PICKUP_FILTER) {
                    this.pickupFilterData.selectedFilter = false;
                    this.backLoadFilterQuery.pickup = false;
                } else {
                    this.deliveryFilterData.selectedFilter = false;
                    this.backLoadFilterQuery.delivery = false;
                }

                return;
            }

            if (data.type === LoadFilterStringEnum.PICKUP_FILTER) {
                this.pickupFilterData.selectedFilter =
                    !this.pickupFilterData.selectedFilter;

                if (
                    this.pickupFilterData.selectedFilter &&
                    this.deliveryFilterData.selectedFilter
                ) {
                    this.tableService.sendResetSpecialFilters(
                        true,
                        LoadFilterStringEnum.DELIVERY_FILTER
                    );
                    this.backLoadFilterQuery.delivery = false;
                }

                this.backLoadFilterQuery.pickup =
                    this.pickupFilterData.selectedFilter;

                this.loadBackFilter(this.backLoadFilterQuery);
            } else {
                this.deliveryFilterData.selectedFilter =
                    !this.deliveryFilterData.selectedFilter;

                if (
                    this.deliveryFilterData.selectedFilter &&
                    this.pickupFilterData.selectedFilter
                ) {
                    this.tableService.sendResetSpecialFilters(
                        true,
                        LoadFilterStringEnum.PICKUP_FILTER
                    );
                    this.backLoadFilterQuery.pickup = false;
                }

                this.backLoadFilterQuery.delivery =
                    this.deliveryFilterData.selectedFilter;

                this.loadBackFilter(this.backLoadFilterQuery);
            }
        }
    }

    public onSortAction(event: {
        column: LoadsSortDropdownModel;
        sortDirection: string;
    }): void {
        const loadConfig = this.shipperConfig.find((item) => item.hasSort);

        if (loadConfig) {
            loadConfig.sortDropdown = loadConfig.sortDropdown.map((item) => {
                item.active = item.id === event.column.id;

                return item;
            });
        }

        this.backLoadFilterQuery.sort = event.sortDirection;

        this.loadBackFilter(this.backLoadFilterQuery);
    }

    private deleteShipperContactById(
        shipperId: number,
        contactId: number
    ): void {
        this.shipperService
            .deleteShipperContactById(shipperId, contactId)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    private resetTableSelectedRows(): void {
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
