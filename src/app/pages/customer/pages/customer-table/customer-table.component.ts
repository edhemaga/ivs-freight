import {
    Component,
    OnInit,
    OnDestroy,
    ViewChild,
    AfterViewInit,
    ChangeDetectorRef,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

// Components
import { BrokerModalComponent } from 'src/app/pages/customer/pages/broker-modal/broker-modal.component';
import { ShipperModalComponent } from 'src/app/pages/customer/pages/shipper-modal/shipper-modal.component';
import { ConfirmationModalComponent } from 'src/app/core/components/modals/confirmation-modal/confirmation-modal.component';

// Services
import { ModalService } from 'src/app/core/components/shared/ta-modal/modal.service';
import { BrokerService } from '../../services/broker.service';
import { ShipperService } from '../../services/shipper.service';
import { TruckassistTableService } from 'src/app/shared/services/truckassist-table.service';
import { DetailsDataService } from 'src/app/shared/services/details-data.service';
import { ReviewsRatingService } from 'src/app/shared/services/reviews-rating.service';
import { MapsService } from 'src/app/core/services/shared/maps.service';
import { ConfirmationService } from 'src/app/core/components/modals/confirmation-modal/state/state/services/confirmation.service';
import { TableCardDropdownActionsService } from 'src/app/core/components/standalone-components/table-card-dropdown-actions/table-card-dropdown-actions.service';

// Store
import { BrokerState } from '../../state/broker-state/broker.store';
import { ShipperState } from '../../state/shipper-state/shipper.store';
import { BrokerQuery } from '../../state/broker-state/broker.query';
import { ShipperQuery } from '../../state/shipper-state/shipper.query';

// Models
import {
    BrokerResponse,
    GetBrokerListResponse,
    RatingSetResponse,
    ShipperListResponse,
    ShipperResponse,
} from 'appcoretruckassist';
import {
    CardRows,
    TableOptionsInterface,
} from 'src/app/core/components/shared/model/card-data.model';
import { CustomerBodyResponse } from './models/customer-body-response.model';
import { CustomerUpdateRating } from './models/customer-update-rating.model';
import { CustomerViewDataResponse } from './models/customer-viewdata-response.model';
import {
    CardDetails,
    DropdownItem,
    ToolbarActions,
} from 'src/app/shared/models/card-table-data.model';
import { MappedShipperBroker } from './models/mapped-shipper-broker.model';
import {
    FilterOptionBroker,
    FilterOptionshipper,
} from 'src/app/core/components/shared/model/table-components/customer.modals';
import {
    DataForCardsAndTables,
    TableColumnConfig,
} from 'src/app/core/components/shared/model/table-components/all-tables.modal';

// Constants
import { CustomerCardDataConfig } from './utils/constants/customer-card-data-config.constants';
import { TableDropdownComponentConstants } from 'src/app/core/utils/constants/table-components.constants';

// Pipes
import { ThousandSeparatorPipe } from 'src/app/shared/pipes/thousand-separator.pipe';

// Enums
import { ConstantStringTableComponentsEnum } from 'src/app/core/utils/enums/table-components.enum';

// Helpers
import { DropdownContentHelper } from 'src/app/shared/utils/helpers/dropdown-content.helper';
import { DataFilterHelper } from 'src/app/shared/utils/helpers/data-filter.helper';
import {
    getBrokerColumnDefinition,
    getShipperColumnDefinition,
} from 'src/assets/utils/settings/customer-columns';
import {
    tableSearch,
    closeAnimationAction,
} from 'src/app/core/utils/methods.globals';

@Component({
    selector: 'app-customer-table',
    templateUrl: './customer-table.component.html',
    styleUrls: [
        './customer-table.component.scss',
        '../../../../../assets/scss/maps.scss',
    ],
    providers: [ThousandSeparatorPipe],
})
export class CustomerTableComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    private destroy$ = new Subject<void>();

    @ViewChild('mapsComponent', { static: false }) public mapsComponent: any;
    public customerTableData: any[] = [];
    public tableOptions: TableOptionsInterface;
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
    public backBrokerFilterQuery: FilterOptionBroker =
        TableDropdownComponentConstants.BROKER_BACK_FILTER;
    public backShipperFilterQuery: FilterOptionshipper =
        TableDropdownComponentConstants.SHIPPER_BACK_FILTER;
    public mapListData = [];

    //Data to display from model Broker
    public displayRowsFront: CardRows[] =
        CustomerCardDataConfig.displayRowsFrontBroker;
    public displayRowsBack: CardRows[] =
        CustomerCardDataConfig.displayRowsBackBroker;

    //Data to display from model Shipper
    public displayRowsFrontShipper: CardRows[] =
        CustomerCardDataConfig.displayRowsFrontShipper;
    public displayRowsBackShipper: CardRows[] =
        CustomerCardDataConfig.displayRowsBackShipper;
    public cardTitle: string = CustomerCardDataConfig.cardTitle;
    public page: string = CustomerCardDataConfig.page;
    public rows: number = CustomerCardDataConfig.rows;

    public sendDataToCardsFront: CardRows[];
    public sendDataToCardsBack: CardRows[];
    public filter: boolean = false;
    public brokerActive: BrokerResponse[];
    public shipperActive: ShipperResponse[];

    constructor(
        // Ref
        private ref: ChangeDetectorRef,

        // Services
        private modalService: ModalService,
        private tableService: TruckassistTableService,
        private tableDropdownService: TableCardDropdownActionsService,
        private brokerService: BrokerService,
        private shipperService: ShipperService,
        private reviewRatingService: ReviewsRatingService,
        private DetailsDataService: DetailsDataService,
        private mapsService: MapsService,
        private confiramtionService: ConfirmationService,

        // Store
        private brokerQuery: BrokerQuery,
        private shipperQuery: ShipperQuery,

        // Pipes
        private thousandSeparator: ThousandSeparatorPipe,
        public datePipe: DatePipe,

        // Router
        private router: Router
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

        this.setTableFilter();

        this.confiramtionSubscribe();
    }

    // ---------------------------- ngAfterViewInit ------------------------------
    ngAfterViewInit(): void {
        setTimeout(() => {
            this.observeTableContainer();
        }, 10);
    }

    private confiramtionSubscribe(): void {
        this.confiramtionService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res.type === ConstantStringTableComponentsEnum.INFO) {
                    if (
                        res.subType ===
                        ConstantStringTableComponentsEnum.BAN_LIST
                    ) {
                        this.changeBanStatus(res.data);
                    } else {
                        this.changeDnuStatus(res.data);
                    }
                }
                if (res.template === ConstantStringTableComponentsEnum.INFO) {
                    if (
                        this.selectedTab ===
                        ConstantStringTableComponentsEnum.ACTIVE
                    ) {
                        this.changeBussinesStatusBroker(res.data);
                    } else {
                        this.changeBussinesStatusShipper(res.data);
                    }
                }
            });
    }

    public changeDnuStatus(data): void {
        this.brokerService
            .changeDnuStatus(data.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.sendCustomerData();
            });
    }

    public changeBussinesStatusBroker(data): void {
        this.brokerService
            .changeBrokerStatus(data.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.sendCustomerData();
            });
    }

    public changeBussinesStatusShipper(data): void {
        this.shipperService
            .changeShipperStatus(data.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.sendCustomerData();
            });
    }

    public changeBanStatus(data): void {
        this.brokerService
            .changeBanStatus(data.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.sendCustomerData();
            });
    }

    public setTableFilter(): void {
        this.tableService.currentSetTableFilter
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res?.filteredArray) {
                    if (res.selectedFilter) {
                        this.filter = true;
                        this.sendCustomerData();
                        this.viewData = this.customerTableData?.filter(
                            (customerData) =>
                                res.filteredArray.some(
                                    (filterData) =>
                                        filterData.id === customerData.id
                                )
                        );
                    }

                    if (!res.selectedFilter) {
                        this.filter = false;
                        this.viewData = this.customerTableData;
                        this.sendCustomerData();
                    }
                } else if (res?.filterType) {
                    if (
                        res.filterType ===
                        ConstantStringTableComponentsEnum.STATE_FILTER
                    ) {
                        if (
                            res.action === ConstantStringTableComponentsEnum.SET
                        ) {
                            this.viewData = this.customerTableData.filter(
                                (address) =>
                                    res.queryParams.canadaArray.some(
                                        (canadaState) =>
                                            canadaState.stateName ===
                                            address.address.state
                                    ) ||
                                    res.queryParams.usaArray.some(
                                        (usaState) =>
                                            usaState.stateName ===
                                            address.address.state
                                    )
                            );
                        }

                        if (
                            res.action ===
                            ConstantStringTableComponentsEnum.CLEAR
                        )
                            this.viewData = this.customerTableData;
                    } else if (
                        res.filterType ===
                        ConstantStringTableComponentsEnum.LOCATION_FILTER
                    ) {
                        if (
                            res.action === ConstantStringTableComponentsEnum.SET
                        ) {
                            this.viewData = this.customerTableData.filter(
                                (address) => {
                                    const distance =
                                        DataFilterHelper.calculateDistanceBetweenTwoCitysByCoordinates(
                                            res.queryParams.latValue,
                                            res.queryParams.longValue,
                                            address.latitude,
                                            address.longitude
                                        );
                                    return res.queryParams.rangeValue > distance
                                        ? address
                                        : null;
                                }
                            );
                        } else this.viewData = this.customerTableData;
                    }
                }
            });
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
                    res?.animation === ConstantStringTableComponentsEnum.ADD &&
                    res.tab === ConstantStringTableComponentsEnum.BROKER
                ) {
                    this.viewData.push(this.mapBrokerData(res.data));

                    this.addData(res.id);
                }
                // Update Broker
                else if (
                    res?.animation ===
                        ConstantStringTableComponentsEnum.UPDATE &&
                    res.tab === ConstantStringTableComponentsEnum.BROKER
                ) {
                    const updatedBroker = this.mapBrokerData(res.data);

                    this.updateData(res.id, updatedBroker);
                }

                // <------------------ Shipper ------------------->
                // Add Shipper
                else if (
                    res?.animation === ConstantStringTableComponentsEnum.ADD &&
                    res.tab === ConstantStringTableComponentsEnum.SHIPPER
                ) {
                    this.viewData.push(this.mapShipperData(res.data));

                    this.addData(res.id);
                }
                // Update Shipper
                else if (
                    res?.animation ===
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
                            .deleteBrokerList()
                            .pipe(takeUntil(this.destroy$))
                            .subscribe(() => {
                                let brokerName:
                                    | ConstantStringTableComponentsEnum
                                    | string =
                                    ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER;

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
                                    }
                                }
                            });
                        });

                        this.shipperService
                            .deleteShipperList()
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
                showBrokerFilter:
                    this.selectedTab ===
                    ConstantStringTableComponentsEnum.ACTIVE,
                showBrokerFilterClosed:
                    this.selectedTab ===
                    ConstantStringTableComponentsEnum.INACTIVE,
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

        const brokerActiveData =
            this.selectedTab === ConstantStringTableComponentsEnum.ACTIVE
                ? this.getTabData(ConstantStringTableComponentsEnum.ACTIVE)
                : [];

        const shipperActiveData =
            this.selectedTab === ConstantStringTableComponentsEnum.INACTIVE
                ? this.getTabData(ConstantStringTableComponentsEnum.INACTIVE)
                : [];

        this.tableData = [
            {
                title: ConstantStringTableComponentsEnum.BROKER,
                field: ConstantStringTableComponentsEnum.ACTIVE,
                length: brokerShipperCount.broker,
                data: brokerActiveData,
                extended: false,
                moneyCountSelected: false,
                isCustomer: true,
                gridNameTitle: ConstantStringTableComponentsEnum.CUSTOMER,
                stateName: ConstantStringTableComponentsEnum.BROKER_3,
                tableConfiguration: ConstantStringTableComponentsEnum.BROKER,
                bannedArray: DataFilterHelper.checkSpecialFilterArray(
                    brokerActiveData,
                    ConstantStringTableComponentsEnum.BAN
                ),
                dnuArray: DataFilterHelper.checkSpecialFilterArray(
                    brokerActiveData,
                    ConstantStringTableComponentsEnum.DNU
                ),
                closedArray: DataFilterHelper.checkSpecialFilterArray(
                    brokerActiveData,
                    ConstantStringTableComponentsEnum.STATUS
                ),
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
                data: shipperActiveData,
                moneyCountSelected: false,
                extended: false,
                isCustomer: true,
                closedArray: DataFilterHelper.checkSpecialFilterArray(
                    shipperActiveData,
                    ConstantStringTableComponentsEnum.STATUS
                ),
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

    private getTabData(dataType: string): BrokerResponse[] {
        if (dataType === ConstantStringTableComponentsEnum.ACTIVE) {
            this.brokerActive = this.brokerQuery.getAll();

            return this.brokerActive?.length ? this.brokerActive : [];
        } else if (dataType === ConstantStringTableComponentsEnum.INACTIVE) {
            this.inactiveTabClicked = true;

            this.shipperActive = this.shipperQuery.getAll();

            return this.shipperActive?.length ? this.shipperActive : [];
        }
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

        this.customerTableData = this.viewData;
    }

    private mapBrokerData(data: BrokerResponse): MappedShipperBroker {
        return {
            ...data,
            isSelected: false,
            businessName: this.filter
                ? {
                      hasBanDnu: data?.ban || data?.dnu || data?.status === 0,
                      isDnu: data?.dnu,
                      isClosed: data?.status === 0 ?? false,
                      name: data?.businessName
                          ? data.businessName
                          : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
                  }
                : data?.businessName,
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
            reviews: null,
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
                content: this.getDropdownBrokerContent(data),
            },
        };
    }

    private mapShipperData(data: ShipperResponse): MappedShipperBroker {
        return {
            ...data,
            businessName: this.filter
                ? {
                      hasBanDnu: data?.status === 0,
                      isDnu: false,
                      isClosed: data?.status === 0 ?? false,
                      name: data?.businessName
                          ? data.businessName
                          : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
                  }
                : data?.businessName,
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
                    ? data?.shippingFrom + ' - ' + data?.shippingTo
                    : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableAvailableHoursReceiving:
                data?.receivingFrom && data?.receivingTo
                    ? data?.receivingFrom + ' - ' + data?.receivingTo
                    : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            reviews: null,
            tableContact: data?.shipperContacts?.length
                ? data.shipperContacts.length
                : 0,
            tableAdded: data.createdAt
                ? this.datePipe.transform(
                      data.createdAt,
                      ConstantStringTableComponentsEnum.DATE_FORMAT
                  )
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableEdited: ConstantStringTableComponentsEnum.NA,
            tableDropdownContent: {
                hasContent: true,
                content: this.getDropdownShipperContent(data),
            },
        };
    }

    private getDropdownBrokerContent(data): DropdownItem[] {
        return DropdownContentHelper.getDropdownBrokerContent(data);
    }

    private getDropdownShipperContent(data): DropdownItem[] {
        return DropdownContentHelper.getDropdownShipperContent(data);
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

            this.sendCustomerData();
        } else if (
            event.action === ConstantStringTableComponentsEnum.VIEW_MODE
        ) {
            this.activeViewMode = event.mode;

            this.tableOptions.toolbarActions.hideSearch =
                event.mode == ConstantStringTableComponentsEnum.MAP;

            this.sendCustomerData();
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

    public onDropdownActions(): void {
        this.tableDropdownService.openModal$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                this.onTableBodyActions(res);
            });
    }

    // Table Body Actions
    private onTableBodyActions(event: {
        id?: number;
        data?: CardDetails;
        type?: string;
        subType?: string;
    }): void {
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
                ConstantStringTableComponentsEnum.EDIT_CUSTOMER_OR_SHIPPER ||
            event.type === ConstantStringTableComponentsEnum.ADD_CONTRACT ||
            event.type === ConstantStringTableComponentsEnum.WRITE_REVIEW
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
                        tab: 3,
                        openedTab:
                            event.type ===
                            ConstantStringTableComponentsEnum.ADD_CONTRACT
                                ? ConstantStringTableComponentsEnum.CONTRACT
                                : event.type ===
                                  ConstantStringTableComponentsEnum.WRITE_REVIEW
                                ? ConstantStringTableComponentsEnum.REVIEW
                                : ConstantStringTableComponentsEnum.DETAILS,
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
                        openedTab:
                            event.type ===
                            ConstantStringTableComponentsEnum.ADD_CONTRACT
                                ? ConstantStringTableComponentsEnum.CONTRACT
                                : event.type ===
                                  ConstantStringTableComponentsEnum.WRITE_REVIEW
                                ? ConstantStringTableComponentsEnum.REVIEW
                                : ConstantStringTableComponentsEnum.DETAILS,
                    }
                );
            }
        } else if (
            event.type === ConstantStringTableComponentsEnum.MOVE_TO_BAN_LIST
        ) {
            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: ConstantStringTableComponentsEnum.SMALL },
                {
                    ...event,
                    type: ConstantStringTableComponentsEnum.INFO,
                    subType: ConstantStringTableComponentsEnum.BAN_LIST,
                    subTypeStatus: !event.data.ban
                        ? ConstantStringTableComponentsEnum.MOVE
                        : ConstantStringTableComponentsEnum.REMOVE,
                }
            );
        } else if (
            event.type === ConstantStringTableComponentsEnum.MOVE_TO_DNU_LIST
        ) {
            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: ConstantStringTableComponentsEnum.SMALL },
                {
                    ...event,
                    type: ConstantStringTableComponentsEnum.INFO,
                    subType: ConstantStringTableComponentsEnum.DNU,
                    subTypeStatus: !event.data.dnu
                        ? ConstantStringTableComponentsEnum.MOVE
                        : ConstantStringTableComponentsEnum.REMOVE,
                }
            );
        } else if (
            event.type === ConstantStringTableComponentsEnum.CLOSE_BUSINESS
        ) {
            const mappedEvent = {
                ...event,
                type:
                    event.data.status === 1
                        ? ConstantStringTableComponentsEnum.CLOSE
                        : ConstantStringTableComponentsEnum.OPEN,
            };
            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: ConstantStringTableComponentsEnum.SMALL },
                {
                    ...mappedEvent,
                    template: ConstantStringTableComponentsEnum.INFO,
                    subType:
                        this.selectedTab ===
                        ConstantStringTableComponentsEnum.ACTIVE
                            ? ConstantStringTableComponentsEnum.BROKER
                            : ConstantStringTableComponentsEnum.SHIPPER,
                    subTypeStatus: ConstantStringTableComponentsEnum.BUSINESS,
                }
            );
        } else if (
            event.type === ConstantStringTableComponentsEnum.VIEW_DETAILS
        ) {
            if (this.selectedTab === ConstantStringTableComponentsEnum.ACTIVE) {
                this.router.navigate([
                    `/list/customer/${event.id}/broker-details`,
                ]);
            } else {
                this.router.navigate([
                    `/list/customer/${event.id}/shipper-details`,
                ]);
            }
        }
        // Delete Call
        else if (event.type === ConstantStringTableComponentsEnum.DELETE) {
            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: ConstantStringTableComponentsEnum.DELETE },
                {
                    type: ConstantStringTableComponentsEnum.DELETE,
                }
            );
            if (this.selectedTab === ConstantStringTableComponentsEnum.ACTIVE) {
                this.confiramtionService.confirmationData$.subscribe(
                    (response) => {
                        if (
                            response.type ===
                            ConstantStringTableComponentsEnum.DELETE
                        ) {
                            this.brokerService
                                .deleteBrokerById(event.id)
                                .pipe(takeUntil(this.destroy$))
                                .subscribe(() => {
                                    this.viewData = this.viewData.map(
                                        (broker) => {
                                            if (broker.id === event.id)
                                                broker.actionAnimation =
                                                    ConstantStringTableComponentsEnum.DELETE;

                                            return broker;
                                        }
                                    );

                                    this.updateDataCount();

                                    const interval = setInterval(() => {
                                        this.viewData = closeAnimationAction(
                                            true,
                                            this.viewData
                                        );

                                        clearInterval(interval);
                                    }, 900);
                                });
                        }
                    }
                );
            } else {
                this.confiramtionService.confirmationData$.subscribe(
                    (response) => {
                        if (
                            response.type ===
                            ConstantStringTableComponentsEnum.DELETE
                        ) {
                            this.shipperService
                                .deleteShipperById(event.id)
                                .pipe(takeUntil(this.destroy$))

                                .subscribe();
                        }
                    }
                );
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

                    newViewData.map((data: CustomerUpdateRating) => {
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
    private getBusinessName(
        event: CustomerBodyResponse,
        businessName: string
    ): string {
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
        this.viewData = this.viewData.map((data: CustomerViewDataResponse) => {
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
        this.viewData = this.viewData.map((data: CustomerViewDataResponse) => {
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
        this.viewData = this.viewData.map((data: CustomerViewDataResponse) => {
            response.map((res: CustomerViewDataResponse) => {
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
