import {
    Component,
    OnInit,
    OnDestroy,
    AfterViewInit,
    ChangeDetectorRef,
} from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

// components
import { BrokerModalComponent } from '@pages/customer/pages/broker-modal/broker-modal.component';
import { ShipperModalComponent } from '@pages/customer/pages/shipper-modal/shipper-modal.component';
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';
import { ConfirmationMoveModalComponent } from '@shared/components/ta-shared-modals/confirmation-move-modal/confirmation-move-modal.component';
import { ConfirmationActivationModalComponent } from '@shared/components/ta-shared-modals/confirmation-activation-modal/confirmation-activation-modal.component';

// base classes
import { CustomerDropdownMenuActionsBase } from '@pages/customer/base-classes';

// settings
import {
    getBrokerColumnDefinition,
    getShipperColumnDefinition,
} from '@shared/utils/settings/table-settings/customer-columns';

// services
import { ModalService } from '@shared/services/modal.service';
import { BrokerService, ShipperService } from '@pages/customer/services';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { DetailsDataService } from '@shared/services/details-data.service';
import { MapsService } from '@shared/services/maps.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { ConfirmationMoveService } from '@shared/components/ta-shared-modals/confirmation-move-modal/services/confirmation-move.service';
import { ConfirmationActivationService } from '@shared/components/ta-shared-modals/confirmation-activation-modal/services/confirmation-activation.service';
import { CustomerCardsModalService } from '@pages/customer/pages/customer-table/components/customer-card-modal/services';
import {
    CaSearchMultipleStatesService,
    ICaMapProps,
    IMapBoundsZoom,
    IMapMarkers,
    IMapSelectedMarkerData,
    SortColumn,
    MapMarkerIconService,
} from 'ca-components';
import { LoadStoreService } from '@pages/load/pages/load-table/services/load-store.service';

// store
import { BrokerState } from '@pages/customer/state/broker-state/broker.store';
import { ShipperState } from '@pages/customer/state/shipper-state/shipper.store';
import { BrokerQuery } from '@pages/customer/state/broker-state/broker.query';
import { ShipperQuery } from '@pages/customer/state/shipper-state/shipper.query';
import { Store, select } from '@ngrx/store';
import {
    selectActiveTabCards,
    selectInactiveTabCards,
} from '@pages/customer/pages/customer-table/components/customer-card-modal/state';

// pipes
import { ThousandSeparatorPipe, FormatCurrencyPipe } from '@shared/pipes';

// enums
import { TableStringEnum, TableActionsStringEnum } from '@shared/enums';
import { ConfirmationMoveStringEnum } from '@shared/components/ta-shared-modals/confirmation-move-modal/enums/confirmation-move-string.enum';
import { ConfirmationActivationStringEnum } from '@shared/components/ta-shared-modals/confirmation-activation-modal/enums/confirmation-activation-string.enum';
import { BrokerModalStringEnum } from '@pages/customer/pages/broker-modal/enums';
import { CustomerTableStringEnum } from '@pages/customer/pages/customer-table/enums';

// constants
import {
    CustomerCardDataConfigConstants,
    ShipperMapConfig,
} from './utils/constants';
import { TableDropdownComponentConstants } from '@shared/utils/constants/table-dropdown-component.constants';

// helpers
import {
    DropdownMenuContentHelper,
    DataFilterHelper,
    MethodsGlobalHelper,
} from '@shared/utils/helpers';
import { ShipperMapDropdownHelper } from '@pages/customer/pages/customer-table/utils/helpers';

// models
import {
    BrokerResponse,
    GetBrokerListResponse,
    ShipperListResponse,
    ShipperResponse,
} from 'appcoretruckassist';
import { CardRows } from '@shared/models/card-models/card-rows.model';
import { CustomerViewDataResponse } from '@pages/customer/pages/customer-table/models/customer-viewdata-response.model';
import { TableToolbarActions } from '@shared/models/table-models/table-toolbar-actions.model';
import { MappedShipperBroker } from '@pages/customer/pages/customer-table/models/mapped-shipper-broker.model';
import { FilterOptionBroker } from '@pages/customer/pages/customer-table/models/filter-option-broker.model';
import { FilterOptionShipper } from '@pages/customer/pages/customer-table/models/filter-option-shipper.model';
import { CardTableData } from '@shared/models/table-models/card-table-data.model';
import { TableColumnConfig } from '@shared/models/table-models/table-column-config.model';
import { MapList } from '@pages/repair/pages/repair-table/models';
import { DropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/models';

@Component({
    selector: 'app-customer-table',
    templateUrl: './customer-table.component.html',
    styleUrls: [
        './customer-table.component.scss',
        '../../../../../assets/scss/maps.scss',
    ],
    providers: [ThousandSeparatorPipe, FormatCurrencyPipe],
})
export class CustomerTableComponent
    extends CustomerDropdownMenuActionsBase
    implements OnInit, AfterViewInit, OnDestroy
{
    protected destroy$ = new Subject<void>();

    public resizeObserver: ResizeObserver;
    public activeViewMode: string = TableStringEnum.LIST;

    public selectedTab = TableStringEnum.ACTIVE;

    public customerTableData: (BrokerState | ShipperState)[] = [];

    public isShipperTabClicked: boolean = false;

    // table
    public tableOptions: any;
    public tableData: any[] = [];
    public viewData: any[] = [];
    public columns: TableColumnConfig[] = [];

    // cards
    public displayRowsFront: CardRows[] =
        CustomerCardDataConfigConstants.displayRowsFrontBroker;
    public displayRowsBack: CardRows[] =
        CustomerCardDataConfigConstants.displayRowsBackBroker;
    public displayRowsFrontShipper: CardRows[] =
        CustomerCardDataConfigConstants.displayRowsFrontShipper;
    public displayRowsBackShipper: CardRows[] =
        CustomerCardDataConfigConstants.displayRowsBackShipper;

    public activeTableDataLength: number;

    public sendDataToCardsFront: CardRows[];
    public sendDataToCardsBack: CardRows[];
    public displayRows$: Observable<any>; //leave this as any for now

    // map
    public mapListData: MapList[] = [];

    public mapData: ICaMapProps = ShipperMapConfig.shipperMapConfig;
    public mapListPagination: { pageIndex: number; pageSize: number } =
        ShipperMapConfig.shipperMapListPagination;
    public mapClustersPagination: { pageIndex: number; pageSize: number } =
        ShipperMapConfig.shipperMapListPagination;
    public mapClustersObject: {
        northEastLatitude: number;
        northEastLongitude: number;
        southWestLatitude: number;
        southWestLongitude: number;
        zoomLevel: number;
    } = null;
    public mapListSearchValue: string | null = null;
    public mapListSortDirection: string | null = null;
    public shipperMapListSortColumns: SortColumn[] =
        ShipperMapConfig.shipperMapListSortColumns;
    public isAddedNewShipper: boolean = false;
    public mapStateFilter: string[] | null = null;
    public isSelectedFromMapList: boolean = false;
    public mapListCount: number = 0;
    public isSelectedFromDetails: boolean = false;

    // filters
    public filter: string;
    public backBrokerFilterQuery: FilterOptionBroker =
        TableDropdownComponentConstants.BROKER_BACK_FILTER;
    public backShipperFilterQuery: FilterOptionShipper =
        TableDropdownComponentConstants.SHIPPER_BACK_FILTER;

    constructor(
        // ref
        private ref: ChangeDetectorRef,

        // services
        protected modalService: ModalService,
        private tableService: TruckassistTableService,
        private brokerService: BrokerService,
        private shipperService: ShipperService,
        protected detailsDataService: DetailsDataService,
        private mapsService: MapsService,
        private confirmationService: ConfirmationService,
        private confirmationMoveService: ConfirmationMoveService,
        private confirmationActivationService: ConfirmationActivationService,
        private customerCardsModalService: CustomerCardsModalService,
        private caSearchMultipleStatesService: CaSearchMultipleStatesService,
        private markerIconService: MapMarkerIconService,
        protected loadStoreService: LoadStoreService,

        // store
        private brokerQuery: BrokerQuery,
        private shipperQuery: ShipperQuery,
        private store: Store,

        // pipes
        private thousandSeparator: ThousandSeparatorPipe,
        public datePipe: DatePipe,
        private formatCurrencyPipe: FormatCurrencyPipe,

        // router
        protected router: Router
    ) {
        super();
    }

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

        this.addMapListScrollEvent();

        this.addSelectedMarkerListener();

        this.checkSelectedMarker();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.observeTableContainer();
        }, 10);
    }

    private confirmationSubscribe(): void {
        this.confirmationService.confirmationData$
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
                        if (this.selectedTab === TableStringEnum.INACTIVE) {
                            if (res?.array?.length === 1)
                                this.deleteShipperById(res.array[0]);
                            else this.deleteShipperList(res.array);
                        } else {
                            if (res?.array?.length === 1)
                                this.deleteBrokerById(res.array[0]);
                            else this.deleteBrokerList(res.array);
                        }

                        break;
                    case TableStringEnum.CLOSE:
                        if (this.selectedTab === TableStringEnum.INACTIVE) {
                            if (
                                res.template !==
                                BrokerModalStringEnum.DELETE_REVIEW
                            )
                                this.changeBussinesStatusShipper(res.data);
                        }
                        break;
                    case TableStringEnum.OPEN:
                        if (this.selectedTab === TableStringEnum.INACTIVE)
                            this.changeBussinesStatusShipper(res.data);

                        break;
                    case TableStringEnum.DELETE:
                        if (
                            res.template !== BrokerModalStringEnum.DELETE_REVIEW
                        ) {
                            if (this.selectedTab === TableStringEnum.ACTIVE)
                                this.deleteBrokerById(res.id);
                            else this.deleteShipperById(res.id);
                        }

                        break;
                    default:
                        break;
                }
            });

        this.confirmationMoveService.getConfirmationMoveData$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) {
                    if (res?.tableType) {
                        this.filter = null;
                        this.tableService.sendResetSpecialFilters(true);

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
                }
            });

        this.confirmationActivationService.getConfirmationActivationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) {
                    this.filter = null;

                    this.tableService.sendResetSpecialFilters(true);

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

                this.resetTableSelectedRows();
            });
    }

    private deleteBrokerList(ids: number[]): void {
        this.brokerService
            .deleteBrokerList(ids)
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                this.viewData = this.viewData.map((broker) => {
                    if (res?.deletedIds) {
                        res?.deletedIds?.forEach((id) => {
                            if (broker.id === id)
                                broker = {
                                    ...broker,
                                    actionAnimation:
                                        TableStringEnum.DELETE_MULTIPLE,
                                };
                        });

                        res?.notDeletedIds?.forEach((notDeletedId) => {
                            if (broker.id === notDeletedId)
                                broker = { ...broker, isSelected: false };
                        });
                    } else {
                        ids.forEach((id) => {
                            if (broker.id === id)
                                broker = {
                                    ...broker,
                                    actionAnimation:
                                        TableStringEnum.DELETE_MULTIPLE,
                                };
                        });
                    }

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

                this.resetTableSelectedRows();
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

                this.resetTableSelectedRows();
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

                this.resetTableSelectedRows();
            });
    }

    public changeDnuStatus(data: BrokerResponse): void {
        this.brokerService
            .changeDnuStatus(data.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.sendCustomerData();

                this.resetTableSelectedRows();
            });
    }

    public changeBussinesStatusBroker(data: BrokerResponse): void {
        this.brokerService
            .changeBrokerStatus(data.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.sendCustomerData();
            });
    }

    public changeBussinesStatusShipper(data: ShipperResponse): void {
        this.shipperService
            .changeShipperStatus(data.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.sendCustomerData();
            });
    }

    public changeBanStatus(data: BrokerResponse): void {
        this.brokerService
            .changeBanStatus(data.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.sendCustomerData();

                this.resetTableSelectedRows();
            });
    }

    public changeBanListStatus(dataArray: BrokerResponse[]): void {
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

                this.resetTableSelectedRows();
            });
    }

    public changeDnuListStatus(dataArray: BrokerResponse[]): void {
        const brokerIds = dataArray.map((broker) => {
            return broker.id;
        });

        this.brokerService
            .changeDnuListStatus(brokerIds)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.sendCustomerData();

                this.resetTableSelectedRows();
            });
    }

    public changeBrokerListStatus(dataArray: BrokerResponse[]): void {
        const brokerIds = dataArray.map((broker) => {
            return broker.id;
        });

        this.brokerService
            .changeBrokerListStatus(brokerIds)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.sendCustomerData();

                this.resetTableSelectedRows();
            });
    }

    public changeShipperListStatus(dataArray: ShipperResponse[]): void {
        const shipperIds = dataArray.map((shipper) => {
            return shipper.id;
        });

        this.shipperService
            .changeShipperListStatus(shipperIds)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.sendCustomerData();

                this.resetTableSelectedRows();
            });
    }

    public setTableFilter(): void {
        this.tableService.currentSetTableFilter
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res?.filteredArray) {
                    if (res.selectedFilter) {
                        const resetFirstFilter =
                            res.filterName === TableStringEnum.BAN
                                ? TableStringEnum.DNU_FILTER
                                : res.filterName === TableStringEnum.DNU
                                  ? TableStringEnum.CLOSED_FILTER
                                  : TableStringEnum.BAN_FILTER;

                        const resetSecondFilter =
                            res.filterName === TableStringEnum.BAN
                                ? TableStringEnum.CLOSED_FILTER
                                : res.filterName === TableStringEnum.DNU
                                  ? TableStringEnum.BAN_FILTER
                                  : TableStringEnum.DNU_FILTER;

                        this.tableService.sendResetSpecialFilters(
                            true,
                            resetFirstFilter
                        );

                        this.tableService.sendResetSpecialFilters(
                            true,
                            resetSecondFilter
                        );

                        this.filter = res.filterName;

                        this.sendCustomerData();

                        this.viewData = this.customerTableData?.filter(
                            (customerData) =>
                                res.filteredArray.some(
                                    (filterData) =>
                                        filterData.id === customerData.id
                                )
                        );

                        if (this.activeViewMode === TableStringEnum.MAP)
                            this.updateMapItem();
                    }

                    if (!res.selectedFilter && res.filterName === this.filter) {
                        this.filter = null;
                        this.viewData = this.customerTableData;

                        this.sendCustomerData();

                        if (this.activeViewMode === TableStringEnum.MAP)
                            this.updateMapItem();
                    }

                    if (res.filterName === TableStringEnum.BAN) {
                        this.backBrokerFilterQuery.ban = res.selectedFilter
                            ? 0
                            : null;

                        this.backBrokerFilterQuery.dnu = null;
                        this.backBrokerFilterQuery.status = null;
                    } else if (res.filterName === TableStringEnum.DNU) {
                        this.backBrokerFilterQuery.dnu = res.selectedFilter
                            ? 0
                            : null;

                        this.backBrokerFilterQuery.ban = null;
                        this.backBrokerFilterQuery.status = null;
                    } else if (
                        res.filterName === TableStringEnum.CLOSED_ARRAY
                    ) {
                        this.backBrokerFilterQuery.status = res.selectedFilter
                            ? 0
                            : null;

                        this.backBrokerFilterQuery.ban = null;
                        this.backBrokerFilterQuery.dnu = null;
                    }

                    if (this.selectedTab === TableStringEnum.ACTIVE) {
                        this.tableData[0].length = this.viewData.length;
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

                            this.mapStateFilter = [
                                ...res.queryParams.canadaArray.map(
                                    (canadaState) => {
                                        return canadaState.stateName;
                                    }
                                ),
                                ...res.queryParams.usaArray.map((usaState) => {
                                    return usaState.stateName;
                                }),
                            ];
                        }

                        if (res.action === TableStringEnum.CLEAR) {
                            this.viewData = this.customerTableData;
                            this.mapStateFilter = null;
                        }
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
                                ?.moneyArray[0]?.from
                                ? parseInt(
                                      res.queryParams.moneyArray[0].from.replace(
                                          /,/g,
                                          ''
                                      )
                                  )
                                : null;
                            const invoiceFilterTo = res.queryParams
                                ?.moneyArray[0]?.to
                                ? parseInt(
                                      res.queryParams.moneyArray[0].to.replace(
                                          /,/g,
                                          ''
                                      )
                                  )
                                : null;

                            const availableCreditFilterFrom = res.queryParams
                                ?.moneyArray[1]?.from
                                ? parseInt(
                                      res.queryParams.moneyArray[1].from.replace(
                                          /,/g,
                                          ''
                                      )
                                  )
                                : null;
                            const availableCreditFilterTo = res.queryParams
                                ?.moneyArray[1]?.to
                                ? parseInt(
                                      res.queryParams.moneyArray[1].to.replace(
                                          /,/g,
                                          ''
                                      )
                                  )
                                : null;

                            const revenueFilterFrom = res.queryParams
                                ?.moneyArray[2]?.from
                                ? parseInt(
                                      res.queryParams.moneyArray[2].from.replace(
                                          /,/g,
                                          ''
                                      )
                                  )
                                : null;
                            const revenueFilterTo = res.queryParams
                                ?.moneyArray[2]?.to
                                ? parseInt(
                                      res.queryParams.moneyArray[2].to.replace(
                                          /,/g,
                                          ''
                                      )
                                  )
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

                if (this.activeViewMode === TableStringEnum.MAP) {
                    this.isAddedNewShipper = true;
                    this.getMapData();
                }
            });
    }

    public resetColumns(): void {
        this.tableService.currentResetColumns
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: boolean) => {
                if (response) this.sendCustomerData();
            });
    }

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

    public toogleColumns(): void {
        this.tableService.currentToaggleColumn
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
                if (response?.column) {
                    this.columns = this.columns.map((col) => {
                        if (col.field === response.column.field)
                            col.hidden = response.column.hidden;

                        return col;
                    });
                }
            });
    }

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
                    if (this.filter) {
                        this.filter = null;

                        this.tableService.sendResetSpecialFilters(true);
                    } else {
                        this.viewData.push(this.mapBrokerData(res.data));
                    }

                    this.addData(res.id);
                }

                // Update Broker
                else if (
                    res?.animation === TableStringEnum.UPDATE &&
                    res.tab === TableStringEnum.BROKER
                ) {
                    const updatedBroker = this.mapBrokerData(res.data);

                    this.updateData(res.id, updatedBroker);

                    this.sendCustomerData();
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

                    if (this.activeViewMode === TableStringEnum.MAP) {
                        this.isAddedNewShipper = true;
                        this.getMapData();
                    }
                }

                // Update Shipper
                else if (
                    res?.animation === TableStringEnum.UPDATE &&
                    res.tab === TableStringEnum.SHIPPER
                ) {
                    const updatedShipper = this.mapShipperData(res.data);

                    this.updateData(res.id, updatedShipper);

                    if (this.activeViewMode === TableStringEnum.MAP) {
                        this.isAddedNewShipper = true;
                        this.getMapData();
                    }
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

    public search(): void {
        this.caSearchMultipleStatesService.currentSearchTableData
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
                            modalTitle:
                                item.tableData.businessName.name ??
                                item.tableData.businessName,
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
                            modalTitle:
                                item.tableData.businessName.name ??
                                item.tableData.businessName,
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
                            modalTitle:
                                item.tableData.businessName.name ??
                                item.tableData.businessName,
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
                fuelMoneyFilter: false,
                loadMoneyFilter: false,
                hideSearch: this.activeViewMode === TableStringEnum.MAP,
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
                  {
                      name: TableStringEnum.MAP,
                      active: this.activeViewMode === TableStringEnum.MAP,
                  },
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

        const filteredBrokerData = this.filterBanDnuBrokerData(
            this.getTabData(TableStringEnum.ACTIVE),
            this.filter
        );

        const shipperActiveData =
            this.selectedTab === TableStringEnum.INACTIVE
                ? this.getTabData(TableStringEnum.INACTIVE)
                : [];

        this.tableData = [
            {
                title: TableStringEnum.BROKER,
                field: TableStringEnum.ACTIVE,
                length: filteredBrokerData?.length,
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
        this.updateCardView();

        this.resetTableSelectedRows();
    }

    private getTabData(dataType: string): BrokerResponse[] {
        if (dataType === TableStringEnum.ACTIVE) {
            const brokerActive = this.brokerQuery.getAll();

            return brokerActive?.length ? brokerActive : [];
        } else if (dataType === TableStringEnum.INACTIVE) {
            this.isShipperTabClicked = true;

            const shipperActive = this.shipperQuery.getAll();

            return shipperActive?.length ? shipperActive : [];
        }
    }

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

            this.tableOptions.toolbarActions = {
                ...this.tableOptions.toolbarActions,
                viewModeOptions: [...viewModeOptions],
                hideSearch: this.activeViewMode === TableStringEnum.MAP,
            };
        }
    }

    private getGridColumns(configType: string): string {
        const tableColumnsConfig = JSON.parse(
            localStorage.getItem(`table-${configType}-Configuration`)
        );

        return (
            tableColumnsConfig ??
            (configType === TableStringEnum.BROKER
                ? getBrokerColumnDefinition()
                : getShipperColumnDefinition())
        );
    }

    private setCustomerData(tdata: CardTableData): void {
        this.columns = tdata.gridColumns;

        if (tdata.data.length) {
            this.viewData = tdata.data;
            this.viewData = this.viewData.map(
                (data: ShipperResponse | BrokerResponse) => {
                    return this.selectedTab === TableStringEnum.ACTIVE
                        ? this.mapBrokerData(data)
                        : this.mapShipperData(data);
                }
            );

            this.viewData = this.filterBanDnuBrokerData(
                this.viewData,
                this.filter
            );

            // Set data for cards based on tab active
            this.selectedTab === TableStringEnum.ACTIVE
                ? ((this.sendDataToCardsFront = this.displayRowsFront),
                  (this.sendDataToCardsBack = this.displayRowsBack))
                : ((this.sendDataToCardsFront = this.displayRowsFrontShipper),
                  (this.sendDataToCardsBack = this.displayRowsBackShipper));

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
                      isClosed: data?.status === 0 || false,
                      name: data?.businessName,
                  }
                : data?.businessName,
            tableAddressPhysical:
                data?.mainAddress?.address ??
                (data?.mainPoBox
                    ? `${data?.mainPoBox.poBox} ${data?.mainPoBox.city} ${
                          data?.mainPoBox.state
                      } ${data?.mainPoBox.zipCode ?? null}`
                    : null),
            tableAddressBilling:
                data?.billingAddress?.address ??
                (data?.billingPoBox
                    ? `${data?.billingPoBox.poBox} ${data?.billingPoBox.city} ${
                          data?.billingPoBox.state
                      } ${data?.billingPoBox.zipCode ?? null}`
                    : null),
            tablePaymentDetailCreditLimit: data?.creditLimit
                ? TableStringEnum.DOLLAR_SIGN +
                  this.thousandSeparator.transform(data.creditLimit)
                : CustomerTableStringEnum.UNLIMITED,
            tablePaymentDetailTerm: data?.payTerm?.name
                ? data?.payTerm?.name.match(/\d+/)?.[0]
                : null,
            tablePaymentDetailAvailCredit: {
                expirationCredit: data?.availableCredit,
                expirationCreditText: data?.availableCredit
                    ? this.formatCurrencyPipe.transform(data?.availableCredit)
                    : null,
                totalValueText:
                    data?.availableCredit > 0
                        ? (
                              (+data?.availableCredit / +data.creditLimit) *
                              100
                          ).toString() + TableStringEnum.PERCENTS
                        : 0 + TableStringEnum.PERCENTS,
                percentage:
                    data?.availableCredit > 0
                        ? (+data?.availableCredit / +data?.creditLimit) * 100
                        : 0,
            },
            tableUnpaidInvAging: {
                ...data.brokerUnpaidInvoiceAgeing,
                tablePayTerm: data?.payTerm,
            },
            tablePaidInvAging: {
                ...data.brokerPaidInvoiceAgeing,
                tablePayTerm: data?.payTerm,
            },
            tableLoads: data?.loadCount
                ? this.thousandSeparator.transform(data.loadCount)
                : null,
            tableMiles: data?.miles
                ? this.thousandSeparator.transform(data.miles)
                : null,
            tablePPM: data?.pricePerMile
                ? TableStringEnum.DOLLAR_SIGN +
                  this.thousandSeparator.transform(data.pricePerMile)
                : null,
            tableRaiting: {
                hasLiked: data.currentCompanyUserRating === 1,
                hasDislike: data.currentCompanyUserRating === -1,
                likeCount: data?.upCount,
                dislikeCount: data?.downCount,
            },
            tableContactData: data?.brokerContacts,
            tableRevenue: data?.revenue
                ? TableStringEnum.DOLLAR_SIGN +
                  this.thousandSeparator.transform(data.revenue)
                : null,
            reviews: data?.ratingReviews,
            tableAdded: this.datePipe.transform(
                data.createdAt,
                TableStringEnum.DATE_FORMAT
            ),
            tableEdited: data.updatedAt
                ? this.datePipe.transform(
                      data.updatedAt,
                      TableStringEnum.DATE_FORMAT
                  )
                : null,
            tableDropdownContent: this.getBrokerDropdownContent(
                data.status,
                data.ban,
                data.dnu
            ),
        };
    }

    private mapShipperData(data: ShipperResponse): MappedShipperBroker {
        return {
            ...data,
            isSelected: false,
            businessName: this.filter
                ? {
                      hasBanDnu: !data?.status,
                      isDnu: false,
                      isClosed: data?.status === 0 || false,
                      name: data?.businessName ?? null,
                  }
                : data?.businessName,
            tableAddress: data?.address?.address ?? null,
            tableLoads: {
                loads: data?.loads,
                pickups: data?.pickups,
                deliveries: data?.deliveries,
            },
            tableAverageWatingTimePickup: data?.avgPickupTime,
            tableAverageWatingTimeDelivery: data?.avgDeliveryTime,
            tableAvailableHoursShipping:
                data?.shippingFrom || data?.shippingTo
                    ? (data?.shippingFrom ??
                          CustomerTableStringEnum.EMPTY_STRING) +
                      CustomerTableStringEnum.FROM_TO +
                      (data?.shippingTo ?? CustomerTableStringEnum.EMPTY_STRING)
                    : data?.shippingAppointment
                      ? CustomerTableStringEnum.APPOINTMENT
                      : null,
            tableAvailableHoursReceiving:
                data?.receivingFrom || data?.receivingTo
                    ? (data?.receivingFrom ??
                          CustomerTableStringEnum.EMPTY_STRING) +
                      CustomerTableStringEnum.FROM_TO +
                      (data?.receivingTo ??
                          CustomerTableStringEnum.EMPTY_STRING)
                    : data?.receivingAppointment
                      ? CustomerTableStringEnum.APPOINTMENT
                      : null,
            reviews: data?.ratingReviews,
            tableRaiting: {
                hasLiked: data?.currentCompanyUserRating === 1,
                hasDislike: data?.currentCompanyUserRating === -1,
                likeCount: data?.upCount,
                dislikeCount: data?.downCount,
            },
            tableContactData: data?.shipperContacts,
            tableAdded: this.datePipe.transform(
                data?.createdAt,
                TableStringEnum.DATE_FORMAT
            ),
            tableEdited: data?.updatedAt
                ? this.datePipe.transform(
                      data?.updatedAt,
                      TableStringEnum.DATE_FORMAT
                  )
                : null,
            tableLastUsed: data?.lastUsedAt
                ? this.datePipe.transform(
                      data?.lastUsedAt,
                      TableStringEnum.DATE_FORMAT
                  )
                : null,
            tableDropdownContent: this.getShipperDropdownContent(data?.status),
        };
    }

    private getBrokerDropdownContent(
        status: number,
        ban: boolean,
        dnu: boolean
    ): DropdownMenuItem[] {
        return DropdownMenuContentHelper.getBrokerDropdownContent(
            status,
            ban,
            dnu
        );
    }

    private getShipperDropdownContent(status: number): DropdownMenuItem[] {
        return DropdownMenuContentHelper.getShipperDropdownContent(status);
    }

    private updateDataCount(): void {
        const brokerShipperCount = JSON.parse(
            localStorage.getItem(TableStringEnum.BROKER_SHIPPER_TABLE_COUNT)
        );

        const updatedTableData = [...this.tableData];

        updatedTableData[0].length = brokerShipperCount.broker;
        updatedTableData[1].length = brokerShipperCount.shipper;

        this.tableData = [...updatedTableData];
    }

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
                    const newData = [...this.viewData];

                    brokers.pagination.data.map((data: BrokerResponse) => {
                        newData.push(this.mapBrokerData(data));
                    });

                    this.viewData = [...newData];
                }

                this.viewData = this.filterBanDnuBrokerData(
                    this.viewData,
                    this.filter
                );
            });
    }

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
                    const newData = [...this.viewData];

                    shippers.pagination.data.map((data: ShipperResponse) => {
                        newData.push(this.mapShipperData(data));
                    });

                    this.viewData = [...newData];
                }
            });
    }

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

            this.filter = null;

            this.sendCustomerData();
        } else if (event.action === TableStringEnum.VIEW_MODE) {
            const isViewModeChanged = this.activeViewMode !== event.mode;

            this.activeViewMode = event.mode;

            this.tableOptions.toolbarActions.hideSearch =
                event.mode === TableStringEnum.MAP;

            this.filter = null;

            if (
                this.selectedTab === TableStringEnum.ACTIVE &&
                isViewModeChanged
            ) {
                this.tableService.sendResetSpecialFilters(true);
            }

            this.sendCustomerData();
        }
    }

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

    private getSelectedTabTableData(): void {
        if (this.tableData?.length)
            this.activeTableDataLength = this.tableData.find(
                (table) => table.field === this.selectedTab
            ).length;

        return;
    }

    private addData(dataId: number): void {
        this.viewData = this.viewData.map((data: CustomerViewDataResponse) => {
            if (data.id === dataId) data.actionAnimation = TableStringEnum.ADD;

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

    private filterBanDnuBrokerData(
        data: BrokerResponse[],
        activeFilter?: string
    ): BrokerResponse[] {
        const filteredData = data.filter((brokerItem) => {
            if (activeFilter) {
                if (activeFilter === TableStringEnum.BAN) return brokerItem.ban;
                else if (activeFilter === TableStringEnum.DNU)
                    return brokerItem.dnu;
                else if (activeFilter === TableStringEnum.CLOSED_ARRAY)
                    return !brokerItem.status;
            } else
                return !brokerItem.ban && !brokerItem.dnu && brokerItem.status;
        });

        return filteredData;
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

        this.customerCardsModalService.updateTab(this.selectedTab);
    }

    private resetTableSelectedRows(): void {
        this.tableService.sendDnuListSelectedRows([]);
        this.tableService.sendBanListSelectedRows([]);
        this.tableService.sendBussinessSelectedRows([]);
        this.tableService.sendRowsSelected([]);
        this.tableService.sendResetSelectedColumns(true);
    }

    // map
    public onMapListSearch(search: string): void {
        this.mapListSearchValue = search;

        this.mapListPagination = {
            ...this.mapListPagination,
            pageIndex: 1,
        };

        this.getShipperMapList();
    }

    public onMapListSort(sortDirection: string): void {
        this.mapListSortDirection = sortDirection;

        this.getShipperMapList();
    }

    public onClusterMarkerClick(selectedMarker: IMapMarkers): void {
        if (this.mapsService.selectedMarkerId) this.onResetSelectedMarkerItem();

        const selectedMarkerData: IMapSelectedMarkerData | null =
            this.mapData.clusterMarkers.find(
                (clusterMarker) =>
                    clusterMarker.position.lat ===
                        selectedMarker.position.lat &&
                    clusterMarker.position.lng === selectedMarker.position.lng
            ) ?? null;

        this.mapData = { ...this.mapData, selectedMarkerData };

        this.ref.detectChanges();
    }

    public onClusterListScroll(clusterMarker: IMapMarkers): void {
        if (
            clusterMarker?.data?.count / this.mapClustersPagination.pageIndex >
            25
        ) {
            this.mapClustersPagination = {
                ...this.mapClustersPagination,
                pageIndex: this.mapClustersPagination.pageIndex + 1,
            };

            this.getShipperClusters(true);
        }
    }

    public onGetInfoWindowData(
        markerId: number,
        isFromMapList?: boolean
    ): void {
        this.mapsService.selectedMarker(markerId);

        this.isSelectedFromMapList = isFromMapList;

        this.getMapData(false, markerId);
    }

    public onMapBoundsChange(event: IMapBoundsZoom): void {
        const ne = event.bounds.getNorthEast(); // LatLng of the north-east corner
        const sw = event.bounds.getSouthWest(); // LatLng of the south-west corder

        this.mapClustersObject = {
            northEastLatitude: parseFloat(ne.lat().toFixed(6)),
            northEastLongitude: parseFloat(ne.lng().toFixed(6)),
            southWestLatitude: parseFloat(sw.lat().toFixed(6)),
            southWestLongitude: parseFloat(sw.lng().toFixed(6)),
            zoomLevel: event.zoom,
        };

        if (this.isSelectedFromDetails) {
            this.onGetInfoWindowData(this.mapsService.selectedMarkerId);
            this.isSelectedFromDetails = false;
        } else this.getMapData();
    }

    public onResetSelectedMarkerItem(isBackButton?: boolean): void {
        const selectedMarkerData = isBackButton
            ? {
                  ...this.mapData.selectedMarkerData,
                  infoWindowContent: {
                      ...this.mapData.selectedMarkerData.infoWindowContent,
                      selectedClusterItemData: null,
                  },
              }
            : null;

        this.mapData = {
            ...this.mapData,
            selectedMarkerData,
        };

        this.isSelectedFromMapList = false;

        this.mapsService.selectedMarker(null);

        this.getShipperClusters();

        this.getShipperMapList();

        this.ref.detectChanges();
    }

    public getShipperClusters(
        isClusterPagination?: boolean,
        selectedMarkerId?: number
    ): void {
        if (!this.mapClustersObject) return;

        this.shipperService
            .getShipperClusters(
                this.mapClustersObject.northEastLatitude,
                this.mapClustersObject.northEastLongitude,
                this.mapClustersObject.southWestLatitude,
                this.mapClustersObject.southWestLongitude,
                this.mapClustersObject.zoomLevel,
                this.isAddedNewShipper, // addedNew flag
                null, // shipperLong
                null, // shipperLat
                null, // shipperDistance
                this.mapStateFilter, // shipperStates
                null, // categoryIds?: Array<number>,
                null, // _long?: number,
                null, // lat?: number,
                null, // distance?: number,
                null, // costFrom?: number,
                null, // costTo?: number,
                null, // lastFrom?: number,
                null, // lastTo?: number,
                null, // ppgFrom?: number,
                null, // ppgTo?: number,
                this.mapsService.selectedMarkerId ?? null, // selectedId
                this.filter === TableStringEnum.CLOSED_FILTER ? 0 : null, // active
                this.mapClustersPagination.pageIndex, // pageIndex
                this.mapClustersPagination.pageSize, // pageSize
                null, // companyId
                this.mapListSortDirection ?? null, // sortBy
                null, // search
                null, // search1
                null // search2
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe((clustersResponse) => {
                if (isClusterPagination) {
                    let selectedMarkerData: IMapMarkers | null = {
                        ...this.mapData.selectedMarkerData,
                    };

                    const findClusterData = clustersResponse.find(
                        (data) =>
                            this.mapData.selectedMarkerData?.position?.lat ===
                                data.latitude &&
                            this.mapData.selectedMarkerData?.position.lng ===
                                data.longitude
                    );

                    if (findClusterData) {
                        selectedMarkerData = {
                            ...selectedMarkerData,
                            infoWindowContent: {
                                ...selectedMarkerData.infoWindowContent,
                                clusterData: [
                                    ...selectedMarkerData.infoWindowContent
                                        .clusterData,
                                    ...findClusterData.pagination.data,
                                ],
                            },
                        };
                    }

                    this.mapData = {
                        ...this.mapData,
                        selectedMarkerData,
                    };
                } else {
                    const clusterMarkers: IMapMarkers[] = [];
                    const markers: IMapMarkers[] = [];

                    clustersResponse?.forEach((data, index) => {
                        const previousClusterData =
                            this.mapData.clusterMarkers.find(
                                (item) =>
                                    item.position.lat === data.latitude &&
                                    item.position.lng === data.longitude
                            );

                        const previousMarkerData = this.mapData.markers.find(
                            (item2) =>
                                item2.position.lat === data.latitude &&
                                item2.position.lng === data.longitude
                        );

                        let clusterInfoWindowContent = data.pagination?.data
                            ? {
                                  clusterData: [...data.pagination.data],
                                  selectedClusterItemData: null,
                              }
                            : null;

                        if (
                            previousClusterData?.infoWindowContent
                                ?.selectedClusterItemData
                        ) {
                            clusterInfoWindowContent = {
                                ...clusterInfoWindowContent,
                                selectedClusterItemData:
                                    previousClusterData?.infoWindowContent
                                        ?.selectedClusterItemData,
                            };
                        }

                        if (previousClusterData || previousMarkerData) {
                            const newMarkerData = {
                                ...(previousMarkerData || previousClusterData),
                                infoWindowContent: clusterInfoWindowContent,
                            };

                            if (data.count > 1)
                                clusterMarkers.push(newMarkerData);
                            else markers.push(newMarkerData);
                        } else {
                            let markerData: IMapMarkers = {
                                position: {
                                    lat: data.latitude,
                                    lng: data.longitude,
                                },
                                infoWindowContent: clusterInfoWindowContent,
                                label: data.name,
                                isFavorite: data.favourite,
                                isClosed: data.isClosed,
                                id: data.id,
                                data,
                            };

                            const markerIcon =
                                data.count > 1
                                    ? this.markerIconService.getClusterMarkerIcon(
                                          markerData
                                      )
                                    : this.markerIconService.getMarkerIcon(
                                          data.id,
                                          data.name,
                                          data.isClosed,
                                          data.favourite
                                      );

                            markerData = {
                                ...markerData,
                                content: markerIcon,
                            };

                            if (data.count > 1) clusterMarkers.push(markerData);
                            else markers.push(markerData);
                        }
                    });

                    this.mapData = {
                        ...this.mapData,
                        clusterMarkers,
                        markers,
                    };
                }

                if (this.isAddedNewShipper) this.isAddedNewShipper = false;

                if (selectedMarkerId) this.getShipperById(selectedMarkerId);

                this.ref.detectChanges();
            });
    }

    public getShipperMapList(): void {
        if (!this.mapClustersObject) return;

        this.shipperService
            .getShipperMapList(
                this.mapClustersObject.northEastLatitude,
                this.mapClustersObject.northEastLongitude,
                this.mapClustersObject.southWestLatitude,
                this.mapClustersObject.southWestLongitude,
                null, // shipperLong
                null, // shipperLat
                null, // shipperDistance
                this.mapStateFilter, // shipperStates
                !this.isSelectedFromMapList
                    ? this.mapsService.selectedMarkerId
                    : null, // selectedId
                this.mapListPagination.pageIndex,
                this.mapListPagination.pageSize,
                null, // companyId
                this.mapListSortDirection ?? null, // sort
                this.mapListSearchValue, // search
                null, // search1
                null // search2
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe((mapListResponse) => {
                const mappedListData = mapListResponse?.pagination?.data?.map(
                    (item) => {
                        const mapItemData = this.mapShipperData(item);

                        return mapItemData;
                    }
                );

                this.mapListCount = mapListResponse.pagination.count;

                this.mapListData =
                    this.mapListPagination.pageIndex > 1
                        ? [...this.mapListData, ...mappedListData]
                        : mappedListData;
                this.ref.detectChanges();
            });
    }

    public getShipperById(markerId: number): void {
        this.shipperService
            .getShipperById(markerId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res) => {
                    const shipperData = this.mapShipperData(res);

                    let selectedMarkerData: IMapSelectedMarkerData | null =
                        null;

                    this.mapData.clusterMarkers.forEach((clusterMarker) => {
                        const clusterItemIndex =
                            clusterMarker.data.pagination?.data?.findIndex(
                                (clusterItem) => clusterItem.id === markerId
                            );

                        if (clusterItemIndex > -1) {
                            selectedMarkerData = {
                                ...clusterMarker,
                                infoWindowContent: {
                                    ...clusterMarker.infoWindowContent,
                                    selectedClusterItemData: {
                                        ...ShipperMapDropdownHelper.getShipperMapDropdownConfig(
                                            shipperData,
                                            true
                                        ),
                                        data: shipperData,
                                    },
                                },
                            };
                        }
                    });

                    const markerData = this.mapData.markers.find(
                        (marker) => marker.data?.id === markerId
                    );

                    if (markerData)
                        selectedMarkerData = {
                            ...markerData,
                            infoWindowContent:
                                ShipperMapDropdownHelper.getShipperMapDropdownConfig(
                                    shipperData
                                ),
                            data: shipperData,
                        };

                    this.mapsService.selectedMarker(
                        selectedMarkerData ? shipperData.id : null
                    );

                    this.mapData = { ...this.mapData, selectedMarkerData };

                    this.ref.detectChanges();
                },
                error: () => {},
            });
    }

    public getMapData(
        isClusterPagination?: boolean,
        selectedMarkerId?: number
    ): void {
        if (this.activeViewMode !== TableStringEnum.MAP) return;

        this.mapListPagination = {
            ...this.mapListPagination,
            pageIndex: 1,
        };

        this.mapClustersPagination = {
            ...this.mapClustersPagination,
            pageIndex: 1,
        };

        this.getShipperClusters(isClusterPagination, selectedMarkerId);

        this.getShipperMapList();
    }

    public addMapListScrollEvent(): void {
        this.mapsService.mapListScrollChange
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                const isNewPage =
                    this.mapListCount / this.mapListPagination.pageIndex > 25;

                if (isNewPage) {
                    this.mapListPagination = {
                        ...this.mapListPagination,
                        pageIndex: this.mapListPagination.pageIndex + 1,
                    };

                    this.getShipperMapList();
                }
            });
    }

    public addSelectedMarkerListener(): void {
        this.mapsService.selectedMapListCardChange
            .pipe(takeUntil(this.destroy$))
            .subscribe((id) => {
                if (id) this.onGetInfoWindowData(id, true);
                else this.onResetSelectedMarkerItem();
            });
    }

    public updateMapItem(item?): void {
        if (this.activeViewMode === TableStringEnum.MAP) {
            this.isAddedNewShipper = true;

            this.getMapData();

            if (item) this.mapsService.markerUpdate(item);
        }
    }

    public checkSelectedMarker(): void {
        const isAlreadySelectedMarker =
            this.mapData?.selectedMarkerData?.data?.id ===
            this.mapsService.selectedMarkerId;

        if (this.mapsService.selectedMarkerId && !isAlreadySelectedMarker)
            this.isSelectedFromDetails = true;
    }

    public handleShowMoreAction(): void {
        if (this.selectedTab === TableStringEnum.ACTIVE) {
            this.backBrokerFilterQuery.pageIndex++;

            this.brokerBackFilter(this.backBrokerFilterQuery, true);
        } else {
            this.backShipperFilterQuery.pageIndex++;

            this.shipperBackFilter(this.backShipperFilterQuery, true);
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.tableService.sendActionAnimation({});
        this.tableService.sendDeleteSelectedRows([]);
        this.resizeObserver.disconnect();
    }
}
