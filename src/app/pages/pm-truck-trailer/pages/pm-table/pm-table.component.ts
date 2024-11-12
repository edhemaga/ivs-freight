import { AfterViewInit, Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { DatePipe } from '@angular/common';

// Helpers
import {
    getTruckPMColumnDefinition,
    getTrailerPMColumnDefinition,
} from '@shared/utils/settings/table-settings/pm-columns';
import { MethodsGlobalHelper } from '@shared/utils/helpers/methods-global.helper';

// Components
import { PmModalComponent } from '@pages/pm-truck-trailer/pages/pm-modal/pm-modal.component';

// Models
import { DropdownItem } from '@shared/models/card-models/card-table-data.model';
import { GridColumn } from '@shared/models/table-models/grid-column.model';
import { PmTrailer } from '@pages/pm-truck-trailer/pages/pm-table/models/pm-trailer.model';
import { PmTruck } from '@pages/pm-truck-trailer/pages/pm-table/models/pm-truck.model';
import { CardTableData } from '@shared/models/table-models/card-table-data.model';
import { CardRows } from '@shared/models/card-models/card-rows.model';
import { TableToolbarActions } from '@shared/models/table-models/table-toolbar-actions.model';
import { PmTableColumns } from '@pages/pm-truck-trailer/pages/pm-table/models/pm-table-columns.model';
import { PmTableAction } from '@pages/pm-truck-trailer/pages/pm-table/models/pm-table-action.model';
import {
    PMStatus,
    PMTrailerUnitResponse,
    PMTruckUnitResponse,
} from 'appcoretruckassist';
import { PMTruckFilter } from '@pages/pm-truck-trailer/pages/pm-table/models/pm-truck-filter.model';
import { PMTrailerFilter } from '@pages/pm-truck-trailer/pages/pm-table/models/pm-trailer-filter.model';

// Services
import { ModalService } from '@shared/services/modal.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { PmService } from '@pages/pm-truck-trailer/services/pm.service';
import { PMCardsModalService } from '@pages/pm-truck-trailer/pages/pm-card-modal/service/pm-cards-modal.service';
import { CaSearchMultipleStatesService } from 'ca-components';

// Constants
import { TableDropdownComponentConstants } from '@shared/utils/constants/table-dropdown-component.constants';
import { PmCardDataConfigConstants } from '@pages/pm-truck-trailer/pages/pm-table/utils/constants/pm-card-data-config.constants';
import { PMTruckFilterConstants } from '@pages/pm-truck-trailer/pages/pm-table/utils/constants/pm-truck-filter.constants';
import { PMTrailerFilterConstants } from '@pages/pm-truck-trailer/pages/pm-table/utils/constants/pm-trailer-filter.constants';

// Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { TruckNameStringEnum } from '@shared/enums/truck-name-string.enum';
import { TrailerNameStringEnum } from '@shared/enums/trailer-name-string.enum';
import { TooltipColorsStringEnum } from '@shared/enums/tooltip-colors-string.enum';
import { TableActionsStringEnum } from '@shared/enums/table-actions-string.enum';

// Store
import { PmTruckQuery } from '@pages/pm-truck-trailer/state/pm-truck-state/pm-truck.query';
import { PmTrailerQuery } from '@pages/pm-truck-trailer/state/pm-trailer-state/pm-trailer.query';
import { PmListTruckQuery } from '@pages/pm-truck-trailer/state/pm-list-truck-state/pm-list-truck.query';
import { PmListTrailerQuery } from '@pages/pm-truck-trailer/state/pm-list-trailer-state/pm-list-trailer.query';

// Pipes
import { ThousandSeparatorPipe } from '@shared/pipes/thousand-separator.pipe';
import { ThousandToShortFormatPipe } from '@shared/pipes/thousand-to-short-format.pipe';
import { select, Store } from '@ngrx/store';
import {
    selectActiveTabCards,
    selectInactiveTabCards,
} from '../pm-card-modal/state';
import { RepairOrderModalComponent } from '@pages/repair/pages/repair-modals/repair-order-modal/repair-order-modal.component';

@Component({
    selector: 'app-pm-table',
    templateUrl: './pm-table.component.html',
    styleUrls: ['./pm-table.component.scss'],
    providers: [ThousandSeparatorPipe, ThousandToShortFormatPipe],
})
export class PmTableComponent implements OnInit, AfterViewInit, OnDestroy {
    private destroy$ = new Subject<void>();
    public tableOptions: any = {};
    public tableData: any[] = [];
    private viewData: any[] = [];
    public columns: GridColumn[] = [];
    public selectedTab: string = TableStringEnum.ACTIVE;
    public activeViewMode: string = TableStringEnum.LIST;
    private resizeObserver: ResizeObserver;

    //Data to display from model Broker
    public displayRowsFront: CardRows[] =
        PmCardDataConfigConstants.DISPLAY_ROWS_FRONT_ACTIVE;
    public displayRowsBack: CardRows[] =
        PmCardDataConfigConstants.DISPLAY_ROWS_BACK_ACTIVE;

    //Data to display from model Shipper
    public displayRowsFrontInactive: CardRows[] =
        PmCardDataConfigConstants.DISPLAY_ROWS_FRONT_INACTIVE;
    public displayRowsBackInactive: CardRows[] =
        PmCardDataConfigConstants.DISPLAY_ROWS_BACK_INACTIVE;

    public cardTitle: string = PmCardDataConfigConstants.CARD_TITLE;
    public page: string = PmCardDataConfigConstants.PAGE;
    public rows: number = PmCardDataConfigConstants.ROWS;

    public sendDataToCardsFront: CardRows[];
    public sendDataToCardsBack: CardRows[];
    public customColumnsTruck: PmTableColumns[] = [];
    public customColumnsTrailer: PmTableColumns[] = [];

    // Filter
    public pmTruckBackFilterQuery: PMTruckFilter = {
        ...PMTruckFilterConstants.pmTruckFilterQuery,
    };
    public pmTrailerBackFilterQuery: PMTrailerFilter = {
        ...PMTrailerFilterConstants.pmTrailerFilterQuery,
    };
    public tableDataLength: number;

    public displayRows$: Observable<any>; //leave this as any for now

    constructor(
        // Services
        private modalService: ModalService,
        private tableService: TruckassistTableService,
        private pmService: PmService,
        private pmCardsModalService: PMCardsModalService,
        private caSearchMultipleStatesService: CaSearchMultipleStatesService,
        // Store
        private pmTruckQuery: PmTruckQuery,
        private pmTrailerQuery: PmTrailerQuery,
        private pmListTruckQuery: PmListTruckQuery,
        private pmListTrailerQuery: PmListTrailerQuery,
        private store: Store,

        // Pipes
        private thousandSeparator: ThousandSeparatorPipe,
        private thousandToShortFormatPipe: ThousandToShortFormatPipe,
        public datePipe: DatePipe
    ) {}

    // ---------------------------- ngOnInit ------------------------------
    ngOnInit(): void {
        this.updateCardView();

        this.setCustomPmColumns();

        this.sendPMData();

        this.resetColumns();

        this.toogleColumns();

        this.actionAnimationSubscribe();

        this.pmListSubscribe();

        this.pmCurrentSearchTableData();
    }

    // ---------------------------- ngAfterViewInit ------------------------------
    ngAfterViewInit(): void {
        setTimeout(() => {
            this.observTableContainer();
        }, 10);
    }

    // Reset Columns
    private resetColumns(): void {
        this.tableService.currentResetColumns
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
                if (response) this.sendPMData();
            });
    }

    private observTableContainer(): void {
        this.resizeObserver = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                this.tableService.sendCurrentSetTableWidth(
                    entry.contentRect.width
                );
            });
        });

        this.resizeObserver.observe(
            document.querySelector(TableStringEnum.TABLE_CONTAINER)
        );
    }

    private initTableOptions(): void {
        this.tableOptions = {
            toolbarActions: {
                showGeneralPmBtn: true,
                hideDeleteButton: true,
                hideActivationButton: true,
                viewModeOptions: [
                    {
                        name: TableStringEnum.LIST,
                        active: this.activeViewMode === TableStringEnum.LIST,
                    },
                    {
                        name: TableStringEnum.CARD,
                        active: this.activeViewMode === TableStringEnum.CARD,
                    },
                ],
            },
            actions: TableDropdownComponentConstants.ACTIONS_DROPDOWN,
        };
    }

    private sendPMData(): void {
        const tableView = JSON.parse(
            localStorage.getItem(TableStringEnum.PM_TABLE_VIEW)
        );

        if (tableView) {
            this.selectedTab = tableView.tabSelected;
            this.activeViewMode = tableView.viewMode;

            this.pmTruckBackFilterQuery.pageIndex = 1;
            this.pmTrailerBackFilterQuery.pageIndex = 1;
        }

        this.initTableOptions();

        this.getTableCountData();
    }

    private getGridColumns(configType: string): PmTableColumns[] {
        const tableColumnsConfig = JSON.parse(
            localStorage.getItem(`table-${configType}-Configuration`)
        );

        if (configType === TableStringEnum.PM_TRUCK) {
            return tableColumnsConfig
                ? tableColumnsConfig
                : getTruckPMColumnDefinition();
        } else {
            return tableColumnsConfig
                ? tableColumnsConfig
                : getTrailerPMColumnDefinition();
        }
    }

    private setPmData(td: CardTableData): void {
        this.columns = td.gridColumns;

        if (td.data.length) {
            this.viewData = td.data;

            this.viewData = this.viewData.map((data) => {
                data.isSelected = false;
                return data;
            });
        } else {
            this.viewData = [];
        }
    }

    private getTableCountData(): void {
        const truckCount = JSON.parse(
            localStorage.getItem('pmTruckTableCount')
        );

        const trailerCount = JSON.parse(
            localStorage.getItem('pmTrailerTableCount')
        );

        this.tableData = [
            {
                title: TableStringEnum.TRUCK_2,
                field: TableStringEnum.ACTIVE,
                length: truckCount.pmTruck,
                data: this.getTableData(TableStringEnum.TRUCK),
                extended: false,
                selectTab: true,
                gridNameTitle: TableStringEnum.PM_2,
                isUpperCaseTitle: true,
                stateName: TableStringEnum.PM_TRUCKS,
                tableConfiguration: TableStringEnum.PM_TRUCK,
                isActive: this.selectedTab === TableStringEnum.ACTIVE,
                gridColumns: this.getAllTableColumns(TableStringEnum.PM_TRUCK),
            },
            {
                title: TableStringEnum.TRAILER_3,
                field: TableStringEnum.INACTIVE,
                length: trailerCount.pmTrailer,
                data: this.getTableData(TableStringEnum.TRAILER_2),
                extended: false,
                selectTab: true,
                gridNameTitle: TableStringEnum.PM_2,
                isUpperCaseTitle: true,
                stateName: TableStringEnum.PM_TRAILERS,
                tableConfiguration: TableStringEnum.PM_TRAILER,
                isActive: this.selectedTab === TableStringEnum.INACTIVE,
                gridColumns: this.getAllTableColumns(
                    TableStringEnum.PM_TRAILER
                ),
            },
        ];

        const activeTableData = this.tableData.find(
            (table) => table.field === this.selectedTab
        );

        this.tableDataLength = activeTableData.length;

        this.setPmData(activeTableData);

        this.updateCardView();
    }

    public onToolBarAction(event: TableToolbarActions): void {
        if (event.action === TableStringEnum.TAB_SELECTED) {
            this.selectedTab = event.tabData.field;
            this.sendPMData();
        } else if (event.action === TableStringEnum.OPEN_GENERAL_PM) {
            if (this.selectedTab === TableStringEnum.ACTIVE) {
                this.modalService.openModal(
                    PmModalComponent,
                    { size: TableStringEnum.SMALL },
                    {
                        type: TableStringEnum.NEW,
                        header: TableStringEnum.TRUCK_2,
                        action: TableStringEnum.GENERIC_PM,
                    }
                );
            } else {
                this.modalService.openModal(
                    PmModalComponent,
                    { size: TableStringEnum.SMALL },
                    {
                        type: TableStringEnum.NEW,
                        header: TableStringEnum.TRAILER_3,
                        action: TableStringEnum.GENERIC_PM,
                    }
                );
            }
        } else if (event.action === TableStringEnum.VIEW_MODE) {
            this.activeViewMode = event.mode;
        } else if (event.action === TableStringEnum.OPEN_MODAL) {
            this.modalService.openModal(
                RepairOrderModalComponent,
                {
                    size: TableStringEnum.LARGE,
                },
                {
                    type:
                        this.selectedTab === TableStringEnum.ACTIVE
                            ? TableStringEnum.NEW_TRUCK
                            : TableStringEnum.NEW_TRAILER,
                }
            );
        }
    }

    public onTableBodyActions(event: PmTableAction): void {
        switch (event.type) {
            case TableStringEnum.SHOW_MORE:
                if (this.selectedTab === TableStringEnum.ACTIVE) {
                    this.pmTruckBackFilterQuery.pageIndex++;

                    this.pmTruckBackFilter(this.pmTruckBackFilterQuery, true);
                } else {
                    this.pmTrailerBackFilterQuery.pageIndex++;

                    this.pmTrailerBackFilter(
                        this.pmTrailerBackFilterQuery,
                        true
                    );
                }
                break;
            case TableStringEnum.CONFIGURE:
                if (this.selectedTab === TableStringEnum.ACTIVE) {
                    this.modalService.openModal(
                        PmModalComponent,
                        { size: TableStringEnum.SMALL },
                        {
                            type: TableStringEnum.EDIT,
                            header: TableStringEnum.EDIT_TRUCK_PM_HEADER,
                            action: TableStringEnum.UNIT_PM,
                            id: event.data.truck.id,
                            data: event.data,
                        }
                    );
                } else {
                    this.modalService.openModal(
                        PmModalComponent,
                        { size: TableStringEnum.SMALL },
                        {
                            type: TableStringEnum.EDIT,
                            header: TableStringEnum.EDIT_TRAILER_PM_HEADER,
                            action: TableStringEnum.UNIT_PM,
                            id: event.data.trailer.id,
                            data: event.data,
                        }
                    );
                }

            default: {
                break;
            }
        }
    }

    public onTableHeadActions(event): void {
        if (event.action === TableActionsStringEnum.SORT) {
            if (event.direction) {
                if (this.selectedTab === TableStringEnum.ACTIVE) {
                    this.pmTruckBackFilterQuery.sort = event.direction;

                    this.pmTruckBackFilterQuery.pageIndex = 1;

                    this.pmTruckBackFilter(this.pmTruckBackFilterQuery);
                } else {
                    this.pmTrailerBackFilterQuery.sort = event.direction;

                    this.pmTrailerBackFilterQuery.pageIndex = 1;

                    this.pmTrailerBackFilter(this.pmTrailerBackFilterQuery);
                }
            } else this.sendPMData();
        }
    }

    private setTruckTooltipColor(truckName: string): string {
        switch (truckName) {
            case TruckNameStringEnum.SEMI_TRUCK:
            case TruckNameStringEnum.SEMI_SLEEPER:
                return TooltipColorsStringEnum.BLUE;
            case TruckNameStringEnum.BOX_TRUCK:
            case TruckNameStringEnum.REEFER_TRUCK:
            case TruckNameStringEnum.CARGO_VAN:
                return TooltipColorsStringEnum.YELLOW;
            case TruckNameStringEnum.DUMP_TRUCK:
            case TruckNameStringEnum.CEMENT_TRUCK:
            case TruckNameStringEnum.GARBAGE_TRUCK:
                return TooltipColorsStringEnum.RED;
            case TruckNameStringEnum.TOW_TRUCK:
            case TruckNameStringEnum.CAR_HAULER:
            case TruckNameStringEnum.SPOTTER:
                return TooltipColorsStringEnum.LIGHT_GREEN;
            default:
                return;
        }
    }

    private setTrailerTooltipColor(trailerName: string): string {
        switch (trailerName) {
            case TrailerNameStringEnum.FLAT_BED:
            case TrailerNameStringEnum.STEP_DECK:
            case TrailerNameStringEnum.LOW_BOY_RGN:
            case TrailerNameStringEnum.CHASSIS:
            case TrailerNameStringEnum.CONESTOGA:
            case TrailerNameStringEnum.SIDE_KIT:
            case TrailerNameStringEnum.CONTAINER:
                return TooltipColorsStringEnum.BLUE;
            case TrailerNameStringEnum.DRY_VAN:
            case TrailerNameStringEnum.REEFER:
                return TooltipColorsStringEnum.YELLOW;
            case TrailerNameStringEnum.END_DUMP:
            case TrailerNameStringEnum.BOTTOM_DUMP:
            case TrailerNameStringEnum.HOPPER:
            case TrailerNameStringEnum.TANKER:
            case TrailerNameStringEnum.PNEUMATIC_TANKER:
                return TooltipColorsStringEnum.RED;
            case TrailerNameStringEnum.CAR_HAULER:
            case TrailerNameStringEnum.CAR_HAULER_STINGER:
                return TooltipColorsStringEnum.LIGHT_GREEN;
            default:
                return;
        }
    }

    private getTableData(dataType: string): (PmTruck | PmTrailer)[] {
        if (dataType === TableStringEnum.TRUCK) {
            const truckUnits = this.pmTruckQuery.getAll();
            const truckUnitsData = truckUnits.map((truckUnit) => {
                return this.mapPmTruckData(truckUnit);
            });

            return truckUnitsData;
        } else {
            const trailerUnits = this.pmTrailerQuery.getAll();
            const trailerUnitsData = trailerUnits.map((trailerUnit) => {
                return this.mapPmTrailerData(trailerUnit);
            });

            return trailerUnitsData;
        }
    }

    // Toogle Columns
    private toogleColumns(): void {
        this.tableService.currentToaggleColumn
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
                if (response?.column) {
                    this.columns = this.columns.map((col) => {
                        if (col.field === response.column.field) {
                            col.hidden = response.column.hidden;
                        }

                        return col;
                    });
                }
            });
    }

    // Get PM Dropdown Content
    private getPMDropdownContent(): DropdownItem[] {
        return TableDropdownComponentConstants.DROPDOWN_PM_CONTENT;
    }

    private actionAnimationSubscribe(): void {
        this.tableService.currentActionAnimation
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res?.animation === TableStringEnum.UPDATE) {
                    const updatedPm =
                        this.selectedTab === TableStringEnum.ACTIVE
                            ? this.mapPmTruckData(res.data)
                            : this.mapPmTrailerData(res.data);

                    this.viewData = this.viewData.map((pm) => {
                        if (pm.pmId === res.id) {
                            pm = updatedPm;
                        }

                        return pm;
                    });
                }
            });
    }

    private pmListSubscribe(): void {
        this.pmService.currentPmListTruck
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) {
                    this.setCustomPmColumns();
                    this.sendPMData();
                }
            });

        this.pmService.currentPmListTrailer
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) {
                    this.setCustomPmColumns();
                    this.sendPMData();
                }
            });
    }

    private mapPmTruckData(truckUnit: PMTruckUnitResponse): PmTruck {
        const truck: PmTruck = {
            truckTypeClass: truckUnit.truck?.truckType?.name
                .trim()
                .replace(' ', TableStringEnum.EMPTY_STRING_PLACEHOLDER)
                .toLowerCase(),
            truckTypeIcon: truckUnit.truck.truckType.logoName,
            tableTruckName: truckUnit.truck.truckType.name,
            truckType: truckUnit.truck.truckType,
            tableTruckColor: this.setTruckTooltipColor(
                truckUnit.truck.truckType.name
            ),
            textUnit: truckUnit.truck.truckNumber,
            textOdometer: truckUnit.odometer
                ? this.thousandSeparator.transform(truckUnit.odometer)
                : null,
            textInv: truckUnit.invoice,
            textLastShop: truckUnit.lastShop,
            lastService: truckUnit.lastService
                ? this.datePipe.transform(
                      truckUnit.lastService,
                      TableStringEnum.DATE_FORMAT
                  )
                : null,
            textMake: truckUnit.truck?.truckMake?.name,
            textModel: truckUnit.truck?.model,
            textYear: truckUnit.truck?.year,
            textRepairShop: truckUnit.lastShop?.name,
            textRepairShopAddress: truckUnit.lastShop?.address?.address,
            note: truckUnit.note,
            tableDropdownContent: {
                hasContent: true,
                content: this.getPMDropdownContent(),
            },
            truck: truckUnit.truck,
            pmId: truckUnit.id,
        };

        const defaultPMData = {
            expirationMiles: null,
            expirationMilesText: null,
            totalValueText: null,
            percentage: null,
        };

        const truckPMColumns = this.getAllTableColumns(
            TableStringEnum.PM_TRUCK
        );

        truckUnit.pMs.forEach((pm) => {
            const pmColumn = truckPMColumns.find(
                (column) => column.name === pm.title
            );

            if (pmColumn) {
                if (
                    pm.diffMileage &&
                    pmColumn.isSelectColumn &&
                    pm.status?.name !== PMStatus.Inactive
                ) {
                    truck[pmColumn.field] = {
                        expirationMiles: Math.abs(pm.diffMileage),
                        expirationMilesText: this.thousandSeparator.transform(
                            Math.abs(pm.diffMileage).toString()
                        ),
                        totalValueText:
                            this.thousandToShortFormatPipe.transform(
                                pm.mileage
                            ) + ' mi',
                        percentage: Math.floor(pm.percentage),
                    };
                } else {
                    truck[pmColumn.field] = defaultPMData;
                }
            }
        });

        return truck;
    }

    private mapPmTrailerData(trailerUnit: PMTrailerUnitResponse): PmTrailer {
        const trailer: PmTrailer = {
            tableTrailerTypeIcon: trailerUnit.trailer.trailerType.logoName,
            tableTrailerName: trailerUnit.trailer.trailerType.name,
            tableTrailerColor: this.setTrailerTooltipColor(
                trailerUnit.trailer.trailerType.name
            ),
            tableTrailerTypeClass: trailerUnit.trailer?.trailerType?.name
                .trim()
                .replace(' ', TableStringEnum.EMPTY_STRING_PLACEHOLDER)
                .toLowerCase(),
            textUnit: trailerUnit.trailer.trailerNumber,
            textOdometer: trailerUnit.odometer
                ? this.thousandSeparator.transform(trailerUnit.odometer)
                : null,
            lastService: trailerUnit.lastService
                ? this.datePipe.transform(
                      trailerUnit.lastService,
                      TableStringEnum.DATE_FORMAT
                  )
                : null,
            textRepairShop: trailerUnit.lastShop?.name,
            textRepairShopAddress: trailerUnit.lastShop?.address?.address,
            textMake: trailerUnit.trailer?.trailerMake?.name,
            textModel: trailerUnit.trailer?.model,
            textYear: trailerUnit.trailer?.year,
            note: trailerUnit.note,
            tableDropdownContent: {
                hasContent: true,
                content: this.getPMDropdownContent(),
            },
            trailer: trailerUnit.trailer,
            pmId: trailerUnit.id,
        };

        const defaultPMData = {
            expirationDays: null,
            expirationDaysText: null,
            totalValueText: null,
            percentage: null,
        };

        const trailerColumns = this.getAllTableColumns(
            TableStringEnum.PM_TRAILER
        );

        trailerUnit.pMs.forEach((pm) => {
            const pmColumn = trailerColumns.find(
                (column) => column.name === pm.title
            );

            if (
                pm.diffDays &&
                pmColumn.isSelectColumn &&
                pm.status?.name !== PMStatus.Inactive
            ) {
                trailer[pmColumn.field] = {
                    expirationDays: Math.abs(pm.diffDays),
                    expirationDaysText: Math.abs(pm.diffDays).toString(),
                    totalValueText: pm.months + ' month period',
                    percentage: Math.floor(pm.percentage),
                };
            } else {
                trailer[pmColumn.field] = defaultPMData;
            }
        });

        return trailer;
    }

    private setCustomPmColumns(): void {
        const pmListTruck = this.pmListTruckQuery.getAll();
        const pmListTrailer = this.pmListTrailerQuery.getAll();

        const customColumnsPmTruck = pmListTruck.filter((pm) =>
            pm.logoName.includes(TableStringEnum.CUSTOM)
        );
        const customColumnsPmTrailer = pmListTrailer.filter((pm) =>
            pm.logoName.includes(TableStringEnum.CUSTOM)
        );

        const truckColumnsLength = this.getGridColumns(
            TableStringEnum.PM_TRUCK
        ).length;

        this.customColumnsTruck = customColumnsPmTruck.map(
            (customColumn, index) => {
                return {
                    ngTemplate: TableStringEnum.PROGRESS_MILES,
                    title: customColumn.title,
                    field: TableStringEnum.CUSTOM_FIELD + (index + 1),
                    name: customColumn.title,
                    sortName: TableStringEnum.CUSTOM_FIELD + (index + 1),
                    hidden: false,
                    isPined: false,
                    width: 150,
                    minWidth: 101,
                    filter: '',
                    isNumeric: true,
                    index: truckColumnsLength + 1,
                    sortable: true,
                    isActionColumn: false,
                    isSelectColumn:
                        customColumn.status.name === PMStatus.Inactive
                            ? false
                            : true,
                    filterable: false,
                    disabled: false,
                    export: true,
                    resizable: true,
                };
            }
        );

        const trailerColumnsLength = this.getGridColumns(
            TableStringEnum.PM_TRAILER
        ).length;

        this.customColumnsTrailer = customColumnsPmTrailer.map(
            (customColumn, index) => {
                return {
                    ngTemplate: TableStringEnum.PROGRESS,
                    title: customColumn.title,
                    field: TableStringEnum.CUSTOM_FIELD + (index + 1),
                    name: customColumn.title,
                    sortName: TableStringEnum.CUSTOM_FIELD + (index + 1),
                    hidden: false,
                    isPined: false,
                    width: 150,
                    minWidth: 101,
                    filter: '',
                    isNumeric: true,
                    index: trailerColumnsLength + 1,
                    sortable: true,
                    isActionColumn: false,
                    isSelectColumn:
                        customColumn.status.name === PMStatus.Inactive
                            ? false
                            : true,
                    filterable: false,
                    disabled: false,
                    export: true,
                    resizable: true,
                };
            }
        );
    }

    private getAllTableColumns(configType: string): PmTableColumns[] {
        if (configType === TableStringEnum.PM_TRUCK) {
            const truckColumns = this.getGridColumns(configType);
            const pmListTruck = this.pmListTruckQuery.getAll();

            truckColumns.forEach((column) => {
                if (column.ngTemplate === TableStringEnum.PROGRESS_MILES) {
                    const findPmListColumn = pmListTruck.find(
                        (pm) => pm.title === column.name
                    );

                    if (findPmListColumn) {
                        column.isSelectColumn =
                            findPmListColumn.status.name === PMStatus.Inactive
                                ? false
                                : true;

                        if (column.disabled) {
                            column.hidden = false;
                            column.disabled = false;
                        }
                    } else {
                        //column.hidden = true;
                        //column.disabled = true;
                    }
                }
            });

            return [...truckColumns, ...this.customColumnsTruck];
        } else {
            const trailerColumns = this.getGridColumns(configType);
            const pmListTrailer = this.pmListTrailerQuery.getAll();

            trailerColumns.forEach((column) => {
                if (column.ngTemplate === TableStringEnum.PROGRESS) {
                    const findPmListColumn = pmListTrailer.find(
                        (pm) => pm.title === column.name
                    );

                    if (findPmListColumn) {
                        column.isSelectColumn =
                            findPmListColumn.status.name === PMStatus.Inactive
                                ? false
                                : true;
                    }
                }
            });

            return [...trailerColumns, ...this.customColumnsTrailer];
        }
    }

    public updateCardView(): void {
        switch (this.selectedTab) {
            case TableStringEnum.ACTIVE:
                this.displayRows$ = this.store.pipe(
                    select(selectActiveTabCards)
                );
                break;

            case TableStringEnum.INACTIVE:
                this.displayRows$ = this.store.pipe(
                    select(selectInactiveTabCards)
                );
                break;
            default:
                break;
        }
        this.pmCardsModalService.updateTab(this.selectedTab);
    }

    private pmTruckBackFilter(
        filter: PMTruckFilter,
        isShowMore?: boolean
    ): void {
        this.pmService
            .getPMTruckUnitList(
                filter.truckId,
                filter.hideInactivePMs,
                filter.truckTypeId,
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
                if (!isShowMore) {
                    this.viewData = res.pagination.data;

                    this.viewData = this.viewData.map(
                        (data: PMTruckUnitResponse) => {
                            return this.mapPmTruckData(data);
                        }
                    );
                } else {
                    const newData = [...this.viewData];

                    res.pagination.data.forEach((data: PMTruckUnitResponse) => {
                        newData.push(this.mapPmTruckData(data));
                    });

                    this.viewData = [...newData];
                }
            });
    }

    private pmTrailerBackFilter(
        filter: PMTrailerFilter,
        isShowMore?: boolean
    ): void {
        this.pmService
            .getPMTrailerUnitList(
                filter.trailerId,
                filter.hideInactivePMs,
                filter.trailerTypeId,
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
                if (!isShowMore) {
                    this.viewData = res.pagination.data;

                    this.viewData = this.viewData.map(
                        (data: PMTrailerUnitResponse) => {
                            return this.mapPmTrailerData(data);
                        }
                    );
                } else {
                    const newData = [...this.viewData];

                    res.pagination.data.forEach(
                        (data: PMTrailerUnitResponse) => {
                            newData.push(this.mapPmTrailerData(data));
                        }
                    );

                    this.viewData = [...newData];
                }
            });
    }

    // Search
    private pmCurrentSearchTableData(): void {
        this.caSearchMultipleStatesService.currentSearchTableData
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) {
                    if (this.selectedTab === TableStringEnum.ACTIVE) {
                        this.pmTruckBackFilterQuery.pageIndex = 1;

                        const searchEvent = MethodsGlobalHelper.tableSearch(
                            res,
                            this.pmTruckBackFilterQuery
                        );

                        if (searchEvent) {
                            if (searchEvent.action === TableStringEnum.API) {
                                this.pmTruckBackFilter(searchEvent.query);
                            } else if (
                                searchEvent.action === TableStringEnum.STORE
                            ) {
                                this.sendPMData();
                            }
                        }
                    } else {
                        this.pmTrailerBackFilterQuery.pageIndex = 1;

                        const searchEvent = MethodsGlobalHelper.tableSearch(
                            res,
                            this.pmTrailerBackFilterQuery
                        );

                        if (searchEvent) {
                            if (searchEvent.action === TableStringEnum.API) {
                                this.pmTrailerBackFilter(searchEvent.query);
                            } else if (
                                searchEvent.action === TableStringEnum.STORE
                            ) {
                                this.sendPMData();
                            }
                        }
                    }
                }
            });
    }

    public onShowMore(): void {
        this.onTableBodyActions({
            type: TableStringEnum.SHOW_MORE,
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
