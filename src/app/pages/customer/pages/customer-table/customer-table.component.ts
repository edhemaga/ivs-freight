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
import { BrokerModalComponent } from '@pages/customer/pages/broker-modal/broker-modal.component';
import { ShipperModalComponent } from '@pages/customer/pages/shipper-modal/shipper-modal.component';
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';
import { ConfirmationMoveModalComponent } from '@shared/components/ta-shared-modals/confirmation-move-modal/confirmation-move-modal.component';
import { ConfirmationActivationModalComponent } from '@shared/components/ta-shared-modals/confirmation-activation-modal/confirmation-activation-modal.component';

// Services
import { ModalService } from '@shared/services/modal.service';
import { BrokerService } from '@pages/customer/services/broker.service';
import { ShipperService } from '@pages/customer/services/shipper.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { DetailsDataService } from '@shared/services/details-data.service';
import { ReviewsRatingService } from '@shared/services/reviews-rating.service';
import { MapsService } from '@shared/services/maps.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { TableCardDropdownActionsService } from '@shared/components/ta-table-card-dropdown-actions/services/table-card-dropdown-actions.service';
import { ConfirmationMoveService } from '@shared/components/ta-shared-modals/confirmation-move-modal/services/confirmation-move.service';
import { ConfirmationActivationService } from '@shared/components/ta-shared-modals/confirmation-activation-modal/services/confirmation-activation.service';

// Store
import { BrokerState } from '@pages/customer/state/broker-state/broker.store';
import { ShipperState } from '@pages/customer/state/shipper-state/shipper.store';
import { BrokerQuery } from '@pages/customer/state/broker-state/broker.query';
import { ShipperQuery } from '@pages/customer/state/shipper-state/shipper.query';

// Models
import {
    BrokerResponse,
    GetBrokerListResponse,
    RatingSetResponse,
    ShipperListResponse,
    ShipperResponse,
} from 'appcoretruckassist';
import { CardRows } from '@shared/models/card-models/card-rows.model';
import { CustomerBodyResponse } from '@pages/customer/pages/customer-table/models/customer-body-response.model';
import { CustomerUpdateRating } from '@pages/customer/pages/customer-table/models/customer-update-rating.model';
import { CustomerViewDataResponse } from '@pages/customer/pages/customer-table/models/customer-viewdata-response.model';
import {
    CardDetails,
    DropdownItem,
} from '@shared/models/card-models/card-table-data.model';
import { TableToolbarActions } from '@shared/models/table-models/table-toolbar-actions.model';
import { MappedShipperBroker } from '@pages/customer/pages/customer-table/models/mapped-shipper-broker.model';
import { FilterOptionBroker } from '@pages/customer/pages/customer-table/models/filter-option-broker.model';
import { FilterOptionShipper } from '@pages/customer/pages/customer-table/models/filter-option-shipper.model';
import { CardTableData } from '@shared/models/table-models/card-table-data.model';
import { TableColumnConfig } from '@shared/models/table-models/table-column-config.model';

// Constants
import { CustomerCardDataConfigConstants } from '@pages/customer/pages/customer-table/utils/constants/customer-card-data-config.constants';
import { TableDropdownComponentConstants } from '@shared/utils/constants/table-dropdown-component.constants';

// Pipes
import { ThousandSeparatorPipe } from '@shared/pipes/thousand-separator.pipe';

// Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { ConfirmationMoveStringEnum } from '@shared/components/ta-shared-modals/confirmation-move-modal/enums/confirmation-move-string.enum';
import { TableActionsStringEnum } from '@shared/enums/table-actions-string.enum';
import { ConfirmationModalStringEnum } from '@shared/components/ta-shared-modals/confirmation-modal/enums/confirmation-modal-string.enum';
import { ConfirmationActivationStringEnum } from '@shared/components/ta-shared-modals/confirmation-activation-modal/enums/confirmation-activation-string.enum';

// Helpers
import { DropdownContentHelper } from '@shared/utils/helpers/dropdown-content.helper';
import { DataFilterHelper } from '@shared/utils/helpers/data-filter.helper';
import {
    getBrokerColumnDefinition,
    getShipperColumnDefinition,
} from '@shared/utils/settings/table-settings/customer-columns';
import { MethodsGlobalHelper } from '@shared/utils/helpers/methods-global.helper';

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
    public tableOptions;
    public tableData: any[] = [];
    public viewData: any[] = [];
    public columns: TableColumnConfig[] = [];
    public brokers: BrokerState[] = [];
    public shipper: ShipperState[] = [];
    public selectedTab = TableStringEnum.ACTIVE;
    public activeViewMode: string = TableStringEnum.LIST;
    public resizeObserver: ResizeObserver;
    public inactiveTabClicked: boolean = false;
    public activeTableData: CardTableData;
    public backBrokerFilterQuery: FilterOptionBroker =
        TableDropdownComponentConstants.BROKER_BACK_FILTER;
    public backShipperFilterQuery: FilterOptionShipper =
        TableDropdownComponentConstants.SHIPPER_BACK_FILTER;
    public mapListData = [];

    //Data to display from model Broker
    public displayRowsFront: CardRows[] =
        CustomerCardDataConfigConstants.displayRowsFrontBroker;
    public displayRowsBack: CardRows[] =
        CustomerCardDataConfigConstants.displayRowsBackBroker;

    //Data to display from model Shipper
    public displayRowsFrontShipper: CardRows[] =
        CustomerCardDataConfigConstants.displayRowsFrontShipper;
    public displayRowsBackShipper: CardRows[] =
        CustomerCardDataConfigConstants.displayRowsBackShipper;
    public cardTitle: string = CustomerCardDataConfigConstants.cardTitle;
    public page: string = CustomerCardDataConfigConstants.page;
    public rows: number = CustomerCardDataConfigConstants.rows;

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
        private confirmationMoveService: ConfirmationMoveService,
        private confirmationActivationService: ConfirmationActivationService,

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

        this.confirmationSubscribe();

        this.banListSelectedRows();

        this.dnuListSelectedRows();

        this.rowsSelected();

        this.openCloseBussinessSelectedRows();
    }

    // ---------------------------- ngAfterViewInit ------------------------------
    ngAfterViewInit(): void {
        setTimeout(() => {
            this.observeTableContainer();
        }, 10);
    }

    private confirmationSubscribe(): void {
        this.confiramtionService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                switch (res.type) {
                    case TableStringEnum.INFO:
                        if (res.subType === TableStringEnum.BAN_LIST)
                            this.changeBanStatus(res.data);
                        else this.changeDnuStatus(res.data);
                        break;
                    case TableStringEnum.INFO:
                        if (this.selectedTab === TableStringEnum.ACTIVE)
                            this.changeBussinesStatusBroker(res.data);
                        else this.changeBussinesStatusShipper(res.data);
                        break;
                    case TableStringEnum.MULTIPLE_DELETE:
                        if (this.selectedTab === TableStringEnum.INACTIVE)
                            this.deleteShipperList(res.array);
                        else this.deleteBrokerList(res.array);
                        break;
                    case TableStringEnum.CLOSE:
                        if (this.selectedTab === TableStringEnum.INACTIVE)
                            this.changeBussinesStatusShipper(res.data);
                        break;
                    case TableStringEnum.OPEN:
                        if (this.selectedTab === TableStringEnum.INACTIVE)
                            this.changeBussinesStatusShipper(res.data);
                        break;
                    case TableStringEnum.DELETE:
                        if (this.selectedTab === TableStringEnum.ACTIVE)
                            this.deleteBrokerById(res.id);
                        else this.deleteShipperById(res.id);
                        break;
                    default:
                        break;
                }
            });

        this.confirmationMoveService.getConfirmationMoveData$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) {
                    if (!res.array) {
                        if (res.subType === TableStringEnum.BAN) {
                            this.changeBanStatus(res.data);
                        } else {
                            this.changeDnuStatus(res.data);
                        }
                    } else {
                        if (res.subType === TableStringEnum.BAN) {
                            this.changeBanListStatus(res.array);
                        } else {
                            this.changeDnuListStatus(res.array);
                        }
                    }
                }
            });

        this.confirmationActivationService.getConfirmationActivationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) {
                    if (!res.array) {
                        if (res.template === TableStringEnum.INFO) {
                            if (this.selectedTab === TableStringEnum.ACTIVE) {
                                this.changeBussinesStatusBroker(res.data);
                            } else {
                                this.changeBussinesStatusShipper(res.data);
                            }
                        }
                    } else {
                        if (res.template === TableStringEnum.INFO) {
                            if (this.selectedTab === TableStringEnum.ACTIVE) {
                                this.changeBrokerListStatus(res.array);
                            } else {
                                this.changeShipperListStatus(res.array);
                            }
                        }
                    }
                }
            });
    }

    private deleteShipperList(ids: number[]): void {
        this.shipperService
            .deleteShipperList(ids)
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

    private deleteBrokerList(ids: number[]): void {
        this.brokerService
            .deleteBrokerList(ids)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.viewData = this.viewData.map((broker) => {
                    ids.map((id) => {
                        if (broker.id === id)
                            broker.actionAnimation =
                                TableStringEnum.DELETE_MULTIPLE;
                    });

                    return broker;
                });

                this.updateDataCount();

                const interval = setInterval(() => {
                    this.viewData = MethodsGlobalHelper.closeAnimationAction(
                        true,
                        this.viewData
                    );

                    clearInterval(interval);
                }, 900);

                this.tableService.sendRowsSelected([]);
                this.tableService.sendResetSelectedColumns(true);
            });
    }

    public deleteShipperById(id: number): void {
        this.shipperService
            .deleteShipperById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.viewData = this.viewData.map((shipper) => {
                    if (shipper.id === id)
                        shipper.actionAnimation = TableStringEnum.DELETE;

                    return shipper;
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

    public deleteBrokerById(id: number): void {
        this.brokerService
            .deleteBrokerById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.viewData = this.viewData.map((broker) => {
                    if (broker.id === id)
                        broker.actionAnimation = TableStringEnum.DELETE;

                    return broker;
                });

                this.updateDataCount();

                const interval = setInterval(() => {
                    this.viewData = MethodsGlobalHelper.closeAnimationAction(
                        true,
                        this.viewData
                    );

                    clearInterval(interval);
                }, 900);

                this.tableService.sendRowsSelected([]);
                this.tableService.sendResetSelectedColumns(true);
            });
    }

    public changeDnuStatus(data): void {
        this.brokerService
            .changeDnuStatus(data.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.sendCustomerData();

                this.tableService.sendRowsSelected([]);
                this.tableService.sendResetSelectedColumns(true);
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

                this.tableService.sendRowsSelected([]);
                this.tableService.sendResetSelectedColumns(true);
            });
    }

    public changeBanListStatus(dataArray): void {
        const brokerIds = dataArray.map((broker) => {
            return broker.id;
        });

        this.brokerService
            .changeBanListStatus(brokerIds)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.viewData = this.viewData.map((broker) => {
                    brokerIds.map((id) => {
                        if (broker.id === id)
                            broker.actionAnimation =
                                TableActionsStringEnum.UPDATE;
                    });

                    return broker;
                });

                this.updateDataCount();

                const interval = setInterval(() => {
                    this.viewData = MethodsGlobalHelper.closeAnimationAction(
                        false,
                        this.viewData
                    );

                    clearInterval(interval);
                }, 900);

                this.sendCustomerData();

                this.tableService.sendRowsSelected([]);
                this.tableService.sendResetSelectedColumns(true);
            });
    }

    public changeDnuListStatus(dataArray): void {
        const brokerIds = dataArray.map((broker) => {
            return broker.id;
        });

        this.brokerService
            .changeDnuListStatus(brokerIds)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.sendCustomerData();

                this.tableService.sendRowsSelected([]);
                this.tableService.sendResetSelectedColumns(true);
            });
    }

    public changeBrokerListStatus(dataArray): void {
        const brokerIds = dataArray.map((broker) => {
            return broker.id;
        });

        this.brokerService
            .changeBrokerListStatus(brokerIds)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.sendCustomerData();

                this.tableService.sendRowsSelected([]);
                this.tableService.sendResetSelectedColumns(true);
            });
    }

    public changeShipperListStatus(dataArray): void {
        const shipperIds = dataArray.map((shipper) => {
            return shipper.id;
        });

        this.shipperService
            .changeShipperListStatus(shipperIds)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.sendCustomerData();

                this.tableService.sendRowsSelected([]);
                this.tableService.sendResetSelectedColumns(true);
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
                    if (res.filterType === TableStringEnum.STATE_FILTER) {
                        if (res.action === TableStringEnum.SET) {
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

                        if (res.action === TableStringEnum.CLEAR)
                            this.viewData = this.customerTableData;
                    } else if (
                        res.filterType === TableStringEnum.LOCATION_FILTER
                    ) {
                        if (res.action === TableStringEnum.SET) {
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
                    } else if (
                        res.filterType === TableStringEnum.MONEY_FILTER
                    ) {
                        if (res.action === TableStringEnum.SET) {
                            const invoiceFilterFrom = res.queryParams
                                .firstFormFrom
                                ? parseInt(res.queryParams.firstFormFrom)
                                : null;
                            const invoiceFilterTo = res.queryParams.firstFormTo
                                ? parseInt(res.queryParams.firstFormTo)
                                : null;

                            const availableCreditFilterFrom = res.queryParams
                                .secondFormFrom
                                ? parseInt(res.queryParams.secondFormFrom)
                                : null;
                            const availableCreditFilterTo = res.queryParams
                                .secondFormTo
                                ? parseInt(res.queryParams.secondFormTo)
                                : null;

                            const revenueFilterFrom = res.queryParams
                                .thirdFormFrom
                                ? parseInt(res.queryParams.thirdFormFrom)
                                : null;
                            const revenueFilterTo = res.queryParams.thirdFormTo
                                ? parseInt(res.queryParams.thirdFormTo)
                                : null;

                            this.viewData = this.customerTableData.filter(
                                (broker) => {
                                    let inoviceFrom = true;
                                    let inovoiceTo = true;
                                    let availableCreditFrom = true;
                                    let availableCreditTo = true;
                                    let revenueFrom = true;
                                    let revenueTo = true;

                                    if (invoiceFilterFrom) {
                                        inoviceFrom =
                                            broker.brokerPaidInvoiceAgeing
                                                .totalPaid >= invoiceFilterFrom;
                                    }

                                    if (invoiceFilterTo) {
                                        inovoiceTo =
                                            broker.brokerPaidInvoiceAgeing
                                                .totalPaid <= invoiceFilterFrom;
                                    }

                                    if (availableCreditFilterFrom) {
                                        availableCreditFrom =
                                            broker.availableCredit >=
                                            availableCreditFilterFrom;
                                    }

                                    if (availableCreditFilterTo) {
                                        availableCreditTo =
                                            broker.availableCredit <=
                                            availableCreditFilterTo;
                                    }

                                    if (revenueFilterFrom) {
                                        revenueFrom =
                                            broker.revenue >= revenueFilterFrom;
                                    }

                                    if (revenueFilterTo) {
                                        revenueTo =
                                            broker.revenue <= revenueFilterTo;
                                    }

                                    return (
                                        inoviceFrom &&
                                        inovoiceTo &&
                                        availableCreditFrom &&
                                        availableCreditTo &&
                                        revenueFrom &&
                                        revenueTo
                                    );
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
                    res?.animation === TableStringEnum.ADD &&
                    res.tab === TableStringEnum.BROKER
                ) {
                    this.viewData.push(this.mapBrokerData(res.data));

                    this.addData(res.id);
                }
                // Update Broker
                else if (
                    res?.animation === TableStringEnum.UPDATE &&
                    res.tab === TableStringEnum.BROKER
                ) {
                    const updatedBroker = this.mapBrokerData(res.data);

                    this.updateData(res.id, updatedBroker);
                }
                // Update Multiple Brokers
                else if (
                    res?.animation === TableStringEnum.UPDATE_MULTIPLE &&
                    res.tab === TableStringEnum.BROKER
                ) {
                    this.sendCustomerData();
                }

                // <------------------ Shipper ------------------->
                // Add Shipper
                else if (
                    res?.animation === TableStringEnum.ADD &&
                    res.tab === TableStringEnum.SHIPPER
                ) {
                    this.viewData.push(this.mapShipperData(res.data));

                    this.addData(res.id);
                }
                // Update Shipper
                else if (
                    res?.animation === TableStringEnum.UPDATE &&
                    res.tab === TableStringEnum.SHIPPER
                ) {
                    const updatedShipper = this.mapShipperData(res.data);

                    this.updateData(res.id, updatedShipper);
                }
                // Update Multiple Shippers
                else if (
                    res?.animation === TableStringEnum.UPDATE_MULTIPLE &&
                    res.tab === TableStringEnum.SHIPPER
                ) {
                    this.sendCustomerData();
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
                    if (this.selectedTab === TableStringEnum.ACTIVE) {
                        const mappedRes = response.map((item) => {
                            return {
                                id: item.id,
                                data: {
                                    ...item.tableData,
                                },
                            };
                        });
                        this.modalService.openModal(
                            ConfirmationModalComponent,
                            { size: TableStringEnum.SMALL },
                            {
                                data: null,
                                array: mappedRes,
                                template: TableStringEnum.BROKER,
                                type: TableStringEnum.MULTIPLE_DELETE,
                                svg: true,
                            }
                        );
                    }
                    // Delete Shipper List
                    else {
                        const mappedRes = response.map((item) => {
                            return {
                                id: item.id,
                                data: {
                                    ...item.tableData,
                                },
                            };
                        });
                        this.modalService.openModal(
                            ConfirmationModalComponent,
                            { size: TableStringEnum.SMALL },
                            {
                                data: null,
                                array: mappedRes,
                                template: TableStringEnum.SHIPPER,
                                type: TableStringEnum.MULTIPLE_DELETE,
                                svg: true,
                            }
                        );
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

                    const searchEvent = MethodsGlobalHelper.tableSearch(
                        res,
                        this.selectedTab === TableStringEnum.ACTIVE
                            ? this.backBrokerFilterQuery
                            : this.backShipperFilterQuery
                    );

                    if (searchEvent) {
                        if (searchEvent.action === TableStringEnum.API) {
                            this.selectedTab === TableStringEnum.ACTIVE
                                ? this.brokerBackFilter(searchEvent.query)
                                : this.shipperBackFilter(searchEvent.query);
                        } else if (
                            searchEvent.action === TableStringEnum.STORE
                        ) {
                            this.sendCustomerData();
                        }
                    }
                }
            });
    }

    private banListSelectedRows(): void {
        this.tableService.currentBanListSelectedRows
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res?.length) {
                    const mappedRes = res.map((item) => {
                        return {
                            id: item.id,
                            data: {
                                ...item.tableData,
                            },
                            modalTitle: item.tableData.businessName,
                            modalSecondTitle:
                                item.tableData.billingAddress?.address ??
                                TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                        };
                    });

                    this.modalService.openModal(
                        ConfirmationMoveModalComponent,
                        { size: TableStringEnum.SMALL },
                        {
                            data: null,
                            array: mappedRes,
                            template: TableStringEnum.BROKER,
                            subType: TableStringEnum.BAN,
                            tableType: ConfirmationMoveStringEnum.BROKER_TEXT,
                            type: !mappedRes[0].data.ban
                                ? TableStringEnum.MOVE
                                : TableStringEnum.REMOVE,
                        }
                    );
                }
            });
    }

    private dnuListSelectedRows(): void {
        this.tableService.currentDnuListSelectedRows
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res?.length) {
                    const mappedRes = res.map((item) => {
                        return {
                            id: item.id,
                            data: {
                                ...item.tableData,
                            },
                            modalTitle: item.tableData.businessName,
                            modalSecondTitle:
                                item.tableData.billingAddress?.address ??
                                TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                        };
                    });

                    this.modalService.openModal(
                        ConfirmationMoveModalComponent,
                        { size: TableStringEnum.SMALL },
                        {
                            data: null,
                            array: mappedRes,
                            template: TableStringEnum.BROKER,
                            subType: TableStringEnum.DNU,
                            tableType: ConfirmationMoveStringEnum.BROKER_TEXT,
                            type: !mappedRes[0].data.dnu
                                ? TableStringEnum.MOVE
                                : TableStringEnum.REMOVE,
                        }
                    );
                }
            });
    }

    private openCloseBussinessSelectedRows(): void {
        this.tableService.currentBussinessSelectedRows
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res?.length) {
                    const mappedRes = res.map((item) => {
                        return {
                            id: item.id,
                            data: {
                                ...item.tableData,
                            },
                            modalTitle: item.tableData.businessName,
                            modalSecondTitle:
                                item.tableData?.address?.address ??
                                item.tableData?.billingAddress?.address ??
                                TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                        };
                    });

                    this.modalService.openModal(
                        ConfirmationActivationModalComponent,
                        { size: TableStringEnum.SMALL },
                        {
                            data: null,
                            array: mappedRes,
                            template: TableStringEnum.INFO,
                            subType:
                                this.selectedTab === TableStringEnum.ACTIVE
                                    ? TableStringEnum.BROKER_2
                                    : TableStringEnum.SHIPPER_3,
                            subTypeStatus: TableStringEnum.BUSINESS,
                            tableType:
                                this.selectedTab === TableStringEnum.ACTIVE
                                    ? ConfirmationActivationStringEnum.BROKER_TEXT
                                    : ConfirmationActivationStringEnum.SHIPPER_TEXT,
                            type: mappedRes[0].data.status
                                ? TableStringEnum.CLOSE
                                : TableStringEnum.OPEN,
                        }
                    );
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
            document.querySelector(TableStringEnum.TABLE_CONTAINER)
        );
    }

    public initTableOptions(): void {
        this.tableOptions = {
            toolbarActions: {
                hidePrintButton: true,
                showBrokerFilter: this.selectedTab === TableStringEnum.ACTIVE,
                showBrokerFilterClosed:
                    this.selectedTab === TableStringEnum.INACTIVE,
                showMoneyFilter: this.selectedTab === TableStringEnum.ACTIVE,
                showLocationFilter:
                    this.selectedTab === TableStringEnum.INACTIVE,
                showStateFilter: this.selectedTab === TableStringEnum.INACTIVE,
                showMoveToBanList: this.selectedTab === TableStringEnum.ACTIVE,
                showMoveToDnuList: this.selectedTab === TableStringEnum.ACTIVE,
                showMoveToOpenList: this.selectedTab === TableStringEnum.ACTIVE,
                showMoveToClosedList: true,
                showRemoveFromBanList:
                    this.selectedTab === TableStringEnum.ACTIVE,
                showRemoveFromDnuList:
                    this.selectedTab === TableStringEnum.ACTIVE,
                hideActivationButton: true,
                viewModeOptions: this.getViewModeOptions(),
            },
        };
    }

    private getViewModeOptions(): {
        name: TableStringEnum;
        active: boolean;
    }[] {
        return this.selectedTab === TableStringEnum.ACTIVE
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
                  //   {
                  //       name: TableStringEnum.MAP,
                  //       active: this.activeViewMode === TableStringEnum.MAP,
                  //   }, this is not going into this sprint
              ];
    }

    private sendCustomerData(): void {
        const tableView = JSON.parse(
            localStorage.getItem(TableStringEnum.CUSTOMER_TABLE_VIEW)
        );

        if (tableView) {
            this.selectedTab = tableView.tabSelected;
            this.activeViewMode = tableView.viewMode;
        }

        this.initTableOptions();

        this.checkActiveViewMode();

        const brokerShipperCount = JSON.parse(
            localStorage.getItem(TableStringEnum.BROKER_SHIPPER_TABLE_COUNT)
        );

        const brokerActiveData =
            this.selectedTab === TableStringEnum.ACTIVE
                ? this.getTabData(TableStringEnum.ACTIVE)
                : [];

        const shipperActiveData =
            this.selectedTab === TableStringEnum.INACTIVE
                ? this.getTabData(TableStringEnum.INACTIVE)
                : [];

        this.tableData = [
            {
                title: TableStringEnum.BROKER,
                field: TableStringEnum.ACTIVE,
                length: brokerShipperCount.broker,
                data: brokerActiveData,
                extended: false,
                moneyCountSelected: false,
                isCustomer: true,
                gridNameTitle: TableStringEnum.CUSTOMER,
                stateName: TableStringEnum.BROKER_3,
                tableConfiguration: TableStringEnum.BROKER,
                bannedArray: DataFilterHelper.checkSpecialFilterArray(
                    brokerActiveData,
                    TableStringEnum.BAN
                ),
                dnuArray: DataFilterHelper.checkSpecialFilterArray(
                    brokerActiveData,
                    TableStringEnum.DNU
                ),
                closedArray: DataFilterHelper.checkSpecialFilterArray(
                    brokerActiveData,
                    TableStringEnum.STATUS
                ),
                isActive: this.selectedTab === TableStringEnum.ACTIVE,
                gridColumns: this.getGridColumns(TableStringEnum.BROKER),
            },
            {
                title: TableStringEnum.SHIPPER,
                field: TableStringEnum.INACTIVE,
                length: brokerShipperCount.shipper,
                data: shipperActiveData,
                moneyCountSelected: false,
                extended: false,
                isCustomer: true,
                closedArray: DataFilterHelper.checkSpecialFilterArray(
                    shipperActiveData,
                    TableStringEnum.STATUS
                ),
                gridNameTitle: TableStringEnum.CUSTOMER,
                stateName: TableStringEnum.SHIPPER_2,
                tableConfiguration: TableStringEnum.SHIPPER,
                isActive: this.selectedTab === TableStringEnum.INACTIVE,
                gridColumns: this.getGridColumns(TableStringEnum.SHIPPER),
            },
        ];

        const td = this.tableData.find((t) => t.field === this.selectedTab);

        this.setCustomerData(td);
    }

    private getTabData(dataType: string): BrokerResponse[] {
        if (dataType === TableStringEnum.ACTIVE) {
            this.brokerActive = this.brokerQuery.getAll();

            return this.brokerActive?.length ? this.brokerActive : [];
        } else if (dataType === TableStringEnum.INACTIVE) {
            this.inactiveTabClicked = true;

            this.shipperActive = this.shipperQuery.getAll();

            return this.shipperActive?.length ? this.shipperActive : [];
        }
    }

    // Check If Selected Tab Has Active View Mode
    private checkActiveViewMode(): void {
        if (this.activeViewMode === TableStringEnum.MAP) {
            let hasMapView = false;

            let viewModeOptions =
                this.tableOptions.toolbarActions.viewModeOptions;

            viewModeOptions.map((viewMode: { name: string }) => {
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

    private getGridColumns(configType: string): string {
        const tableColumnsConfig = JSON.parse(
            localStorage.getItem(`table-${configType}-Configuration`)
        );

        if (configType === TableStringEnum.BROKER) {
            return tableColumnsConfig
                ? tableColumnsConfig
                : getBrokerColumnDefinition();
        } else {
            return tableColumnsConfig
                ? tableColumnsConfig
                : getShipperColumnDefinition();
        }
    }

    private setCustomerData(td: CardTableData): void {
        this.columns = td.gridColumns;

        if (td.data.length) {
            this.viewData = td.data;
            this.viewData = this.viewData.map(
                (data: ShipperResponse | BrokerResponse) => {
                    return this.selectedTab === TableStringEnum.ACTIVE
                        ? this.mapBrokerData(data)
                        : this.mapShipperData(data);
                }
            );

            // Set data for cards based on tab active
            this.selectedTab === TableStringEnum.ACTIVE
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
                      hasBanDnu: data?.ban || data?.dnu || !data?.status,
                      isDnu: data?.dnu,
                      isClosed: data?.status === 0 ?? false,
                      name: data?.businessName
                          ? data.businessName
                          : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                  }
                : data?.businessName,
            tableAddressPhysical: data?.mainAddress?.address
                ? data.mainAddress.address
                : data?.mainPoBox?.poBox
                ? data.mainPoBox.poBox +
                  ' ' +
                  data.mainPoBox.city +
                  ' ' +
                  data.mainPoBox.state +
                  ' ' +
                  data.mainPoBox.zipCode
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableAddressBilling: data?.billingAddress?.address
                ? data.billingAddress.address
                : data?.billingPoBox?.poBox
                ? data.mainPoBox.poBox +
                  ' ' +
                  data.mainPoBox.city +
                  ' ' +
                  data.mainPoBox.state +
                  ' ' +
                  data.mainPoBox.zipCode
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tablePaymentDetailAvailCredit: data?.availableCredit
                ? TableStringEnum.DOLLAR_SIGN +
                  this.thousandSeparator.transform(data.availableCredit)
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tablePaymentDetailCreditLimit: data?.creditLimit
                ? TableStringEnum.DOLLAR_SIGN +
                  this.thousandSeparator.transform(data.creditLimit)
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tablePaymentDetailTerm: data?.payTerm?.name
                ? data.payTerm.name
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tablePaymentDetailDTP: data?.daysToPay
                ? data.daysToPay + TableStringEnum.DAY
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tablePaidInvAging: {
                ...data.brokerPaidInvoiceAgeing,
                tablePayTerm: data?.payTerm,
            },
            tableUnpaidInvAging: {
                ...data.brokerUnpaidInvoiceAgeing,
                tablePayTerm: data?.payTerm,
            },
            tableLoads: data?.loadCount
                ? this.thousandSeparator.transform(data.loadCount)
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableMiles: data?.miles
                ? this.thousandSeparator.transform(data.miles)
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tablePPM: data?.pricePerMile
                ? TableStringEnum.DOLLAR_SIGN +
                  this.thousandSeparator.transform(data.pricePerMile)
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableRevenue: data?.revenue
                ? TableStringEnum.DOLLAR_SIGN +
                  this.thousandSeparator.transform(data.revenue)
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            reviews: data?.ratingReviews,
            tableContactData: data?.brokerContacts,
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
                      hasBanDnu: !data?.status,
                      isDnu: false,
                      isClosed: data?.status === 0 ?? false,
                      name: data?.businessName
                          ? data.businessName
                          : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                  }
                : data?.businessName,
            isSelected: false,
            tableAddress: data?.address?.address
                ? data.address.address
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableLoads: TableStringEnum.NA,
            tableAverageWatingTimePickup: data?.avgPickupTimeInMin
                ? data.avgPickupTimeInMin.toString()
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableAverageWatingTimeDelivery: data?.avgDeliveryTimeInMin
                ? data.avgDeliveryTimeInMin.toString()
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,

            tableAvailableHoursShipping:
                data?.shippingFrom && data?.shippingTo
                    ? data?.shippingFrom + ' - ' + data?.shippingTo
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableAvailableHoursReceiving:
                data?.receivingFrom && data?.receivingTo
                    ? data?.receivingFrom + ' - ' + data?.receivingTo
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            reviews: null,
            tableContactData: data?.shipperContacts,
            tableAdded: data.createdAt
                ? this.datePipe.transform(
                      data.createdAt,
                      TableStringEnum.DATE_FORMAT
                  )
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableEdited: TableStringEnum.NA,
            tableDropdownContent: {
                hasContent: true,
                content: this.getDropdownShipperContent(data),
            },
        };
    }

    private getDropdownBrokerContent(data): DropdownItem[] {
        const dropdownContent =
            DropdownContentHelper.getDropdownBrokerContent(data);

        dropdownContent.map((dropItem) => {
            if (
                dropItem.name === TableStringEnum.CREATE_LOAD &&
                (data.ban || data.dnu)
            )
                dropItem.mutedStyle = true;
            else dropItem.mutedStyle = false;

            if (
                !data.status &&
                [
                    TableStringEnum.CREATE_LOAD.toString(),
                    TableStringEnum.ADD_CONTRACT.toString(),
                    TableStringEnum.WRITE_REVIEW.toString(),
                    TableStringEnum.MOVE_TO_BAN_LIST.toString(),
                ].includes(dropItem.name)
            )
                dropItem.mutedStyle = true;
            else dropItem.mutedStyle = false;

            return dropItem;
        });

        return dropdownContent;
    }

    private getDropdownShipperContent(data): DropdownItem[] {
        return DropdownContentHelper.getDropdownShipperContent(data);
    }

    // Update Broker And Shipper Count
    private updateDataCount(): void {
        const brokerShipperCount = JSON.parse(
            localStorage.getItem(TableStringEnum.BROKER_SHIPPER_TABLE_COUNT)
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
            status: number | undefined;
            invoiceAgeingFrom: number | undefined;
            invoiceAgeingTo: number | undefined;
            availableCreditFrom: number | undefined;
            availableCreditTo: number | undefined;
            revenueFrom: number | undefined;
            revenueTo: number | undefined;
            _long: number | undefined;
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
        this.brokerService
            .getBrokerList(
                filter.ban,
                filter.dnu,
                filter.status,
                filter.invoiceAgeingFrom,
                filter.invoiceAgeingTo,
                filter.availableCreditFrom,
                filter.availableCreditTo,
                filter.revenueFrom,
                filter.revenueTo,
                filter._long,
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
    public onToolBarAction(event: TableToolbarActions): void {
        // Add Call
        if (event.action === TableStringEnum.OPEN_MODAL) {
            // Add Broker Call Modal

            if (this.selectedTab === TableStringEnum.ACTIVE) {
                this.modalService.openModal(BrokerModalComponent, {
                    size: TableStringEnum.MEDIUM,
                });
            }
            // Add Shipper Call Modal
            else {
                this.modalService.openModal(ShipperModalComponent, {
                    size: TableStringEnum.MEDIUM,
                });
            }
        }
        // Switch Tab Call
        else if (event.action === TableStringEnum.TAB_SELECTED) {
            this.selectedTab = event.tabData.field as TableStringEnum;

            this.backBrokerFilterQuery.pageIndex = 1;
            this.backShipperFilterQuery.pageIndex = 1;

            this.sendCustomerData();
        } else if (event.action === TableStringEnum.VIEW_MODE) {
            this.activeViewMode = event.mode;

            this.tableOptions.toolbarActions.hideSearch =
                event.mode == TableStringEnum.MAP;

            this.sendCustomerData();
        }
    }

    // Head Actions
    public onTableHeadActions(event: {
        action: string;
        direction: string;
    }): void {
        if (event.action === TableStringEnum.SORT) {
            if (event.direction) {
                if (this.selectedTab === TableStringEnum.ACTIVE) {
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
        if (event.type === TableStringEnum.SHOW_MORE) {
            if (this.selectedTab === TableStringEnum.ACTIVE) {
                this.backBrokerFilterQuery.pageIndex++;

                this.brokerBackFilter(this.backBrokerFilterQuery, true);
            } else {
                this.backShipperFilterQuery.pageIndex++;

                this.shipperBackFilter(this.backShipperFilterQuery, true);
            }
        } else if (
            event.type === TableStringEnum.EDIT_CUSTOMER_OR_SHIPPER ||
            event.type === TableStringEnum.ADD_CONTRACT ||
            event.type === TableStringEnum.EDIT_CONTACT ||
            event.type === TableStringEnum.DELTETE_CONTACT ||
            event.type === TableStringEnum.WRITE_REVIEW
        ) {
            // Edit Broker Call Modal
            if (this.selectedTab === TableStringEnum.ACTIVE) {
                this.modalService.openModal(
                    BrokerModalComponent,
                    { size: TableStringEnum.SMALL },
                    {
                        ...event,
                        type: TableStringEnum.EDIT,
                        dnuButton: true,
                        bfbButton: true,
                        tab: 3,
                        openedTab:
                            event.type === TableStringEnum.ADD_CONTRACT ||
                            event.type === TableStringEnum.EDIT_CONTACT ||
                            event.type === TableStringEnum.DELTETE_CONTACT
                                ? TableStringEnum.CONTRACT
                                : event.type === TableStringEnum.WRITE_REVIEW
                                ? TableStringEnum.REVIEW
                                : TableStringEnum.DETAIL,
                    }
                );
            }
            // Edit Shipper Call Modal
            else {
                this.modalService.openModal(
                    ShipperModalComponent,
                    { size: TableStringEnum.SMALL },
                    {
                        ...event,
                        type: TableStringEnum.EDIT,
                        openedTab:
                            event.type === TableStringEnum.ADD_CONTRACT
                                ? TableStringEnum.CONTRACT
                                : event.type === TableStringEnum.WRITE_REVIEW
                                ? TableStringEnum.REVIEW
                                : TableStringEnum.DETAIL,
                    }
                );
            }
        } else if (event.type === TableStringEnum.MOVE_TO_BAN_LIST) {
            const mappedEvent = {
                ...event,
                type: !event.data.ban
                    ? TableStringEnum.MOVE
                    : TableStringEnum.REMOVE,
            };

            this.modalService.openModal(
                ConfirmationMoveModalComponent,
                { size: TableStringEnum.SMALL },
                {
                    ...mappedEvent,
                    template: TableStringEnum.BROKER,
                    subType: TableStringEnum.BAN,
                    tableType: ConfirmationMoveStringEnum.BROKER_TEXT,
                    modalTitle: event.data.businessName,
                    modalSecondTitle:
                        event.data?.billingAddress?.address ??
                        TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                }
            );
        } else if (event.type === TableStringEnum.MOVE_TO_DNU_LIST) {
            const mappedEvent = {
                ...event,
                type: !event.data.dnu
                    ? TableStringEnum.MOVE
                    : TableStringEnum.REMOVE,
            };

            this.modalService.openModal(
                ConfirmationMoveModalComponent,
                { size: TableStringEnum.SMALL },
                {
                    ...mappedEvent,
                    template: TableStringEnum.BROKER,
                    subType: TableStringEnum.DNU,
                    tableType: ConfirmationMoveStringEnum.BROKER_TEXT,
                    modalTitle: event.data.businessName,
                    modalSecondTitle:
                        event.data?.billingAddress?.address ??
                        TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                }
            );
        } else if (event.type === TableStringEnum.CLOSE_BUSINESS) {
            const mappedEvent = {
                ...event,
                type: event.data.status
                    ? TableStringEnum.CLOSE
                    : TableStringEnum.OPEN,
            };

            this.modalService.openModal(
                ConfirmationActivationModalComponent,
                { size: TableStringEnum.SMALL },
                {
                    ...mappedEvent,
                    template: TableStringEnum.INFO,
                    subType:
                        this.selectedTab === TableStringEnum.ACTIVE
                            ? TableStringEnum.BROKER_2
                            : TableStringEnum.SHIPPER_3,
                    subTypeStatus: TableStringEnum.BUSINESS,
                    tableType:
                        this.selectedTab === TableStringEnum.ACTIVE
                            ? ConfirmationActivationStringEnum.BROKER_TEXT
                            : ConfirmationActivationStringEnum.SHIPPER_TEXT,
                    modalTitle: event.data.businessName,
                    modalSecondTitle:
                        event.data?.address?.address ??
                        event.data?.billingAddress?.address ??
                        TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                }
            );
        } else if (event.type === TableStringEnum.VIEW_DETAILS) {
            if (this.selectedTab === TableStringEnum.ACTIVE) {
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
        else if (event.type === TableStringEnum.DELETE) {
            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: TableStringEnum.DELETE },
                {
                    ...event,
                    template:
                        this.selectedTab === TableStringEnum.ACTIVE
                            ? TableStringEnum.BROKER
                            : TableStringEnum.SHIPPER,
                    type: TableStringEnum.DELETE,
                    svg: true,
                    modalHeaderTitle:
                        this.selectedTab === TableStringEnum.ACTIVE
                            ? ConfirmationModalStringEnum.DELETE_BROKER
                            : ConfirmationModalStringEnum.DELETE_SHIPPER,
                }
            );
        }
        // Raiting
        else if (event.type === TableStringEnum.RATING) {
            let raitingData = {
                entityTypeRatingId:
                    this.selectedTab === TableStringEnum.ACTIVE ? 1 : 3,
                entityTypeId: event.data.id,
                thumb: event.subType === TableStringEnum.LIKE ? 1 : -1,
                tableData: event.data,
            };

            this.reviewRatingService
                .addRating(raitingData)
                .pipe(takeUntil(this.destroy$))
                .subscribe((res: RatingSetResponse) => {
                    let newViewData = [...this.viewData];

                    newViewData.map((data: CustomerUpdateRating) => {
                        if (data.id === event.data.id) {
                            data.actionAnimation = TableStringEnum.UPDATE;
                            data.tableRaiting = {
                                hasLiked: res.currentCompanyUserRating === 1,
                                hasDislike: res.currentCompanyUserRating === -1,
                                likeCount: res?.upCount
                                    ? res.upCount
                                    : TableStringEnum.NUMBER_0,
                                dislikeCount: res?.downCount
                                    ? res.downCount
                                    : TableStringEnum.NUMBER_0,
                            };
                        }
                    });

                    this.viewData = [...newViewData];

                    const interval = setInterval(() => {
                        this.viewData =
                            MethodsGlobalHelper.closeAnimationAction(
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
            type: TableStringEnum.SHOW_MORE,
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
                businessName + TableStringEnum.COMA + event.data.businessName);
        }
    }

    // Add Shipper Or Broker To Viewdata
    private addData(dataId: number): void {
        this.viewData = this.viewData.map((data: CustomerViewDataResponse) => {
            if (data.id === dataId) {
                data.actionAnimation = TableStringEnum.ADD;
            }
            return data;
        });

        this.updateDataCount();

        const interval = setInterval(() => {
            this.viewData = MethodsGlobalHelper.closeAnimationAction(
                false,
                this.viewData
            );

            clearInterval(interval);
        }, 2300);
    }

    // Update Shipper Or Broker In Viewdata
    private updateData(dataId: number, updatedData: MappedShipperBroker): void {
        this.viewData = this.viewData.map((data) => {
            if (data.id === dataId) {
                data = updatedData;
                data.actionAnimation = TableStringEnum.UPDATE;
            }

            return data;
        });

        this.ref.detectChanges();

        const interval = setInterval(() => {
            this.viewData = MethodsGlobalHelper.closeAnimationAction(
                false,
                this.viewData
            );

            clearInterval(interval);
        }, 1000);
    }

    // Delete Shipper Or Broker From Viewdata
    private deleteDataById(dataId: number): void {
        this.viewData = this.viewData.map((data: CustomerViewDataResponse) => {
            if (data.id === dataId) {
                data.actionAnimation = TableStringEnum.DELETE;
            }

            return data;
        });

        this.updateDataCount();

        const interval = setInterval(() => {
            this.viewData = MethodsGlobalHelper.closeAnimationAction(
                true,
                this.viewData
            );

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
                    data.actionAnimation = TableStringEnum.DELETE_MULTIPLE;
                }
            });

            return data;
        });

        this.updateDataCount();

        const interval = setInterval(() => {
            this.viewData = MethodsGlobalHelper.closeAnimationAction(
                true,
                this.viewData
            );

            clearInterval(interval);
        }, 900);

        this.tableService.sendRowsSelected([]);
        this.tableService.sendResetSelectedColumns(true);
    }

    private rowsSelected(): void {
        this.tableService.currentRowsSelected
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) {
                    if (this.selectedTab === TableStringEnum.ACTIVE) {
                        let selectedBannedCount = 0;
                        let selectedNotBannedCount = 0;
                        let selectedDnuCount = 0;
                        let selectedNotDnuCount = 0;
                        let selectedClosedCount = 0;
                        let selectedOpenCount = 0;

                        res.forEach((item) => {
                            if (item.tableData.ban) selectedBannedCount++;
                            else selectedNotBannedCount++;

                            if (item.tableData.dnu) selectedDnuCount++;
                            else selectedNotDnuCount++;

                            if (item.tableData.status) selectedOpenCount++;
                            else selectedClosedCount++;
                        });

                        this.tableOptions.toolbarActions.showMoveToBanList =
                            selectedNotBannedCount &&
                            !selectedBannedCount &&
                            !selectedDnuCount &&
                            !selectedClosedCount;

                        this.tableOptions.toolbarActions.showMoveToDnuList =
                            selectedNotDnuCount &&
                            !selectedDnuCount &&
                            !selectedBannedCount &&
                            !selectedClosedCount;

                        this.tableOptions.toolbarActions.showMoveToOpenList =
                            selectedClosedCount && !selectedOpenCount;

                        this.tableOptions.toolbarActions.showMoveToClosedList =
                            selectedOpenCount && !selectedClosedCount;

                        this.tableOptions.toolbarActions.showRemoveFromBanList =
                            selectedBannedCount &&
                            !selectedNotBannedCount &&
                            !selectedClosedCount;

                        this.tableOptions.toolbarActions.showRemoveFromDnuList =
                            selectedDnuCount &&
                            !selectedNotDnuCount &&
                            !selectedClosedCount;
                    } else {
                        let selectedClosedCount = 0;
                        let selectedOpenCount = 0;

                        res.forEach((item) => {
                            if (item.tableData.status) selectedOpenCount++;
                            else selectedClosedCount++;
                        });

                        this.tableOptions.toolbarActions.showMoveToOpenList =
                            selectedClosedCount && !selectedOpenCount;

                        this.tableOptions.toolbarActions.showMoveToClosedList =
                            selectedOpenCount && !selectedClosedCount;
                    }
                }
            });
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
