import {
    Component,
    OnInit,
    OnDestroy,
    ViewChild,
    AfterViewInit,
    ChangeDetectorRef,
} from '@angular/core';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

// Components
import { RepairShopModalComponent } from '../../modals/repair-modals/repair-shop-modal/repair-shop-modal.component';
import { RepairOrderModalComponent } from '../../modals/repair-modals/repair-order-modal/repair-order-modal.component';
import { ModalService } from '../../shared/ta-modal/modal.service';

// Services
import { RepairTService } from '../state/repair.service';
import { TruckassistTableService } from '../../../services/truckassist-table/truckassist-table.service';
import { ReviewsRatingService } from '../../../services/reviews-rating/reviewsRating.service';
import { MapsService } from '../../../services/shared/maps.service';

// Modals
import { RepairListResponse, RepairResponse } from 'appcoretruckassist';
import {
    getRepairsShopColumnDefinition,
    getRepairTruckAndTrailerColumnDefinition,
} from '../../../../../assets/utils/settings/repair-columns';
import {
    BodyResponseRepair,
    MapList,
    MapedTruckAndTrailer,
    RepairBackFilterModal,
    ShopBackFilterModal,
    ShopbBckFilterQueryInterface,
} from '../repair.modal';
import {
    DataForCardsAndTables,
    TableColumnConfig,
} from '../../shared/model/table-components/all-tables.modal';
import { CardRows, TableOptionsInterface } from '../../shared/model/cardData';
import { DropdownItem, ToolbarActions } from '../../shared/model/cardTableData';

// Store
import { ShopQuery } from '../state/shop-state/shop.query';
import { ShopState, ShopStore } from '../state/shop-state/shop.store';

import { RepairTruckState } from '../state/repair-truck-state/repair-truck.store';
import { RepairTruckQuery } from '../state/repair-truck-state/repair-truck.query';

import { RepairTrailerQuery } from '../state/repair-trailer-state/repair-trailer.query';
import {
    RepairTrailerState,
    RepairTrailerStore,
} from '../state/repair-trailer-state/repair-trailer.store';

// Pipes
import { DatePipe } from '@angular/common';
import { TaThousandSeparatorPipe } from '../../../pipes/taThousandSeparator.pipe';

// Enum
import { ConstantStringTableComponentsEnum } from 'src/app/core/utils/enums/table-components.enums';

// Constants
import { TableRepair } from 'src/app/core/utils/constants/table-components.constants';

// Animations
import {
    tableSearch,
    closeAnimationAction,
} from '../../../utils/methods.globals';
import { DisplayRepairConfiguration } from '../repair-card-data';

//Helpers
import { checkSpecialFilterArray } from 'src/app/core/helpers/dataFilter';

@Component({
    selector: 'app-repair-table',
    templateUrl: './repair-table.component.html',
    styleUrls: [
        './repair-table.component.scss',
        '../../../../../assets/scss/maps.scss',
    ],
    providers: [TaThousandSeparatorPipe],
})
export class RepairTableComponent implements OnInit, OnDestroy, AfterViewInit {
    private destroy$ = new Subject<void>();
    @ViewChild('mapsComponent', { static: false }) public mapsComponent: any;
    public reapirTableData: any[] = [];

    public tableOptions: TableOptionsInterface;
    public tableData: any[] = [];
    public viewData: any[] = [];
    public columns: TableColumnConfig[] = [];
    public selectedTab: ConstantStringTableComponentsEnum | string =
        ConstantStringTableComponentsEnum.ACTIVE;
    public activeViewMode: string = ConstantStringTableComponentsEnum.LIST;
    public repairTrucks: RepairTruckState[] = [];
    public repairTrailers: RepairTrailerState[] = [];
    public repairShops: ShopState[] = [];
    public resizeObserver: ResizeObserver;
    public inactiveTabClicked: boolean = false;
    public repairShopTabClicked: boolean = false;
    public activeTableData: string;
    public backFilterQuery: RepairBackFilterModal =
        TableRepair.BACK_FILTER_QUERY;

    public shopFilterQuery: ShopbBckFilterQueryInterface =
        TableRepair.SHOP_FILTER_QUERY;

    public mapListData: MapList[] = [];

    //Data to display from model Truck
    public displayRowsFrontTruck: CardRows[] =
        DisplayRepairConfiguration.displayRowsFrontTruck;
    public displayRowsBackTruck: CardRows[] =
        DisplayRepairConfiguration.displayRowsBackTruck;

    // Data to display from model Trailer
    public displayRowsFrontTrailer: CardRows[] =
        DisplayRepairConfiguration.displayRowsFrontTruck;
    public displayRowsBackTrailer: CardRows[] =
        DisplayRepairConfiguration.displayRowsBackTruck;

    // Data to display from model Trailer
    public displayRowsFrontRepairShop: CardRows[] =
        DisplayRepairConfiguration.displayRowsFrontRepairShop;
    public displayRowsBackRepairShop: CardRows[] =
        DisplayRepairConfiguration.displayRowsBackRepairShop;

    //Title
    public cardTitle: string =
        ConstantStringTableComponentsEnum.TRUCK_TRUCK_NUMBER;

    // Page
    public page: string = DisplayRepairConfiguration.page;

    //  Number of rows in card
    public rows: number = DisplayRepairConfiguration.rows;

    public sendDataToCardsFront: CardRows[];
    public sendDataToCardsBack: CardRows[];

    constructor(
        private modalService: ModalService,
        private tableService: TruckassistTableService,
        public router: Router,
        private shopQuery: ShopQuery,
        private repairTruckQuery: RepairTruckQuery,
        private repairTrailerQuery: RepairTrailerQuery,
        private repairService: RepairTService,
        public datePipe: DatePipe,
        private thousandSeparator: TaThousandSeparatorPipe,
        private reviewRatingService: ReviewsRatingService,
        private ref: ChangeDetectorRef,
        private mapsService: MapsService,
        private repairTrailerStore: RepairTrailerStore,
        private shopStore: ShopStore
    ) {}

    ngOnInit(): void {
        this.sendRepairData();
        //Table Filter

        this.setTableFilter();

        // Reset Columns

        this.resetColumns();

        this.switchSelected();

        this.resize();

        this.toggleColumns();

        this.search();

        this.repair();

        this.getSelectedTabTableData();
    }

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
                if (response) {
                    this.sendRepairData();
                }
            });
    }

    public setTableFilter() {
        this.tableService.currentSetTableFilter
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res?.filteredArray) {
                    if (res.selectedFilter) {
                        this.viewData = this.reapirTableData;
                        this.viewData = this.viewData?.filter((repairData) =>
                            res.filteredArray.some(
                                (filterData) => filterData.id == repairData.id
                            )
                        );
                    }

                    if (!res.selectedFilter) this.sendRepairData();
                }
            });
    }

    // Switch Selected
    private switchSelected(): void {
        this.tableService.currentSwitchOptionSelected
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
                if (res) {
                    if (
                        res.switchType ===
                        ConstantStringTableComponentsEnum.PM_2
                    ) {
                        this.router.navigate([
                            ConstantStringTableComponentsEnum.PM,
                        ]);
                    }
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

    private search(): void {
        // Search
        this.tableService.currentSearchTableData
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) {
                    this.backFilterQuery.pageIndex = 1;
                    this.shopFilterQuery.pageIndex = 1;

                    const searchEvent = tableSearch(
                        res,
                        this.selectedTab !==
                            ConstantStringTableComponentsEnum.REPAIR_SHOP
                            ? this.backFilterQuery
                            : this.shopFilterQuery
                    );

                    if (searchEvent) {
                        if (
                            searchEvent.action ===
                            ConstantStringTableComponentsEnum.API
                        ) {
                            if (
                                this.selectedTab !==
                                ConstantStringTableComponentsEnum.REPAIR_SHOP
                            ) {
                                this.backFilterQuery.unitType =
                                    this.selectedTab ===
                                    ConstantStringTableComponentsEnum.ACTIVE
                                        ? 1
                                        : 2;

                                this.repairBackFilter(this.backFilterQuery);
                            } else {
                                this.shopBackFilter(this.shopFilterQuery);
                            }
                        } else if (
                            searchEvent.action ===
                            ConstantStringTableComponentsEnum.STORE
                        ) {
                            this.sendRepairData();
                        }
                    }
                }
            });
    }

    // Repair Actions
    private repair(): void {
        this.tableService.currentActionAnimation
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                this.updateDataCount();

                // On Add Repair
                if (
                    res?.animation === ConstantStringTableComponentsEnum.ADD &&
                    this.selectedTab === res.tab
                ) {
                    this.viewData.push(
                        res.tab !==
                            ConstantStringTableComponentsEnum.REPAIR_SHOP
                            ? this.mapTruckAndTrailerData(res.data)
                            : this.mapShopData(res.data)
                    );

                    this.viewData = this.viewData.map((repair) => {
                        if (repair.id === res.id) {
                            repair.actionAnimation =
                                ConstantStringTableComponentsEnum.ADD;
                        }

                        return repair;
                    });

                    const inetval = setInterval(() => {
                        this.viewData = closeAnimationAction(
                            false,
                            this.viewData
                        );

                        clearInterval(inetval);
                    }, 2300);
                }
                // On Update Repair
                else if (
                    res?.animation ===
                        ConstantStringTableComponentsEnum.UPDATE &&
                    this.selectedTab === res.tab
                ) {
                    const updatedRepair =
                        res.tab !==
                        ConstantStringTableComponentsEnum.REPAIR_SHOP
                            ? this.mapTruckAndTrailerData(res.data)
                            : this.mapShopData(res.data);

                    this.viewData = this.viewData.map((repair) => {
                        if (repair.id === res.id) {
                            repair = updatedRepair;
                            repair.actionAnimation =
                                ConstantStringTableComponentsEnum.UPDATE;
                        }

                        return repair;
                    });

                    const inetval = setInterval(() => {
                        this.viewData = closeAnimationAction(
                            false,
                            this.viewData
                        );

                        clearInterval(inetval);
                    }, 1000);
                }
                // On Delete Repair
                else if (
                    res?.animation ===
                        ConstantStringTableComponentsEnum.DELETE &&
                    this.selectedTab === res.tab
                ) {
                    let repairIndex: number;

                    this.viewData = this.viewData.map(
                        (repair, index: number) => {
                            if (repair.id === res.id) {
                                repair.actionAnimation =
                                    ConstantStringTableComponentsEnum.DELETE;
                                repairIndex = index;
                            }

                            return repair;
                        }
                    );

                    this.ref.detectChanges();

                    const inetval = setInterval(() => {
                        this.viewData = closeAnimationAction(
                            false,
                            this.viewData
                        );

                        this.viewData.splice(repairIndex, 1);
                        clearInterval(inetval);
                    }, 900);
                }
            });
    }
    // Observ Table Container
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

    // Repair Table Options
    private initTableOptions(): void {
        this.tableOptions = {
            toolbarActions: {
                showRepairShop:
                    this.selectedTab !==
                    ConstantStringTableComponentsEnum.REPAIR_SHOP,
                showTimeFilter:
                    this.selectedTab !==
                    ConstantStringTableComponentsEnum.REPAIR_SHOP,
                showRepairOrderFilter:
                    this.selectedTab !==
                    ConstantStringTableComponentsEnum.REPAIR_SHOP,
                showPMFilter:
                    this.selectedTab !==
                    ConstantStringTableComponentsEnum.REPAIR_SHOP,
                showCategoryRepairFilter: true,
                showMoneyFilter: true,
                hideMoneySubType: true,
                showLocationFilter: true,
                showMoneyCount:
                    this.selectedTab !==
                    ConstantStringTableComponentsEnum.REPAIR_SHOP,
                viewModeOptions: this.getViewModeOptions(),
            },
        };
    }

    // Get View Mode Options
    private getViewModeOptions(): {
        name: ConstantStringTableComponentsEnum;
        active: boolean;
    }[] {
        return this.selectedTab ===
            ConstantStringTableComponentsEnum.REPAIR_SHOP
            ? [
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
                  {
                      name: ConstantStringTableComponentsEnum.MAP,
                      active:
                          this.activeViewMode ===
                          ConstantStringTableComponentsEnum.MAP,
                  },
              ]
            : [
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
              ];
    }

    // Send Repair Data
    private sendRepairData(): void {
        const tableView = JSON.parse(
            localStorage.getItem(
                ConstantStringTableComponentsEnum.REPAIR_TABLE_VIEW
            )
        );

        if (tableView) {
            this.selectedTab = tableView.tabSelected;
            this.activeViewMode = tableView.viewMode;
        }

        this.initTableOptions();

        this.checkActiveViewMode();

        const repairTruckTrailerCount = JSON.parse(
            localStorage.getItem(
                ConstantStringTableComponentsEnum.REPAIR_TRUCK_TRAILER_TABLE_COUNT
            )
        );

        const repairTruckData =
            this.selectedTab === ConstantStringTableComponentsEnum.ACTIVE
                ? this.getTabData(ConstantStringTableComponentsEnum.ACTIVE)
                : [];

        const repairTrailerData =
            this.selectedTab === ConstantStringTableComponentsEnum.INACTIVE
                ? this.getTabData(ConstantStringTableComponentsEnum.INACTIVE)
                : [];

        const repairShopData =
            this.selectedTab === ConstantStringTableComponentsEnum.REPAIR_SHOP
                ? this.getTabData(ConstantStringTableComponentsEnum.REPAIR_SHOP)
                : [];

        this.tableData = [
            {
                title: ConstantStringTableComponentsEnum.TRUCK_2,
                field: ConstantStringTableComponentsEnum.ACTIVE,
                length: repairTruckTrailerCount.repairTrucks,
                moneyCount:
                    this.selectedTab ===
                    ConstantStringTableComponentsEnum.ACTIVE
                        ? repairTruckTrailerCount.truckMoneyTotal
                        : 0,
                moneyCountSelected: false,
                data: repairTruckData,
                gridNameTitle: ConstantStringTableComponentsEnum.REPAIR,
                repairArray: checkSpecialFilterArray(
                    repairTruckData,
                    ConstantStringTableComponentsEnum.ORDER_2,
                    ConstantStringTableComponentsEnum.REPAIR_TYPE
                ),
                stateName: 'repair_trucks',
                tableConfiguration:
                    ConstantStringTableComponentsEnum.REPAIR_TRUCK,
                isActive:
                    this.selectedTab ===
                    ConstantStringTableComponentsEnum.ACTIVE,
                gridColumns: this.getGridColumns(
                    ConstantStringTableComponentsEnum.REPAIR_TRUCK
                ),
            },
            {
                title: ConstantStringTableComponentsEnum.TRAILER,
                field: ConstantStringTableComponentsEnum.INACTIVE,
                length: repairTruckTrailerCount.repairTrailers,
                moneyCount:
                    this.selectedTab ===
                    ConstantStringTableComponentsEnum.INACTIVE
                        ? repairTruckTrailerCount.trailerMoneyTotal
                        : 0,
                moneyCountSelected: false,
                data: repairTrailerData,
                gridNameTitle: ConstantStringTableComponentsEnum.REPAIR,
                repairArray: checkSpecialFilterArray(
                    repairTrailerData,
                    ConstantStringTableComponentsEnum.ORDER_2,
                    ConstantStringTableComponentsEnum.REPAIR_TYPE
                ),
                stateName: 'repair_trailers',
                tableConfiguration:
                    ConstantStringTableComponentsEnum.REPAIR_TRAILER,
                isActive:
                    this.selectedTab ===
                    ConstantStringTableComponentsEnum.INACTIVE,
                gridColumns: this.getGridColumns(
                    ConstantStringTableComponentsEnum.REPAIR_TRAILER
                ),
            },
            {
                title: ConstantStringTableComponentsEnum.SHOP,
                field: ConstantStringTableComponentsEnum.REPAIR_SHOP,
                length: repairTruckTrailerCount.repairShops,
                data: repairShopData,
                gridNameTitle: ConstantStringTableComponentsEnum.REPAIR,
                stateName: 'repair_shops',
                closedArray: checkSpecialFilterArray(
                    repairShopData,
                    ConstantStringTableComponentsEnum.STATUS
                ),
                tableConfiguration: 'REPAIR_SHOP',
                isActive:
                    this.selectedTab ===
                    ConstantStringTableComponentsEnum.REPAIR_SHOP,
                gridColumns: this.getGridColumns('REPAIR_SHOP'),
            },
        ];

        const td = this.tableData.find((t) => t.field === this.selectedTab);

        this.setRepairData(td);
    }

    // Check If Selected Tab Has Active View Mode
    private checkActiveViewMode(): void {
        if (this.activeViewMode === ConstantStringTableComponentsEnum.MAP) {
            let hasMapView = false;

            let viewModeOptions =
                this.tableOptions.toolbarActions.viewModeOptions;

            viewModeOptions.map((viewMode) => {
                if (viewMode.name === ConstantStringTableComponentsEnum.MAP) {
                    hasMapView = true;
                }
            });

            if (!hasMapView) {
                this.activeViewMode = ConstantStringTableComponentsEnum.LIST;

                viewModeOptions = this.getViewModeOptions();
            }

            this.tableOptions.toolbarActions.viewModeOptions = [
                ...viewModeOptions,
            ];
        }
    }

    // Get Tab Data From Store Or Via Api
    private getTabData(dataType: string): RepairTruckState[] {
        if (dataType === ConstantStringTableComponentsEnum.ACTIVE) {
            this.repairTrucks = this.repairTruckQuery.getAll();

            return this.repairTrucks?.length ? this.repairTrucks : [];
        } else if (dataType === ConstantStringTableComponentsEnum.INACTIVE) {
            this.inactiveTabClicked = true;

            this.repairTrailers = this.repairTrailerQuery.getAll();

            return this.repairTrailers?.length ? this.repairTrailers : [];
        } else if (dataType === ConstantStringTableComponentsEnum.REPAIR_SHOP) {
            this.repairShopTabClicked = true;

            this.repairShops = this.shopQuery.getAll();

            return this.repairShops?.length ? this.repairShops : [];
        }
    }

    // Get Repair Columns
    private getGridColumns(configType: string): void {
        const tableColumnsConfig = JSON.parse(
            localStorage.getItem(`table-${configType}-Configuration`)
        );

        if (
            configType === ConstantStringTableComponentsEnum.REPAIR_TRUCK ||
            configType === ConstantStringTableComponentsEnum.REPAIR_TRAILER
        ) {
            return tableColumnsConfig
                ? tableColumnsConfig
                : getRepairTruckAndTrailerColumnDefinition();
        } else {
            return tableColumnsConfig
                ? tableColumnsConfig
                : getRepairsShopColumnDefinition();
        }
    }

    // Set Repair Data
    private setRepairData(tdata: DataForCardsAndTables): void {
        this.columns = tdata.gridColumns;

        if (tdata.data.length) {
            this.viewData = tdata.data;

            this.viewData = this.viewData.map((data) => {
                if (
                    this.selectedTab ===
                        ConstantStringTableComponentsEnum.ACTIVE ||
                    this.selectedTab ===
                        ConstantStringTableComponentsEnum.INACTIVE ||
                    this.selectedTab ===
                        ConstantStringTableComponentsEnum.REPAIR_SHOP
                ) {
                    switch (this.selectedTab) {
                        case ConstantStringTableComponentsEnum.ACTIVE:
                            this.sendDataToCardsFront =
                                this.displayRowsFrontTruck;
                            this.sendDataToCardsBack =
                                this.displayRowsBackTruck;
                            this.cardTitle =
                                ConstantStringTableComponentsEnum.TRUCK_TRUCK_NUMBER;

                            break;
                        case ConstantStringTableComponentsEnum.REPAIR_SHOP:
                            this.sendDataToCardsFront =
                                this.displayRowsFrontRepairShop;
                            this.sendDataToCardsBack =
                                this.displayRowsBackRepairShop;
                            this.cardTitle =
                                ConstantStringTableComponentsEnum.NAME;
                            break;

                        case ConstantStringTableComponentsEnum.INACTIVE:
                            this.sendDataToCardsFront =
                                this.displayRowsFrontTrailer;
                            this.sendDataToCardsBack =
                                this.displayRowsBackTrailer;
                            this.cardTitle =
                                ConstantStringTableComponentsEnum.TRAILER_TRAILER_NUMBER;
                            break;
                    }
                    this.getSelectedTabTableData();
                    return this.mapTruckAndTrailerData(data);
                } else {
                    return this.mapShopData(data);
                }
            });

            this.mapListData = JSON.parse(JSON.stringify(this.viewData));
        } else {
            this.viewData = [];
        }

        this.reapirTableData = this.viewData;
    }

    // Map Truck And Trailer Data
    private mapTruckAndTrailerData(data: RepairResponse): MapedTruckAndTrailer {
        return {
            ...data,
            isSelected: false,
            isRepairOrder:
                data?.repairType?.name ===
                ConstantStringTableComponentsEnum.ORDER,
            tableUnit: data?.truck?.truckNumber
                ? data.truck.truckNumber
                : data?.trailer?.trailerNumber
                ? data.trailer.trailerNumber
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableType: ConstantStringTableComponentsEnum.NA,
            tableMake: ConstantStringTableComponentsEnum.NA,
            tableModel: ConstantStringTableComponentsEnum.NA,
            tableYear: ConstantStringTableComponentsEnum.NA,
            tableOdometer: data.odometer
                ? this.thousandSeparator.transform(data.odometer)
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableIssued: data?.date
                ? this.datePipe.transform(
                      data.date,
                      ConstantStringTableComponentsEnum.DATE_FORMAT
                  )
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableShopName: data?.repairShop?.name
                ? data.repairShop.name
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableShopAdress: data?.repairShop?.address?.address
                ? data.repairShop.address.address
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableServices: data?.serviceTypes ? data?.serviceTypes : null,

            tableDescription: data?.items
                ? data.items
                      .map((item) => item.description?.trim())
                      .join(
                          ConstantStringTableComponentsEnum.DIV_ELEMENT_DESCRIPTION_DOT_CONTAINER
                      )
                : null,
            descriptionItems: data?.items
                ? data.items.map((item) => {
                      return {
                          ...item,
                          descriptionPrice: item?.price
                              ? ConstantStringTableComponentsEnum.DOLLAR_SIGN +
                                this.thousandSeparator.transform(item.price)
                              : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
                          descriptionTotalPrice: item?.subtotal
                              ? ConstantStringTableComponentsEnum.DOLLAR_SIGN +
                                this.thousandSeparator.transform(item.subtotal)
                              : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
                          pmDescription: item?.pmTruck
                              ? item.pmTruck
                              : item?.pmTrailer
                              ? item.pmTrailer
                              : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
                      };
                  })
                : null,
            tabelDescriptionDropTotal: data?.total
                ? ConstantStringTableComponentsEnum.DOLLAR_SIGN +
                  this.thousandSeparator.transform(data.total)
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableCost: data?.total
                ? ConstantStringTableComponentsEnum.DOLLAR_SIGN +
                  this.thousandSeparator.transform(data.total)
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
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
                content: this.getRepairDropdownContent(),
            },
        };
    }

    // Map Shop Data
    // TODO find parametar data type
    private mapShopData(data: any): void {
        return {
            ...data,
            isSelected: false,
            tableAddress: data?.address?.address
                ? data.address.address
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableShopServices: data?.serviceTypes ? data?.serviceTypes : null,
            tableOpenHours: 'Treba Novi Template',
            tableBankDetailsBankName: data?.bank?.name
                ? data.bank.name
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableBankDetailsRouting: data?.routing
                ? data.routing
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableBankDetailsAccount: data?.account
                ? data.account
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableRepairCountBill: ConstantStringTableComponentsEnum.NA,
            tableRepairCountOrder: data?.order
                ? this.thousandSeparator.transform(data.order)
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableShopRaiting: {
                hasLiked: data.currentCompanyUserRating === 1,
                hasDislike: data.currentCompanyUserRating === -1,
                likeCount: data?.upCount
                    ? data.upCount
                    : ConstantStringTableComponentsEnum.NUMBER_0,
                dislikeCount: data?.downCount
                    ? data.downCount
                    : ConstantStringTableComponentsEnum.NUMBER_0,
            },
            tableContact: data?.contacts?.length ? data.contacts.length : 0,
            tableExpense: data?.cost
                ? ConstantStringTableComponentsEnum.DOLLAR_SIGN +
                  this.thousandSeparator.transform(data.cost)
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableLUsed: data.lastVisited
                ? this.datePipe.transform(
                      data.lastVisited,
                      ConstantStringTableComponentsEnum.DATE_FORMAT
                  )
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
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
            isFavorite: data.pinned,
            tableAttachments: data?.files ? data.files : [],
            fileCount: data?.fileCount,

            tableDropdownContent: {
                hasContent: true,
                content: this.getShopDropdownContent(),
            },
        };
    }

    // Get Repair Dropdown Content
    private getRepairDropdownContent(): DropdownItem[] {
        return TableRepair.DROPDOWN_REPAIR;
    }

    // Get Repair Dropdown Content
    private getShopDropdownContent(): DropdownItem[] {
        return TableRepair.DROPDOWN_SHOP;
    }

    // Repair Back Filters
    private repairBackFilter(
        filter: RepairBackFilterModal,
        isShowMore?: boolean
    ): void {
        this.repairService
            .getRepairList(
                filter.repairShopId,
                filter.unitType,
                filter.dateFrom,
                filter.dateTo,
                filter.isPM,
                filter.categoryIds,
                filter.pmTruckTitles,
                filter.pmTrailerTitles,
                filter.isOrder,
                filter.truckId,
                filter.pageIndex,
                filter.pageSize,
                filter.companyId,
                filter.sort,
                filter.searchOne,
                filter.searchTwo,
                filter.searchThree
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe((repair: RepairListResponse) => {
                if (!isShowMore) {
                    this.viewData = repair.pagination.data;

                    this.viewData = this.viewData.map((data) => {
                        return this.mapTruckAndTrailerData(data);
                    });
                } else {
                    let newData = [...this.viewData];

                    repair.pagination.data.map((data) => {
                        newData.push(this.mapTruckAndTrailerData(data));
                    });

                    this.viewData = [...newData];
                }
            });
    }

    // Shop Back Filters
    private shopBackFilter(
        filter: ShopBackFilterModal,
        isShowMore?: boolean
    ): void {
        this.repairService
            .getRepairShopList(
                filter.active,
                filter.pinned,
                filter.companyOwned,
                filter.categoryIds,
                filter.long,
                filter.lat,
                filter.distance,
                filter.costFrom,
                filter.costTo,
                filter.pageIndex,
                filter.pageSize,
                filter.companyId,
                filter.sort,
                filter.searchOne,
                filter.searchTwo,
                filter.searchThree
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe((shop) => {
                if (!isShowMore) {
                    this.viewData = shop.pagination.data;

                    this.viewData = this.viewData.map((data) => {
                        return this.mapShopData(data);
                    });
                } else {
                    let newData = [...this.viewData];

                    shop.pagination.data.map((data) => {
                        newData.push(this.mapShopData(data));
                    });

                    this.viewData = [...newData];
                }
            });
    }

    // Update Data Count
    private updateDataCount(): void {
        const repairTruckTrailerCount = JSON.parse(
            localStorage.getItem(
                ConstantStringTableComponentsEnum.REPAIR_TRUCK_TRAILER_TABLE_COUNT
            )
        );

        const updatedTableData = [...this.tableData];

        updatedTableData[0].length = repairTruckTrailerCount.repairTrucks;
        updatedTableData[0].moneyCount =
            repairTruckTrailerCount.truckMoneyTotal;
        updatedTableData[1].length = repairTruckTrailerCount.repairTrailers;
        updatedTableData[1].moneyCount =
            repairTruckTrailerCount.trailerMoneyTotal;
        updatedTableData[2].length = repairTruckTrailerCount.repairShops;

        this.tableData = [...updatedTableData];
    }

    // Table Toolbar Actions
    public onToolBarAction(event: ToolbarActions): void {
        if (event.action === ConstantStringTableComponentsEnum.TAB_SELECTED) {
            this.selectedTab = event.tabData.field;

            this.backFilterQuery.unitType =
                this.selectedTab === ConstantStringTableComponentsEnum.ACTIVE
                    ? 1
                    : 2;

            this.backFilterQuery.pageIndex = 1;
            this.shopFilterQuery.pageIndex = 1;

            // Repair Trailer Api Call
            if (
                this.selectedTab ===
                    ConstantStringTableComponentsEnum.INACTIVE &&
                !this.inactiveTabClicked
            ) {
                forkJoin([
                    this.repairService.getRepairList(
                        undefined,
                        2,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        1,
                        25
                    ),
                    this.tableService.getTableConfig(11),
                ])
                    .pipe(takeUntil(this.destroy$))
                    .subscribe(([repairTrailerPagination, tableConfig]) => {
                        if (tableConfig) {
                            const config = JSON.parse(tableConfig.config);

                            localStorage.setItem(
                                `table-${tableConfig.tableType}-Configuration`,
                                JSON.stringify(config)
                            );
                        }

                        this.repairTrailerStore.set(
                            repairTrailerPagination.pagination.data
                        );

                        this.sendRepairData();
                    });
            }
            // Repair Shop Api Call
            else if (
                this.selectedTab ===
                    ConstantStringTableComponentsEnum.REPAIR_SHOP &&
                !this.repairShopTabClicked
            ) {
                forkJoin([
                    this.repairService.getRepairShopList(
                        1,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        1,
                        25
                    ),
                    this.tableService.getTableConfig(12),
                ])
                    .pipe(takeUntil(this.destroy$))
                    .subscribe(([repairPagination, tableConfig]) => {
                        if (tableConfig) {
                            const config = JSON.parse(tableConfig.config);

                            localStorage.setItem(
                                `table-${tableConfig.tableType}-Configuration`,
                                JSON.stringify(config)
                            );
                        }

                        this.shopStore.set(repairPagination.pagination.data);

                        this.sendRepairData();
                    });
            } else {
                this.sendRepairData();
            }
        } else if (
            event.action === ConstantStringTableComponentsEnum.OPEN_MODAL
        ) {
            if (this.selectedTab === ConstantStringTableComponentsEnum.ACTIVE) {
                this.modalService.openModal(
                    RepairOrderModalComponent,
                    {
                        size: ConstantStringTableComponentsEnum.LARGE,
                    },
                    {
                        type: ConstantStringTableComponentsEnum.NEW_TRUCK,
                    }
                );
            } else if (
                this.selectedTab === ConstantStringTableComponentsEnum.INACTIVE
            ) {
                this.modalService.openModal(
                    RepairOrderModalComponent,
                    {
                        size: ConstantStringTableComponentsEnum.LARGE,
                    },
                    {
                        type: ConstantStringTableComponentsEnum.NEW_TRAILER,
                    }
                );
            } else {
                this.modalService.openModal(RepairShopModalComponent, {
                    size: ConstantStringTableComponentsEnum.SMALL,
                });
            }
        } else if (
            event.action === ConstantStringTableComponentsEnum.VIEW_MODE
        ) {
            this.activeViewMode = event.mode;

            this.tableOptions.toolbarActions.hideSearch =
                event.mode == ConstantStringTableComponentsEnum.MAP;
        }
    }

    // Table Head Actions
    public onTableHeadActions(event: {
        action: string;
        direction: string;
    }): void {
        if (event.action === ConstantStringTableComponentsEnum.SORT) {
            if (event.direction) {
                this.backFilterQuery.sort = event.direction;
                this.backFilterQuery.pageIndex = 1;
                this.shopFilterQuery.pageIndex = 1;

                if (
                    this.selectedTab !==
                    ConstantStringTableComponentsEnum.REPAIR_SHOP
                ) {
                    this.backFilterQuery.unitType =
                        this.selectedTab ===
                        ConstantStringTableComponentsEnum.ACTIVE
                            ? 1
                            : 2;

                    this.repairBackFilter(this.backFilterQuery);
                } else {
                    this.shopBackFilter(this.shopFilterQuery);
                }
            } else {
                this.sendRepairData();
            }
        }
    }

    // Table Body Actions
    public onTableBodyActions(event: BodyResponseRepair): void {
        // Show More

        if (event.type === ConstantStringTableComponentsEnum.SHOW_MORE) {
            if (
                this.selectedTab !==
                ConstantStringTableComponentsEnum.REPAIR_SHOP
            ) {
                this.backFilterQuery.unitType =
                    this.selectedTab ===
                    ConstantStringTableComponentsEnum.ACTIVE
                        ? 1
                        : 2;
            }

            this.selectedTab !== ConstantStringTableComponentsEnum.REPAIR_SHOP
                ? this.backFilterQuery.pageIndex++
                : this.shopFilterQuery.pageIndex++;

            this.selectedTab !== ConstantStringTableComponentsEnum.REPAIR_SHOP
                ? this.repairBackFilter(this.backFilterQuery, true)
                : this.shopBackFilter(this.shopFilterQuery, true);
        }

        // Edit
        else if (event.type === ConstantStringTableComponentsEnum.EDIT) {
            switch (this.selectedTab) {
                case ConstantStringTableComponentsEnum.ACTIVE: {
                    this.modalService.openModal(
                        RepairOrderModalComponent,
                        { size: ConstantStringTableComponentsEnum.LARGE },
                        {
                            ...event,
                            type: ConstantStringTableComponentsEnum.EDIT_TRUCK,
                        }
                    );
                    break;
                }
                case ConstantStringTableComponentsEnum.INACTIVE: {
                    this.modalService.openModal(
                        RepairOrderModalComponent,
                        { size: ConstantStringTableComponentsEnum.LARGE },
                        {
                            ...event,
                            type: ConstantStringTableComponentsEnum.EDIT_TRAILER,
                        }
                    );
                    break;
                }
                default: {
                    this.modalService.openModal(
                        RepairShopModalComponent,
                        { size: ConstantStringTableComponentsEnum.SMALL },
                        event
                    );
                    break;
                }
            }
        }

        // Delete
        else if (
            event.type === ConstantStringTableComponentsEnum.DELETE_REPAIR
        ) {
            if (
                this.selectedTab !==
                ConstantStringTableComponentsEnum.REPAIR_SHOP
            ) {
                this.repairService
                    .deleteRepairById(event.id, this.selectedTab)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe();
            } else {
                this.repairService
                    .deleteRepairShopById(event.id)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe();
            }
        }

        // Finish Order
        else if (
            event.type === ConstantStringTableComponentsEnum.FINISH_ORDER
        ) {
            switch (this.selectedTab) {
                case ConstantStringTableComponentsEnum.ACTIVE: {
                    this.modalService.openModal(
                        RepairOrderModalComponent,
                        { size: ConstantStringTableComponentsEnum.LARGE },
                        {
                            ...event.data,
                            type: ConstantStringTableComponentsEnum.EDIT_FO_TRUCK,
                        }
                    );
                    break;
                }
                case ConstantStringTableComponentsEnum.INACTIVE: {
                    this.modalService.openModal(
                        RepairOrderModalComponent,
                        { size: ConstantStringTableComponentsEnum.LARGE },
                        {
                            ...event.data,
                            type: ConstantStringTableComponentsEnum.EDIT_FO_TRAILER,
                        }
                    );
                    break;
                }
                default: {
                    break;
                }
            }
        }

        // Raiting
        else if (event.type === ConstantStringTableComponentsEnum.RATING) {
            const raitingData = {
                entityTypeRatingId: 2,
                entityTypeId: event.data.id,
                thumb:
                    event.subType === ConstantStringTableComponentsEnum.LIKE
                        ? 1
                        : -1,
                tableData: event.data,
            };

            this.reviewRatingService
                .addRating(raitingData)
                .pipe(takeUntil(this.destroy$))
                .subscribe((res) => {
                    const newViewData = [...this.viewData];

                    newViewData.map((data) => {
                        if (data.id === event.data.id) {
                            data.actionAnimation =
                                ConstantStringTableComponentsEnum.UPDATE;
                            data.tableShopRaiting = {
                                hasLiked: res.currentCompanyUserRating === 1,
                                hasDislike: res.currentCompanyUserRating === -1,
                                likeCount: res?.upCount
                                    ? res.upCount
                                    : ConstantStringTableComponentsEnum.NUMBER_0,
                                dislikeCount: res?.downCount
                                    ? res.downCount
                                    : ConstantStringTableComponentsEnum.NUMBER_0,
                            };
                        }
                    });

                    this.viewData = [...newViewData];

                    const inetval = setInterval(() => {
                        this.viewData = closeAnimationAction(
                            false,
                            this.viewData
                        );

                        clearInterval(inetval);
                    }, 1000);

                    this.mapsService.addRating(res);
                });
        }

        // Favorite
        else if (event.type === ConstantStringTableComponentsEnum.FAVORITE) {
            this.repairService
                .addShopFavorite(event.data.id)
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => {
                    const newViewData = [...this.viewData];

                    newViewData.map((data) => {
                        if (data.id === event.data.id) {
                            data.actionAnimation =
                                ConstantStringTableComponentsEnum.UPDATE;
                            data.isFavorite = !data.isFavorite;
                        }
                    });

                    const sortedByFavorite = newViewData.sort(
                        (a, b) => b.isFavorite - a.isFavorite
                    );

                    this.viewData = [...sortedByFavorite];

                    const inetval = setInterval(() => {
                        this.viewData = closeAnimationAction(
                            false,
                            this.viewData
                        );

                        clearInterval(inetval);
                    }, 1000);
                });
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

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.tableService.sendActionAnimation({});
        this.tableService.sendCurrentSwitchOptionSelected(null);
        // this.resizeObserver.unobserve(
        //     document.querySelector(ConstantStringTableComponentsEnum.TABLE_CONTAINER)
        // );
        this.resizeObserver.disconnect();
    }

    // MAP Find parameter type
    public selectItem(data: any): void {
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
                        const clusterData = cluster.pagination.data;

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

    public updateMapList(mapListResponse): void {
        const newMapList = mapListResponse.pagination.data;
        let listChanged = false;
        let addData = mapListResponse.addData ? true : false;

        if (!addData) {
            for (let i = 0; i < this.mapListData.length; i++) {
                const item = this.mapListData[i];

                const itemIndex = newMapList.findIndex(
                    (item2) => item2.id === item.id
                );

                if (itemIndex == -1) {
                    this.mapListData.splice(i, 1);
                    listChanged = true;
                    i--;
                }
            }
        }

        for (let b = 0; b < newMapList.length; b++) {
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
}
