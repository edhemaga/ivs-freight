import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

// components
import { ConfirmationModalComponent } from 'src/app/core/components/modals/confirmation-modal/confirmation-modal.component';
import { TruckModalComponent } from 'src/app/pages/truck/pages/truck-modal/truck-modal.component';
import { TtRegistrationModalComponent } from 'src/app/core/components/modals/common-truck-trailer-modals/tt-registration-modal/tt-registration-modal.component';
import { TtFhwaInspectionModalComponent } from 'src/app/core/components/modals/common-truck-trailer-modals/tt-fhwa-inspection-modal/tt-fhwa-inspection-modal.component';
import { TtTitleModalComponent } from 'src/app/core/components/modals/common-truck-trailer-modals/tt-title-modal/tt-title-modal.component';

// services
import { TruckService } from '../../../../shared/services/truck.service';
import { ModalService } from 'src/app/shared/components/ta-modal/services/modal.service';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { ConfirmationService } from 'src/app/core/components/modals/confirmation-modal/state/state/services/confirmation.service';

// store
import { TruckActiveQuery } from '../../state/truck-active-state/truck-active.query';
import { TruckInactiveQuery } from '../../state/truck-inactive-state/truck-inactive.query';
import { TruckActiveState } from '../../state/truck-active-state/truck-active.store';
import { TruckInactiveState } from '../../state/truck-inactive-state/truck-inactive.store';
import { TruckInactiveStore } from '../../state/truck-inactive-state/truck-inactive.store';

// constants
import { TruckCardDataConstants } from './utils/constants/truck-card-data.constants';
import { TableDropdownComponentConstants } from 'src/app/core/utils/constants/table-components.constants';

// pipes
import { DatePipe } from '@angular/common';
import { ThousandSeparatorPipe } from 'src/app/shared/pipes/thousand-separator.pipe';

// enums
import { ConstantStringTableComponentsEnum } from 'src/app/core/utils/enums/table-components.enum';
import { TruckName } from 'src/app/core/utils/enums/truck-component.enum';
import { TooltipColors } from 'src/app/core/utils/enums/trailer-component.enum';

//Helpers
import { DataFilterHelper } from 'src/app/shared/utils/helpers/data-filter.helper';
import {
    closeAnimationAction,
    tableSearch,
} from 'src/app/core/utils/methods.globals';
import { getTruckColumnDefinition } from 'src/assets/utils/settings/truck-columns';

// models
import { TruckListResponse } from 'appcoretruckassist';
import {
    CardRows,
    TableOptionsInterface,
} from 'src/app/core/components/shared/model/card-data.model';
import {
    DataForCardsAndTables,
    TableColumnConfig,
} from 'src/app/core/components/shared/model/table-components/all-tables.modal';
import { TruckFilter } from './models/truck-filter.model';
import {
    DropdownItem,
    ToolbarActions,
} from 'src/app/shared/models/card-table-data.model';
import { TruckBodyResponse } from './models/truck-body-response.model';

@Component({
    selector: 'app-truck-table',
    templateUrl: './truck-table.component.html',
    styleUrls: ['./truck-table.component.scss'],
    providers: [ThousandSeparatorPipe],
})
export class TruckTableComponent implements OnInit, AfterViewInit, OnDestroy {
    private destroy$ = new Subject<void>();
    public tableOptions: TableOptionsInterface;
    public truckData: any[] = [];
    public tableData: any[] = [];
    public viewData: any[] = [];
    public columns: TableColumnConfig[] = [];
    public selectedTab: string = ConstantStringTableComponentsEnum.ACTIVE;
    public activeViewMode: string = ConstantStringTableComponentsEnum.LIST;
    public trucksActive: TruckActiveState[] = [];
    public trucksInactive: TruckInactiveState[] = [];
    public loadingPage: boolean = false;
    public inactiveTabClicked: boolean = false;
    public activeTableData: string;
    public backFilterQuery: TruckFilter =
        TableDropdownComponentConstants.BACK_FILTER_QUERY;

    public resizeObserver: ResizeObserver;

    //Data to display from model Truck Active
    public displayRowsFrontActive: CardRows[] =
        TruckCardDataConstants.displayRowsFrontActive;
    public displayRowsBackActive: CardRows[] =
        TruckCardDataConstants.displayRowsBackActive;

    public displayRowsFrontInactive: CardRows[] =
        TruckCardDataConstants.displayRowsFrontInactive;
    public displayRowsBackInactive: CardRows[] =
        TruckCardDataConstants.displayRowsBackInactive;

    public cardTitle: string = TruckCardDataConstants.cardTitle;
    public page: string = TruckCardDataConstants.page;
    public rows: number = TruckCardDataConstants.rows;

    public sendDataToCardsFront: CardRows[];
    public sendDataToCardsBack: CardRows[];

    constructor(
        private modalService: ModalService,
        private router: Router,
        private tableService: TruckassistTableService,
        private truckService: TruckService,
        private confirmationService: ConfirmationService,
        private truckActiveQuery: TruckActiveQuery,
        private truckInactiveQuery: TruckInactiveQuery,
        private truckInactiveStore: TruckInactiveStore,
        private thousandSeparator: ThousandSeparatorPipe,
        public datePipe: DatePipe
    ) {}

    ngOnInit(): void {
        this.sendTruckData();

        this.confirmationSubscribe();

        this.resetColumns();

        this.resize();

        this.toggleColumns();

        this.addTruckOrUpdate();

        this.deleteSelectedRow();

        this.search();

        this.getSelectedTabTableData();

        this.setTableFilter();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.observTableContainer();
        }, 10);
    }

    // Confirmation Subscribe
    private confirmationSubscribe(): void {
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res) => {
                    switch (res.type) {
                        case ConstantStringTableComponentsEnum.DELETE: {
                            this.deleteTruckById(res.id);
                            break;
                        }
                        case ConstantStringTableComponentsEnum.ACTIVATE: {
                            if (res.array?.length) {
                                res.array.map((e) => {
                                    this.changeTruckStatus(e.id);
                                });
                            } else {
                                this.changeTruckStatus(res.id);
                            }
                            break;
                        }
                        case ConstantStringTableComponentsEnum.DEACTIVATE: {
                            if (res.array?.length) {
                                res.array.map((e) => {
                                    this.changeTruckStatus(e.id);
                                });
                            } else {
                                this.changeTruckStatus(res.id);
                            }
                            break;
                        }
                        case ConstantStringTableComponentsEnum.MULTIPLE_DELETE: {
                            this.multipleDeleteTrucks(res.array);
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                },
            });
    }

    // Reset Columns
    private resetColumns(): void {
        this.tableService.currentResetColumns
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
                if (response && !this.loadingPage) {
                    this.sendTruckData();
                }
            });
    }

    public setTableFilter(): void {
        this.tableService.currentSetTableFilter
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res?.filterType) {
                    if (res.action === ConstantStringTableComponentsEnum.SET) {
                        this.viewData = this.truckData?.filter((customerData) =>
                            res.queryParams.some(
                                (filterData) => filterData === customerData.id
                            )
                        );
                    }

                    if (res.action === ConstantStringTableComponentsEnum.CLEAR)
                        this.viewData = this.truckData;
                }
            });
    }

    // Resize
    private resize(): void {
        this.tableService.currentColumnWidth
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
                if (response?.event?.width) {
                    this.columns = this.columns.map((col) => {
                        if (
                            col.title ===
                            response.columns[response.event.index].title
                        ) {
                            col.width = response.event.width;
                        }

                        return col;
                    });
                }
            });
    }

    // Toggle Columns
    private toggleColumns(): void {
        this.tableService.currentToaggleColumn
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: any) => {
                if (response?.column) {
                    this.columns = this.columns.map((c) => {
                        if (c.field === response.column.field) {
                            c.hidden = response.column.hidden;
                        }

                        return c;
                    });
                }
            });
    }

    // Add Truck Or Update
    private addTruckOrUpdate(): void {
        this.tableService.currentActionAnimation
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res?.animation === ConstantStringTableComponentsEnum.ADD) {
                    this.viewData.push(this.mapTruckData(res.data));

                    this.viewData = this.viewData.map((truck) => {
                        if (truck.id === res.id) {
                            truck.actionAnimation =
                                ConstantStringTableComponentsEnum.ADD;
                        }

                        return truck;
                    });

                    this.updateDataCount();

                    const inetval = setInterval(() => {
                        this.viewData = closeAnimationAction(
                            false,
                            this.viewData
                        );

                        clearInterval(inetval);
                    }, 2300);
                } else if (
                    res?.animation === ConstantStringTableComponentsEnum.ADD &&
                    this.selectedTab ===
                        ConstantStringTableComponentsEnum.INACTIVE
                ) {
                    this.updateDataCount();
                } else if (
                    res?.animation === ConstantStringTableComponentsEnum.UPDATE
                ) {
                    const updatedTruck = this.mapTruckData(res.data);

                    this.viewData = this.viewData.map((truck) => {
                        if (truck.id === res.id) {
                            truck = updatedTruck;
                            truck.actionAnimation =
                                ConstantStringTableComponentsEnum.UPDATE;
                        }

                        return truck;
                    });

                    const inetval = setInterval(() => {
                        this.viewData = closeAnimationAction(
                            false,
                            this.viewData
                        );

                        clearInterval(inetval);
                    }, 1000);
                } else if (
                    res?.animation ===
                    ConstantStringTableComponentsEnum.UPDATE_STATUS
                ) {
                    let truckIndex: number;

                    this.viewData = this.viewData.map(
                        (truck: any, index: number) => {
                            if (truck.id === res.id) {
                                truck.actionAnimation =
                                    this.selectedTab ===
                                    ConstantStringTableComponentsEnum.ACTIVE
                                        ? ConstantStringTableComponentsEnum.DEACTIVATE
                                        : ConstantStringTableComponentsEnum.ACTIVATE;
                                truckIndex = index;
                            }

                            return truck;
                        }
                    );

                    this.updateDataCount();

                    const inetval = setInterval(() => {
                        this.viewData = closeAnimationAction(
                            false,
                            this.viewData
                        );

                        this.viewData.splice(truckIndex, 1);
                        clearInterval(inetval);
                    }, 900);
                } else if (
                    res?.animation === ConstantStringTableComponentsEnum.DELETE
                ) {
                    let truckIndex: number;

                    this.viewData = this.viewData.map(
                        (truck: any, index: number) => {
                            if (truck.id === res.id) {
                                truck.actionAnimation =
                                    ConstantStringTableComponentsEnum.DELETE;
                                truckIndex = index;
                            }

                            return truck;
                        }
                    );

                    this.updateDataCount();

                    const inetval = setInterval(() => {
                        this.viewData = closeAnimationAction(
                            false,
                            this.viewData
                        );

                        this.viewData.splice(truckIndex, 1);
                        clearInterval(inetval);
                    }, 900);
                }
            });
    }

    // Delete Selected Rows
    private deleteSelectedRow(): void {
        this.tableService.currentDeleteSelectedRows
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
                if (response.length && !this.loadingPage) {
                    const mappedRes = response.map((item) => {
                        return {
                            id: item.id,
                            data: {
                                ...item.tableData,
                                number: item.tableData?.truckNumber,
                                avatar: `assets/svg/common/trucks/${item.tableData?.truckType?.logoName}`,
                            },
                        };
                    });
                    this.modalService.openModal(
                        ConfirmationModalComponent,
                        { size: ConstantStringTableComponentsEnum.SMALL },
                        {
                            data: null,
                            array: mappedRes,
                            template: ConstantStringTableComponentsEnum.TRUCK,
                            type: ConstantStringTableComponentsEnum.MULTIPLE_DELETE,
                            svg: true,
                        }
                    );
                }
            });
    }

    // Search
    private search(): void {
        this.tableService.currentSearchTableData
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) {
                    this.backFilterQuery.active =
                        this.selectedTab ===
                        ConstantStringTableComponentsEnum.ACTIVE
                            ? 1
                            : 0;
                    this.backFilterQuery.pageIndex = 1;

                    const searchEvent = tableSearch(res, this.backFilterQuery);

                    if (searchEvent) {
                        if (
                            searchEvent.action ===
                            ConstantStringTableComponentsEnum.API
                        ) {
                            this.truckBackFilter(searchEvent.query);
                        } else if (
                            searchEvent.action ===
                            ConstantStringTableComponentsEnum.STORE
                        ) {
                            this.sendTruckData();
                        }
                    }
                }
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
                showTruckFilter: true,
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
        };
    }

    private sendTruckData(): void {
        const tableView = JSON.parse(
            localStorage.getItem(
                ConstantStringTableComponentsEnum.TRUCK_TABLE_VIEW
            )
        );

        if (tableView) {
            this.selectedTab = tableView.tabSelected;
            this.activeViewMode = tableView.viewMode;
        }

        this.initTableOptions();

        const truckCount = JSON.parse(
            localStorage.getItem(
                ConstantStringTableComponentsEnum.TRUCK_TABLE_COUNT
            )
        );

        const truckActiveData =
            this.selectedTab === ConstantStringTableComponentsEnum.ACTIVE
                ? this.getTabData(ConstantStringTableComponentsEnum.ACTIVE)
                : [];

        const truckInactiveData =
            this.selectedTab === ConstantStringTableComponentsEnum.INACTIVE
                ? this.getTabData(ConstantStringTableComponentsEnum.INACTIVE)
                : [];

        this.tableData = [
            {
                title: ConstantStringTableComponentsEnum.ACTIVE_2,
                field: ConstantStringTableComponentsEnum.ACTIVE,
                length: truckCount.active,
                data: truckActiveData,
                gridNameTitle: ConstantStringTableComponentsEnum.TRUCK_2,
                stateName: ConstantStringTableComponentsEnum.TRUCKS,
                tableConfiguration: ConstantStringTableComponentsEnum.TRUCK_3,
                isActive:
                    this.selectedTab ===
                    ConstantStringTableComponentsEnum.ACTIVE,
                gridColumns: this.getGridColumns(
                    ConstantStringTableComponentsEnum.TRUCK_3
                ),
            },
            {
                title: ConstantStringTableComponentsEnum.INACTIVE_2,
                field: ConstantStringTableComponentsEnum.INACTIVE,
                length: truckCount.inactive,
                data: truckInactiveData,
                gridNameTitle: ConstantStringTableComponentsEnum.TRUCK_2,
                stateName: ConstantStringTableComponentsEnum.TRUCKS,
                tableConfiguration: ConstantStringTableComponentsEnum.TRUCK_3,
                isActive:
                    this.selectedTab ===
                    ConstantStringTableComponentsEnum.INACTIVE,
                gridColumns: this.getGridColumns(
                    ConstantStringTableComponentsEnum.TRUCK_3
                ),
            },
        ];

        const td = this.tableData.find((t) => t.field === this.selectedTab);

        this.setTruckData(td);
    }

    private getGridColumns(configType: string): string[] {
        const tableColumnsConfig = JSON.parse(
            localStorage.getItem(`table-${configType}-Configuration`)
        );

        return tableColumnsConfig
            ? tableColumnsConfig
            : getTruckColumnDefinition();
    }

    // Set data for display in tables and cards
    private setTruckData(td: DataForCardsAndTables): void {
        this.columns = td.gridColumns;

        if (td.data.length) {
            this.viewData = td.data;

            this.viewData = this.viewData.map((data) => {
                return this.mapTruckData(data);
            });

            // Set data for cards based on tab active
            this.selectedTab === ConstantStringTableComponentsEnum.ACTIVE
                ? ((this.sendDataToCardsFront = this.displayRowsFrontActive),
                  (this.sendDataToCardsBack = this.displayRowsBackActive))
                : ((this.sendDataToCardsFront = this.displayRowsFrontInactive),
                  (this.sendDataToCardsBack = this.displayRowsBackInactive));

            this.getSelectedTabTableData();
        } else {
            this.viewData = [];
        }
        this.truckData = this.viewData;
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

    // TODO any type
    private mapTruckData(data: any): void {
        return {
            ...data,
            truckTypeIcon: data.truckType.logoName,
            tableTruckName: data.truckType.name,
            tableTruckColor: this.setTruckTooltipColor(data.truckType.name),
            tableVin: {
                regularText: data?.vin
                    ? data.vin.substr(0, data.vin.length - 6)
                    : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
                boldText: data?.vin
                    ? data.vin.substr(data.vin.length - 6)
                    : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            },
            truckTypeClass: data.truckType.logoName.replace(
                ConstantStringTableComponentsEnum.SVG,
                ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER
            ),
            tabelLength: data?.truckLength?.name
                ? DataFilterHelper.getLengthNumber(data?.truckLength?.name)
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            textMake: data?.truckMake?.name
                ? data.truckMake.name
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            textModel: data?.model
                ? data.model
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            textYear: data.year
                ? data.year
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableColor: data?.color?.code
                ? data.color.code
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            colorName: data?.color?.name
                ? data.color.name
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableDriver: ConstantStringTableComponentsEnum.NA,
            tableTrailer: ConstantStringTableComponentsEnum.NA,
            tableTrailerType: ConstantStringTableComponentsEnum.NA,
            tabelOwnerDetailsName: data?.owner?.name
                ? data.owner.name
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tabelOwnerDetailsComm: data?.commission
                ? data.commission + ConstantStringTableComponentsEnum.PERCENTS
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            textWeightGross: data?.truckGrossWeight?.name
                ? data.truckGrossWeight.name
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            textWeightEmpty: data?.emptyWeight
                ? this.thousandSeparator.transform(data.emptyWeight) +
                  ConstantStringTableComponentsEnum.POUNDS_2
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tabelEngineModel: data?.truckEngineModel?.name
                ? data.truckEngineModel.name
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tabelEngineOilType: data?.engineOilType?.name
                ? data.engineOilType.name
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tabelTransmissionModel: data?.transmissionModel
                ? data.transmissionModel
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tabelTransmissionShifter: data?.shifter?.name
                ? data.shifter.name
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tabelTransmissionRatio: data?.gearRatio?.name
                ? data.gearRatio.name
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tabelFuelDetailsFuelType: data?.fuelType?.name
                ? data.fuelType.name
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tabelFuelDetailsTank: data?.fuelTankSize
                ? this.thousandSeparator.transform(data.fuelTankSize)
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tabelAxle: data?.axles
                ? data.axles
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tabelBrakes: data?.brakes?.name
                ? data.brakes.name
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableTireSize: data?.tireSize?.name
                ? data.tireSize.name
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableWheelCompositionFront: data?.frontWheels?.name
                ? data.frontWheels.name
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableWheelCompositionRear: data?.rearWheels?.name
                ? data.rearWheels.name
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableAPUnit: data?.apUnit?.name
                ? data.apUnit.name
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableFeatures: `${
                data?.doubleBunk
                    ? ConstantStringTableComponentsEnum.DBUNK
                    : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER
            }${
                data?.refrigerator
                    ? ConstantStringTableComponentsEnum.FRIDGE
                    : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER
            }${
                data?.dcInverter
                    ? ConstantStringTableComponentsEnum.DCI
                    : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER
            }${
                data?.blower
                    ? ConstantStringTableComponentsEnum.BLOWER
                    : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER
            }${
                data?.pto
                    ? ConstantStringTableComponentsEnum.PTO
                    : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER
            }`,
            tableTollDeviceTransponder: data?.tollTransponder?.name
                ? data.tollTransponder.name
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableTollDeviceNo: data?.tollTransponderDeviceNo
                ? data.tollTransponderDeviceNo
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableInsPolicy: data?.insurancePolicy
                ? data.insurancePolicy
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableMileage: data?.mileage
                ? this.thousandSeparator.transform(data.mileage) +
                  ConstantStringTableComponentsEnum.MILES_2
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableLicencePlateDetailNumber: data?.licensePlate
                ? data.licensePlate
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableLicencePlateDetailST: ConstantStringTableComponentsEnum.NA,
            tableLicencePlateDetailExpiration: {
                expirationDays: data?.registrationExpirationDays
                    ? data.registrationExpirationDays
                    : null,
                expirationDaysText: data?.registrationExpirationDays
                    ? this.thousandSeparator.transform(
                          data.registrationExpirationDays
                      )
                    : null,
                percentage:
                    data?.registrationPercentage ||
                    data?.registrationPercentage === 0
                        ? 100 - data.registrationPercentage
                        : null,
            },
            tableFhwaInspectionTerm: data?.fhwaExp
                ? data.fhwaExp + ConstantStringTableComponentsEnum.MONTHS
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableFhwaInspectionExpiration: {
                expirationDays: data?.inspectionExpirationDays
                    ? data.inspectionExpirationDays
                    : null,
                expirationDaysText: data?.inspectionExpirationDays
                    ? this.thousandSeparator.transform(
                          data.inspectionExpirationDays
                      )
                    : null,
                percentage:
                    data?.inspectionPercentage ||
                    data?.inspectionPercentage === 0
                        ? 100 - data.inspectionPercentage
                        : null,
            },
            tableTitleNumber: ConstantStringTableComponentsEnum.NA,
            tableTitleST: ConstantStringTableComponentsEnum.NA,
            tableTitleIssued: ConstantStringTableComponentsEnum.NA,
            tableTitlePurchase: ConstantStringTableComponentsEnum.NA,
            tablePurchasePrice: data?.purchasePrice
                ? ConstantStringTableComponentsEnum.DOLLAR_SIGN +
                  this.thousandSeparator.transform(data.purchasePrice)
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tablePurchaseDate: data.purchaseDate
                ? this.datePipe.transform(
                      data.purchaseDate,
                      ConstantStringTableComponentsEnum.DATE_FORMAT
                  )
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,

            tableTerminated: ConstantStringTableComponentsEnum.NA,
            tableAdded: data.createdAt
                ? this.datePipe.transform(
                      data.createdAt,
                      ConstantStringTableComponentsEnum.DATE_FORMAT
                  )
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableEdited: data.updatedAt
                ? this.datePipe.transform(
                      data.updatedAt,
                      ConstantStringTableComponentsEnum.DATE_FORMAT
                  )
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableAttachments: data?.files ? data.files : [],
            fileCount: data?.fileCount,
            tableDropdownContent: {
                hasContent: true,
                content: this.getDropdownTruckContent(),
            },
        };
    }

    private getDropdownTruckContent(): DropdownItem[] {
        return [
            {
                title: ConstantStringTableComponentsEnum.EDIT_2,
                name: ConstantStringTableComponentsEnum.EDIT_TRUCK,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Edit.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                hasBorder: true,
                svgClass: ConstantStringTableComponentsEnum.REGULAR,
            },
            {
                title: ConstantStringTableComponentsEnum.VIEW_DETAILS_2,
                name: ConstantStringTableComponentsEnum.VIEW_DETAILS,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Information.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: ConstantStringTableComponentsEnum.REGULAR,
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
            },
            {
                title: ConstantStringTableComponentsEnum.ADD_NEW_2,
                name: ConstantStringTableComponentsEnum.ADD_NEW,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Show More.svg',
                svgStyle: {
                    width: 15,
                    height: 15,
                },
                svgClass: ConstantStringTableComponentsEnum.REGULAR,
                isDropdown: true,
                insideDropdownContent: [
                    {
                        title: ConstantStringTableComponentsEnum.REGISTRATION,
                        name: ConstantStringTableComponentsEnum.ADD_REGISTRATION,
                    },
                    {
                        title: ConstantStringTableComponentsEnum.INSPECTION,
                        name: ConstantStringTableComponentsEnum.ADD_INSPECTION,
                    },
                    {
                        title: ConstantStringTableComponentsEnum.TITLE,
                        name: ConstantStringTableComponentsEnum.ADD_REPAIR,
                    },
                ],
                hasBorder: true,
            },
            {
                title:
                    this.selectedTab ===
                    ConstantStringTableComponentsEnum.ACTIVE
                        ? ConstantStringTableComponentsEnum.DEACTIVATE_2
                        : ConstantStringTableComponentsEnum.ACTIVATE_2,
                name: ConstantStringTableComponentsEnum.ACTIVATE_ITEM,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Deactivate.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass:
                    this.selectedTab ===
                    ConstantStringTableComponentsEnum.ACTIVE
                        ? ConstantStringTableComponentsEnum.DEACTIVATE
                        : ConstantStringTableComponentsEnum.ACTIVATE,
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
            },
            {
                title: ConstantStringTableComponentsEnum.DELETE_2,
                name: ConstantStringTableComponentsEnum.DELETE_ITEM,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Delete.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: ConstantStringTableComponentsEnum.DELETE,
            },
        ];
    }

    private updateDataCount(): void {
        const truckCount = JSON.parse(
            localStorage.getItem(
                ConstantStringTableComponentsEnum.TRUCK_TABLE_COUNT
            )
        );

        const updatedTableData = [...this.tableData];

        updatedTableData[0].length = truckCount.active;
        updatedTableData[1].length = truckCount.inactive;

        this.tableData = [...updatedTableData];
    }

    private getTabData(dataType: string): TruckActiveState[] {
        if (dataType === ConstantStringTableComponentsEnum.ACTIVE) {
            this.trucksActive = this.truckActiveQuery.getAll();

            return this.trucksActive?.length ? this.trucksActive : [];
        } else if (dataType === ConstantStringTableComponentsEnum.INACTIVE) {
            this.inactiveTabClicked = true;

            this.trucksInactive = this.truckInactiveQuery.getAll();

            return this.trucksInactive?.length ? this.trucksInactive : [];
        }
    }

    private truckBackFilter(
        filter: {
            active: number;
            pageIndex: number;
            pageSize: number;
            companyId: number | undefined;
            sort: string | undefined;
            searchOne: string | undefined;
            searchTwo: string | undefined;
            searchThree: string | undefined;
        },
        isShowMore?: boolean
    ): void {
        this.truckService
            .getTruckList(
                filter.active,
                filter.pageIndex,
                filter.pageSize,
                filter.companyId,
                filter.sort,
                filter.searchOne,
                filter.searchTwo,
                filter.searchThree
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe((trucks) => {
                if (!isShowMore) {
                    this.viewData = trucks.pagination.data;

                    this.viewData = this.viewData.map((data) => {
                        return this.mapTruckData(data);
                    });
                } else {
                    let newData = [...this.viewData];

                    trucks.pagination.data.map((data) => {
                        newData.push(this.mapTruckData(data));
                    });

                    this.viewData = [...newData];
                }
            });
    }

    public onToolBarAction(event: ToolbarActions): void {
        // Open Modal
        if (event.action === ConstantStringTableComponentsEnum.OPEN_MODAL) {
            this.modalService.openModal(TruckModalComponent, {
                size: ConstantStringTableComponentsEnum.SMALL,
            });
        }
        // Select Tab
        else if (
            event.action === ConstantStringTableComponentsEnum.TAB_SELECTED
        ) {
            this.selectedTab = event.tabData.field;

            this.backFilterQuery.pageIndex = 1;

            this.backFilterQuery.active =
                this.selectedTab === ConstantStringTableComponentsEnum.ACTIVE
                    ? 1
                    : 0;

            if (
                this.selectedTab ===
                    ConstantStringTableComponentsEnum.INACTIVE &&
                !this.inactiveTabClicked
            ) {
                this.truckService
                    .getTruckList(0, 1, 25)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe((truckPagination: TruckListResponse) => {
                        this.truckInactiveStore.set(
                            truckPagination.pagination.data
                        );

                        this.sendTruckData();
                    });
            } else {
                this.sendTruckData();
            }
        }
        // Change View Mode
        else if (event.action === ConstantStringTableComponentsEnum.VIEW_MODE) {
            this.activeViewMode = event.mode;
        } else if (
            event.action === ConstantStringTableComponentsEnum.ACTIVATE_ITEM
        ) {
            let status = false;
            let mappedEvent = [];
            this.viewData.map((data) => {
                event.tabData.data.map((element) => {
                    if (data.id === element) {
                        status = data.status;
                        mappedEvent.push({
                            ...data,
                            data: {
                                ...data,
                                number: data.truckNumber,
                                avatar: `assets/svg/common/trucks/${data?.truckType?.logoName}`,
                            },
                        });
                    }
                });
            });
            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: ConstantStringTableComponentsEnum.SMALL },
                {
                    data: null,
                    array: mappedEvent,
                    template: ConstantStringTableComponentsEnum.TRUCK,
                    type: status
                        ? ConstantStringTableComponentsEnum.DEACTIVATE
                        : ConstantStringTableComponentsEnum.ACTIVATE,
                    svg: true,
                }
            );
        }
    }

    public onTableHeadActions(event: {
        action: string;
        direction: string;
    }): void {
        if (event.action === ConstantStringTableComponentsEnum.SORT) {
            if (event.direction) {
                this.backFilterQuery.active =
                    this.selectedTab ===
                    ConstantStringTableComponentsEnum.ACTIVE
                        ? 1
                        : 0;
                this.backFilterQuery.pageIndex = 1;
                this.backFilterQuery.sort = event.direction;

                this.truckBackFilter(this.backFilterQuery);
            } else {
                this.sendTruckData();
            }
        }
    }

    private onTableBodyActions(event: TruckBodyResponse): void {
        const mappedEvent = {
            ...event,
            data: {
                ...event.data,
                number: event.data?.truckNumber,
                avatar: `assets/svg/common/trucks/${event.data?.truckType?.logoName}`,
            },
        };

        switch (event.type) {
            case ConstantStringTableComponentsEnum.SHOW_MORE: {
                this.backFilterQuery.active =
                    this.selectedTab ===
                    ConstantStringTableComponentsEnum.ACTIVE
                        ? 1
                        : 0;
                this.backFilterQuery.pageIndex++;
                this.truckBackFilter(this.backFilterQuery, true);
                break;
            }
            case ConstantStringTableComponentsEnum.EDIT_TRUCK: {
                this.modalService.openModal(
                    TruckModalComponent,
                    { size: ConstantStringTableComponentsEnum.SMALL },
                    {
                        ...event,
                        type: ConstantStringTableComponentsEnum.EDIT,
                        disableButton: true,
                        tabSelected: this.selectedTab,
                    }
                );
                break;
            }
            case ConstantStringTableComponentsEnum.ADD_REGISTRATION: {
                this.modalService.openModal(
                    TtRegistrationModalComponent,
                    { size: ConstantStringTableComponentsEnum.SMALL },
                    {
                        ...event,
                        modal: ConstantStringTableComponentsEnum.TRUCK,
                        tabSelected: this.selectedTab,
                    }
                );
                break;
            }

            case ConstantStringTableComponentsEnum.ADD_INSPECTION: {
                this.modalService.openModal(
                    TtFhwaInspectionModalComponent,
                    { size: ConstantStringTableComponentsEnum.SMALL },
                    {
                        ...event,
                        modal: ConstantStringTableComponentsEnum.TRUCK,
                        tabSelected: this.selectedTab,
                    }
                );
                break;
            }
            case ConstantStringTableComponentsEnum.VIEW_DETAILS: {
                this.router.navigate([`/list/truck/${event.id}/details`]);
                break;
            }
            case ConstantStringTableComponentsEnum.ADD_REPAIR: {
                this.modalService.openModal(
                    TtTitleModalComponent,
                    { size: ConstantStringTableComponentsEnum.SMALL },
                    {
                        ...event,
                        modal: ConstantStringTableComponentsEnum.TRUCK,
                        tabSelected: this.selectedTab,
                    }
                );
                break;
            }
            case ConstantStringTableComponentsEnum.ACTIVATE_ITEM: {
                this.modalService.openModal(
                    ConfirmationModalComponent,
                    { size: ConstantStringTableComponentsEnum.SMALL },
                    {
                        ...mappedEvent,
                        template: ConstantStringTableComponentsEnum.TRUCK,
                        type:
                            event.data.status === 1
                                ? ConstantStringTableComponentsEnum.DEACTIVATE
                                : ConstantStringTableComponentsEnum.ACTIVATE,
                        svg: true,
                    }
                );
                break;
            }
            case ConstantStringTableComponentsEnum.DELETE_ITEM: {
                this.modalService.openModal(
                    ConfirmationModalComponent,
                    { size: ConstantStringTableComponentsEnum.SMALL },
                    {
                        ...mappedEvent,
                        template: ConstantStringTableComponentsEnum.TRUCK,
                        type: ConstantStringTableComponentsEnum.DELETE,
                        svg: true,
                    }
                );
                break;
            }
            default: {
                break;
            }
        }
    }

    // Get Tab Table Data For Selected Tab
    private getSelectedTabTableData(): void {
        if (this.tableData?.length) {
            this.activeTableData = this.tableData.find(
                (table) => table.field === this.selectedTab
            );
        }
    }

    // Show More Data
    public onShowMore(): void {
        this.onTableBodyActions({
            type: ConstantStringTableComponentsEnum.SHOW_MORE,
        });
    }

    private changeTruckStatus(id: number): void {
        this.truckService
            .changeTruckStatus(id, this.selectedTab)
            .pipe(takeUntil(this.destroy$))
            .subscribe({});
    }

    private deleteTruckById(id: number): void {
        this.truckService
            .deleteTruckById(id, this.selectedTab)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.viewData = this.viewData.map((truck) => {
                        if (truck.id === id) {
                            truck.actionAnimation =
                                ConstantStringTableComponentsEnum.DELETE;
                        }

                        return truck;
                    });

                    this.updateDataCount();

                    const inetval = setInterval(() => {
                        this.viewData = closeAnimationAction(
                            true,
                            this.viewData
                        );

                        clearInterval(inetval);
                    }, 900);
                },
            });
    }

    // TODO Function commented in service for some reason it needs to be checked
    private multipleDeleteTrucks(response: number[]): void {
        this.truckService
            .deleteTruckList(response, this.selectedTab)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.viewData = this.viewData.map((truck) => {
                    response.map((id) => {
                        if (truck.id === id) {
                            truck.actionAnimation =
                                ConstantStringTableComponentsEnum.DELETE_MULTIPLE;
                        }
                    });

                    return truck;
                });

                this.updateDataCount();
                const inetval = setInterval(() => {
                    this.viewData = closeAnimationAction(true, this.viewData);

                    clearInterval(inetval);
                }, 900);

                this.tableService.sendRowsSelected([]);
                this.tableService.sendResetSelectedColumns(true);
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.tableService.sendActionAnimation({});
        // this.resizeObserver.unobserve(
        //     document.querySelector(ConstantStringTableComponentsEnum.TABLE_CONTAINER)
        // );
        this.resizeObserver.disconnect();
    }
}
