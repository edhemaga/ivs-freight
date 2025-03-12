import { RouterModule } from '@angular/router';
import {
    Component,
    Input,
    OnInit,
    Output,
    EventEmitter,
    OnChanges,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

// bootstrap
import {
    NgbModule,
    NgbPopover,
    NgbPopoverModule,
} from '@ng-bootstrap/ng-bootstrap';

// components
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaDetailsDropdownComponent } from '@shared/components/ta-details-dropdown/ta-details-dropdown.component';
import { TaCounterComponent } from '@shared/components/ta-counter/ta-counter.component';
import { TaSpecialFilterComponent } from '@shared/components/ta-special-filter/ta-special-filter.component';
import {
    CaSearchMultipleStatesComponent,
    CaFilterComponent,
    CaSortDropdownComponent,
    SortColumn,
    CaFilterDropdownComponent,
    CaFilterTimeDropdownComponent,
    CaFilterListDropdownComponent
} from 'ca-components';

// icon
import { AngularSvgIconModule } from 'angular-svg-icon';

// pipes
import { FormatCurrencyPipe } from '@shared/pipes/format-currency.pipe';

// enums
import { ToolbarFilterStringEnum } from '@shared/components/ta-filter/enums/toolbar-filter-string.enum';
import { DetailsHeaderStringEnum } from '@shared/components/ta-details-header/enums';

// svg routes
import { DetailsHeaderSvgRoutes } from '@shared/components/ta-details-header/utils/svg-routes';

// constants
import { FilterIconRoutes } from '@shared/components/ta-filter/utils/constants/filter-icons-routes.constants';

// models
import { MultipleSelectDetailsDropdownItem } from '@shared/models/multiple-select-details-dropdown-item.model';
import { LoadsSortDropdownModel } from '@pages/customer/models/loads-sort-dropdown.model';
import { ArrayStatus } from '@shared/components/ta-filter/models/array-status.model';

// services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { FilterStateService } from '@shared/components/ta-filter/services/filter-state.service';

@Component({
    selector: 'app-ta-details-header',
    templateUrl: './ta-details-header.component.html',
    styleUrls: ['./ta-details-header.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        FormsModule,
        NgbModule,
        AngularSvgIconModule,
        RouterModule,
        NgbPopoverModule,

        // components
        TaAppTooltipV2Component,
        TaDetailsDropdownComponent,
        TaCounterComponent,
        TaSpecialFilterComponent,
        CaSearchMultipleStatesComponent,
        CaFilterComponent,
        CaSortDropdownComponent,
        CaFilterDropdownComponent,
        CaFilterTimeDropdownComponent,
        CaFilterListDropdownComponent,

        // pipes
        FormatCurrencyPipe,
    ],
})
export class TaDetailsHeaderComponent implements OnInit, OnChanges {
    @ViewChild('popover') multipleDetailsPopover: NgbPopover;

    @Input() headerText: string = null;
    @Input() tooltipHeaderName: string = '';
    @Input() route: string = '';
    @Input() options: any = [];
    @Input() counterData: number = 0;
    @Input() hasIcon: boolean = false;
    @Input() hasDateArrow: boolean = false;
    @Input() customText: string = '';
    @Input() hasRequest: boolean;
    @Input() statusInactive: boolean = true;
    @Input() danger: boolean = false;
    @Input() isInactive: boolean = false;
    @Input() public optionsId: number;
    @Input() hasDateNav: boolean = true;
    @Input() counterViolation: number;
    @Input() hasArrowDown: boolean;
    @Input() totalCost: any;
    @Input() businessOpen: boolean;
    @Input() showClosedBadge: boolean;
    @Input() secondNameHeader: string = '';
    @Input() countViolation: number;
    @Input() hideCounter: boolean;
    @Input() mainData: any;
    @Input() timeFilter: boolean = false;
    @Input() unitFilter: boolean = false;
    @Input() truckTypeFilter: boolean = false;
    @Input() trailerTypeFilter: boolean = false;
    @Input() repairOrderFilter: boolean = false;
    @Input() pmFilter: boolean = false;
    @Input() categoryFilter: boolean = false;
    @Input() moneyFilter: boolean = false;
    @Input() brokerLoadDrop: boolean = false;
    @Input() hasSearch: boolean = false;
    @Input() searchPlaceholder: string;
    @Input() subText: string;
    @Input() capsulaText: string;
    @Input() isMapBtn: boolean;
    @Input() isMapDisplayed: boolean;
    @Input() hasMultipleDetailsSelectDropdown: boolean;
    @Input() multipleDetailsSelectDropdown: MultipleSelectDetailsDropdownItem[];
    @Input() isSearchBtn: boolean = false;
    @Input() pickupFilter: boolean = false;
    @Input() deliveryFilter: boolean = false;
    @Input() pickupFilterData: {
        selectedFilter: boolean;
        filteredArray: any[];
    };
    @Input() deliveryFilterData: {
        selectedFilter: boolean;
        filteredArray: any[];
    };
    @Input() repairFilterData: {
        selectedFilter: boolean;
        filteredArray: any[];
    };
    @Input() dispatcherFilter: boolean = false;
    @Input() statusFilter: boolean = false;
    @Input() locationFilter: boolean = false;
    @Input() areaFilter: boolean = false;
    @Input() hasSort: boolean = false;
    @Input() isSortBtn: boolean = false;
    @Input() sortColumns?: SortColumn[] = [];
    @Input() sortDropdown: LoadsSortDropdownModel[];

    @Output() openModalAction = new EventEmitter<any>();
    @Output() changeDataArrowUp = new EventEmitter<any>();
    @Output() changeDataArrowDown = new EventEmitter<any>();
    @Output() makeRequest = new EventEmitter<any>();
    @Output() mapBtnEmitter = new EventEmitter<boolean>();
    @Output() searchBtnEmitter = new EventEmitter<boolean>();
    @Output() multipleDetailsSelectDropdownEmitter = new EventEmitter<number>();
    @Output() dropActions = new EventEmitter<any>();
    @Output() filterActions = new EventEmitter<any>();
    @Output() specialFilterActions = new EventEmitter<any>();
    @Output() sortItemsAction = new EventEmitter<{
        column: LoadsSortDropdownModel;
        sortDirection: string;
    }>();
    @Output() sortActions = new EventEmitter<any>();

    private destroy$ = new Subject<void>();

    public icPlusSvgIcon: string = 'assets/svg/common/ic_plus.svg';
    public icDangerSvgIcon: string = 'assets/svg/common/ic_danger.svg';
    public up: boolean = false;
    public down: boolean = false;
    public dropOpened: boolean = false;
    public tooltip: any;
    public activeTemplate: any = 'All Load';
    public isMapBtnClicked: boolean = true;
    public isSearchBtnDisplayed: boolean = true;
    public sortDirection: string = 'desc';
    public selectedSort: LoadsSortDropdownModel = null;
    public sortPopover: NgbPopover;
    public isSortDropdownOpen: boolean = false;
    public activeSortType: SortColumn | null = null;

    public loadStatusOptionsArray: ArrayStatus[];
    public unselectedDispatcher: ArrayStatus[];
    public truckTypeArray: ArrayStatus[];
    public trailerTypeArray: ArrayStatus[];
    public categoryRepairArray: ArrayStatus[];
    public pmFilterArray: ArrayStatus[];

    public detailsHeaderSvgRoutes = DetailsHeaderSvgRoutes;

    private rotate: { [key: string]: string } = {
        asc: 'desc',
        desc: 'asc',
    };

    constructor(
        private tableService: TruckassistTableService,
        private filterService: FilterStateService
    ) {}

    ngOnInit(): void {
        this.handleFilterInitialization();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (
            changes?.isMapDisplayed?.currentValue !==
            changes?.isMapDisplayed?.previousValue
        ) {
            this.isMapBtnClicked = changes?.isMapDisplayed?.currentValue;
        }

        if (
            changes?.sortDropdown?.currentValue !==
            changes?.sortDropdown?.previousValue
        ) {
            this.selectedSort = changes.sortDropdown.currentValue.find(
                (item) => item.active
            );
        }
    }

    public handleFilterInitialization(): void {
        let truckResData;
        let trailerResData;

        if (this.categoryFilter) this.filterService.getRepairCategory();

        if (this.pmFilter)
            this.filterService.getPmData(ToolbarFilterStringEnum.TRUCK);

        if (this.truckTypeFilter || this.trailerTypeFilter) {
            truckResData = this.filterService.getTruckType(
                this.options.toolbarActions.showTruckDispatchFilter
            );
            trailerResData = this.filterService.getTrailerType(
                this.options.toolbarActions.showTrailerDispatchFilter
            );
        }

        this.tableService.currentLoadStatusFilterOptions
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) this.loadStatusOptionsArray = [...res.options];
            });

        this.tableService.currentActionAnimation
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                (
                    res: any // leave any for now
                ) => {
                    if (
                        res?.animation ===
                        ToolbarFilterStringEnum.DISPATCH_DATA_UPDATE
                    ) {
                        const newData = res.data.map(
                            (
                                type: any
                                // leave any for now
                            ) => {
                                type[ToolbarFilterStringEnum.NAME] =
                                    type?.fullName ??
                                    `${type?.driver?.firstName} ${type?.driver?.lastName}`;
                                type[ToolbarFilterStringEnum.COUNT] =
                                    type.loadCount;
                                return type;
                            }
                        );

                        this.unselectedDispatcher = newData;
                    }
                    if (res?.animation === ToolbarFilterStringEnum.LIST_UPDATE)
                        this.loadStatusOptionsArray = res.data.statuses;

                    if (
                        res?.animation ===
                        ToolbarFilterStringEnum.TRUCK_LIST_UPDATE
                    ) {
                        this.truckTypeArray = truckResData;
                        if (
                            this.options.toolbarActions.showTruckPmFilter ||
                            this.options.toolbarActions.showTrailerPmFilter
                        ) {
                            this.truckTypeArray = res.data.map(
                                (
                                    type: any
                                    // leave any for now
                                ) => {
                                    type[ToolbarFilterStringEnum.NAME] =
                                        type.truckNumber;
                                    return type;
                                }
                            );
                        } else {
                            this.truckTypeArray = res.data.map((item) => ({
                                ...item.truckType,
                                count: item.count,
                                icon: item.truckType?.logoName
                                    ? FilterIconRoutes.truckSVG +
                                      item.truckType.logoName
                                    : null,
                            }));
                        }
                    }
                    if (
                        res?.animation ===
                        ToolbarFilterStringEnum.TRAILER_LIST_UPDATE
                    ) {
                        this.trailerTypeArray = trailerResData;
                        if (
                            this.options.toolbarActions.showTruckPmFilter ||
                            this.options.toolbarActions.showTrailerPmFilter
                        ) {
                            this.trailerTypeArray = res.data.map(
                                (
                                    type: any
                                    // leave any for now
                                ) => {
                                    type[ToolbarFilterStringEnum.NAME] =
                                        type.trailerNumber;
                                    return type;
                                }
                            );
                        } else {
                            this.trailerTypeArray = res.data.map((item) => ({
                                ...item.trailerType,
                                count: item.count,
                                icon: item.trailerType?.logoName
                                    ? FilterIconRoutes.trailerSVG +
                                      item.trailerType.logoName
                                    : null,
                            }));
                        }
                    }
                    if (
                        res?.animation ===
                        ToolbarFilterStringEnum.TRUCK_TYPE_UPDATE
                    ) {
                        this.truckTypeArray = truckResData;
                        this.truckTypeArray = res.data.map((item) => ({
                            ...item.truckType,
                            count: item.count,
                            icon: item.truckType?.logoName
                                ? FilterIconRoutes.truckSVG +
                                  item.truckType.logoName
                                : null,
                        }));
                    }
                    if (
                        res?.animation ===
                        ToolbarFilterStringEnum.TRAILER_TYPE_UPDATE
                    ) {
                        this.trailerTypeArray = trailerResData;
                        this.trailerTypeArray = res.data.map((item) => ({
                            ...item.trailerType,
                            count: item.count,
                            icon: item.trailerType?.logoName
                                ? FilterIconRoutes.trailerSVG +
                                  item.trailerType.logoName
                                : null,
                        }));
                    }

                    if (
                        res?.animation ===
                        ToolbarFilterStringEnum.REPAIR_CATEGORY_UPDATE
                    ) {
                        const newData = res.data.map(
                            (
                                type: any // leave any for now
                            ) => {
                                type[ToolbarFilterStringEnum.ICON] =
                                    FilterIconRoutes.categorySVG + type.logo;
                                return type;
                            }
                        );
                        this.categoryRepairArray = newData;
                    }

                    if (
                        res?.animation ===
                        ToolbarFilterStringEnum.PM_TRUCK_DATA_UPDATE
                    ) {
                        if (res.data.pmTrucks?.length) {
                            const newData = res.data.pmTrucks.map(
                                (type: any) => {
                                    type[ToolbarFilterStringEnum.ICON] =
                                        FilterIconRoutes.repairPmSVG +
                                        type.logoName;
                                    type[ToolbarFilterStringEnum.NAME] =
                                        type.title;

                                    return type;
                                }
                            );

                            this.pmFilterArray = newData;
                        } else {
                            this.pmFilterArray = [];
                        }
                    }
                }
            );
    }

    public openModal(val: string) {
        this.openModalAction.emit(val);
    }
    public makeRequestFun(req: any) {
        this.makeRequest.emit(req);
    }
    /**Function for drop acitons */
    public dropAct(action: any) {
        this.dropActions.emit(action);
    }
    public changeDataArrowUpFun(val: any) {
        this.up = true;
        if (this.down == true) {
            this.down = false;
        }
        this.changeDataArrowUp.emit(val);
    }
    public changeDataArrowDownFun(val: any) {
        this.down = true;
        if (this.up == true) {
            this.up = false;
        }
        this.changeDataArrowDown.emit(val);
    }
    public trackByIndex(index: number, _: any): any {
        return index;
    }

    toggleDropdownActions() {
        let itemData = this.mainData?.data;
        let diasbleClosedArray;

        if (this.mainData?.nameDefault == 'Repair Shop Detail') {
            if (itemData.status != 1) {
                diasbleClosedArray = [0, 3, 4, 5];
            } else if (itemData.companyOwned) {
                diasbleClosedArray = [3];
            }
        }

        if (this.mainData?.nameDefault == 'Broker Detail') {
            if (itemData.status != 1) {
                diasbleClosedArray = [0, 2, 3, 4, 5, 6];
            } else if (itemData.dnu || itemData.ban) {
                diasbleClosedArray = [2];
            }
        }

        if (this.mainData?.nameDefault == 'Shipper Detail') {
            if (itemData.status != 1) {
                diasbleClosedArray = [0, 2, 3];
            }
        }

        switch (this.mainData?.nameDefault) {
            case 'Repair Shop Detail':
                this.options?.actions.map((action, index) => {
                    if (index == 3) {
                        if (itemData.pinned != false) {
                            action.title = 'Remove from Favourite';
                            action.name = 'remove-from-favourite';
                            action.blueIcon = true;
                        } else {
                            action.title = 'Mark as favorite';
                            action.name = 'move-to-favourite';
                            action.blueIcon = false;
                        }
                    }

                    if (
                        diasbleClosedArray &&
                        diasbleClosedArray.indexOf(index) > -1
                    ) {
                        action.disabled = true;
                    } else {
                        action.disabled = false;
                    }

                    if (index == 9) {
                        this.openCloseBusiness(itemData, action);
                    }
                });
                break;
            case 'Broker Detail':
                this.options?.actions.map((action, index) => {
                    if (
                        diasbleClosedArray &&
                        diasbleClosedArray.indexOf(index) > -1
                    ) {
                        action.disabled = true;
                    } else {
                        action.disabled = false;
                    }

                    if (index == 5) {
                        if (itemData.ban) {
                            action.title = 'Remove from Ban List';
                            action.name = 'remove-from-ban';
                        } else {
                            action.title = 'Move to Ban List';
                            action.name = 'move-to-ban';
                        }
                    }

                    if (index == 6) {
                        if (itemData.dnu) {
                            action.title = 'Remove from DNU List';
                            action.name = 'remove-from-dnu';
                        } else {
                            action.title = 'Move to DNU List';
                            action.name = 'move-to-dnu';
                        }
                    }

                    if (index == 11) {
                        this.openCloseBusiness(itemData, action);
                    }
                });

                break;

            case 'Shipper Detail':
                this.options?.actions.map((action, index) => {
                    if (
                        diasbleClosedArray &&
                        diasbleClosedArray.indexOf(index) > -1
                    ) {
                        action.disabled = true;
                    } else {
                        action.disabled = false;
                    }

                    if (index == 8) {
                        if (itemData.status != 1) {
                            action.title = 'Reopen Business';
                            action.greenIcon = true;
                            action.redIcon = false;
                            action.name = 'open-business';
                            action.iconName = 'mark-as-done';
                        } else {
                            action.title = 'Close Business';
                            action.greenIcon = false;
                            action.redIcon = true;
                            action.name = 'close-business';
                            action.iconName = 'close-business';
                        }
                    }
                });
                break;
        }
    }

    private openCloseBusiness(itemData: any, action: any) {
        if (itemData.status === 0) {
            action.title = 'Reopen Business';
            action.greenIcon = true;
            action.redIcon = false;
            action.name = 'open-business';
            action.iconName = 'mark-as-done';
        } else {
            action.title = 'Close Business';
            action.greenIcon = false;
            action.redIcon = true;
            action.name = 'close-business';
            action.iconName = 'close-business';
        }
    }

    showDropdown(tooltip: any) {
        if (this.brokerLoadDrop) {
            this.tooltip = tooltip;
            if (tooltip.isOpen()) {
                //tooltip.close();
            } else {
                tooltip.open();
            }
            this.dropOpened = !this.dropOpened;
        }
    }

    dropdownClosed() {
        this.dropOpened = false;
    }

    public handleMapBtnClick(): void {
        this.isMapBtnClicked = !this.isMapBtnClicked;

        this.mapBtnEmitter.emit(this.isMapBtnClicked);
    }

    public handleSearchBtnClick(): void {
        this.isSearchBtnDisplayed = false;

        this.searchBtnEmitter.emit(true);
    }

    public handleMultipleDetailsSelectDropdownClick(id: number): void {
        this.multipleDetailsSelectDropdownEmitter.emit(id);

        this.multipleDetailsPopover.close();
    }

    public setFilterValue<T>(data: T): void {
        this.filterActions.emit(data);
    }

    public onSpecialFilter<T>(data: T, type: string): void {
        this.specialFilterActions.emit({ data, type });
    }

    public handleSortClick(event: {
        column: SortColumn;
        sortName: string;
    }): void {
        if (!event.sortName) {
            this.sortDirection =
                this.sortDirection === DetailsHeaderStringEnum.DESC
                    ? DetailsHeaderStringEnum.ASC
                    : DetailsHeaderStringEnum.DESC;

            const capitalizedDirection =
                this.sortDirection.charAt(0).toUpperCase() +
                this.sortDirection.slice(1);

            const dateSortDirection =
                DetailsHeaderStringEnum.DATE_ADDED + capitalizedDirection;

            this.sortActions.emit({ direction: dateSortDirection });
        } else {
            this.activeSortType = event.column;

            this.sortActions.emit({ direction: event.sortName });
        }
    }

    public sortItems(
        column: LoadsSortDropdownModel,
        changeDirection?: boolean
    ): void {
        if (changeDirection)
            this.sortDirection = this.rotate[this.sortDirection];

        const directionSort = this.sortDirection
            ? column.sortName +
              (this.sortDirection[0]?.toUpperCase() +
                  this.sortDirection?.substr(1).toLowerCase())
            : '';

        this.sortItemsAction.emit({ column, sortDirection: directionSort });

        if (this.sortPopover?.isOpen()) {
            this.showSortDropdown(this.sortPopover);
        }
    }

    public showSortDropdown(popover: NgbPopover): void {
        this.sortPopover = popover;
        if (popover.isOpen()) {
            popover.close();
        } else {
            popover.open();
        }
        this.isSortDropdownOpen = !this.isSortDropdownOpen;
    }

    public sortDropdownClosed(): void {
        this.sortPopover?.close();
        this.isSortDropdownOpen = false;
    }

    ngOnDestroy(): void {
        this.tableService.sendCurrentSetTableFilter(null);
    }
}
