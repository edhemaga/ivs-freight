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
import {
    DropdownItem,
    GridColumn,
    ToolbarActions,
} from 'src/app/shared/models/card-table-data.model';
import { Truck, Trailer } from 'src/app/core/components/shared/model/pm';
import { DataForCardsAndTables } from 'src/app/core/components/shared/model/table-components/all-tables.modal';
import { CardRows } from 'src/app/core/components/shared/model/card-data.model';

// Services
import { ModalService } from 'src/app/shared/components/ta-modal/services/modal.service';
import { TruckassistTableService } from 'src/app/shared/services/truckassist-table.service';
import { PmService } from '../../services/pm.service';

// Constants
import { TableDropdownComponentConstants } from 'src/app/shared/utils/constants/table-dropdown-component.constants';
import { DisplayPMConfiguration } from './utils/constants/pm-card-data.constants';

// Enums
import { TableStringEnum } from 'src/app/shared/enums/table-string.enum';
import { TruckNameStringEnum } from 'src/app/shared/enums/truck-name-string.enum';
import { TrailerNameStringEnum } from 'src/app/shared/enums/trailer-name-string.enum';
import { TooltipColorsStringEnum } from 'src/app/shared/enums/tooltip-colors-string,enum';

// Store
import { PmTruckQuery } from '../../state/pm-truck-state/pm-truck.query';
import { PmTrailerQuery } from '../../state/pm-trailer-state/pm-trailer.query';

// Pipes
import { ThousandSeparatorPipe } from 'src/app/shared/pipes/thousand-separator.pipe';

@Component({
    selector: 'app-pm-table',
    templateUrl: './pm-table.component.html',
    styleUrls: ['./pm-table.component.scss'],
    providers: [ThousandSeparatorPipe],
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
        DisplayPMConfiguration.DISPLAY_ROWS_FRONT_ACTIVE;
    public displayRowsBack: CardRows[] =
        DisplayPMConfiguration.DISPLAY_ROWS_BACK_ACTIVE;

    //Data to display from model Shipper
    public displayRowsFrontInactive: CardRows[] =
        DisplayPMConfiguration.DISPLAY_ROWS_FRONT_INACTIVE;
    public displayRowsBackInactive: CardRows[] =
        DisplayPMConfiguration.DISPLAY_ROWS_BACK_INACTIVE;

    public cardTitle: string = DisplayPMConfiguration.CARD_TITLE;
    public page: string = DisplayPMConfiguration.PAGE;
    public rows: number = DisplayPMConfiguration.ROWS;

    public sendDataToCardsFront: CardRows[];
    public sendDataToCardsBack: CardRows[];

    constructor(
        // Services
        private modalService: ModalService,
        private tableService: TruckassistTableService,
        private pmService: PmService,

        // Store
        private pmTruckQuery: PmTruckQuery,
        private pmTrailerQuery: PmTrailerQuery,

        // Pipes
        private thousandSeparator: ThousandSeparatorPipe
    ) {}

    // ---------------------------- ngOnInit ------------------------------
    ngOnInit(): void {
        this.sendPMData();

        this.resetColumns();

        this.toogleColumns();
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
                gridColumns: this.getGridColumns(TableStringEnum.PM_TRUCK),
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
                gridColumns: this.getGridColumns(TableStringEnum.PM_TRAILER),
            },
        ];

        const td = this.tableData.find((t) => t.field === this.selectedTab);

        this.setPmData(td);
    }

    private getGridColumns(configType: string): any {
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

    private setPmData(td: DataForCardsAndTables): void {
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

    // Data until backend point is fixed
    private getDumyData(
        numberOfCopy: number,
        dataType: string
    ): (Truck | Trailer)[] {
        const newDumyData = {
            expirationDays: 8350,
            expirationDaysText: '8350',
            totalValueText: '6 month period',
            percentage: 20,
        };

        const truck: Truck = {
            textUnit: '12345',
            textOdometer: '567,364',
            oilFilter: newDumyData,
            airFilter: newDumyData,
            transFluid: newDumyData,
            belts: newDumyData,
            textInv: 'W444-444',
            textLastShop: 'NEXTRAN TRUCKS',
            lastService: '04/04/24',
            ruMake: 'Carrier',
            repairShop: 'ARMEN’S TIRE AND SERVICE',
        };

        const trailer: Trailer = {
            textUnit: '123',
            textOdometer: '1,267,305',
            lastService: '01/29/21',
            repairShop: 'ARMEN’S TIRE AND SERVICE',
            color: '#7040A1',
            svgIcon: 'Treba da se sredi',
            alignment: newDumyData,
            general: newDumyData,
            ptoNumber: newDumyData,
            ruMake: 'Carrier',
            reeferUnit: newDumyData,
        };

        let data = [];

        for (let i = 0; i < numberOfCopy; i++) {
            if (dataType === TableStringEnum.TRUCK) {
                data.push(truck);
            } else {
                data.push(trailer);
            }
        }

        return data;
    }

    public onToolBarAction(event: ToolbarActions): void {
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

    public onTableBodyActions(event: any): void {
        switch (this.selectedTab) {
            case TableStringEnum.ACTIVE: {
                this.modalService.openModal(
                    PmModalComponent,
                    { size: TableStringEnum.SMALL },
                    {
                        ...event,
                        header: TableStringEnum.TRUCK_2,
                        action: TableStringEnum.UNIT_PM,
                    }
                );
                break;
            }
            case TableStringEnum.INACTIVE: {
                this.modalService.openModal(
                    PmModalComponent,
                    { size: TableStringEnum.SMALL },
                    {
                        ...event,
                        header: TableStringEnum.TRAILER_3,
                        action: TableStringEnum.UNIT_PM,
                    }
                );
                break;
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

    private getTableData(dataType: string): (Truck | Trailer)[] {
        if (dataType === TableStringEnum.TRUCK) {
            const truckUnits = this.pmTruckQuery.getAll();
            const truckUnitsData = truckUnits.map((truckUnit) => {
                const truck: any = {
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
                        : '86,125',
                    textInv: truckUnit.invoice,
                    textLastShop: truckUnit.lastShop,
                    lastService: truckUnit.lastService ?? '04/03/24',
                    ruMake: 'Carrier',
                    repairShop: 'ARMEN’S TIRE AND SERVICE',
                    additionalData: { note: '' },
                    tableDropdownContent: {
                        hasContent: true,
                        content: this.getPMDropdownContent(),
                    },
                };

                const defaultPMData = {
                    expirationMiles: null,
                    expirationMilesText: null,
                    totalValueText: null,
                    percentage: null,
                };

                const truckPMColumns = this.getGridColumns(
                    TableStringEnum.PM_TRUCK
                );

                truckUnit.pMs.map((pm) => {
                    const pmColumn = truckPMColumns.find(
                        (column) => column.name === pm.title
                    );

                    if (pm.passedMileage) {
                        truck[pmColumn.field] = {
                            expirationMiles: pm.mileage - pm.passedMileage,
                            expirationMilesText:
                                this.thousandSeparator.transform(
                                    pm.mileage - pm.passedMileage
                                ),
                            totalValueText:
                                this.thousandSeparator.transform(pm.mileage) +
                                ' mi',
                            percentage:
                                Math.floor(
                                    this.calculatePercentage(
                                        pm.mileage,
                                        pm.passedMileage
                                    )
                                ) ?? null,
                        };
                    } else {
                        truck[pmColumn.field] = defaultPMData;
                    }
                });

                return truck;
            });

            return truckUnitsData;
        } else {
            const trailerUnits = this.pmTrailerQuery.getAll();
            const trailerUnitsData = trailerUnits.map((trailerUnit) => {
                const trailer: any = {
                    tableTrailerTypeIcon:
                        trailerUnit.trailer.trailerType.logoName,
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
                        : '86,125',
                    lastService: trailerUnit.lastService ?? '01/29/21',
                    repairShop: 'ARMEN’S TIRE AND SERVICE',
                    ruMake: 'Carrier',
                    additionalData: { note: '' },
                    tableDropdownContent: {
                        hasContent: true,
                        content: this.getPMDropdownContent(),
                    },
                };

                const defaultPMData = {
                    expirationDays: null,
                    expirationDaysText: null,
                    totalValueText: null,
                    percentage: null,
                };

                const trailerColumns = this.getGridColumns(
                    TableStringEnum.PM_TRAILER
                );

                trailerUnit.pMs.map((pm) => {
                    const pmColumn = trailerColumns.find(
                        (column) => column.name === pm.title
                    );

                    if (pm.passedMonths) {
                        trailer[pmColumn.field] = {
                            expirationDays: Math.abs(
                                pm.months * 30 - pm.passedMonths * 30
                            ),
                            expirationDaysText: Math.abs(
                                pm.months * 30 - pm.passedMonths * 30
                            ).toString(),
                            totalValueText: pm.months + ' month period',
                            percentage: Math.floor(
                                this.calculatePercentage(
                                    pm.months,
                                    pm.passedMonths
                                )
                            ),
                        };
                    } else {
                        trailer[pmColumn.field] = defaultPMData;
                    }
                });

                return trailer;
            });

            return trailerUnitsData;
        }
    }

    private calculatePercentage(partialValue, totalValue): number {
        if (!partialValue || !totalValue) {
            return null;
        }

        const percentageValue = (100 * partialValue) / totalValue;
        return percentageValue <= 100 ? percentageValue : 0;
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

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
