import { AfterViewInit, Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

// Helpers
import {
    getTruckPMColumnDefinition,
    getTrailerPMColumnDefinition,
} from 'src/assets/utils/settings/pm-columns';

// Components
import { PmModalComponent } from 'src/app/pages/pm-truck-trailer/pages/pm-modal/pm-modal.component';

// Models
import { CardDetails } from 'src/app/shared/models/card-models/card-table-data.model';
import { CardRows } from 'src/app/core/components/shared/model/card-data.model';
import { DropdownItem } from 'src/app/shared/models/card-models/card-table-data.model';
import { GridColumn } from 'src/app/shared/models/table-models/grid-column.model';
import { CardTableData } from 'src/app/shared/models/table-models/card-table-data.model';
import { PmTableColumns } from './models/pm-table-columns.model';
import { PmTableAction } from './models/pm-table-actions.model';
import { PmTrailer } from './models/pm-trailer.model';
import { PmTruck } from './models/pm-truck.model';
import { TableToolbarActions } from 'src/app/shared/models/table-models/table-toolbar-actions.model';
import { PMTrailerUnitResponse, PMTruckUnitResponse } from 'appcoretruckassist';

// Services
import { ModalService } from 'src/app/shared/components/ta-modal/services/modal.service';
import { TruckassistTableService } from 'src/app/shared/services/truckassist-table.service';
import { PmService } from '../../services/pm.service';

// Constants
import { TableDropdownComponentConstants } from 'src/app/shared/utils/constants/table-dropdown-component.constants';
import { PmCardDataConfigConstants } from './utils/constants/pm-card-data-config.constants';

// Enums
import { TableStringEnum } from 'src/app/shared/enums/table-string.enum';
import { TruckNameStringEnum } from 'src/app/shared/enums/truck-name-string.enum';
import { TrailerNameStringEnum } from 'src/app/shared/enums/trailer-name-string.enum';
import { TooltipColorsStringEnum } from 'src/app/shared/enums/tooltip-colors-string,enum';

// Store
import { PmTruckQuery } from '../../state/pm-truck-state/pm-truck.query';
import { PmTrailerQuery } from '../../state/pm-trailer-state/pm-trailer.query';
import { PmListTruckQuery } from '../../state/pm-list-truck-state/pm-list-truck.query';
import { PmListTrailerQuery } from '../../state/pm-list-trailer-state/pm-list-trailer.query';

// Pipes
import { ThousandSeparatorPipe } from 'src/app/shared/pipes/thousand-separator.pipe';
import { ThousandToShortFormatPipe } from 'src/app/shared/pipes/thousand-to-short-format.pipe';

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
    private viewData: CardDetails[] = [];
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

    constructor(
        // Services
        private modalService: ModalService,
        private tableService: TruckassistTableService,
        private pmService: PmService,

        // Store
        private pmTruckQuery: PmTruckQuery,
        private pmTrailerQuery: PmTrailerQuery,
        private pmListTruckQuery: PmListTruckQuery,
        private pmListTrailerQuery: PmListTrailerQuery,

        // Pipes
        private thousandSeparator: ThousandSeparatorPipe,
        private thousandToShortFormatPipe: ThousandToShortFormatPipe
    ) {}

    // ---------------------------- ngOnInit ------------------------------
    ngOnInit(): void {
        this.setCustomPmColumns();

        this.sendPMData();

        this.resetColumns();

        this.toogleColumns();

        this.actionAnimationSubscribe();

        this.pmListSubscribe();
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
                hideOpenModalButton: true,
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

            // Set data for cards based on tab active
            this.selectedTab === TableStringEnum.ACTIVE
                ? ((this.sendDataToCardsFront = this.displayRowsFront),
                  (this.sendDataToCardsBack = this.displayRowsBack))
                : ((this.sendDataToCardsFront = this.displayRowsFrontInactive),
                  (this.sendDataToCardsBack = this.displayRowsBackInactive));
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
                stateName: TableStringEnum.PM_TRAILERS,
                tableConfiguration: TableStringEnum.PM_TRAILER,
                isActive: this.selectedTab === TableStringEnum.INACTIVE,
                gridColumns: this.getAllTableColumns(
                    TableStringEnum.PM_TRAILER
                ),
            },
        ];

        const td = this.tableData.find((t) => t.field === this.selectedTab);

        this.setPmData(td);
    }

    public onToolBarAction(event: TableToolbarActions): void {
        if (event.action === TableStringEnum.TAB_SELECTED) {
            this.selectedTab = event.tabData.field;
            this.sendPMData();
        } else if (event.action === TableStringEnum.OPEN_MODAL) {
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
        }
    }

    public onTableBodyActions(event: PmTableAction): void {
        switch (event.type) {
            case TableStringEnum.CONFIGURE: {
                if (this.selectedTab === TableStringEnum.ACTIVE) {
                    this.modalService.openModal(
                        PmModalComponent,
                        { size: TableStringEnum.SMALL },
                        {
                            type: TableStringEnum.EDIT,
                            header: TableStringEnum.EDIT_TRUCK_PM_HEADER,
                            action: TableStringEnum.UNIT_PM,
                            id: event.data.pmId,
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
                            id: event.data.pmId,
                            data: event.data,
                        }
                    );
                }
            }
            case TableStringEnum.ADD_REPAIR_BILL: {
                console.log('onTableBodyActions truck ADD_REPAIR_BILL');
            }
            default: {
                break;
            }
        }
    }

    private setTruckTooltipColor(truckName: string): string {
        if (truckName === TruckNameStringEnum.SEMI_TRUCK) {
            return TooltipColorsStringEnum.LIGHT_GREEN;
        } else if (truckName === TruckNameStringEnum.SEMI_SLEEPER) {
            return TooltipColorsStringEnum.YELLOW;
        } else if (truckName === TruckNameStringEnum.BOX_TRUCK) {
            return TooltipColorsStringEnum.RED;
        } else if (truckName === TruckNameStringEnum.CARGO_VAN) {
            return TooltipColorsStringEnum.BLUE;
        } else if (truckName === TruckNameStringEnum.CAR_HAULER) {
            return TooltipColorsStringEnum.PINK;
        } else if (truckName === TruckNameStringEnum.TOW_TRUCK) {
            return TooltipColorsStringEnum.PURPLE;
        } else if (truckName === TruckNameStringEnum.SPOTTER) {
            return TooltipColorsStringEnum.BROWN;
        }
    }

    private setTrailerTooltipColor(trailerName: string): string {
        if (trailerName === TrailerNameStringEnum.REEFER) {
            return TooltipColorsStringEnum.BLUE;
        } else if (trailerName === TrailerNameStringEnum.DRY_VAN) {
            return TooltipColorsStringEnum.DARK_BLUE;
        } else if (trailerName === TrailerNameStringEnum.DUMPER) {
            return TooltipColorsStringEnum.PURPLE;
        } else if (trailerName === TrailerNameStringEnum.TANKER) {
            return TooltipColorsStringEnum.GREEN;
        } else if (trailerName === TrailerNameStringEnum.PNEUMATIC_TANKER) {
            return TooltipColorsStringEnum.LIGHT_GREEN;
        } else if (trailerName === TrailerNameStringEnum.CAR_HAULER) {
            return TooltipColorsStringEnum.PINK;
        } else if (trailerName === TrailerNameStringEnum.CAR_HAULER_STINGER) {
            return TooltipColorsStringEnum.PINK;
        } else if (trailerName === TrailerNameStringEnum.CHASSIS) {
            return TooltipColorsStringEnum.BROWN;
        } else if (trailerName === TrailerNameStringEnum.LOW_BOY_RGN) {
            return TooltipColorsStringEnum.RED;
        } else if (trailerName === TrailerNameStringEnum.STEP_DECK) {
            return TooltipColorsStringEnum.RED;
        } else if (trailerName === TrailerNameStringEnum.FLAT_BED) {
            return TooltipColorsStringEnum.RED;
        } else if (trailerName === TrailerNameStringEnum.SIDE_KIT) {
            return TooltipColorsStringEnum.ORANGE;
        } else if (trailerName === TrailerNameStringEnum.CONESTOGA) {
            return TooltipColorsStringEnum.GOLD;
        } else if (trailerName === TrailerNameStringEnum.CONTAINER) {
            return TooltipColorsStringEnum.YELLOW;
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

    private actionAnimationSubscribe() {
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
        const truck = {
            truckTypeClass: truckUnit.truck.truckType.logoName.replace(
                TableStringEnum.SVG,
                TableStringEnum.EMPTY_STRING_PLACEHOLDER
            ),
            truckTypeIcon: truckUnit.truck.truckType.logoName,
            tableTruckName: truckUnit.truck.truckType.name,
            truckType: truckUnit.truck.truckType,
            tableTruckColor: this.setTruckTooltipColor(
                truckUnit.truck.truckType.name
            ),
            textUnit: truckUnit.truck.truckNumber,
            textOdometer: truckUnit.odometer
                ? truckUnit.odometer.toString()
                : null,
            textInv: truckUnit.invoice,
            textLastShop: truckUnit.lastShop,
            lastService: truckUnit.lastService ?? null,
            ruMake: 'Carrier',
            repairShop: truckUnit.lastShop,
            additionalData: { note: '' },
            tableDropdownContent: {
                hasContent: true,
                content: this.getPMDropdownContent(),
            },
            truck: truckUnit.truck,
            pmId: truckUnit.truck.id,
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

        truckUnit.pMs.map((pm) => {
            const pmColumn = truckPMColumns.find(
                (column) => column.name === pm.title
            );

            if (pm.diffMileage) {
                truck[pmColumn.field] = {
                    expirationMiles: pm.diffMileage,
                    expirationMilesText: this.thousandSeparator.transform(
                        pm.diffMileage
                    ),
                    totalValueText:
                        this.thousandToShortFormatPipe.transform(pm.mileage) +
                        ' mi',
                    percentage: Math.floor(pm.percentage),
                };
            } else {
                truck[pmColumn.field] = defaultPMData;
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
            tableTrailerTypeClass:
                trailerUnit.trailer.trailerType.logoName.replace(
                    TableStringEnum.SVG,
                    TableStringEnum.EMPTY_STRING_PLACEHOLDER
                ),
            textUnit: trailerUnit.trailer.trailerNumber,
            textOdometer: trailerUnit.odometer
                ? trailerUnit.odometer.toString()
                : null,
            lastService: trailerUnit.lastService ?? null,
            repairShop: trailerUnit.lastShop,
            ruMake: 'Carrier',
            additionalData: { note: '' },
            tableDropdownContent: {
                hasContent: true,
                content: this.getPMDropdownContent(),
            },
            trailer: trailerUnit.trailer,
            pmId: trailerUnit.trailer.id,
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

        trailerUnit.pMs.map((pm) => {
            const pmColumn = trailerColumns.find(
                (column) => column.name === pm.title
            );

            if (pm.diffDays) {
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
                    ngTemplate: 'progressMiles',
                    title: customColumn.title,
                    field: 'customField' + (index + 1),
                    name: customColumn.title,
                    sortName: 'customField' + (index + 1),
                    hidden: false,
                    isPined: false,
                    width: 150,
                    minWidth: 101,
                    filter: '',
                    isNumeric: true,
                    index: truckColumnsLength + 1,
                    sortable: true,
                    isActionColumn: false,
                    isSelectColumn: false,
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
                    ngTemplate: 'progress',
                    title: customColumn.title,
                    field: 'customField' + (index + 1),
                    name: customColumn.title,
                    sortName: 'customField' + (index + 1),
                    hidden: false,
                    isPined: false,
                    width: 150,
                    minWidth: 101,
                    filter: '',
                    isNumeric: true,
                    index: trailerColumnsLength + 1,
                    sortable: true,
                    isActionColumn: false,
                    isSelectColumn: false,
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

            return [...truckColumns, ...this.customColumnsTruck];
        } else {
            const trailerColumns = this.getGridColumns(configType);

            return [...trailerColumns, ...this.customColumnsTrailer];
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
