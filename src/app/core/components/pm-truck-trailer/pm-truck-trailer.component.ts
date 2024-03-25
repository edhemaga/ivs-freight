import { AfterViewInit, Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

// Modules
import {
    getTruckPMColumnDefinition,
    getTrailerPMColumnDefinition,
} from '../../../../assets/utils/settings/pm-columns';
import { ConstantStringTableComponentsEnum } from '../../utils/enums/table-components.enum';

// Components
import { RepairPmModalComponent } from '../modals/repair-modals/repair-pm-modal/repair-pm-modal.component';

// Models
import {
    GridColumn,
    ToolbarActions,
} from '../shared/model/card-table-data.model';
import { Truck, Trailer } from '../shared/model/pm';
import { DataForCardsAndTables } from '../shared/model/table-components/all-tables.modal';
import { CardRows } from '../shared/model/card-data.model';

// Services
import { ModalService } from '../shared/ta-modal/modal.service';
import { TruckassistTableService } from '../../services/truckassist-table/truckassist-table.service';
import { PmTService } from './state/pm.service';

// Constants
import { TableDropdownComponentConstants } from '../../utils/constants/table-components.constants';

// Data
import { DisplayPMConfiguration } from './pm-card-data';
import { TruckName } from '../../utils/enums/truck-component.enum';
import {
    TooltipColors,
    TrailerName,
} from '../../utils/enums/trailer-component.enum';

// Store
import { PmTruckQuery } from './state/pm-truck-state/pm-truck.query';
import { PmTrailerQuery } from './state/pm-trailer-state/pm-trailer.query';

@Component({
    selector: 'app-pm-truck-trailer',
    templateUrl: './pm-truck-trailer.component.html',
    styleUrls: ['./pm-truck-trailer.component.scss'],
})
export class PmTruckTrailerComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    private destroy$ = new Subject<void>();
    public tableOptions: any = {};
    public tableData: any[] = [];
    private viewData: any[] = [];
    public columns: GridColumn[] = [];
    public selectedTab: string = ConstantStringTableComponentsEnum.ACTIVE;
    public activeViewMode: string = ConstantStringTableComponentsEnum.LIST;
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
        private pmService: PmTService,

        // Store
        private pmTruckQuery: PmTruckQuery,
        private pmTrailerQuery: PmTrailerQuery
    ) {}

    // ---------------------------- ngOnInit ------------------------------
    ngOnInit(): void {
        this.sendPMData();

        this.resetColumns();

        //this.getPMTrailerList();
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
            document.querySelector(
                ConstantStringTableComponentsEnum.TABLE_CONTAINER
            )
        );
    }

    private initTableOptions(): void {
        this.tableOptions = {
            toolbarActions: {
                showGeneralPmBtn: true,
                hideOpenModalButton: true,
                viewModeOptions: [
                    {
                        name: ConstantStringTableComponentsEnum.LIST,
                        active:
                            this.activeViewMode ===
                            ConstantStringTableComponentsEnum.LIST,
                    },
                    {
                        name: ConstantStringTableComponentsEnum.CARD,
                        active:
                            this.activeViewMode ===
                            ConstantStringTableComponentsEnum.CARD,
                    },
                ],
            },
            actions: TableDropdownComponentConstants.ACTIONS_DROPDOWN,
        };
    }

    private sendPMData(): void {
        const tableView = JSON.parse(
            localStorage.getItem(
                ConstantStringTableComponentsEnum.PM_TABLE_VIEW
            )
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
                title: ConstantStringTableComponentsEnum.TRUCK_2,
                field: ConstantStringTableComponentsEnum.ACTIVE,
                length: truckCount.pmTruck,
                data: this.getTableData(
                    ConstantStringTableComponentsEnum.TRUCK
                ),
                extended: false,
                selectTab: true,
                gridNameTitle: ConstantStringTableComponentsEnum.PM_2,
                stateName: ConstantStringTableComponentsEnum.PM_TRUCKS,
                tableConfiguration: ConstantStringTableComponentsEnum.PM_TRUCK,
                isActive:
                    this.selectedTab ===
                    ConstantStringTableComponentsEnum.ACTIVE,
                gridColumns: this.getGridColumns(
                    ConstantStringTableComponentsEnum.PM_TRUCK
                ),
            },
            {
                title: ConstantStringTableComponentsEnum.TRAILER_3,
                field: ConstantStringTableComponentsEnum.INACTIVE,
                length: trailerCount.pmTrailer,
                data: this.getTableData(
                    ConstantStringTableComponentsEnum.TRAILER_2
                ),
                extended: false,
                selectTab: true,
                gridNameTitle: ConstantStringTableComponentsEnum.PM_2,
                stateName: ConstantStringTableComponentsEnum.PM_TRAILERS,
                tableConfiguration:
                    ConstantStringTableComponentsEnum.PM_TRAILER,
                isActive:
                    this.selectedTab ===
                    ConstantStringTableComponentsEnum.INACTIVE,
                gridColumns: this.getGridColumns(
                    ConstantStringTableComponentsEnum.PM_TRAILER
                ),
            },
        ];

        const td = this.tableData.find((t) => t.field === this.selectedTab);

        this.setPmData(td);
    }

    private getGridColumns(configType: string): void {
        const tableColumnsConfig = JSON.parse(
            localStorage.getItem(`table-${configType}-Configuration`)
        );

        if (configType === ConstantStringTableComponentsEnum.PM_TRUCK) {
            console.log('getGridColumns truck 1', tableColumnsConfig);
            console.log('getGridColumns truck 2', getTruckPMColumnDefinition());

            return tableColumnsConfig
                ? tableColumnsConfig
                : getTruckPMColumnDefinition();
        } else {
            console.log('getGridColumns trailer 1', tableColumnsConfig);
            console.log(
                'getGridColumns trailer 2',
                getTrailerPMColumnDefinition()
            );
            return tableColumnsConfig
                ? tableColumnsConfig
                : getTrailerPMColumnDefinition();
        }
    }

    private setPmData(td: DataForCardsAndTables): void {
        this.columns = td.gridColumns;
        console.log('columns', this.columns);

        if (td.data.length) {
            this.viewData = td.data;

            this.viewData = this.viewData.map((data) => {
                data.isSelected = false;
                return data;
            });

            console.log('viewData', this.viewData);

            // Set data for cards based on tab active
            this.selectedTab === ConstantStringTableComponentsEnum.ACTIVE
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
            if (dataType === ConstantStringTableComponentsEnum.TRUCK) {
                data.push(truck);
            } else {
                data.push(trailer);
            }
        }

        return data;
    }

    public onToolBarAction(event: ToolbarActions): void {
        if (event.action === ConstantStringTableComponentsEnum.TAB_SELECTED) {
            this.selectedTab = event.tabData.field;
            this.sendPMData();
        } else if (
            event.action === ConstantStringTableComponentsEnum.OPEN_MODAL
        ) {
        } else if (
            event.action === ConstantStringTableComponentsEnum.OPEN_GENERAL_PM
        ) {
            if (this.selectedTab === ConstantStringTableComponentsEnum.ACTIVE) {
                this.modalService.openModal(
                    RepairPmModalComponent,
                    { size: ConstantStringTableComponentsEnum.SMALL },
                    {
                        type: ConstantStringTableComponentsEnum.NEW,
                        header: ConstantStringTableComponentsEnum.TRUCK_2,
                        action: ConstantStringTableComponentsEnum.GENERIC_PM,
                    }
                );
            } else {
                this.modalService.openModal(
                    RepairPmModalComponent,
                    { size: ConstantStringTableComponentsEnum.SMALL },
                    {
                        type: ConstantStringTableComponentsEnum.NEW,
                        header: ConstantStringTableComponentsEnum.TRAILER_3,
                        action: ConstantStringTableComponentsEnum.GENERIC_PM,
                    }
                );
            }
        } else if (
            event.action === ConstantStringTableComponentsEnum.VIEW_MODE
        ) {
            this.activeViewMode = event.mode;
        }
    }

    public onTableBodyActions(event: any): void {
        switch (this.selectedTab) {
            case ConstantStringTableComponentsEnum.ACTIVE: {
                this.modalService.openModal(
                    RepairPmModalComponent,
                    { size: ConstantStringTableComponentsEnum.SMALL },
                    {
                        ...event,
                        header: ConstantStringTableComponentsEnum.TRUCK_2,
                        action: ConstantStringTableComponentsEnum.UNIT_PM,
                    }
                );
                break;
            }
            case ConstantStringTableComponentsEnum.INACTIVE: {
                this.modalService.openModal(
                    RepairPmModalComponent,
                    { size: ConstantStringTableComponentsEnum.SMALL },
                    {
                        ...event,
                        header: ConstantStringTableComponentsEnum.TRAILER_3,
                        action: ConstantStringTableComponentsEnum.UNIT_PM,
                    }
                );
                break;
            }
            default: {
                break;
            }
        }
    }

    public getPMTrailerList(): void {
        this.pmService
            .getPMTruckUnitList()
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
                console.log('getPMTruckUnitList response', response);

                const truckUnits = response.pagination.data;
                const truckUnitsData = truckUnits.map((truckUnit) => {
                    const newDumyData = {
                        expirationDays: 8350,
                        expirationDaysText: '8350',
                        percentage: 20,
                    };

                    const truck: any = {
                        truckTypeClass:
                            truckUnit.truck.truckType.logoName.replace(
                                ConstantStringTableComponentsEnum.SVG,
                                ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER
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
                        oilFilter: newDumyData,
                        airFilter: newDumyData,
                        transFluid: newDumyData,
                        belts: newDumyData,
                        textInv: truckUnit.invoice,
                        textLastShop: truckUnit.lastShop,
                        lastService: truckUnit.lastService ?? '04/03/24',
                        ruMake: 'Carrier',
                        repairShop: 'ARMEN’S TIRE AND SERVICE',
                    };

                    return truck;
                });

                this.viewData = truckUnitsData;
                console.log('viewData', this.viewData);
            });

        this.pmService
            .getPMTruckList()
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
                console.log('getPMTruckList response', response);
            });

        this.pmService
            .getRepairList()
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
                console.log('getRepairList response', response);
            });

        this.pmService
            .getRepairPmTrailerFilter()
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
                console.log('getRepairPmTrailerFilter response', response);
            });

        this.pmService
            .getRepairPmTruckFilter()
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
                console.log('getRepairPmTruckFilter response', response);
            });
    }

    private setTruckTooltipColor(truckName: string): string {
        if (truckName === TruckName.SEMI_TRUCK) {
            return TooltipColors.LIGHT_GREEN;
        } else if (truckName === TruckName.SEMI_SLEEPER) {
            return TooltipColors.YELLOW;
        } else if (truckName === TruckName.BOX_TRUCK) {
            return TooltipColors.RED;
        } else if (truckName === TruckName.CARGO_VAN) {
            return TooltipColors.BLUE;
        } else if (truckName === TruckName.CAR_HAULER) {
            return TooltipColors.PINK;
        } else if (truckName === TruckName.TOW_TRUCK) {
            return TooltipColors.PURPLE;
        } else if (truckName === TruckName.SPOTTER) {
            return TooltipColors.BROWN;
        }
    }

    private setTrailerTooltipColor(trailerName: string): string {
        if (trailerName === TrailerName.REEFER) {
            return TooltipColors.BLUE;
        } else if (trailerName === TrailerName.DRY_VAN) {
            return TooltipColors.DARK_BLUE;
        } else if (trailerName === TrailerName.DUMPER) {
            return TooltipColors.PURPLE;
        } else if (trailerName === TrailerName.TANKER) {
            return TooltipColors.GREEN;
        } else if (trailerName === TrailerName.PNEUMATIC_TANKER) {
            return TooltipColors.LIGHT_GREEN;
        } else if (trailerName === TrailerName.CAR_HAULER) {
            return TooltipColors.PINK;
        } else if (trailerName === TrailerName.CAR_HAULER_STINGER) {
            return TooltipColors.PINK;
        } else if (trailerName === TrailerName.CHASSIS) {
            return TooltipColors.BROWN;
        } else if (trailerName === TrailerName.LOW_BOY_RGN) {
            return TooltipColors.RED;
        } else if (trailerName === TrailerName.STEP_DECK) {
            return TooltipColors.RED;
        } else if (trailerName === TrailerName.FLAT_BED) {
            return TooltipColors.RED;
        } else if (trailerName === TrailerName.SIDE_KIT) {
            return TooltipColors.ORANGE;
        } else if (trailerName === TrailerName.CONESTOGA) {
            return TooltipColors.GOLD;
        } else if (trailerName === TrailerName.CONTAINER) {
            return TooltipColors.YELLOW;
        }
    }

    private getTableData(dataType: string): (Truck | Trailer)[] {
        if (dataType === ConstantStringTableComponentsEnum.TRUCK) {
            const truckUnits = this.pmTruckQuery.getAll();
            const truckUnitsData = truckUnits.map((truckUnit) => {
                const newDumyData = {
                    expirationMiles: 8350,
                    expirationMilesText: '8350',
                    percentage: 20,
                };

                let oilFilter,
                    airFilter,
                    transFluid,
                    belts,
                    engineTune,
                    alignment = {
                        expirationMiles: null,
                        expirationMilesText: null,
                        percentage: null,
                    };

                truckUnit.pMs.map((pm) => {
                    if (pm.title === 'Engine Oil & Filter') {
                        oilFilter = {
                            expirationMiles: pm.mileage - pm.passedMileage,
                            expirationMilesText: (
                                pm.mileage - pm.passedMileage
                            ).toString(),
                            percentage:
                                Math.floor(
                                    this.calculatePercentage(
                                        pm.mileage,
                                        pm.passedMileage
                                    )
                                ) ?? null,
                        };
                    } else if (pm.title === 'Air Filter') {
                        airFilter = {
                            expirationMiles: pm.mileage - pm.passedMileage,
                            expirationMilesText: (
                                pm.mileage - pm.passedMileage
                            ).toString(),
                            percentage:
                                Math.floor(
                                    this.calculatePercentage(
                                        pm.mileage,
                                        pm.passedMileage
                                    )
                                ) ?? null,
                        };
                    } else if (pm.title === 'Belts') {
                        belts = {
                            expirationMiles: pm.mileage - pm.passedMileage,
                            expirationMilesText: (
                                pm.mileage - pm.passedMileage
                            ).toString(),
                            percentage:
                                Math.floor(
                                    this.calculatePercentage(
                                        pm.mileage,
                                        pm.passedMileage
                                    )
                                ) ?? null,
                        };
                    } else if (pm.title === 'Transmission Fluid') {
                        transFluid = {
                            expirationMiles: pm.mileage - pm.passedMileage,
                            expirationMilesText: (
                                pm.mileage - pm.passedMileage
                            ).toString(),
                            percentage:
                                Math.floor(
                                    this.calculatePercentage(
                                        pm.mileage,
                                        pm.passedMileage
                                    )
                                ) ?? null,
                        };
                    } else if (pm.title === 'Engine Tune-Up') {
                        engineTune = {
                            expirationMiles: pm.mileage - pm.passedMileage,
                            expirationMilesText: (
                                pm.mileage - pm.passedMileage
                            ).toString(),
                            percentage:
                                Math.floor(
                                    this.calculatePercentage(
                                        pm.mileage,
                                        pm.passedMileage
                                    )
                                ) ?? null,
                        };
                    } else if (pm.title === 'Alignment') {
                        alignment = {
                            expirationMiles: pm.mileage - pm.passedMileage,
                            expirationMilesText: (
                                pm.mileage - pm.passedMileage
                            ).toString(),
                            percentage:
                                Math.floor(
                                    this.calculatePercentage(
                                        pm.mileage,
                                        pm.passedMileage
                                    )
                                ) ?? null,
                        };
                    }
                });

                const truck: any = {
                    truckTypeClass: truckUnit.truck.truckType.logoName.replace(
                        ConstantStringTableComponentsEnum.SVG,
                        ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER
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
                    oilFilter: oilFilter,
                    airFilter: airFilter,
                    transFluid: transFluid,
                    belts: belts,
                    engTuneUp: engineTune,
                    alignment: alignment,
                    textInv: truckUnit.invoice,
                    textLastShop: truckUnit.lastShop,
                    lastService: truckUnit.lastService ?? '04/03/24',
                    ruMake: 'Carrier',
                    repairShop: 'ARMEN’S TIRE AND SERVICE',
                };

                console.log('truck data', truck);

                return truck;
            });

            console.log('truckUnits query', truckUnits);
            return truckUnitsData;
        } else {
            const trailerUnits = this.pmTrailerQuery.getAll();
            const trailerUnitsData = trailerUnits.map((trailerUnit) => {
                let generalServiceData,
                    reeferUnitServiceData,
                    alignmentServiceData,
                    ptoPumpServiceData = {
                        expirationDays: null,
                        expirationDaysText: null,
                        percentage: null,
                    };

                trailerUnit.pMs.map((pm) => {
                    if (pm.title === 'General') {
                        generalServiceData = {
                            expirationDays: Math.abs(
                                pm.months * 30 - pm.passedMonths * 30
                            ),
                            expirationDaysText: Math.abs(
                                pm.months * 30 - pm.passedMonths * 30
                            ).toString(),
                            percentage: Math.floor(
                                this.calculatePercentage(
                                    pm.months,
                                    pm.passedMonths
                                )
                            ),
                        };
                    } else if (pm.title === 'Reefer Unit') {
                        reeferUnitServiceData = {
                            expirationDays: Math.abs(
                                pm.months * 30 - pm.passedMonths * 30
                            ),
                            expirationDaysText: Math.abs(
                                pm.months * 30 - pm.passedMonths * 30
                            ).toString(),
                            percentage: Math.floor(
                                this.calculatePercentage(
                                    pm.months,
                                    pm.passedMonths
                                )
                            ),
                        };
                    } else if (pm.title === 'Alignment') {
                        alignmentServiceData = {
                            expirationDays: Math.abs(
                                pm.months * 30 - pm.passedMonths * 30
                            ),
                            expirationDaysText: Math.abs(
                                pm.months * 30 - pm.passedMonths * 30
                            ).toString(),
                            percentage: Math.floor(
                                this.calculatePercentage(
                                    pm.months,
                                    pm.passedMonths
                                )
                            ),
                        };
                    } else if (pm.title === 'PTO Pump') {
                        ptoPumpServiceData = {
                            expirationDays: Math.abs(
                                pm.months * 30 - pm.passedMonths * 30
                            ),
                            expirationDaysText: Math.abs(
                                pm.months * 30 - pm.passedMonths * 30
                            ).toString(),
                            percentage: Math.floor(
                                this.calculatePercentage(
                                    pm.months,
                                    pm.passedMonths
                                )
                            ),
                        };
                    }
                });

                console.log('trailerUnit', trailerUnit);

                const trailer: any = {
                    tableTrailerTypeIcon:
                        trailerUnit.trailer.trailerType.logoName,
                    tableTrailerName: trailerUnit.trailer.trailerType.name,
                    tableTrailerColor: this.setTrailerTooltipColor(
                        trailerUnit.trailer.trailerType.name
                    ),
                    tableTrailerTypeClass:
                        trailerUnit.trailer.trailerType.logoName.replace(
                            ConstantStringTableComponentsEnum.SVG,
                            ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER
                        ),
                    textUnit: trailerUnit.trailer.trailerNumber,
                    textOdometer: trailerUnit.odometer
                        ? trailerUnit.odometer.toString()
                        : '86,125',
                    lastService: trailerUnit.lastService ?? '01/29/21',
                    repairShop: 'ARMEN’S TIRE AND SERVICE',
                    //color: '#7040A1',
                    alignment: alignmentServiceData,
                    general: generalServiceData,
                    ptoPump: ptoPumpServiceData,
                    ruMake: 'Carrier',
                    reeferUnit: reeferUnitServiceData,
                };

                return trailer;
            });

            console.log('trailerUnits query', trailerUnits);
            console.log('trailerUnitsData query', trailerUnitsData);
            return trailerUnitsData;
        }
    }

    private calculatePercentage(partialValue, totalValue): number {
        console.log('calculatePercentage partialValue', partialValue);
        console.log('calculatePercentage totalValue', totalValue);
        if (!partialValue || !totalValue) {
            console.log('calculatePercentage return null');
            return null;
        }

        const percentageValue = (100 * partialValue) / totalValue;
        return percentageValue <= 100 ? percentageValue : 0;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
