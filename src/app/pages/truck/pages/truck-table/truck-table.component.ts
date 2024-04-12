import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

// components
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';
import { TruckModalComponent } from '@pages/truck/pages/truck-modal/truck-modal.component';
import { TtRegistrationModalComponent } from '@shared/components/ta-shared-modals/truck-trailer-modals/modals/tt-registration-modal/tt-registration-modal.component';
import { TtFhwaInspectionModalComponent } from '@shared/components/ta-shared-modals/truck-trailer-modals/modals/tt-fhwa-inspection-modal/tt-fhwa-inspection-modal.component';
import { TtTitleModalComponent } from '@shared/components/ta-shared-modals/truck-trailer-modals/modals/tt-title-modal/tt-title-modal.component';

// services
import { TruckService } from '@shared/services/truck.service';
import { ModalService } from '@shared/services/modal.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';

// store
import { TruckActiveQuery } from '@pages/truck/state/truck-active-state/truck-active.query';
import { TruckInactiveQuery } from '@pages/truck/state/truck-inactive-state/truck-inactive.query';
import { TruckActiveState } from '@pages/truck/state/truck-active-state/truck-active.store';
import { TruckInactiveState } from '@pages/truck/state/truck-inactive-state/truck-inactive.store';
import { TruckInactiveStore } from '@pages/truck/state/truck-inactive-state/truck-inactive.store';

// constants
import { TruckCardDataConstants } from '@pages/truck/pages/truck-table/utils/constants/truck-card-data.constants';
import { TableDropdownComponentConstants } from '@shared/utils/constants/table-dropdown-component.constants';

// pipes
import { DatePipe } from '@angular/common';
import { ThousandSeparatorPipe } from '@shared/pipes/thousand-separator.pipe';

// enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { TruckNameStringEnum } from '@shared/enums/truck-name-string.enum';
import { TooltipColorsStringEnum } from '@shared/enums/tooltip-colors-string,enum';

//Helpers
import { DataFilterHelper } from '@shared/utils/helpers/data-filter.helper';
import { MethodsGlobalHelper } from '@shared/utils/helpers/methods-global.helper';
import { getTruckColumnDefinition } from '@shared/utils/settings/table-settings/truck-columns';

// models
import { TruckListResponse } from 'appcoretruckassist';
import { CardRows } from '@shared/models/card-models/card-rows.model';
import { CardTableData } from '@shared/models/table-models/card-table-data.model';
import { TableColumnConfig } from '@shared/models/table-models/table-column-config.model';
import { TruckFilter } from '@pages/truck/pages/truck-table/models/truck-filter.model';
import { DropdownItem } from '@shared/models/card-models/card-table-data.model';
import { TableToolbarActions } from '@shared/models/table-models/table-toolbar-actions.model';

import { TruckBodyResponse } from '@pages/truck/pages/truck-table/models/truck-body-response.model';

@Component({
    selector: 'app-truck-table',
    templateUrl: './truck-table.component.html',
    styleUrls: ['./truck-table.component.scss'],
    providers: [ThousandSeparatorPipe],
})
export class TruckTableComponent implements OnInit, AfterViewInit, OnDestroy {
    private destroy$ = new Subject<void>();
    public tableOptions;
    public truckData: any[] = [];
    public tableData: any[] = [];
    public viewData: any[] = [];
    public columns: TableColumnConfig[] = [];
    public selectedTab: string = TableStringEnum.ACTIVE;
    public activeViewMode: string = TableStringEnum.LIST;
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
                        case TableStringEnum.DELETE: {
                            this.deleteTruckById(res.id);
                            break;
                        }
                        case TableStringEnum.ACTIVATE: {
                            if (res.array?.length) {
                                res.array.map((e) => {
                                    this.changeTruckStatus(e.id);
                                });
                            } else {
                                this.changeTruckStatus(res.id);
                            }
                            break;
                        }
                        case TableStringEnum.DEACTIVATE: {
                            if (res.array?.length) {
                                res.array.map((e) => {
                                    this.changeTruckStatus(e.id);
                                });
                            } else {
                                this.changeTruckStatus(res.id);
                            }
                            break;
                        }
                        case TableStringEnum.MULTIPLE_DELETE: {
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
                    if (res.action === TableStringEnum.SET) {
                        this.viewData = this.truckData?.filter((customerData) =>
                            res.queryParams.some(
                                (filterData) => filterData === customerData.id
                            )
                        );
                    }

                    if (res.action === TableStringEnum.CLEAR)
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
                if (res?.animation === TableStringEnum.ADD) {
                    this.viewData.push(this.mapTruckData(res.data));

                    this.viewData = this.viewData.map((truck) => {
                        if (truck.id === res.id) {
                            truck.actionAnimation = TableStringEnum.ADD;
                        }

                        return truck;
                    });

                    this.updateDataCount();

                    const inetval = setInterval(() => {
                        this.viewData =
                            MethodsGlobalHelper.closeAnimationAction(
                                false,
                                this.viewData
                            );

                        clearInterval(inetval);
                    }, 2300);
                } else if (
                    res?.animation === TableStringEnum.ADD &&
                    this.selectedTab === TableStringEnum.INACTIVE
                ) {
                    this.updateDataCount();
                } else if (res?.animation === TableStringEnum.UPDATE) {
                    const updatedTruck = this.mapTruckData(res.data);

                    this.viewData = this.viewData.map((truck) => {
                        if (truck.id === res.id) {
                            truck = updatedTruck;
                            truck.actionAnimation = TableStringEnum.UPDATE;
                        }

                        return truck;
                    });

                    const inetval = setInterval(() => {
                        this.viewData =
                            MethodsGlobalHelper.closeAnimationAction(
                                false,
                                this.viewData
                            );

                        clearInterval(inetval);
                    }, 1000);
                } else if (res?.animation === TableStringEnum.UPDATE_STATUS) {
                    let truckIndex: number;

                    this.viewData = this.viewData.map(
                        (truck: any, index: number) => {
                            if (truck.id === res.id) {
                                truck.actionAnimation =
                                    this.selectedTab === TableStringEnum.ACTIVE
                                        ? TableStringEnum.DEACTIVATE
                                        : TableStringEnum.ACTIVATE;
                                truckIndex = index;
                            }

                            return truck;
                        }
                    );

                    this.updateDataCount();

                    const inetval = setInterval(() => {
                        this.viewData =
                            MethodsGlobalHelper.closeAnimationAction(
                                false,
                                this.viewData
                            );

                        this.viewData.splice(truckIndex, 1);
                        clearInterval(inetval);
                    }, 900);
                } else if (res?.animation === TableStringEnum.DELETE) {
                    let truckIndex: number;

                    this.viewData = this.viewData.map(
                        (truck: any, index: number) => {
                            if (truck.id === res.id) {
                                truck.actionAnimation = TableStringEnum.DELETE;
                                truckIndex = index;
                            }

                            return truck;
                        }
                    );

                    this.updateDataCount();

                    const inetval = setInterval(() => {
                        this.viewData =
                            MethodsGlobalHelper.closeAnimationAction(
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
                        { size: TableStringEnum.SMALL },
                        {
                            data: null,
                            array: mappedRes,
                            template: TableStringEnum.TRUCK,
                            type: TableStringEnum.MULTIPLE_DELETE,
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
                        this.selectedTab === TableStringEnum.ACTIVE ? 1 : 0;
                    this.backFilterQuery.pageIndex = 1;

                    const searchEvent = MethodsGlobalHelper.tableSearch(
                        res,
                        this.backFilterQuery
                    );

                    if (searchEvent) {
                        if (searchEvent.action === TableStringEnum.API) {
                            this.truckBackFilter(searchEvent.query);
                        } else if (
                            searchEvent.action === TableStringEnum.STORE
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
            document.querySelector(TableStringEnum.TABLE_CONTAINER)
        );
    }

    private initTableOptions(): void {
        this.tableOptions = {
            toolbarActions: {
                showTruckFilter: true,
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
        };
    }

    private sendTruckData(): void {
        const tableView = JSON.parse(
            localStorage.getItem(TableStringEnum.TRUCK_TABLE_VIEW)
        );

        if (tableView) {
            this.selectedTab = tableView.tabSelected;
            this.activeViewMode = tableView.viewMode;
        }

        this.initTableOptions();

        const truckCount = JSON.parse(
            localStorage.getItem(TableStringEnum.TRUCK_TABLE_COUNT)
        );

        const truckActiveData =
            this.selectedTab === TableStringEnum.ACTIVE
                ? this.getTabData(TableStringEnum.ACTIVE)
                : [];

        const truckInactiveData =
            this.selectedTab === TableStringEnum.INACTIVE
                ? this.getTabData(TableStringEnum.INACTIVE)
                : [];

        this.tableData = [
            {
                title: TableStringEnum.ACTIVE_2,
                field: TableStringEnum.ACTIVE,
                length: truckCount.active,
                data: truckActiveData,
                gridNameTitle: TableStringEnum.TRUCK_2,
                stateName: TableStringEnum.TRUCKS,
                tableConfiguration: TableStringEnum.TRUCK_3,
                isActive: this.selectedTab === TableStringEnum.ACTIVE,
                gridColumns: this.getGridColumns(TableStringEnum.TRUCK_3),
            },
            {
                title: TableStringEnum.INACTIVE_2,
                field: TableStringEnum.INACTIVE,
                length: truckCount.inactive,
                data: truckInactiveData,
                gridNameTitle: TableStringEnum.TRUCK_2,
                stateName: TableStringEnum.TRUCKS,
                tableConfiguration: TableStringEnum.TRUCK_3,
                isActive: this.selectedTab === TableStringEnum.INACTIVE,
                gridColumns: this.getGridColumns(TableStringEnum.TRUCK_3),
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
    private setTruckData(td: CardTableData): void {
        this.columns = td.gridColumns;

        if (td.data.length) {
            this.viewData = td.data;

            this.viewData = this.viewData.map((data) => {
                return this.mapTruckData(data);
            });

            // Set data for cards based on tab active
            this.selectedTab === TableStringEnum.ACTIVE
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
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                boldText: data?.vin
                    ? data.vin.substr(data.vin.length - 6)
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            },
            truckTypeClass: data.truckType.logoName.replace(
                TableStringEnum.SVG,
                TableStringEnum.EMPTY_STRING_PLACEHOLDER
            ),
            tabelLength: data?.truckLength?.name
                ? DataFilterHelper.getLengthNumber(data?.truckLength?.name)
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            textMake: data?.truckMake?.name
                ? data.truckMake.name
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            textModel: data?.model
                ? data.model
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            textYear: data.year
                ? data.year
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableColor: data?.color?.code
                ? data.color.code
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            colorName: data?.color?.name
                ? data.color.name
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableDriver: TableStringEnum.NA,
            tableTrailer: TableStringEnum.NA,
            tableTrailerType: TableStringEnum.NA,
            tabelOwnerDetailsName: data?.owner?.name
                ? data.owner.name
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tabelOwnerDetailsComm: data?.commission
                ? data.commission + TableStringEnum.PERCENTS
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            textWeightGross: data?.truckGrossWeight?.name
                ? data.truckGrossWeight.name
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            textWeightEmpty: data?.emptyWeight
                ? this.thousandSeparator.transform(data.emptyWeight) +
                  TableStringEnum.POUNDS_2
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tabelEngineModel: data?.truckEngineModel?.name
                ? data.truckEngineModel.name
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tabelEngineOilType: data?.engineOilType?.name
                ? data.engineOilType.name
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tabelTransmissionModel: data?.transmissionModel
                ? data.transmissionModel
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tabelTransmissionShifter: data?.shifter?.name
                ? data.shifter.name
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tabelTransmissionRatio: data?.gearRatio?.name
                ? data.gearRatio.name
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tabelFuelDetailsFuelType: data?.fuelType?.name
                ? data.fuelType.name
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tabelFuelDetailsTank: data?.fuelTankSize
                ? this.thousandSeparator.transform(data.fuelTankSize)
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tabelAxle: data?.axles
                ? data.axles
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tabelBrakes: data?.brakes?.name
                ? data.brakes.name
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableTireSize: data?.tireSize?.name
                ? data.tireSize.name
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableWheelCompositionFront: data?.frontWheels?.name
                ? data.frontWheels.name
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableWheelCompositionRear: data?.rearWheels?.name
                ? data.rearWheels.name
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableAPUnit: data?.apUnit?.name
                ? data.apUnit.name
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableFeatures: `${
                data?.doubleBunk
                    ? TableStringEnum.DBUNK
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER
            }${
                data?.refrigerator
                    ? TableStringEnum.FRIDGE
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER
            }${
                data?.dcInverter
                    ? TableStringEnum.DCI
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER
            }${
                data?.blower
                    ? TableStringEnum.BLOWER
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER
            }${
                data?.pto
                    ? TableStringEnum.PTO
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER
            }`,
            tableTollDeviceTransponder: data?.tollTransponder?.name
                ? data.tollTransponder.name
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableTollDeviceNo: data?.tollTransponderDeviceNo
                ? data.tollTransponderDeviceNo
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableInsPolicy: data?.insurancePolicy
                ? data.insurancePolicy
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableMileage: data?.mileage
                ? this.thousandSeparator.transform(data.mileage) +
                  TableStringEnum.MILES_2
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableLicencePlateDetailNumber: data?.licensePlate
                ? data.licensePlate
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableLicencePlateDetailST: TableStringEnum.NA,
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
                ? data.fhwaExp + TableStringEnum.MONTHS
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
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
            tableTitleNumber: TableStringEnum.NA,
            tableTitleST: TableStringEnum.NA,
            tableTitleIssued: TableStringEnum.NA,
            tableTitlePurchase: TableStringEnum.NA,
            tablePurchasePrice: data?.purchasePrice
                ? TableStringEnum.DOLLAR_SIGN +
                  this.thousandSeparator.transform(data.purchasePrice)
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tablePurchaseDate: data.purchaseDate
                ? this.datePipe.transform(
                      data.purchaseDate,
                      TableStringEnum.DATE_FORMAT
                  )
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,

            tableTerminated: TableStringEnum.NA,
            tableAdded: data.createdAt
                ? this.datePipe.transform(
                      data.createdAt,
                      TableStringEnum.DATE_FORMAT
                  )
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableEdited: data.updatedAt
                ? this.datePipe.transform(
                      data.updatedAt,
                      TableStringEnum.DATE_FORMAT
                  )
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
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
                title: TableStringEnum.EDIT_2,
                name: TableStringEnum.EDIT_TRUCK,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Edit.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                hasBorder: true,
                svgClass: TableStringEnum.REGULAR,
            },
            {
                title: TableStringEnum.VIEW_DETAILS_2,
                name: TableStringEnum.VIEW_DETAILS,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Information.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.REGULAR,
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
            },
            {
                title: TableStringEnum.ADD_NEW_2,
                name: TableStringEnum.ADD_NEW,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Show More.svg',
                svgStyle: {
                    width: 15,
                    height: 15,
                },
                svgClass: TableStringEnum.REGULAR,
                isDropdown: true,
                insideDropdownContent: [
                    {
                        title: TableStringEnum.REGISTRATION,
                        name: TableStringEnum.ADD_REGISTRATION,
                    },
                    {
                        title: TableStringEnum.INSPECTION,
                        name: TableStringEnum.ADD_INSPECTION,
                    },
                    {
                        title: TableStringEnum.TITLE,
                        name: TableStringEnum.ADD_REPAIR,
                    },
                ],
                hasBorder: true,
            },
            {
                title:
                    this.selectedTab === TableStringEnum.ACTIVE
                        ? TableStringEnum.DEACTIVATE_2
                        : TableStringEnum.ACTIVATE_2,
                name: TableStringEnum.ACTIVATE_ITEM,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Deactivate.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass:
                    this.selectedTab === TableStringEnum.ACTIVE
                        ? TableStringEnum.DEACTIVATE
                        : TableStringEnum.ACTIVATE,
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
            },
            {
                title: TableStringEnum.DELETE_2,
                name: TableStringEnum.DELETE_ITEM,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Delete.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.DELETE,
            },
        ];
    }

    private updateDataCount(): void {
        const truckCount = JSON.parse(
            localStorage.getItem(TableStringEnum.TRUCK_TABLE_COUNT)
        );

        const updatedTableData = [...this.tableData];

        updatedTableData[0].length = truckCount.active;
        updatedTableData[1].length = truckCount.inactive;

        this.tableData = [...updatedTableData];
    }

    private getTabData(dataType: string): TruckActiveState[] {
        if (dataType === TableStringEnum.ACTIVE) {
            this.trucksActive = this.truckActiveQuery.getAll();

            return this.trucksActive?.length ? this.trucksActive : [];
        } else if (dataType === TableStringEnum.INACTIVE) {
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

    public onToolBarAction(event: TableToolbarActions): void {
        // Open Modal
        if (event.action === TableStringEnum.OPEN_MODAL) {
            this.modalService.openModal(TruckModalComponent, {
                size: TableStringEnum.SMALL,
            });
        }
        // Select Tab
        else if (event.action === TableStringEnum.TAB_SELECTED) {
            this.selectedTab = event.tabData.field;

            this.backFilterQuery.pageIndex = 1;

            this.backFilterQuery.active =
                this.selectedTab === TableStringEnum.ACTIVE ? 1 : 0;

            if (
                this.selectedTab === TableStringEnum.INACTIVE &&
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
        else if (event.action === TableStringEnum.VIEW_MODE) {
            this.activeViewMode = event.mode;
        } else if (event.action === TableStringEnum.ACTIVATE_ITEM) {
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
                { size: TableStringEnum.SMALL },
                {
                    data: null,
                    array: mappedEvent,
                    template: TableStringEnum.TRUCK,
                    type: status
                        ? TableStringEnum.DEACTIVATE
                        : TableStringEnum.ACTIVATE,
                    svg: true,
                }
            );
        }
    }

    public onTableHeadActions(event: {
        action: string;
        direction: string;
    }): void {
        if (event.action === TableStringEnum.SORT) {
            if (event.direction) {
                this.backFilterQuery.active =
                    this.selectedTab === TableStringEnum.ACTIVE ? 1 : 0;
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
            case TableStringEnum.SHOW_MORE: {
                this.backFilterQuery.active =
                    this.selectedTab === TableStringEnum.ACTIVE ? 1 : 0;
                this.backFilterQuery.pageIndex++;
                this.truckBackFilter(this.backFilterQuery, true);
                break;
            }
            case TableStringEnum.EDIT_TRUCK: {
                this.modalService.openModal(
                    TruckModalComponent,
                    { size: TableStringEnum.SMALL },
                    {
                        ...event,
                        type: TableStringEnum.EDIT,
                        disableButton: true,
                        tabSelected: this.selectedTab,
                    }
                );
                break;
            }
            case TableStringEnum.ADD_REGISTRATION: {
                this.modalService.openModal(
                    TtRegistrationModalComponent,
                    { size: TableStringEnum.SMALL },
                    {
                        ...event,
                        modal: TableStringEnum.TRUCK,
                        tabSelected: this.selectedTab,
                    }
                );
                break;
            }

            case TableStringEnum.ADD_INSPECTION: {
                this.modalService.openModal(
                    TtFhwaInspectionModalComponent,
                    { size: TableStringEnum.SMALL },
                    {
                        ...event,
                        modal: TableStringEnum.TRUCK,
                        tabSelected: this.selectedTab,
                    }
                );
                break;
            }
            case TableStringEnum.VIEW_DETAILS: {
                this.router.navigate([`/list/truck/${event.id}/details`]);
                break;
            }
            case TableStringEnum.ADD_REPAIR: {
                this.modalService.openModal(
                    TtTitleModalComponent,
                    { size: TableStringEnum.SMALL },
                    {
                        ...event,
                        modal: TableStringEnum.TRUCK,
                        tabSelected: this.selectedTab,
                    }
                );
                break;
            }
            case TableStringEnum.ACTIVATE_ITEM: {
                this.modalService.openModal(
                    ConfirmationModalComponent,
                    { size: TableStringEnum.SMALL },
                    {
                        ...mappedEvent,
                        template: TableStringEnum.TRUCK,
                        type:
                            event.data.status === 1
                                ? TableStringEnum.DEACTIVATE
                                : TableStringEnum.ACTIVATE,
                        svg: true,
                    }
                );
                break;
            }
            case TableStringEnum.DELETE_ITEM: {
                this.modalService.openModal(
                    ConfirmationModalComponent,
                    { size: TableStringEnum.SMALL },
                    {
                        ...mappedEvent,
                        template: TableStringEnum.TRUCK,
                        type: TableStringEnum.DELETE,
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
            type: TableStringEnum.SHOW_MORE,
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
                            truck.actionAnimation = TableStringEnum.DELETE;
                        }

                        return truck;
                    });

                    this.updateDataCount();

                    const inetval = setInterval(() => {
                        this.viewData =
                            MethodsGlobalHelper.closeAnimationAction(
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
                                TableStringEnum.DELETE_MULTIPLE;
                        }
                    });

                    return truck;
                });

                this.updateDataCount();
                const inetval = setInterval(() => {
                    this.viewData = MethodsGlobalHelper.closeAnimationAction(
                        true,
                        this.viewData
                    );

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
        //     document.querySelector(TableStringEnum.TABLE_CONTAINER)
        // );
        this.resizeObserver.disconnect();
    }
}
