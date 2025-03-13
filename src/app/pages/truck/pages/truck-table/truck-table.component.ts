import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, skip, Subject, takeUntil } from 'rxjs';

// components
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';
import { TruckModalComponent } from '@pages/truck/pages/truck-modal/truck-modal.component';
import { ConfirmationActivationModalComponent } from '@shared/components/ta-shared-modals/confirmation-activation-modal/confirmation-activation-modal.component';

// base classes
import { TruckDropdownMenuActionsBase } from '@pages/truck/base-classes';

// settings
import { getTruckColumnDefinition } from '@shared/utils/settings/table-settings/truck-columns';

// services
import { TruckService } from '@shared/services/truck.service';
import { ModalService } from '@shared/services/modal.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { ConfirmationActivationService } from '@shared/components/ta-shared-modals/confirmation-activation-modal/services/confirmation-activation.service';
import { CaSearchMultipleStatesService } from 'ca-components';
import { TruckCardsModalService } from '@pages/truck/pages/truck-card-modal/service/truck-cards-modal.service';
import { DetailsDataService } from '@shared/services/details-data.service';

// store
import { TruckActiveQuery } from '@pages/truck/state/truck-active-state/truck-active.query';
import { TruckInactiveQuery } from '@pages/truck/state/truck-inactive-state/truck-inactive.query';
import {
    TruckActiveState,
    TruckActiveStore,
} from '@pages/truck/state/truck-active-state/truck-active.store';
import { TruckInactiveState } from '@pages/truck/state/truck-inactive-state/truck-inactive.store';
import { TruckInactiveStore } from '@pages/truck/state/truck-inactive-state/truck-inactive.store';
import { select, Store } from '@ngrx/store';
import {
    selectActiveTabCards,
    selectInactiveTabCards,
} from '@pages/truck/pages/truck-card-modal/state/truck-card-modal.selectors';

// pipes
import { DatePipe } from '@angular/common';
import { ThousandSeparatorPipe } from '@shared/pipes/thousand-separator.pipe';

// enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { TruckNameStringEnum } from '@shared/enums/truck-name-string.enum';
import { TooltipColorsStringEnum } from '@shared/enums/tooltip-colors-string.enum';
import { DropdownMenuStringEnum } from '@shared/enums';

// constants
import { TruckCardDataConstants } from '@pages/truck/pages/truck-table/utils/constants/truck-card-data.constants';
import { TableDropdownComponentConstants } from '@shared/utils/constants/table-dropdown-component.constants';
import { TruckCardsModalConfig } from '@pages/truck/pages/truck-card-modal/utils/constants/truck-cards-modal.config';

// helpers
import { DataFilterHelper } from '@shared/utils/helpers/data-filter.helper';
import { MethodsGlobalHelper } from '@shared/utils/helpers/methods-global.helper';
import { TruckFeaturesDataHelper } from '@pages/truck/pages/truck-table/utils/helpers/truck-features-data.helper';
import { DropdownMenuContentHelper } from '@shared/utils/helpers';

// models
import { CardRows } from '@shared/models/card-models/card-rows.model';
import { CardTableData } from '@shared/models/table-models/card-table-data.model';
import { TableColumnConfig } from '@shared/models/table-models/table-column-config.model';
import { TruckFilter } from '@pages/truck/pages/truck-table/models/truck-filter.model';
import { TableToolbarActions } from '@shared/models/table-models/table-toolbar-actions.model';
import { IDropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/interfaces';

@Component({
    selector: 'app-truck-table',
    templateUrl: './truck-table.component.html',
    styleUrls: ['./truck-table.component.scss'],
    providers: [ThousandSeparatorPipe],
})
export class TruckTableComponent
    extends TruckDropdownMenuActionsBase
    implements OnInit, AfterViewInit, OnDestroy
{
    public destroy$ = new Subject<void>();

    public dropdownMenuStringEnum = DropdownMenuStringEnum;

    public resizeObserver: ResizeObserver;
    public activeViewMode: string = TableStringEnum.LIST;

    public selectedTab: string = TableStringEnum.ACTIVE;

    public trucksActive: TruckActiveState[] = [];
    public trucksInactive: TruckInactiveState[] = [];

    public truckData: any[] = [];

    public loadingPage: boolean = false;
    public inactiveTabClicked: boolean = false;
    public activeTableData: string;

    // table
    public tableOptions: any = {};
    public tableData: any[] = [];
    public viewData: any[] = [];
    public columns: TableColumnConfig[] = [];

    // cards
    public displayRowsFront: CardRows[] =
        TruckCardDataConstants.displayRowsFrontActive;
    public displayRowsBack: CardRows[] =
        TruckCardsModalConfig.displayRowsBackActive;
    public displayRowsFrontActive: CardRows[] =
        TruckCardDataConstants.displayRowsFrontActive;
    public displayRowsBackActive: CardRows[] =
        TruckCardDataConstants.displayRowsBackActive;

    public displayRowsFrontInactive: CardRows[] =
        TruckCardDataConstants.displayRowsFrontInactive;
    public displayRowsBackInactive: CardRows[] =
        TruckCardDataConstants.displayRowsBackInactive;

    public sendDataToCardsFront: CardRows[];
    public sendDataToCardsBack: CardRows[];

    public displayRows$: Observable<any>;

    // filters
    public backFilterQuery: TruckFilter = JSON.parse(
        JSON.stringify(TableDropdownComponentConstants.BACK_FILTER_QUERY)
    );

    constructor(
        protected router: Router,

        // services
        protected modalService: ModalService,

        private tableService: TruckassistTableService,
        private truckService: TruckService,
        private confirmationService: ConfirmationService,
        private truckCardsModalService: TruckCardsModalService,
        private confirmationActivationService: ConfirmationActivationService,
        private caSearchMultipleStatesService: CaSearchMultipleStatesService,
        private detailsDataService: DetailsDataService,

        // Store
        private truckActiveQuery: TruckActiveQuery,
        private truckInactiveQuery: TruckInactiveQuery,
        private truckInactiveStore: TruckInactiveStore,
        private truckActiveStore: TruckActiveStore,
        private store: Store,

        // Pipes
        private thousandSeparator: ThousandSeparatorPipe,
        private datePipe: DatePipe
    ) {
        super();
    }

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
        this.truckCardsModalService.updateTab(this.selectedTab);
    }

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

        this.confirmationActivationService.getConfirmationActivationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) {
                    if (!res.array) {
                        this.detailsDataService.setNewData(res.data);
                        this.changeTruckStatus(res.data.id);
                    } else {
                        res.array.map((truck) => {
                            this.detailsDataService.setNewData(truck);
                            this.changeTruckStatus(truck.id);
                        });
                    }
                }
            });
    }

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
            .pipe(skip(1), takeUntil(this.destroy$))
            .subscribe((res) => { 
                if (res?.filterType) {
                    this.backFilterQuery.truckType = res.selectedIds;
                    this.truckBackFilter(this.backFilterQuery);
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
                    this.updateDataCount();
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
        this.caSearchMultipleStatesService.selectedChips$
            .pipe(skip(1), takeUntil(this.destroy$))
            .subscribe((res) => {
                this.backFilterQuery.searchOne = res[0] ?? null;
                this.backFilterQuery.searchTwo = res[1] ?? null;
                this.backFilterQuery.searchThree = res[2] ?? null;
                this.truckBackFilter(this.backFilterQuery);
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
                showTruckTypeFilter: true,
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
            this.backFilterQuery.active =
                this.selectedTab === TableStringEnum.ACTIVE ? 1 : 0;
            this.activeViewMode = tableView.viewMode;
            this.detailsDataService.setActivation(
                !!!this.backFilterQuery.active
            );
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
        this.updateCardView();
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

    // TODO any type
    private mapTruckData(data: any): any {
        const {
            id,
            axles,
            color,
            createdAt,
            emptyWeight,
            fhwaExp,
            fileCount,
            inspectionExpirationDays,
            inspectionPercentage,
            insurancePolicy,
            licensePlate,
            mileage,
            model,
            note,
            owner,
            purchaseDate,
            purchasePrice,
            registrationExpirationDays,
            updatedAt,
            registrationPercentage,
            status,
            tireSize,
            trailerNumber,
            vin,
            files,
            year,
            brakes,
            commission,
            driver,
            driverAvatar,
            engineOilType,
            frontWheels,
            fuelTankSize,
            fuelType,
            gearRatio,
            rearWheels,
            shifter,
            titleIssueDate,
            titleNumber,
            titlePurchaseDate,
            titleState,
            tollTransponder,
            tollTransponderDeviceNo,
            transmissionModel,
            truckEngineModel,
            truckLength,
            truckMake,
            truckNumber,
            truckType,
            apUnit,
            truckGrossWeight,
            wheelBase,
            driverAvatarFile,
            deactivatedAt,
        } = data;

        return {
            id,
            status,
            truckNumber,
            year,
            note,
            truckTypeIcon: truckType.logoName,
            tableTruckName: truckType.name,
            tableTruckColor: this.setTruckTooltipColor(truckType.name),
            tableVin: {
                regularText: vin
                    ? vin.substr(0, vin.length - 6)
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                boldText: vin
                    ? vin.substr(vin.length - 6)
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            },
            truckTypeClass: truckType.name
                .trim()
                .replace(' ', TableStringEnum.EMPTY_STRING_PLACEHOLDER)
                .toLowerCase(),
            tabelLength: truckLength?.name
                ? DataFilterHelper.getLengthNumber(truckLength?.name)
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            textMake: truckMake?.name,
            textModel: model,
            textYear: year,
            tableColor: color?.code,
            colorName: color?.name,
            color: color,
            wheelBase: wheelBase,
            tableDriver: driver
                ? driverAvatar
                    ? driverAvatar + driver
                    : driver
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableDriverAvatar: driverAvatarFile?.url,
            tableTrailer: trailerNumber,
            tabelOwnerDetailsName: owner?.name,
            tabelOwnerDetailsComm: commission
                ? commission + TableStringEnum.PERCENTS
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            textWeightGross: truckGrossWeight?.name,
            textWeightEmpty: emptyWeight
                ? this.thousandSeparator.transform(emptyWeight) +
                  TableStringEnum.POUNDS_2
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tabelEngineModel: truckEngineModel?.name,
            tabelEngineOilType: engineOilType?.name,
            tabelTransmissionModel: transmissionModel,
            tabelTransmissionShifter: shifter?.name,
            tabelTransmissionRatio: gearRatio?.name,
            tabelFuelDetailsFuelType: fuelType?.name,
            tabelFuelDetailsTank: fuelTankSize
                ? this.thousandSeparator.transform(fuelTankSize)
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tabelAxle: axles,
            tabelBrakes: brakes?.name,
            tableTireSize: tireSize?.name,
            tableWheelCompositionFront: frontWheels?.name,
            tableWheelCompositionRear: rearWheels?.name,
            tableAPUnit: apUnit?.name,
            tableFeatures: TruckFeaturesDataHelper.truckFeaturesData(data),
            tableTollDeviceTransponder: tollTransponder?.name,
            tableTollDeviceNo: tollTransponderDeviceNo,
            tableInsPolicy: insurancePolicy,
            tableMileage: mileage
                ? this.thousandSeparator.transform(mileage) +
                  TableStringEnum.MILES_2
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableLicencePlateDetailNumber: licensePlate,
            tableLicencePlateDetailST: TableStringEnum.NA,
            tableLicencePlateDetailExpiration: {
                expirationDays: registrationExpirationDays
                    ? registrationExpirationDays
                    : null,
                expirationDaysText: registrationExpirationDays
                    ? this.thousandSeparator.transform(
                          registrationExpirationDays
                      )
                    : null,
                percentage:
                    registrationPercentage || registrationPercentage === 0
                        ? 100 - registrationPercentage
                        : null,
            },
            tableFhwaInspectionTerm: fhwaExp
                ? fhwaExp + TableStringEnum.MONTHS
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableFhwaInspectionExpiration: {
                expirationDays: inspectionExpirationDays
                    ? inspectionExpirationDays
                    : null,
                expirationDaysText: inspectionExpirationDays
                    ? this.thousandSeparator.transform(inspectionExpirationDays)
                    : null,
                percentage:
                    inspectionPercentage || inspectionPercentage === 0
                        ? 100 - inspectionPercentage
                        : null,
            },
            tableTitleNumber: titleNumber,
            tableTitleST: titleState,
            tableTitleIssued: titleIssueDate
                ? this.datePipe.transform(
                      titlePurchaseDate,
                      TableStringEnum.DATE_FORMAT
                  )
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableTitlePurchase: titlePurchaseDate
                ? this.datePipe.transform(
                      titlePurchaseDate,
                      TableStringEnum.DATE_FORMAT
                  )
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tablePurchasePrice: purchasePrice
                ? TableStringEnum.DOLLAR_SIGN +
                  this.thousandSeparator.transform(purchasePrice)
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tablePurchaseDate: purchaseDate
                ? this.datePipe.transform(
                      purchaseDate,
                      TableStringEnum.DATE_FORMAT
                  )
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,

            tableTerminated: TableStringEnum.NA,
            tableAdded: createdAt
                ? this.datePipe.transform(
                      createdAt,
                      TableStringEnum.DATE_FORMAT
                  )
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableEdited: updatedAt
                ? this.datePipe.transform(
                      updatedAt,
                      TableStringEnum.DATE_FORMAT
                  )
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableDeactivated: deactivatedAt
                ? this.datePipe.transform(
                      updatedAt,
                      TableStringEnum.DATE_FORMAT
                  )
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableAttachments: files ? files : [],
            fileCount: fileCount,
            tableDropdownContent: this.getTruckDropdownContent(),
            createdAt,
            updatedAt,
        };
    }

    private getTruckDropdownContent(): IDropdownMenuItem[] {
        return DropdownMenuContentHelper.getTruckTrailerDropdownContent(
            this.selectedTab
        );
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
            truckType?: number[] | undefined;
            pageIndex: number;
            pageSize: number;
            companyId: number | undefined;
            sort: string | undefined;
            searchOne: string | undefined;
            searchTwo: string | undefined;
            searchThree: string | undefined;
        },
        isShowMore?: boolean,
        updateTruckTable?: boolean
    ): void {
        this.truckService
            .getTruckList(
                filter.active,
                filter.truckType,
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
                    this.truckInactiveStore.set(this.viewData);
                    this.truckActiveStore.set(this.viewData);
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
                this.tableService.sendSelectOrDeselect(
                    TableStringEnum.DESELECT
                );

                if (updateTruckTable) this.sendTruckData();
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
            this.backFilterQuery.sort = null;

            this.backFilterQuery.active =
                this.selectedTab === TableStringEnum.ACTIVE ? 1 : 0;

            this.caSearchMultipleStatesService.deleteAllChips();
            if (
                this.selectedTab === TableStringEnum.INACTIVE &&
                !this.inactiveTabClicked
            ) {
                this.truckBackFilter(this.backFilterQuery, false, true);
            } else {
                this.sendTruckData();
            }

            // on tab change we need to reset chips and truck type filters
            this.truckService.updateTableFilters();
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
                                avatarFile: {
                                    url: data?.truckTypeIcon
                                        ? `/assets/svg/common/trucks/${data?.truckTypeIcon}`
                                        : `/assets/svg/common/trucks/${data?.truckType?.logoName}`,
                                },
                            },
                            modalTitle: data.truckNumber,
                            modalSecondTitle: data?.tableVin
                                ? data?.tableVin?.regularText +
                                  data?.tableVin?.boldText
                                : data?.vin,
                        });
                    }
                });
            });
            this.modalService.openModal(
                ConfirmationActivationModalComponent,
                { size: TableStringEnum.SMALL },
                {
                    data: null,
                    array: mappedEvent,
                    template: TableStringEnum.TRUCK,
                    subType: TableStringEnum.TRUCKS,
                    type: status
                        ? TableStringEnum.DEACTIVATE
                        : TableStringEnum.ACTIVATE,
                    tableType: TableStringEnum.TRUCK,
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
            this.backFilterQuery.sort = event.direction ?? null;
            this.backFilterQuery.active =
                this.selectedTab === TableStringEnum.ACTIVE ? 1 : 0;
            this.backFilterQuery.pageIndex = 1;
            this.truckBackFilter(this.backFilterQuery);
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

    public handleShowMoreAction(): void {
        this.backFilterQuery.active =
            this.selectedTab === DropdownMenuStringEnum.ACTIVE ? 1 : 0;

        this.backFilterQuery.pageIndex++;

        this.truckBackFilter(this.backFilterQuery, true);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.tableService.sendActionAnimation({});
        this.resizeObserver.disconnect();
    }
}
