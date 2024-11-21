import {
    Component,
    OnInit,
    ViewChild,
    OnDestroy,
    ChangeDetectorRef,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { AfterViewInit } from '@angular/core';

//Rxjs
import { combineLatest, Observable, of, Subject, switchMap, takeUntil } from 'rxjs';

//Components
import { FuelPurchaseModalComponent } from '@pages/fuel/pages/fuel-modals/fuel-purchase-modal/fuel-purchase-modal.component';
import { FuelStopModalComponent } from '@pages/fuel/pages/fuel-modals/fuel-stop-modal/fuel-stop-modal.component';
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';

//Services
import { ModalService } from '@shared/services/modal.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { PayrollService } from '@pages/accounting/pages/payroll/services/payroll.service';

//Utils
import {
    getFuelStopColumnDefinition,
    getFuelTransactionColumnDefinition,
} from '@shared/utils/settings/table-settings/accounting-fuel-columns';
import { TableDropdownComponentConstants } from '@shared/utils/constants/table-dropdown-component.constants';
import { FuelTableConstants } from '@pages/fuel/pages/fuel-table/utils/constants/fuel-table.constants';
import { FuelTableSvgRoutes } from '@pages/fuel/pages/fuel-table/utils/svg-routes/fuel-table-svg-routes';

//Pipes
import { ThousandSeparatorPipe, NameInitialsPipe, ActivityTimePipe } from '@shared/pipes';

//Helpers
import { DataFilterHelper } from '@shared/utils/helpers/data-filter.helper';
import { MethodsGlobalHelper } from '@shared/utils/helpers/methods-global.helper';
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

//Models
import {
    FuelStopListResponse,
    FuelTransactionResponse,
} from 'appcoretruckassist';
import { FuelTransactionListResponse } from 'appcoretruckassist';
import { TableColumnConfig } from '@shared/models/table-models/table-column-config.model';
import { DropdownItem } from '@shared/models/card-models/card-table-data.model';
import { IFuelTableData } from '@pages/fuel/pages/fuel-table/models/fuel-table-data.model';
import { AvatarColors } from '@pages/driver/pages/driver-table/models/avatar-colors.model';
import { SortTypes } from '@shared/models/sort-types.model';

//Store
import { FuelQuery } from '@pages/fuel/state/fuel-state/fuel-state.query';
import { select, Store } from '@ngrx/store';
import { selectActiveTabCards, selectInactiveTabCards } from '@pages/fuel/pages/fuel-card-modal/state';

//Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { eFuelTransactionType } from '@pages/fuel/pages/fuel-table/enums';
import { eProgressRangeUnit } from '@shared/components/ta-progress-range/enums';

//Services
import { FuelService } from '@shared/services/fuel.service';
import { FuelCardsModalService } from '@pages/fuel/pages/fuel-card-modal/services/fuel-cards-modal.service';

//Helpers
import { AvatarColorsHelper } from '@shared/utils/helpers/avatar-colors.helper';
import { ConfirmationModalStringEnum } from '@shared/components/ta-shared-modals/confirmation-modal/enums/confirmation-modal-string.enum';

@Component({
    selector: 'app-fuel-table',
    templateUrl: './fuel-table.component.html',
    styleUrls: [
        './fuel-table.component.scss',
        '../../../../../assets/scss/maps.scss',
    ],
    providers: [ThousandSeparatorPipe, NameInitialsPipe, ActivityTimePipe],
})
export class FuelTableComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('mapsComponent', { static: false }) public mapsComponent: any;

    public fuelTableData: any[] = [];
    public tableOptions: any = {};
    public tableData: any[] = [];
    public viewData: any[] = [];
    public columns: TableColumnConfig[] = [];
    public selectedTab: string;
    public activeViewMode: string = TableStringEnum.LIST;

    public sortTypes: SortTypes[] = [];
    public sortDirection: string = TableStringEnum.ASC;
    public activeSortType: SortTypes;
    public sortBy: string;
    public searchValue: string = TableStringEnum.EMPTY_STRING_PLACEHOLDER;
    public locationFilterOn: boolean = false;

    public fuelPriceColors: string[] =
        TableDropdownComponentConstants.FUEL_PRICE_COLORS;

    public fuelPriceHoverColors: string[] =
        TableDropdownComponentConstants.FUEL_PRICE_HOVER_COLORS;

    public resizeObserver: ResizeObserver;
    public fuelData: IFuelTableData;

    public mapListData = [];

    private destroy$ = new Subject<void>();
    private avatarColorMappingIndexByDriverId: { [key: string]: AvatarColors } =
        {} as { [key: string]: AvatarColors };

    public displayRows$: Observable<any>; //leave this as any for now

    constructor(
        private modalService: ModalService,
        private tableService: TruckassistTableService,
        private thousandSeparator: ThousandSeparatorPipe,
        public datePipe: DatePipe,
        private fuelQuery: FuelQuery,
        private ref: ChangeDetectorRef,
        private confiramtionService: ConfirmationService,
        private fuelService: FuelService,
        private nameInitialsPipe: NameInitialsPipe,
        private activityTimePipe: ActivityTimePipe,
        private payrollService: PayrollService,

        // services
        private fuelCardsModalService: FuelCardsModalService,

        // store
        private store: Store,
    ) {}

    //-------------------------------NG ON INIT-------------------------------
    ngOnInit(): void {
        this.setActiveTab();

        this.manageSubscriptions();

        this.resetColumns();

        this.resize();

        this.toggleColumns();

        this.confiramtionSubscribe();

        this.deleteSelectedRows();

        this.fuelActions();

        this.sorting();

        // Map
        this.sortTypes = TableDropdownComponentConstants.SORT_TYPES;

        this.activeSortType = this.sortTypes[0];
    }

    //-------------------------------NG AFTER INIT-------------------------------
    ngAfterViewInit(): void {
        setTimeout(() => {
            this.observTableContainer();
        }, 10);
    }

    private sorting(): void {
        this.sortBy = this.sortDirection
            ? this.activeSortType?.sortName +
              (this.sortDirection[0]?.toUpperCase() +
                  this.sortDirection?.substr(1).toLowerCase())
            : TableStringEnum.EMPTY_STRING_PLACEHOLDER;
    }

    // Reset Columns
    private resetColumns(): void {
        this.tableService.currentResetColumns
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: boolean) => {
                if (response) {
                    this.sendFuelData();
                }
            });
    }

    // Resize
    private resize(): void {
        this.tableService.currentColumnWidth
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: any) => {
                if (response?.event?.width) {
                    this.columns = this.columns.map((c) => {
                        if (
                            c.title ===
                            response.columns[response.event.index].title
                        ) {
                            c.width = response.event.width;
                        }

                        return c;
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

    private deleteSelectedRows(): void {
        this.tableService.currentDeleteSelectedRows
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
                if (response.length) {
                    const mappedRes = response.map((item) => {
                        return {
                            id: item.id,
                            data: {
                                ...item.tableData,
                                date: MethodsCalculationsHelper.convertDateFromBackend(
                                    item.tableData.transactionDate
                                ),
                                time: MethodsCalculationsHelper.convertDateToTimeFromBackend(
                                    item.tableData.transactionDate,
                                    true
                                ),
                            },
                        };
                    });
                    this.modalService.openModal(
                        ConfirmationModalComponent,
                        { size: TableStringEnum.SMALL },
                        {
                            data: null,
                            array: mappedRes,
                            template: TableStringEnum.FUEL_TRANSACTION_TEXT,
                            type: TableStringEnum.MULTIPLE_DELETE,
                            svg: true,
                        }
                    );
                }
            });
    }

    private confiramtionSubscribe(): void {
        this.confiramtionService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res) => {
                    switch (res.type) {
                        case TableStringEnum.DELETE:
                            if (res.template === TableStringEnum.FUEL_1) {
                                // this.deletFuelTransactionById();
                                this.deleteFuelTransactionList([res.id])
                            } else {
                                /*  this.deletFuelTransactionById() */
                            }

                            break;
                        case TableStringEnum.MULTIPLE_DELETE:
                            if (res.template === TableStringEnum.FUEL_STOP_2) {
                                /*      this.deleteFuelStopList(res.id); */
                            } else {
                                this.deleteFuelTransactionList(res.array);
                            }

                            break;
                        default:
                            break;
                    }
                },
            });
    }

    private deleteFuelStopById(fuelStopId: number) {
        this.fuelService
            .deleteFuelStopById(fuelStopId)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    private deleteFuelStopList(fuelStopIds: number[]) {
        this.fuelService
            .deleteFuelStopList(fuelStopIds)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    private deletFuelTransactionById() {
    }

    private deleteFuelTransactionList(ids: number[]): void {
        this.fuelService
            .deleteFuelTransactionsList(ids)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.viewData = this.viewData.map((fuel) => {
                    ids.map((id) => {
                        if (fuel.id === id)
                            fuel.actionAnimation =
                                TableStringEnum.DELETE_MULTIPLE;
                    });

                    return fuel;
                });

                this.updateDataCount();

                const interval = setInterval(() => {
                    this.viewData = MethodsGlobalHelper.closeAnimationAction(
                        true,
                        this.viewData
                    );
                    this.tableData[0].data = this.viewData;

                    clearInterval(interval);
                }, 900);

                this.tableService.sendRowsSelected([]);
                this.tableService.sendResetSelectedColumns(true);
            });
    }

    private updateDataCount(): void {
        const fuelCount = JSON.parse(
            localStorage.getItem(TableStringEnum.FUEL_TABLE_COUNT)
        );

        const updatedTableData = [...this.tableData];

        updatedTableData[0].length = fuelCount.fuelTransactions;

        this.tableData = [...updatedTableData];
    }

    // Fuel Actions
    private fuelActions(): void {
        this.tableService.currentActionAnimation
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
                // On Add Driver Active
                if (
                    res?.animation === TableStringEnum.ADD &&
                    this.selectedTab === TableStringEnum.FUEL_TRANSACTION
                ) {
                }

                // On Add Driver Inactive
                else if (
                    res?.animation === TableStringEnum.ADD &&
                    this.selectedTab === TableStringEnum.FUEL_STOP
                ) {
                }

                // On Update Driver
                else if (res?.animation === TableStringEnum.UPDATE) {
                }

                // On Update Driver Status
                else if (res?.animation === TableStringEnum.UPDATE_STATUS) {
                }

                // On Delete Driver
                else if (res?.animation === TableStringEnum.DELETE) {
                }
            });
    }

    observTableContainer() {
        this.resizeObserver = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                this.tableService.sendCurrentSetTableWidth(
                    entry.contentRect.width
                );
            });
        });

        this.resizeObserver.observe(document.querySelector('.table-container'));
    }

    initTableOptions(): void {
        this.tableOptions = {
            toolbarActions: {
                showTimeFilter:
                    this.selectedTab === TableStringEnum.FUEL_TRANSACTION,
                showTruckFilter:
                    this.selectedTab === TableStringEnum.FUEL_TRANSACTION,
                showFuelPermanentlyClosed:
                    this.selectedTab === TableStringEnum.FUEL_STOP,
                showLocationFilter: true,
                showFuelStopFilter:
                    this.selectedTab === TableStringEnum.FUEL_STOP,
                showMoneyFilter: true,
                fuelMoneyFilter: true,
                showCategoryFuelFilter:
                    this.selectedTab === TableStringEnum.FUEL_TRANSACTION,
                showIntegratedFuelTransactionsFilter:
                    this.selectedTab === TableStringEnum.FUEL_TRANSACTION,
                viewModeOptions: this.getViewModeOptions(),
            },
            actions: [
                {
                    title: TableStringEnum.EDIT_2,
                    name: TableStringEnum.EDIT,
                    class: TableStringEnum.REGULAR_TEXT,
                    contentType: TableStringEnum.EDIT,
                    show: true,
                    svg: FuelTableSvgRoutes.DROPDOWN_CONTENT_EDIT,
                    iconName: TableStringEnum.EDIT,
                },
                {
                    title: TableStringEnum.DELETE_2,
                    name: TableStringEnum.DELETE,
                    type: TableStringEnum.FUEL_1,
                    text: FuelTableConstants.TEXT_DELETE_FUEL_POPUP,
                    class: TableStringEnum.DELETE_TEXT,
                    contentType: TableStringEnum.DELETE,
                    show: true,
                    danger: true,
                    svg: FuelTableSvgRoutes.DROPDOWN_CONTENT_DELETE,
                    iconName: TableStringEnum.DELETE,
                    redIcon: true,
                },
            ],
        };
    }

    getViewModeOptions() {
        return this.selectedTab === TableStringEnum.FUEL_TRANSACTION
            ? [
                  {
                      name: TableStringEnum.LIST,
                      active: this.activeViewMode === TableStringEnum.LIST,
                  },
                  {
                      name: TableStringEnum.CARD,
                      active: this.activeViewMode === TableStringEnum.CARD,
                  },
              ]
            : [
                  {
                      name: TableStringEnum.LIST,
                      active: this.activeViewMode === TableStringEnum.LIST,
                  },
                  {
                      name: TableStringEnum.CARD,
                      active: this.activeViewMode === TableStringEnum.CARD,
                  },
                  {
                      name: TableStringEnum.MAP,
                      active: this.activeViewMode === TableStringEnum.MAP,
                  },
              ];
    }

    sendFuelData() {
        const { data, integratedFuelTransactionsCount } = this.fuelData;
        
        this.initTableOptions();
        this.checkActiveViewMode();

        const fuelCount = JSON.parse(
            localStorage.getItem(TableStringEnum.FUEL_TABLE_COUNT)
        );

        this.tableData = [
            {
                title: TableStringEnum.TRANSACTIONS,
                field: TableStringEnum.FUEL_TRANSACTION,
                length: fuelCount.fuelTransactions,
                data: data,
                gridNameTitle: TableStringEnum.FUEL,
                integratedDataCount: integratedFuelTransactionsCount,
                tableConfiguration: TableStringEnum.FUEL_TRANSACTION,
                isActive: this.selectedTab === TableStringEnum.FUEL_TRANSACTION,
                gridColumns: this.getGridColumns(
                    TableStringEnum.FUEL_TRANSACTION
                ),
            },
            {
                title: TableStringEnum.STOP,
                field: TableStringEnum.FUEL_STOP,
                length: fuelCount.fuelStops,
                data: data,
                gridNameTitle: TableStringEnum.FUEL,
                closedArray: DataFilterHelper.checkSpecialFilterArray(
                    data,
                    TableStringEnum.IS_CLOSED
                ),
                tableConfiguration: TableStringEnum.FUEL_STOP,
                showFuelStopFilter:
                    this.selectedTab === TableStringEnum.FUEL_STOP,
                isActive: this.selectedTab === TableStringEnum.FUEL_STOP,
                gridColumns: this.getGridColumns(TableStringEnum.FUEL_STOP),
            },
        ];

        const td = this.tableData.find((t) => t.field === this.selectedTab);
        this.setFuelData(td);
        this.updateCardView();
    }

    // Check If Selected Tab Has Active View Mode
    checkActiveViewMode() {
        if (this.activeViewMode === TableStringEnum.MAP) {
            let hasMapView = false;

            let viewModeOptions =
                this.tableOptions.toolbarActions.viewModeOptions;

            viewModeOptions.map((viewMode: any) => {
                if (viewMode.name === TableStringEnum.MAP) {
                    hasMapView = true;
                }
            });

            if (!hasMapView) {
                this.activeViewMode = TableStringEnum.LIST;

                viewModeOptions = this.getViewModeOptions();
            }

            this.tableOptions.toolbarActions.viewModeOptions = [
                ...viewModeOptions,
            ];
        }
    }

    getGridColumns(configType: string) {
        const tableColumnsConfig = JSON.parse(
            localStorage.getItem(`table-${configType}-Configuration`)
        );

        if (configType === TableStringEnum.FUEL_TRANSACTION)
            return tableColumnsConfig ?? getFuelTransactionColumnDefinition();
        else return tableColumnsConfig ?? getFuelStopColumnDefinition();
    }

    setFuelData(td: any) {
        this.columns = td.gridColumns;
        if (td.data?.length) {
            this.viewData = [...td.data];
            this.mapListData = JSON.parse(JSON.stringify(this.viewData));

            this.viewData = this.viewData.map((data) => {
                return this.selectedTab === TableStringEnum.FUEL_TRANSACTION
                    ? this.mapFuelTransactionsData(data)
                    : this.mapFuelStopsData(data);
            });
        } else {
            this.viewData = [];
        }

        this.fuelTableData = this.viewData;
    }

    private mapFuelTransactionsData(data: any) {
        const {
            driver,
            truck,
            fuelCard,
            fuelStopStore,
            transactionDate,
            fuelItems,
            total,
            fuelTransactionType,
            files,
            invoice,
        } = data || {};
        const { avatarFile, firstName, lastName, id } = driver || {};
        const { truckNumber } = truck || {};
        const { cardNumber } = fuelCard || {};
        const { businessName, address } = fuelStopStore || {};
        const { address: addressName } = address || {};
        const { url } = avatarFile || {};
        const { id: fuelTransactionTypeId } = fuelTransactionType || {};
        const driverFullName =
            firstName && lastName ? `${firstName} ${lastName}` : null;
        const tableDescriptionDropTotal = total
            ? `$ ${this.thousandSeparator.transform(total)}`
            : TableStringEnum.EMPTY_STRING_PLACEHOLDER;

        if (
            driver &&
            !avatarFile &&
            !this.avatarColorMappingIndexByDriverId[id]
        )
            this.avatarColorMappingIndexByDriverId[id] =
                AvatarColorsHelper.getAvatarColors(id);

        return {
            ...data,
            loadInvoice: { invoice: invoice },
            textDriverShortName:
                this.nameInitialsPipe.transform(driverFullName),
            avatarColor: this.avatarColorMappingIndexByDriverId[id] ?? null,
            avatarSize: FuelTableConstants.AVATAR_SIZE_PX,
            avatarFontSize: FuelTableConstants.AVATAR_FONT_SIZE_PX,
            avatarImg: url ?? null,
            avatarIsHoverEffect: FuelTableConstants.AVATAR_IS_HOVER_EFFECT,
            isSelected: false,
            tableTruckNumber:
                truckNumber ?? TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableDriverName:
                driverFullName ?? TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            TableDropdownComponentConstantsCardNumber:
                cardNumber ?? TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableTransactionDate: transactionDate
                ? this.datePipe.transform(transactionDate, 'MM/dd/yy hh:mm a')
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableTransactionTime: 'Treba da se poveze',
            tableFuelStopName:
                businessName ?? TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableLocation:
                addressName ?? TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableDescription: fuelItems ?? null,
            descriptionItems: fuelItems
                ? fuelItems.map((item) => {
                      return {
                          quantity:
                              item?.itemFuel?.qty ??
                              TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                          description:
                              item?.itemFuel?.name ??
                              TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                          descriptionPrice: item?.price
                              ? `$${this.thousandSeparator.transform(
                                    item.price
                                )}`
                              : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                          price: item?.price
                              ? `$${this.thousandSeparator.transform(
                                    item.price
                                )}`
                              : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                          descriptionTotalPrice: item?.subtotal
                              ? `$${this.thousandSeparator.transform(
                                    item.subtotal
                                )}`
                              : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                      };
                  })
                : null,
            tableQTY: 1,
            tablePPG: 1,
            tabelDescriptionDropTotal: tableDescriptionDropTotal,
            tableTotal: tableDescriptionDropTotal,
            tableAttachments: files,
            fileCount: files ? files.length : 0,
            tableDropdownContent: {
                hasContent: true,
                content: this.getDropdownOwnerContent(),
            },
            isIntegratedFuelTransaction:
                fuelTransactionTypeId !== eFuelTransactionType.Manual,
        };
    }

    private mapFuelStopsData(data: any) {
        const {
            businessName,
            store,
            address,
            pricePerGallon,
            totalCost,
            lastUsed,
            used,
            favourite,
            lowestPricePerGallon,
            highestPricePerGallon
        } = data || {};
        const { address: addressName } = address || {};
        const tablePriceRange = 
            lowestPricePerGallon && highestPricePerGallon 
            ? (lowestPricePerGallon === highestPricePerGallon) 
                ? `$${lowestPricePerGallon}`
                : `$${lowestPricePerGallon} - $${highestPricePerGallon}` 
            : TableStringEnum.EMPTY_STRING_PLACEHOLDER;
        const tableExpense = totalCost ? `$${totalCost}` : TableStringEnum.EMPTY_STRING_PLACEHOLDER;
        const tableLast = {
            startRange: lowestPricePerGallon ?? null,
            endRange: highestPricePerGallon ?? null,
            value: pricePerGallon ?? null,
            unit: eProgressRangeUnit.Dollar,
            lastUsed: lastUsed
        };
        const tableLastVisit = lastUsed ? this.activityTimePipe.transform(lastUsed) : TableStringEnum.EMPTY_STRING_PLACEHOLDER

        return {
            ...data,
            isSelected: false,
            tableName: businessName ?? TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableStore: store ?? TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableAddress:
                addressName ?? TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tablePPG:
                pricePerGallon ?? TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableLast: tableLast ?? TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableLastVisit: tableLastVisit,
            tableUsed: used ?? TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tablePriceRange: tablePriceRange,
            tableExpense: tableExpense,
            tableProgressRangeStart: lowestPricePerGallon ?? TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableProgressRangeEnd: highestPricePerGallon ?? TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableProgressRangeValue: pricePerGallon ?? TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            isFavorite: favourite,
            tableDropdownContent: {
                hasContent: true,
                content: this.getDropdownOwnerContent(),
            },
        };
    }

    private getDropdownOwnerContent(): DropdownItem[] {
        return TableDropdownComponentConstants.DROPDOWN_FUEL_CONTENT;
    }

    onToolBarAction(event: any) {
        if (event.action === TableStringEnum.OPEN_MODAL) {
            if (this.selectedTab === TableStringEnum.FUEL_TRANSACTION) {
                this.modalService.openModal(FuelPurchaseModalComponent, {
                    size: TableStringEnum.SMALL,
                });
            } else if (this.selectedTab === TableStringEnum.FUEL_STOP) {
                this.modalService.openModal(FuelStopModalComponent, {
                    size: TableStringEnum.SMALL,
                });
            }
        } else if (event.action === TableStringEnum.TAB_SELECTED) {
            const { integratedFuelTransactionsCount } = this.fuelData || {};
            this.selectedTab = event.tabData.field;

            this.fuelData = {
                data: [],
                integratedFuelTransactionsCount: integratedFuelTransactionsCount,
                integratedFuelTransactionsFilterActive: false,
                pageIndex: 0
            }
            
            this.fetchApiDataPaginated();
        } else if (event.action === TableStringEnum.VIEW_MODE) {
            this.activeViewMode = event.mode;

            this.tableOptions.toolbarActions.hideSearch =
                event.mode == TableStringEnum.MAP;
        }
    }

    onTableHeadActions(event: any) {
        if (event.action === TableStringEnum.SORT) {
            if (event.direction) {
            } else {
                this.sendFuelData();
            }
        }
    }

    onTableBodyActions(event: any) {
        if (event.type === TableStringEnum.EDIT) {
            if (this.selectedTab === TableStringEnum.FUEL_TRANSACTION) {
                this.modalService.openModal(
                    FuelPurchaseModalComponent,
                    { size: TableStringEnum.SMALL },
                    {
                        ...event,
                    }
                );
            } else {
                this.modalService.openModal(
                    FuelStopModalComponent,
                    {
                        size: TableStringEnum.SMALL,
                    },
                    {
                        ...event,
                    }
                );
            }
        } else if (event.type === TableStringEnum.DELETE_ITEM) {
            this.payrollService.raiseDeleteModal(
                TableStringEnum.FUEL_1,
                ConfirmationModalStringEnum.DELETE_FUEL,
                event.id,
                {
                    title: event.data.invoice,
                    subtitle: event.data.total,
                    date: event.data.transactionDate,
                    label: event.data.truck?.truckNumber,
                    id: event.data.id
                }
            );
        } else if (event.type === TableStringEnum.SHOW_MORE) {
            this.fetchApiDataPaginated();
        }
    }

    selectItem(data: any) {
        this.mapsComponent.clickedMarker(data[0]);

        this.mapListData.map((item) => {
            if (item.id == data[0]) {
                let itemIndex = this.mapsComponent.viewData.findIndex(
                    (item2) => item2.id === item.id
                );

                if (
                    itemIndex > -1 &&
                    this.mapsComponent.viewData[itemIndex].showMarker
                ) {
                    item.isSelected =
                        this.mapsComponent.viewData[itemIndex].isSelected;
                } else {
                    this.mapsComponent.clusterMarkers.map((cluster) => {
                        var clusterData = cluster.pagination.data;

                        let clusterItemIndex = clusterData.findIndex(
                            (item2) => item2.id === data[0]
                        );

                        if (clusterItemIndex > -1) {
                            if (!data[1]) {
                                if (
                                    !cluster.isSelected ||
                                    (cluster.isSelected &&
                                        cluster.detailedInfo?.id == data[0])
                                ) {
                                    this.mapsComponent.clickedCluster(cluster);
                                }

                                if (cluster.isSelected) {
                                    this.mapsComponent.showClusterItemInfo([
                                        cluster,
                                        clusterData[clusterItemIndex],
                                    ]);
                                }
                            }

                            item.isSelected = cluster.isSelected;
                        }
                    });
                }
            }
        });
    }

    updateMapList(mapListResponse) {
        var newMapList = mapListResponse.pagination.data;
        var listChanged = false;
        var addData = mapListResponse.addData ? true : false;

        if (!addData) {
            for (var i = 0; i < this.mapListData.length; i++) {
                let item = this.mapListData[i];

                let itemIndex = newMapList.findIndex(
                    (item2) => item2.id === item.id
                );

                if (itemIndex == -1) {
                    this.mapListData.splice(i, 1);
                    listChanged = true;
                    i--;
                }
            }
        }

        for (var b = 0; b < newMapList.length; b++) {
            let item = newMapList[b];

            let itemIndex = this.mapListData.findIndex(
                (item2) => item2.id === item.id
            );

            if (itemIndex == -1) {
                if (addData) {
                    this.mapListData.push(item);
                } else {
                    this.mapListData.splice(b, 0, item);
                    listChanged = true;
                    b--;
                }
            }
        }

        if (listChanged || mapListResponse.changedSort) {
            if (mapListResponse.changedSort)
                this.mapListData = mapListResponse.pagination.data;
            this.ref.detectChanges();
        }
    }

    private composeFuelData(
        response: FuelTransactionListResponse | FuelStopListResponse
    ): void {
        const { data, pageIndex } = response?.pagination;
        const { integrationFuelTransactionCount } = response;
        const integratedFuelTransactionsFilterActive = this.fuelData?.integratedFuelTransactionsFilterActive ?? false;

        this.fuelData = {
            data: data,
            integratedFuelTransactionsCount: integrationFuelTransactionCount,
            integratedFuelTransactionsFilterActive: integratedFuelTransactionsFilterActive,
            pageIndex: pageIndex
        } as IFuelTableData;
    }

    private fetchApiDataPaginated(): void {
        this.fuelData.pageIndex++;

        if (this.selectedTab === TableStringEnum.FUEL_TRANSACTION) {
            this.fuelService
                .getFuelTransactionsList(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, this.fuelData.integratedFuelTransactionsFilterActive, this.fuelData.pageIndex, FuelTableConstants.TABLE_PAGE_SIZE)
                .pipe(takeUntil(this.destroy$))
                .subscribe((response) => {
                    this.updateStoreData(response);
                });
        } else if (this.selectedTab === TableStringEnum.FUEL_STOP) {
            this.fuelService
                .getFuelStopsList(null, null, null, null, null, null, null, null, null, null, null, null, null, null, this.fuelData.pageIndex, FuelTableConstants.TABLE_PAGE_SIZE)
                .pipe(takeUntil(this.destroy$))
                .subscribe((response) => {
                    this.updateStoreData(response);
                });
        }
    }

    private updateStoreData(
        response: FuelTransactionListResponse | FuelStopListResponse,
        shouldResetData: boolean = false
    ): void {
        const { data: localData } = this.fuelData;
        const { data: fetchedData } = response?.pagination;

        let dataToStore: FuelTransactionResponse | FuelStopListResponse =
            response;
        dataToStore.pagination.data = shouldResetData
            ? [...fetchedData]
            : [...localData, ...fetchedData];

        if (this.selectedTab === TableStringEnum.FUEL_TRANSACTION)
            this.fuelService.updateStoreFuelTransactionsList = response;
        else if (this.selectedTab === TableStringEnum.FUEL_STOP)
            this.fuelService.updateStoreFuelStopList = response;
    }

    private manageSubscriptions(): void {
        combineLatest([
            this.fuelQuery.fuelTransactions$,
            this.fuelQuery.fuelStops$,
        ])
            .pipe(takeUntil(this.destroy$))
            .subscribe((responses) => {
                const response =
                    this.selectedTab === TableStringEnum.FUEL_TRANSACTION
                        ? responses[0]
                        : responses[1];

                this.composeFuelData(response);
                this.sendFuelData();
            });

        this.tableService.currentSetTableFilter
            .pipe(takeUntil(this.destroy$))
            .pipe(switchMap(currentFilter => {
                this.fuelData.integratedFuelTransactionsFilterActive =
                    currentFilter?.filterName === TableStringEnum.FUEL_ARRAY && 
                    currentFilter?.selectedFilter;
                this.fuelData.pageIndex = 1;

                if (!!currentFilter) return this.fuelService
                    .getFuelTransactionsList(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, this.fuelData.integratedFuelTransactionsFilterActive, this.fuelData.pageIndex, FuelTableConstants.TABLE_PAGE_SIZE);
                else return of();
            }))
            .subscribe(response => {
                this.updateStoreData(response, true);
            });
    }

    private setActiveTab(): void {
        const tableView = JSON.parse(
            localStorage.getItem(TableStringEnum.FUEL_TABLE_VIEW)
        );

        if (tableView) {
            this.selectedTab = tableView.tabSelected;
            this.activeViewMode = tableView.viewMode;
        } else {
            this.selectedTab = TableStringEnum.FUEL_TRANSACTION;
        }
    }

    public updateCardView(): void {
        switch (this.selectedTab) {
            case TableStringEnum.FUEL_TRANSACTION:
                this.displayRows$ = this.store.pipe(
                    select(selectActiveTabCards)
                );
                break;

            case TableStringEnum.FUEL_STOP:
                this.displayRows$ = this.store.pipe(
                    select(selectInactiveTabCards)
                );
                break;
            default:
                break;
        }
        this.fuelCardsModalService.updateTab(this.selectedTab);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.tableService.sendActionAnimation({});
        this.resizeObserver.disconnect();
    }
}
