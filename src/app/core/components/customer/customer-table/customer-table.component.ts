import {
    Component,
    OnInit,
    OnDestroy,
    ViewChild,
    AfterViewInit,
    ChangeDetectorRef,
} from '@angular/core';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { DatePipe } from '@angular/common';

// Components
import { BrokerModalComponent } from '../../modals/broker-modal/broker-modal.component';
import { ShipperModalComponent } from '../../modals/shipper-modal/shipper-modal.component';

// Services
import { ModalService } from '../../shared/ta-modal/modal.service';
import { BrokerTService } from '../state/broker-state/broker.service';
import { ShipperTService } from '../state/shipper-state/shipper.service';
import { TruckassistTableService } from '../../../services/truckassist-table/truckassist-table.service';
import { DetailsDataService } from '../../../services/details-data/details-data.service';
import { ReviewsRatingService } from '../../../services/reviews-rating/reviewsRating.service';
import { MapsService } from 'src/app/core/services/shared/maps.service';

// Queries
import { BrokerQuery } from '../state/broker-state/broker.query';
import { ShipperQuery } from '../state/shipper-state/shipper.query';

// Stores
import { BrokerState } from '../state/broker-state/broker.store';
import { ShipperState } from '../state/shipper-state/shipper.store';
import { ShipperStore } from '../state/shipper-state/shipper.store';

// Models
import {
    BrokerResponse,
    GetBrokerListResponse,
    RatingSetResponse,
    ShipperListResponse,
    ShipperResponse,
    TimeOnly,
} from 'appcoretruckassist';
import { CardRows, Search } from '../../shared/model/cardData';
import {
    BodyResponse,
    UpdateRating,
    UpdateShipperBroker,
    ViewDataResponse,
} from '../customer.modal';
import {
    DataForCardsAndTables,
    DropdownItem,
    GridColumn,
    MappedShipperBroker,
    ResizingEventData,
    TableColumnConfig,
    ToolbarActions,
} from '../../shared/model/cardTableData';
import {
    getBrokerColumnDefinition,
    getShipperColumnDefinition,
} from '../../../../../assets/utils/settings/customer-columns';
import { DisplayCustomerConfiguration } from '../customer-card-data';

// Globals
import {
    tableSearch,
    closeAnimationAction,
} from '../../../utils/methods.globals';

// Pipes
import { TaThousandSeparatorPipe } from '../../../pipes/taThousandSeparator.pipe';

// Enums
import { ConstantStringTableComponentsEnum } from 'src/app/core/utils/enums/table-components.enums';

// Constants
import { TableDropdownCustomerComponentConstants } from 'src/app/core/utils/constants/table-components.constants';
import {
    FilterOptionBroker,
    FilterOptionshipper,
} from '../../shared/model/table-components/customer.modals';

interface PaginationFilter {
    companyId?: number | undefined;
    distance?: number | undefined;
    lat?: number | undefined;
    long?: number | undefined;
    pageIndex: number;
    pageSize: number;
    searchOne?: string | undefined;
    searchThree?: string | undefined;
    searchTwo?: string | undefined;
    sort?: string | undefined;
    stateIds?: number[] | undefined;
}

@Component({
    selector: 'app-customer-table',
    templateUrl: './customer-table.component.html',
    styleUrls: [
        './customer-table.component.scss',
        '../../../../../assets/scss/maps.scss',
    ],
    providers: [TaThousandSeparatorPipe],
})
export class CustomerTableComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    private destroy$ = new Subject<void>();

    @ViewChild('mapsComponent', { static: false }) public mapsComponent: any;

    public tableOptions: any = {};
    public tableData: any[] = [];
    public viewData: any[] = [];
    public columns: TableColumnConfig[] = [];
    public brokers: BrokerState[] = [];
    public shipper: ShipperState[] = [];
    public selectedTab = ConstantStringTableComponentsEnum.ACTIVE;
    public activeViewMode: string = ConstantStringTableComponentsEnum.LIST;
    public resizeObserver: ResizeObserver;
    public inactiveTabClicked: boolean = false;
    public activeTableData: DataForCardsAndTables;
    public backBrokerFilterQuery: FilterOptionBroker = {
        ban: null,
        dnu: null,
        invoiceAgeingFrom: undefined,
        invoiceAgeingTo: undefined,
        availableCreditFrom: undefined,
        availableCreditTo: undefined,
        revenueFrom: undefined,
        revenueTo: undefined,
        pageIndex: 1,
        pageSize: 25,
        companyId: undefined,
        sort: undefined,
        searchOne: undefined,
        searchTwo: undefined,
        searchThree: undefined,
    };

    public backShipperFilterQuery: FilterOptionshipper = {
        stateIds: undefined,
        long: undefined,
        lat: undefined,
        distance: undefined,
        pageIndex: 1,
        pageSize: 25,
        companyId: undefined,
        sort: undefined,
        searchOne: undefined,
        searchTwo: undefined,
        searchThree: undefined,
    };
    public mapListData = [];

    //Data to display from model Broker
    public displayRowsFront: CardRows[] =
        DisplayCustomerConfiguration.displayRowsFrontBroker;
    public displayRowsBack: CardRows[] =
        DisplayCustomerConfiguration.displayRowsBackBroker;

    //Data to display from model Shipper
    public displayRowsFrontShipper: CardRows[] =
        DisplayCustomerConfiguration.displayRowsFrontShipper;
    public displayRowsBackShipper: CardRows[] =
        DisplayCustomerConfiguration.displayRowsBackShipper;
    public cardTitle: string = DisplayCustomerConfiguration.cardTitle;
    public page: string = DisplayCustomerConfiguration.page;
    public rows: number = DisplayCustomerConfiguration.rows;

    public sendDataToCardsFront: CardRows[];
    public sendDataToCardsBack: CardRows[];

    constructor(
        private ref: ChangeDetectorRef,
        private modalService: ModalService,
        private tableService: TruckassistTableService,
        private brokerQuery: BrokerQuery,
        private brokerService: BrokerTService,
        private shipperService: ShipperTService,
        private reviewRatingService: ReviewsRatingService,
        private DetailsDataService: DetailsDataService,
        private mapsService: MapsService,
        private shipperQuery: ShipperQuery,
        private thousandSeparator: TaThousandSeparatorPipe,
        public datePipe: DatePipe,
        private shipperStore: ShipperStore
    ) {}

    // ---------------------------- ngOnInit ------------------------------
    ngOnInit(): void {
        this.sendCustomerData();

        this.resetColumns();

        this.getSelectedTabTableData();

        this.resizeColumns();

        this.toogleColumns();

        this.addUpdateBrokerShipper();

        this.deleleteSelectedRows();

        this.search();
    }

    // ---------------------------- ngAfterViewInit ------------------------------
    ngAfterViewInit(): void {
        setTimeout(() => {
            this.observeTableContainer();
        }, 10);
    }

    // Reset Columns
    public resetColumns(): void {
        this.tableService.currentResetColumns
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: boolean) => {
                if (response) {
                    this.sendCustomerData();
                }
            });
    }

    // Resize Columns
    public resizeColumns(): void {
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

    // Toogle Columns
    public toogleColumns(): void {
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

    // Add-Update Broker-Shipper
    public addUpdateBrokerShipper(): void {
        this.tableService.currentActionAnimation
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                // <------------------ Broker ------------------->
                // Add Broker
                if (
                    res.animation === ConstantStringTableComponentsEnum.ADD &&
                    res.tab === ConstantStringTableComponentsEnum.BROKER
                ) {
                    this.viewData.push(this.mapBrokerData(res.data));

                    this.addData(res.id);
                }
                // Update Broker
                else if (
                    res.animation ===
                        ConstantStringTableComponentsEnum.UPDATE &&
                    res.tab === ConstantStringTableComponentsEnum.BROKER
                ) {
                    const updatedBroker = this.mapBrokerData(res.data);

                    this.updateData(res.id, updatedBroker);
                }

                // <------------------ Shipper ------------------->
                // Add Shipper
                else if (
                    res.animation === ConstantStringTableComponentsEnum.ADD &&
                    res.tab === ConstantStringTableComponentsEnum.SHIPPER
                ) {
                    this.viewData.push(this.mapShipperData(res.data));

                    this.addData(res.id);
                }
                // Update Shipper
                else if (
                    res.animation ===
                        ConstantStringTableComponentsEnum.UPDATE &&
                    res.tab === ConstantStringTableComponentsEnum.SHIPPER
                ) {
                    const updatedShipper = this.mapShipperData(res.data);

                    this.updateData(res.id, updatedShipper);
                }
            });
    }

    // Delete Selected Rows
    public deleleteSelectedRows(): void {
        this.tableService.currentDeleteSelectedRows
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
                // Multiple Delete
                if (response.length) {
                    // Delete Broker List

                    if (
                        this.selectedTab ===
                        ConstantStringTableComponentsEnum.ACTIVE
                    ) {
                        this.brokerService
                            .deleteBrokerList(response)
                            .pipe(takeUntil(this.destroy$))
                            .subscribe(() => {
                                let brokerName:
                                    | ConstantStringTableComponentsEnum
                                    | string =
                                    ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER;
                                let brokerText:
                                    | ConstantStringTableComponentsEnum
                                    | string =
                                    ConstantStringTableComponentsEnum.BROKER_2;
                                this.viewData.map((data: BrokerResponse) => {
                                    response.map((r: BrokerResponse) => {
                                        if (data.id === r.id) {
                                            if (!brokerName) {
                                                brokerName = data.businessName;
                                            } else {
                                                brokerName =
                                                    brokerName +
                                                    ConstantStringTableComponentsEnum.COMA +
                                                    data.businessName;
                                                brokerText =
                                                    ConstantStringTableComponentsEnum.BROKER_3;
                                            }
                                        }
                                    });
                                });

                                this.multipleDeleteData(response);
                            });
                    }
                    // Delete Shipper List
                    else {
                        let shipperName:
                            | ConstantStringTableComponentsEnum
                            | string =
                            ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER;
                        let shipText:
                            | ConstantStringTableComponentsEnum
                            | string =
                            ConstantStringTableComponentsEnum.SHIPPER_WITH_SPACE;
                        this.viewData.map((data: ShipperResponse) => {
                            response.map((r: ShipperResponse) => {
                                if (data.id === r.id) {
                                    if (!shipperName) {
                                        shipperName = data.businessName;
                                    } else {
                                        shipperName =
                                            shipperName +
                                            ConstantStringTableComponentsEnum.COMA +
                                            data.businessName;
                                        shipText =
                                            ConstantStringTableComponentsEnum.SHIPPERS_WITH_SPACE;
                                    }
                                }
                            });
                        });

                        this.shipperService
                            .deleteShipperList(response)
                            .pipe(takeUntil(this.destroy$))
                            .subscribe(() => {
                                this.multipleDeleteData(response);
                            });
                    }
                }
            });
    }

    // Search
    public search(): void {
        this.tableService.currentSearchTableData
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) {
                    this.backBrokerFilterQuery.pageIndex = 1;
                    this.backShipperFilterQuery.pageIndex = 1;

                    const searchEvent = tableSearch(
                        res,
                        this.selectedTab ===
                            ConstantStringTableComponentsEnum.ACTIVE
                            ? this.backBrokerFilterQuery
                            : this.backShipperFilterQuery
                    );

                    if (searchEvent) {
                        if (
                            searchEvent.action ===
                            ConstantStringTableComponentsEnum.API
                        ) {
                            this.selectedTab ===
                            ConstantStringTableComponentsEnum.ACTIVE
                                ? this.brokerBackFilter(searchEvent.query)
                                : this.shipperBackFilter(searchEvent.query);
                        } else if (
                            searchEvent.action ===
                            ConstantStringTableComponentsEnum.STORE
                        ) {
                            this.sendCustomerData();
                        }
                    }
                }
            });
    }

    private observeTableContainer(): void {
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

    public initTableOptions(): void {
        this.tableOptions = {
            toolbarActions: {
                showMoneyFilter:
                    this.selectedTab ===
                    ConstantStringTableComponentsEnum.ACTIVE,
                showLocationFilter:
                    this.selectedTab ===
                    ConstantStringTableComponentsEnum.INACTIVE,
                showStateFilter:
                    this.selectedTab ===
                    ConstantStringTableComponentsEnum.INACTIVE,
                viewModeOptions: this.getViewModeOptions(),
            },
        };
    }

    private getViewModeOptions(): {
        name: ConstantStringTableComponentsEnum;
        active: boolean;
    }[] {
        return this.selectedTab === ConstantStringTableComponentsEnum.ACTIVE
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
                  {
                      name: ConstantStringTableComponentsEnum.MAP,
                      active:
                          this.activeViewMode ===
                          ConstantStringTableComponentsEnum.MAP,
                  },
              ];
    }

    private sendCustomerData(): void {
        const tableView = JSON.parse(
            localStorage.getItem(
                ConstantStringTableComponentsEnum.CUSTOMER_TABLE_VIEW
            )
        );

        if (tableView) {
            this.selectedTab = tableView.tabSelected;
            this.activeViewMode = tableView.viewMode;
        }

        this.initTableOptions();

        this.checkActiveViewMode();

        const brokerShipperCount = JSON.parse(
            localStorage.getItem(
                ConstantStringTableComponentsEnum.BROKER_SHIPPER_TABLE_COUNT
            )
        );

        if (this.selectedTab === ConstantStringTableComponentsEnum.ACTIVE) {
            this.brokers = this.brokerQuery.getAll().length
                ? this.brokerQuery.getAll()
                : [];
        } else {
            this.inactiveTabClicked = true;

            this.shipper = this.shipperQuery.getAll().length
                ? this.shipperQuery.getAll()
                : [];
        }

        this.tableData = [
            {
                title: ConstantStringTableComponentsEnum.BROKER,
                field: ConstantStringTableComponentsEnum.ACTIVE,
                length: brokerShipperCount.broker,
                data: this.brokers,
                extended: false,
                isCustomer: true,
                gridNameTitle: ConstantStringTableComponentsEnum.CUSTOMER,
                stateName: ConstantStringTableComponentsEnum.BROKER_3,
                tableConfiguration: ConstantStringTableComponentsEnum.BROKER,
                isActive:
                    this.selectedTab ===
                    ConstantStringTableComponentsEnum.ACTIVE,
                gridColumns: this.getGridColumns(
                    ConstantStringTableComponentsEnum.BROKER
                ),
            },
            {
                title: ConstantStringTableComponentsEnum.SHIPPER,
                field: ConstantStringTableComponentsEnum.INACTIVE,
                length: brokerShipperCount.shipper,
                data: this.shipper,
                extended: false,
                isCustomer: true,
                gridNameTitle: ConstantStringTableComponentsEnum.CUSTOMER,
                stateName: ConstantStringTableComponentsEnum.SHIPPER_2,
                tableConfiguration: ConstantStringTableComponentsEnum.SHIPPER,
                isActive:
                    this.selectedTab ===
                    ConstantStringTableComponentsEnum.INACTIVE,
                gridColumns: this.getGridColumns(
                    ConstantStringTableComponentsEnum.SHIPPER
                ),
            },
        ];

        const td = this.tableData.find((t) => t.field === this.selectedTab);

        this.setCustomerData(td);
    }

    // Check If Selected Tab Has Active View Mode
    private checkActiveViewMode(): void {
        if (this.activeViewMode === ConstantStringTableComponentsEnum.MAP) {
            let hasMapView = false;

            let viewModeOptions =
                this.tableOptions.toolbarActions.viewModeOptions;

            viewModeOptions.map((viewMode: { name: string }) => {
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

    private getGridColumns(configType: string): string {
        const tableColumnsConfig = JSON.parse(
            localStorage.getItem(`table-${configType}-Configuration`)
        );

        if (configType === ConstantStringTableComponentsEnum.BROKER) {
            return tableColumnsConfig
                ? tableColumnsConfig
                : getBrokerColumnDefinition();
        } else {
            return tableColumnsConfig
                ? tableColumnsConfig
                : getShipperColumnDefinition();
        }
    }

    private setCustomerData(td: DataForCardsAndTables): void {
        this.columns = td.gridColumns;

        if (td.data.length) {
            this.viewData = td.data;

            this.viewData = this.viewData.map(
                (data: ShipperResponse | BrokerResponse) => {
                    return this.selectedTab ===
                        ConstantStringTableComponentsEnum.ACTIVE
                        ? this.mapBrokerData(data)
                        : this.mapShipperData(data);
                }
            );

            // Set data for cards based on tab active
            this.selectedTab === ConstantStringTableComponentsEnum.ACTIVE
                ? ((this.sendDataToCardsFront = this.displayRowsFront),
                  (this.sendDataToCardsBack = this.displayRowsBack))
                : ((this.sendDataToCardsFront = this.displayRowsFrontShipper),
                  (this.sendDataToCardsBack = this.displayRowsBackShipper));

            this.mapListData = JSON.parse(JSON.stringify(this.viewData));

            // Get Tab Table Data For Selected Tab
            this.getSelectedTabTableData();
        } else {
            this.viewData = [];
        }
    }

    // Map Broker Data
    private mapBrokerData(data: BrokerResponse): MappedShipperBroker {
        return {
            ...data,
            isSelected: false,
            tableAddressPhysical: data?.mainAddress?.address
                ? data.mainAddress.address
                : data?.mainPoBox?.poBox
                ? // ? data.mainPoBox.poBox + ' ' + data.mainPoBox.city + ' ' + data.mainPoBox.state + ' ' + data.mainPoBox.zipCode
                  'Treba da se postavo odgovarajuci redosled za po box address'
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableAddressBilling: data?.billingAddress?.address
                ? data.billingAddress.address
                : data?.billingPoBox?.poBox
                ? // ? data.mainPoBox.poBox + ' ' + data.mainPoBox.city + ' ' + data.mainPoBox.state + ' ' + data.mainPoBox.zipCode
                  'Treba da se postavo odgovarajuci redosled za po box address'
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tablePaymentDetailAvailCredit: ConstantStringTableComponentsEnum.NA,
            tablePaymentDetailCreditLimit: data?.creditLimit
                ? ConstantStringTableComponentsEnum.DOLLAR_SIGN +
                  this.thousandSeparator.transform(data.creditLimit)
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tablePaymentDetailTerm: data?.payTerm?.name
                ? data.payTerm.name
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tablePaymentDetailDTP: data?.daysToPay
                ? data.daysToPay + ConstantStringTableComponentsEnum.DAY
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tablePaymentDetailInvAgeing: {
                bfb: ConstantStringTableComponentsEnum.NUMBER_0,
                dnu: ConstantStringTableComponentsEnum.NUMBER_0,
                amount: 'Template is changed',
            },
            tableLoads: data?.loadCount
                ? this.thousandSeparator.transform(data.loadCount)
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableMiles: data?.miles
                ? this.thousandSeparator.transform(data.miles)
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tablePPM: data?.pricePerMile
                ? ConstantStringTableComponentsEnum.DOLLAR_SIGN +
                  this.thousandSeparator.transform(data.pricePerMile)
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableRevenue: data?.revenue
                ? ConstantStringTableComponentsEnum.DOLLAR_SIGN +
                  this.thousandSeparator.transform(data.revenue)
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableRaiting: {
                hasLiked: data.currentCompanyUserRating === 1,
                hasDislike: data.currentCompanyUserRating === -1,
                likeCount: data?.upCount
                    ? data.upCount
                    : ConstantStringTableComponentsEnum.NUMBER_0,
                dislikeCount: data?.downCount
                    ? data.downCount
                    : ConstantStringTableComponentsEnum.NUMBER_0,
            },
            tableContact: data?.brokerContacts?.length
                ? data.brokerContacts.length
                : 0,
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
            tableDropdownContent: {
                hasContent: true,
                content: this.getDropdownBrokerContent(),
            },
        };
    }

    // Map Shipper Data
    private mapShipperData(data: ShipperResponse): MappedShipperBroker {
        return {
            ...data,
            isSelected: false,
            tableAddress: data?.address?.address
                ? data.address.address
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableLoads: ConstantStringTableComponentsEnum.NA,
            tableAverageWatingTimePickup: data?.avgPickupTime
                ? data.avgPickupTime
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableAverageWatingTimeDelivery: data?.avgDeliveryTime
                ? data.avgDeliveryTime
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,

            tableAvailableHoursShipping:
                data?.shippingFrom && data?.shippingTo
                    ? data?.shippingFrom +
                      ' Treba AM ili PM' +
                      ' - ' +
                      data?.shippingTo +
                      ' Treba AM ili PM'
                    : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableAvailableHoursReceiving:
                data?.receivingFrom && data?.receivingTo
                    ? data?.receivingFrom +
                      ' Treba AM ili PM' +
                      ' - ' +
                      data?.receivingTo +
                      ' Treba AM ili PM'
                    : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableRaiting: {
                hasLiked: data.currentCompanyUserRating === 1,
                hasDislike: data.currentCompanyUserRating === -1,
                likeCount: data?.upCount
                    ? data.upCount
                    : ConstantStringTableComponentsEnum.NUMBER_0,
                dislikeCount: data?.downCount
                    ? data.downCount
                    : ConstantStringTableComponentsEnum.NUMBER_0,
            },
            tableContact: data?.shipperContacts?.length
                ? data.shipperContacts.length
                : 0,
            tableAdded: data.createdAt
                ? this.datePipe.transform(
                      data.createdAt,
                      ConstantStringTableComponentsEnum.DATE_FORMAT
                  )
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableEdited: ConstantStringTableComponentsEnum.NA, // data.updatedAt
            //? this.datePipe.transform(data.updatedAt, ConstantStringTableComponentsEnum.DATE_FORMAT)
            //: ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableDropdownContent: {
                hasContent: true,
                content: this.getDropdownShipperContent(),
            },
        };
    }

    private getDropdownBrokerContent(): DropdownItem[] {
        return TableDropdownCustomerComponentConstants.DROPDOWN_BROKER;
    }

    private getDropdownShipperContent(): DropdownItem[] {
        return TableDropdownCustomerComponentConstants.DROPDOWN_SHIPPER;
    }

    // Update Broker And Shipper Count
    private updateDataCount(): void {
        const brokerShipperCount = JSON.parse(
            localStorage.getItem(
                ConstantStringTableComponentsEnum.BROKER_SHIPPER_TABLE_COUNT
            )
        );

        const updatedTableData = [...this.tableData];

        updatedTableData[0].length = brokerShipperCount.broker;
        updatedTableData[1].length = brokerShipperCount.shipper;

        this.tableData = [...updatedTableData];
    }

    // Broker Back Filter Query
    private brokerBackFilter(
        filter: {
            ban: number | undefined;
            dnu: number | undefined;
            invoiceAgeingFrom: number | undefined;
            invoiceAgeingTo: number | undefined;
            availableCreditFrom: number | undefined;
            availableCreditTo: number | undefined;
            revenueFrom: number | undefined;
            revenueTo: number | undefined;
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
        this.brokerService
            .getBrokerList(
                filter.ban,
                filter.dnu,
                filter.invoiceAgeingFrom,
                filter.invoiceAgeingTo,
                filter.availableCreditFrom,
                filter.availableCreditTo,
                filter.revenueFrom,
                filter.revenueTo,
                filter.pageIndex,
                filter.pageSize,
                filter.companyId,
                filter.sort,
                filter.searchOne,
                filter.searchTwo,
                filter.searchThree
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe((brokers: GetBrokerListResponse) => {
                if (!isShowMore) {
                    this.viewData = brokers.pagination.data;

                    this.viewData = this.viewData.map(
                        (data: BrokerResponse) => {
                            return this.mapBrokerData(data);
                        }
                    );
                } else {
                    let newData = [...this.viewData];

                    brokers.pagination.data.map((data: BrokerResponse) => {
                        newData.push(this.mapBrokerData(data));
                    });

                    this.viewData = [...newData];
                }
            });
    }

    // Shipper Back Filter Query
    private shipperBackFilter(
        filter: {
            stateIds?: Array<number> | undefined;
            long: number | undefined;
            lat: number | undefined;
            distance: number | undefined;
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
        this.shipperService
            .getShippersList(
                filter.stateIds,
                filter.long,
                filter.lat,
                filter.distance,
                filter.pageIndex,
                filter.pageSize,
                filter.companyId,
                filter.sort,
                filter.searchOne,
                filter.searchTwo,
                filter.searchThree
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe((shippers: ShipperListResponse) => {
                if (!isShowMore) {
                    this.viewData = shippers.pagination.data;

                    this.viewData = this.viewData.map(
                        (data: ShipperResponse) => {
                            return this.mapShipperData(data);
                        }
                    );
                } else {
                    let newData = [...this.viewData];

                    shippers.pagination.data.map((data: ShipperResponse) => {
                        newData.push(this.mapShipperData(data));
                    });

                    this.viewData = [...newData];
                }
            });
    }

    // Toolbar Actions
    public onToolBarAction(event: ToolbarActions): void {
        // Add Call
        if (event.action === ConstantStringTableComponentsEnum.OPEN_MODAL) {
            // Add Broker Call Modal
            if (this.selectedTab === ConstantStringTableComponentsEnum.ACTIVE) {
                this.modalService.openModal(BrokerModalComponent, {
                    size: ConstantStringTableComponentsEnum.MEDIUM,
                });
            }
            // Add Shipper Call Modal
            else {
                this.modalService.openModal(ShipperModalComponent, {
                    size: ConstantStringTableComponentsEnum.MEDIUM,
                });
            }
        }
        // Switch Tab Call
        else if (
            event.action === ConstantStringTableComponentsEnum.TAB_SELECTED
        ) {
            this.selectedTab = event.tabData
                .field as ConstantStringTableComponentsEnum;

            this.backBrokerFilterQuery.pageIndex = 1;
            this.backShipperFilterQuery.pageIndex = 1;

            if (
                this.selectedTab ===
                    ConstantStringTableComponentsEnum.INACTIVE &&
                !this.inactiveTabClicked
            ) {
                this.shipperService;
                forkJoin([
                    this.shipperService.getShippersList(
                        null,
                        null,
                        null,
                        null,
                        1,
                        25
                    ),
                    this.tableService.getTableConfig(5),
                ])
                    .pipe(takeUntil(this.destroy$))
                    .subscribe(([shipperPagination, tableConfig]) => {
                        if (tableConfig) {
                            const config = JSON.parse(tableConfig.config);

                            localStorage.setItem(
                                `table-${tableConfig.tableType}-Configuration`,
                                JSON.stringify(config)
                            );
                        }

                        this.shipperStore.set(
                            shipperPagination.pagination.data
                        );

                        this.sendCustomerData();
                    });
            } else {
                this.sendCustomerData();
            }
        } else if (
            event.action === ConstantStringTableComponentsEnum.VIEW_MODE
        ) {
            this.activeViewMode = event.mode;

            this.tableOptions.toolbarActions.hideSearch =
                event.mode == ConstantStringTableComponentsEnum.MAP;
        }
    }

    // Head Actions
    public onTableHeadActions(event: {
        action: string;
        direction: string;
    }): void {
        if (event.action === ConstantStringTableComponentsEnum.SORT) {
            if (event.direction) {
                if (
                    this.selectedTab ===
                    ConstantStringTableComponentsEnum.ACTIVE
                ) {
                    this.backBrokerFilterQuery.sort = event.direction;

                    this.backBrokerFilterQuery.pageIndex = 1;

                    this.brokerBackFilter(this.backBrokerFilterQuery);
                } else {
                    this.backShipperFilterQuery.sort = event.direction;

                    this.backShipperFilterQuery.pageIndex = 1;

                    this.shipperBackFilter(this.backShipperFilterQuery);
                }
            } else {
                this.sendCustomerData();
            }
        }
    }

    // Table Body Actions
    private onTableBodyActions(event: BodyResponse): void {
        let businessName: string =
            ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER;
        this.DetailsDataService.setNewData(event.data);
        // Edit Call
        if (event.type === ConstantStringTableComponentsEnum.SHOW_MORE) {
            if (this.selectedTab === ConstantStringTableComponentsEnum.ACTIVE) {
                this.backBrokerFilterQuery.pageIndex++;

                this.brokerBackFilter(this.backBrokerFilterQuery, true);
            } else {
                this.backShipperFilterQuery.pageIndex++;

                this.shipperBackFilter(this.backShipperFilterQuery, true);
            }
        } else if (
            event.type ===
            ConstantStringTableComponentsEnum.EDIT_CUSTOMER_OR_SHIPPER
        ) {
            // Edit Broker Call Modal
            if (this.selectedTab === ConstantStringTableComponentsEnum.ACTIVE) {
                this.modalService.openModal(
                    BrokerModalComponent,
                    { size: ConstantStringTableComponentsEnum.SMALL },
                    {
                        ...event,
                        type: ConstantStringTableComponentsEnum.EDIT,
                        dnuButton: true,
                        bfbButton: true,
                    }
                );
            }
            // Edit Shipper Call Modal
            else {
                this.modalService.openModal(
                    ShipperModalComponent,
                    { size: ConstantStringTableComponentsEnum.SMALL },
                    {
                        ...event,
                        type: ConstantStringTableComponentsEnum.EDIT,
                    }
                );
            }
        }
        // Delete Call
        else if (event.type === ConstantStringTableComponentsEnum.DELETE) {
            businessName = this.getBusinessName(event, businessName);

            // Delete Broker Call
            if (this.selectedTab === ConstantStringTableComponentsEnum.ACTIVE) {
                this.brokerService
                    .deleteBrokerById(event.id)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: () => {
                            this.deleteDataById(event.id);
                        },
                        error: () => {},
                    });
            }
            // Delete Shipper Call
            else {
                businessName = this.getBusinessName(event, businessName);

                this.shipperService
                    .deleteShipperById(event.id)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: () => {
                            this.deleteDataById(event.id);
                        },
                        error: () => {},
                    });
            }
        }
        // Raiting
        else if (event.type === ConstantStringTableComponentsEnum.RATING) {
            let raitingData = {
                entityTypeRatingId:
                    this.selectedTab ===
                    ConstantStringTableComponentsEnum.ACTIVE
                        ? 1
                        : 3,
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
                .subscribe((res: RatingSetResponse) => {
                    let newViewData = [...this.viewData];

                    newViewData.map((data: UpdateRating) => {
                        if (data.id === event.data.id) {
                            data.actionAnimation =
                                ConstantStringTableComponentsEnum.UPDATE;
                            data.tableRaiting = {
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

                    const interval = setInterval(() => {
                        this.viewData = closeAnimationAction(
                            false,
                            this.viewData
                        );

                        clearInterval(interval);
                    }, 1000);

                    this.mapsService.addRating(res);
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
        return;
    }
    // Show More Data
    public onShowMore(): void {
        this.onTableBodyActions({
            type: ConstantStringTableComponentsEnum.SHOW_MORE,
        });
    }

    // Get Business Name
    private getBusinessName(event: BodyResponse, businessName: string): string {
        if (!businessName) {
            return (businessName = event.data.businessName);
        } else {
            return (businessName =
                businessName +
                ConstantStringTableComponentsEnum.COMA +
                event.data.businessName);
        }
    }

    // Add Shipper Or Broker To Viewdata
    private addData(dataId: number): void {
        this.viewData = this.viewData.map((data: ViewDataResponse) => {
            if (data.id === dataId) {
                data.actionAnimation = ConstantStringTableComponentsEnum.ADD;
            }
            return data;
        });

        this.updateDataCount();

        const interval = setInterval(() => {
            this.viewData = closeAnimationAction(false, this.viewData);

            clearInterval(interval);
        }, 2300);
    }

    // Update Shipper Or Broker In Viewdata
    private updateData(dataId: number, updatedData: MappedShipperBroker): void {
        this.viewData = this.viewData.map((data) => {
            if (data.id === dataId) {
                data = updatedData;
                data.actionAnimation = ConstantStringTableComponentsEnum.UPDATE;
            }

            return data;
        });

        this.ref.detectChanges();

        const interval = setInterval(() => {
            this.viewData = closeAnimationAction(false, this.viewData);

            clearInterval(interval);
        }, 1000);
    }

    // Delete Shipper Or Broker From Viewdata
    private deleteDataById(dataId: number): void {
        this.viewData = this.viewData.map((data: ViewDataResponse) => {
            if (data.id === dataId) {
                data.actionAnimation = ConstantStringTableComponentsEnum.DELETE;
            }

            return data;
        });

        this.updateDataCount();

        const interval = setInterval(() => {
            this.viewData = closeAnimationAction(true, this.viewData);

            clearInterval(interval);
        }, 900);
    }

    // Multiple Delete Shipper Or Broker From Viewdata
    private multipleDeleteData(
        response: BrokerResponse[] | ShipperResponse[]
    ): void {
        this.viewData = this.viewData.map((data: ViewDataResponse) => {
            response.map((res: ViewDataResponse) => {
                if (data.id === res.id) {
                    data.actionAnimation =
                        ConstantStringTableComponentsEnum.DELETE_MULTIPLE;
                }
            });

            return data;
        });

        this.updateDataCount();

        const interval = setInterval(() => {
            this.viewData = closeAnimationAction(true, this.viewData);

            clearInterval(interval);
        }, 900);

        this.tableService.sendRowsSelected([]);
        this.tableService.sendResetSelectedColumns(true);
    }

    // ---------------------------- ngOnDestroy ------------------------------
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.tableService.sendActionAnimation({});
        this.tableService.sendDeleteSelectedRows([]);
        this.resizeObserver.disconnect();
    }

    // THIS FUNCTION IS RECIVING SOME DATA FROM MAP CHILD COMPONENT BUT THERE IN CHILD COMPONENT IS ONLY  @Output() clickedMarker: EventEmitter<any> = new EventEmitter<any>(); WITH NO DATA EXPORTING
    // SO DATA TYPE WILL STAY ANY I GUES FUNCTION IS NOT FINISHED IN CHILD
    // MAP
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

    public updateMapList(mapListResponse): void {
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
            //this.tableData[1].length = mapListResponse.pagination.count;
            this.ref.detectChanges();
        }
    }

    public trackByIdentity(id: number): number {
        return id;
    }
}
