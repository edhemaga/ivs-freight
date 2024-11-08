import { CommonModule } from '@angular/common';
import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

//Components

import { TaFilterComponent } from '@shared/components/ta-filter/ta-filter.component';
import { TaSpecialFilterComponent } from '@shared/components/ta-special-filter/ta-special-filter.component';
import {
    CaFilterComponent,
    CaSearchMultipleStatesComponent,
} from 'ca-components';
// enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { LoadFilterStringEnum } from '@pages/load/pages/load-table/enums/load-filter-string.enum';
import { ToolbarFilterStringEnum } from '@shared/components/ta-filter/enums/toolbar-filter-string.enum';

// pipes
import { MoneyFilterPipe } from '@shared/pipes/money-filter.pipe';
import { FormatCurrencyPipe } from '@shared/pipes/format-currency.pipe';

// constants
import { FilterIconRoutes } from '@shared/components/ta-filter/utils/constants/filter-icons-routes.constants';

// services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { FilterStateService } from '@shared/components/ta-filter/services/filter-state.service';

// models
import { ArrayStatus } from '@shared/components/ta-filter/models/array-status.model';
import { StateResponse } from 'appcoretruckassist/model/stateResponse';

@Component({
    selector: 'app-ta-toolbar-filters',
    templateUrl: './ta-toolbar-filters.component.html',
    styleUrls: ['./ta-toolbar-filters.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TaFilterComponent,
        AngularSvgIconModule,
        FormatCurrencyPipe,
        MoneyFilterPipe,
        TaSpecialFilterComponent,
        CaSearchMultipleStatesComponent,
        CaFilterComponent,
    ],
})
export class TaToolbarFiltersComponent implements OnInit, OnChanges, OnDestroy {
    @Output() toolbarFilter: EventEmitter<any> = new EventEmitter();
    @Input() options: any;
    @Input() activeTableData: any;
    public loadFilterData: { name: string; active: boolean }[] = [
        {
            name: TableStringEnum.ALL,
            active: true,
        },
        {
            name: TableStringEnum.FTL,
            active: false,
        },
        {
            name: TableStringEnum.LTL,
            active: false,
        },
    ];
    public showLtl: boolean = true;
    public showFtl: boolean = true;
    private destroy$ = new Subject<void>();

    public loadStatusOptionsArray: ArrayStatus[];
    public unselectedDispatcher: ArrayStatus[];
    public truckTypeArray: ArrayStatus[];
    public trailerTypeArray: ArrayStatus[];
    public usaStates: ArrayStatus[];
    public canadaStates: ArrayStatus[];
    public categoryRepairArray: ArrayStatus[];
    public pmFilterArray: ArrayStatus[];

    constructor(
        private tableSevice: TruckassistTableService,
        private filterService: FilterStateService
    ) {}
    public customerFilter: {
        filteredArray: any;
        selectedFilter: boolean;
        filterName: string;
    } = {
        filteredArray: [],
        selectedFilter: false,
        filterName: '',
    };

    // --------------------------------NgOnInit---------------------------------
    ngOnInit(): void {
        this.handleFilterInitialization();
    }

    // --------------------------------NgOnChanges---------------------------------
    ngOnChanges(changes: SimpleChanges) {
        if (!changes?.options?.firstChange && changes?.options) {
            this.options = changes.options.currentValue;
        }

        if (
            !changes?.activeTableData?.firstChange &&
            changes?.activeTableData
        ) {
            this.activeTableData = changes.activeTableData.currentValue;
        }

        this.handleFilterInitialization();
    }

    public handleFilterInitialization(): void {
        let truckResData;
        let trailerResData;

        if (this.options.toolbarActions.showDispatcherFilter)
            this.filterService.getDispatchData();

        if (this.options.toolbarActions.showStateFilter)
            this.filterService.getStateData();

        if (this.options.toolbarActions.showCategoryRepairFilter)
            this.filterService.getRepairCategory();

        if (this.options.toolbarActions.showPMFilter)
            this.filterService.getPmData(
                this.options.toolbarActions.showTrailerPmFilter
                    ? 'trailer'
                    : 'truck'
            );

        if (
            this.options.toolbarActions.showTruckPmFilter ||
            this.options.toolbarActions.showTrailerPmFilter
        ) {
            trailerResData = this.filterService.getRepairTrailerData();
            truckResData = this.filterService.getRepairTruckData();
        } else {
            truckResData = this.filterService.getTruckType(
                this.options.toolbarActions.showTruckDispatchFilter
            );
            trailerResData = this.filterService.getTrailerType(
                this.options.toolbarActions.showTrailerDispatchFilter
            );
        }

        this.tableSevice.currentLoadStatusFilterOptions
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) this.loadStatusOptionsArray = [...res.options];
            });

        this.tableSevice.currentActionAnimation
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
                                icon:
                                    FilterIconRoutes.truckSVG +
                                    item.truckType.logoName,
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
                                icon:
                                    FilterIconRoutes.trailerSVG +
                                    item.trailerType.logoName,
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
                            icon:
                                FilterIconRoutes.truckSVG +
                                item.truckType.logoName,
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
                            icon:
                                FilterIconRoutes.trailerSVG +
                                item.trailerType.logoName,
                        }));
                    }
                    if (
                        res?.animation ===
                        ToolbarFilterStringEnum.STATE_DATA_UPDATE
                    )
                        this.handleStateDataUpdate(res);

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

    public handleStateDataUpdate(
        res: any // leave any for now
    ): void {
        const usaArray = [];
        const canadaArray = [];

        res.data.forEach((state: StateResponse) => {
            if (state.countryType.name === ToolbarFilterStringEnum.CANADA_2)
                canadaArray.push(state);
            else usaArray.push(state);
        });

        this.usaStates = usaArray;
        this.canadaStates = canadaArray;
    }

    // On Change Mode View
    changeModeView(modeView: string) {
        this.options.toolbarActions.viewModeOptions =
            this.options.toolbarActions.viewModeOptions.map((viewMode: any) => {
                viewMode.active = viewMode.name === modeView;

                return viewMode;
            });

        this.toolbarFilter.emit({
            mode: modeView,
        });
    }

    public changeFilterView(event: string): void {
        this.loadFilterData.map((filterData) => {
            filterData.active = filterData.name === event || false;
            if (filterData.active) {
                if (filterData.name == TableStringEnum.ALL) {
                    this.showFtl = true;
                    this.showLtl = true;
                } else if (filterData.name == TableStringEnum.FTL) {
                    this.showFtl = true;
                    this.showLtl = false;
                } else if (filterData.name == TableStringEnum.LTL) {
                    this.showFtl = false;
                    this.showLtl = true;
                }
            }
        });

        const mappedEvent = {
            action: LoadFilterStringEnum.SET,
            filterType: LoadFilterStringEnum.LOAD_TYPE_FILTER,
            queryParams: {
                loadType:
                    event === LoadFilterStringEnum.FTL
                        ? 1
                        : event === LoadFilterStringEnum.LTL
                        ? 2
                        : null,
            },
        };
        this.tableSevice.sendCurrentSetTableFilter(mappedEvent);
    }

    // On Filter
    onFilter(event: any) {
        this.tableSevice.sendCurrentSetTableFilter(event);
    }

    //On special filter
    public onSpecialFilter(event: any, data: string): void {
        if (this.activeTableData?.ftlArray)
            this.activeTableData.ftlArray.selectedFilter =
                data == TableStringEnum.FTL_ARRAY || false;

        if (this.activeTableData?.ltlArray)
            this.activeTableData.ltlArray.selectedFilter =
                data == TableStringEnum.LTL_ARRAY || false;

        if (this.activeTableData?.repairArray)
            this.activeTableData.repairArray.selectedFilter =
                data == TableStringEnum.REPAIR_ARRAY || false;

        if (this.activeTableData?.fuelArray)
            this.activeTableData.fuelArray.selectedFilter =
                data == TableStringEnum.FUEL_ARRAY || false;

        if (this.activeTableData?.closedArray)
            this.activeTableData.closedArray.selectedFilter =
                data == TableStringEnum.CLOSED_ARRAY || false;

        if (this.activeTableData?.driverArhivedArray)
            this.activeTableData.driverArhivedArray.selectedFilter =
                data == TableStringEnum.DRIVER_ARCHIVED_ARRAY || false;

        if (this.activeTableData?.deactivatedUserArray)
            this.activeTableData.deactivatedUserArray.selectedFilter =
                data == TableStringEnum.DEACTIVATED_ARHIVED_ARRAY || false;

        if (this.activeTableData?.bannedArray)
            this.activeTableData.bannedArray.selectedFilter =
                data == TableStringEnum.BAN;

        if (this.activeTableData?.dnuArray)
            this.activeTableData.dnuArray.selectedFilter =
                data == TableStringEnum.DNU;

        if (
            this.activeTableData?.dnuArray ||
            this.activeTableData?.bannedArray ||
            this.activeTableData?.closedArray
        ) {
            this.customerFilter = {
                ...this.customerFilter,
                filterName: data,
                selectedFilter: event.selectedFilter,
            };

            if (event.selectedFilter) {
                event.filteredArray.forEach((item) => {
                    this.customerFilter.filteredArray.push(item);
                });
            } else {
                this.customerFilter.filteredArray =
                    this.customerFilter.filteredArray.filter((item) => {
                        return !event.filteredArray.some((removeItem) =>
                            Object.entries(removeItem).every(
                                ([key, value]) => item[key] === value
                            )
                        );
                    });
            }
            if (!this.customerFilter.filteredArray.length) {
                this.customerFilter.selectedFilter = false;
            }
        }
        this.tableSevice.sendCurrentSetTableFilter(
            this.customerFilter?.filteredArray.length
                ? this.customerFilter
                : { ...event, filterName: data }
        );
    }
    // --------------------------------NgOnDestroy---------------------------------
    ngOnDestroy(): void {
        this.tableSevice.sendCurrentSetTableFilter(null);
    }
}
