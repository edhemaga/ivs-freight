import {
    Component,
    OnInit,
    OnDestroy,
    ViewChild,
    AfterViewInit,
    ChangeDetectorRef,
} from '@angular/core';

import { BrokerModalComponent } from '../../modals/broker-modal/broker-modal.component';
import { ShipperModalComponent } from '../../modals/shipper-modal/shipper-modal.component';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { BrokerQuery } from '../state/broker-state/broker.query';
import { BrokerTService } from '../state/broker-state/broker.service';
import { BrokerState } from '../state/broker-state/broker.store';
import { ShipperState } from '../state/shipper-state/shipper.store';
import { ShipperQuery } from '../state/shipper-state/shipper.query';
import { ShipperTService } from '../state/shipper-state/shipper.service';
import { GetBrokerListResponse, ShipperListResponse } from 'appcoretruckassist';
import { Subject, takeUntil } from 'rxjs';
import { TruckassistTableService } from '../../../services/truckassist-table/truckassist-table.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { DetailsDataService } from '../../../services/details-data/details-data.service';
import {
    tableSearch,
    closeAnimationAction,
} from '../../../utils/methods.globals';
import {
    getBrokerColumnDefinition,
    getShipperColumnDefinition,
} from '../../../../../assets/utils/settings/customer-columns';
import { TaThousandSeparatorPipe } from '../../../pipes/taThousandSeparator.pipe';
import { ReviewsRatingService } from '../../../services/reviews-rating/reviewsRating.service';
import { DatePipe } from '@angular/common';

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

    tableOptions: any = {};
    tableData: any[] = [];
    viewData: any[] = [];
    columns: any[] = [];
    brokers: BrokerState[] = [];
    shipper: ShipperState[] = [];
    selectedTab = 'active';
    activeViewMode: string = 'List';
    tableContainerWidth: number = 0;
    resizeObserver: ResizeObserver;
    backBrokerFilterQuery = {
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

    backShipperFilterQuery = {
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

    mapListData = [];

    constructor(
        private modalService: ModalService,
        private tableService: TruckassistTableService,
        private brokerQuery: BrokerQuery,
        private brokerService: BrokerTService,
        private shipperQuery: ShipperQuery,
        private shipperService: ShipperTService,
        private notificationService: NotificationService,
        private thousandSeparator: TaThousandSeparatorPipe,
        private reviewRatingService: ReviewsRatingService,
        private DetailsDataService: DetailsDataService,
        private ref: ChangeDetectorRef,
        public datePipe: DatePipe
    ) {}

    ngOnInit(): void {
        this.sendCustomerData();

        // Reset Columns
        this.tableService.currentResetColumns
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: boolean) => {
                if (response) {
                    this.sendCustomerData();
                }
            });

        // Resize
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

        // Toaggle Columns
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

        // Add-Update Broker-Shipper
        this.tableService.currentActionAnimation
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
                // <------------------ Broker ------------------->
                // Add Broker
                if (res.animation === 'add' && res.tab === 'broker') {
                    this.viewData.push(this.mapBrokerData(res.data));

                    this.addData(res.id);
                }
                // Update Broker
                else if (res.animation === 'update' && res.tab === 'broker') {
                    const updatedBroker = this.mapBrokerData(res.data);

                    this.updateData(res.id, updatedBroker);
                }

                // <------------------ Shipper ------------------->
                // Add Shipper
                else if (res.animation === 'add' && res.tab === 'shipper') {
                    this.viewData.push(this.mapShipperData(res.data));

                    this.addData(res.id);
                }
                // Update Shipper
                else if (res.animation === 'update' && res.tab === 'shipper') {
                    const updatedShipper = this.mapShipperData(res.data);

                    this.updateData(res.id, updatedShipper);
                }
            });

        // Delete Selected Rows
        this.tableService.currentDeleteSelectedRows
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: any[]) => {
                // Multiple Delete
                if (response.length) {
                    // Delete Broker List

                    if (this.selectedTab === 'active') {
                        this.brokerService
                            .deleteBrokerList(response)
                            .pipe(takeUntil(this.destroy$))
                            .subscribe(() => {
                                let brokerName = '';
                                let brokerText = 'Broker ';
                                this.viewData.map((data: any) => {
                                    response.map((r: any) => {
                                        if (data.id === r.id) {
                                            if (!brokerName) {
                                                brokerName = data.businessName;
                                            } else {
                                                brokerName =
                                                    brokerName +
                                                    ', ' +
                                                    data.businessName;
                                                brokerText = 'Brokers ';
                                            }
                                        }
                                    });
                                });

                                this.multipleDeleteData(response);
                            });
                    }
                    // Delete Shipper List
                    else {
                        let shipperName = '';
                        let shipText = 'Shipper ';
                        this.viewData.map((data: any) => {
                            response.map((r: any) => {
                                if (data.id === r.id) {
                                    if (!shipperName) {
                                        shipperName = data.businessName;
                                    } else {
                                        shipperName =
                                            shipperName +
                                            ', ' +
                                            data.businessName;
                                        shipText = 'Shippers ';
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

        // Search
        this.tableService.currentSearchTableData
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
                if (res) {
                    if (this.selectedTab === 'active') {
                        this.backBrokerFilterQuery.pageIndex = 1;

                        const searchEvent = tableSearch(
                            res,
                            this.backBrokerFilterQuery
                        );

                        if (searchEvent) {
                            if (searchEvent.action === 'api') {
                                this.brokerBackFilter(searchEvent.query, true);
                            } else if (searchEvent.action === 'store') {
                                this.sendCustomerData();
                            }
                        }
                    }
                }
            });
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.observTableContainer();
        }, 10);
    }

    observTableContainer() {
        this.resizeObserver = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                this.tableContainerWidth = entry.contentRect.width;
            });
        });

        this.resizeObserver.observe(document.querySelector('.table-container'));
    }

    public initTableOptions(): void {
        this.tableOptions = {
            toolbarActions: {
                showMoneyFilter: this.selectedTab === 'active',
                showLocationFilter: this.selectedTab === 'inactive',
                showStateFilter: this.selectedTab === 'inactive',
                viewModeOptions: this.getViewModeOptions(),
            },
            actions: [
                {
                    title: 'Edit',
                    name: 'edit-cutomer-or-shipper',
                    class: 'regular-text',
                    contentType: 'edit',
                    show: true,
                    svg: 'assets/svg/truckassist-table/dropdown/content/edit.svg',
                    iconName: 'edit',
                },
                {
                    title: 'Delete',
                    name: 'delete',
                    type: 'customer',
                    text:
                        this.selectedTab === 'active'
                            ? 'Are you sure you want to delete broker(s)?'
                            : 'Are you sure you want to delete shipper(s)?',
                    class: 'delete-text',
                    contentType: 'delete',
                    show: true,
                    danger: true,
                    svg: 'assets/svg/truckassist-table/dropdown/content/delete.svg',
                    iconName: 'delete',
                    redIcon: true,
                },
            ],
        };
    }

    getViewModeOptions() {
        return this.selectedTab === 'active'
            ? [
                  { name: 'List', active: this.activeViewMode === 'List' },
                  { name: 'Card', active: this.activeViewMode === 'Card' },
              ]
            : [
                  { name: 'List', active: this.activeViewMode === 'List' },
                  { name: 'Card', active: this.activeViewMode === 'Card' },
                  { name: 'Map', active: this.activeViewMode === 'Map' },
              ];
    }

    sendCustomerData() {
        this.initTableOptions();

        this.checkActiveViewMode();

        const brokerShipperCount = JSON.parse(
            localStorage.getItem('brokerShipperTableCount')
        );

        if (this.selectedTab === 'active') {
             this.brokers = this.brokerQuery.getAll().length
                ? this.brokerQuery.getAll()
                : [];
        } else {
            this.shipper = this.shipperQuery.getAll().length
                ? this.shipperQuery.getAll()
                : [];
        }

        this.tableData = [
            {
                title: 'Broker',
                field: 'active',
                length: brokerShipperCount.broker,
                data: this.brokers,
                extended: false,
                isCustomer: true,
                gridNameTitle: 'Customer',
                stateName: 'brokers',
                tableConfiguration: 'BROKER',
                isActive: this.selectedTab === 'active',
                gridColumns: this.getGridColumns('BROKER'),
            },
            {
                title: 'Shipper',
                field: 'inactive',
                length: brokerShipperCount.shipper,
                data: this.shipper,
                extended: false,
                isCustomer: true,
                gridNameTitle: 'Customer',
                stateName: 'shippers',
                tableConfiguration: 'SHIPPER',
                isActive: this.selectedTab === 'inactive',
                gridColumns: this.getGridColumns('SHIPPER'),
            },
        ];

        const td = this.tableData.find((t) => t.field === this.selectedTab);

        this.setCustomerData(td);
    }

    // Check If Selected Tab Has Active View Mode
    checkActiveViewMode() {
        if (this.activeViewMode === 'Map') {
            let hasMapView = false;

            let viewModeOptions =
                this.tableOptions.toolbarActions.viewModeOptions;

            viewModeOptions.map((viewMode: any) => {
                if (viewMode.name === 'Map') {
                    hasMapView = true;
                }
            });

            if (!hasMapView) {
                this.activeViewMode = 'List';

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

        if (configType === 'BROKER') {
            return tableColumnsConfig
                ? tableColumnsConfig
                : getBrokerColumnDefinition();
        } else {
            return tableColumnsConfig
                ? tableColumnsConfig
                : getShipperColumnDefinition();
        }
    }

    setCustomerData(td: any) {
        this.columns = td.gridColumns;

        if (td.data.length) {
            this.viewData = td.data;

            this.mapListData = JSON.parse(JSON.stringify(this.viewData));

            this.viewData = this.viewData.map((data: any) => {
                if (this.selectedTab === 'active') {
                    return this.mapBrokerData(data);
                } else {
                    return this.mapShipperData(data);
                }
            });

            // For Testing
            // for (let i = 0; i < 1000; i++) {
            //   this.viewData.push(this.viewData[0]);
            // }
        } else {
            this.viewData = [];
        }
    }

    // Map Broker Data
    mapBrokerData(data: any) {
        return {
            ...data,
            isSelected: false,
            tableAddressPhysical: data?.mainAddress?.address
                ? data.mainAddress.address
                : data?.mainPoBox?.poBox
                ? // ? data.mainPoBox.poBox + ' ' + data.mainPoBox.city + ' ' + data.mainPoBox.state + ' ' + data.mainPoBox.zipCode
                  'Treba da se postavo odgovarajuci redosled za po box address'
                : '',
            tableAddressBilling: data?.billingAddress?.address
                ? data.billingAddress.address
                : data?.billingPoBox?.poBox
                ? // ? data.mainPoBox.poBox + ' ' + data.mainPoBox.city + ' ' + data.mainPoBox.state + ' ' + data.mainPoBox.zipCode
                  'Treba da se postavo odgovarajuci redosled za po box address'
                : '',
            tablePaymentDetailAvailCredit: 'NA',
            tablePaymentDetailCreditLimit: data?.creditLimit
                ? '$' + this.thousandSeparator.transform(data.creditLimit)
                : '',
            tablePaymentDetailTerm: data?.payTerm?.name
                ? data.payTerm.name
                : '',
            tablePaymentDetailDTP: data?.daysToPay
                ? data.daysToPay + ' days'
                : '',
            tablePaymentDetailInvAgeing: {
                bfb: 0,
                dnu: 0,
                amount: 'Template se promenio',
            },
            tableLoads: data?.loadCount
                ? this.thousandSeparator.transform(data.loadCount)
                : '',
            tableMiles: data?.miles
                ? this.thousandSeparator.transform(data.miles)
                : '',
            tablePPM: data?.pricePerMile
                ? '$' + this.thousandSeparator.transform(data.pricePerMile)
                : '',
            tableRevenue: data?.revenue
                ? '$' + this.thousandSeparator.transform(data.revenue)
                : '',
            tableRaiting: {
                hasLiked: data.currentCompanyUserRating === 1,
                hasDislike: data.currentCompanyUserRating === -1,
                likeCount: data?.upCount ? data.upCount : '0',
                dislikeCount: data?.downCount ? data.downCount : '0',
            },
            tableContact: data?.brokerContacts?.length
                ? data.brokerContacts.length
                : 0,
            tableAdded: data.createdAt
                ? this.datePipe.transform(data.createdAt, 'MM/dd/yy')
                : '',
            tableEdited: data.updatedAt
                ? this.datePipe.transform(data.updatedAt, 'MM/dd/yy')
                : '',
        };
    }

    // Map Shipper Data
    mapShipperData(data: any) {
        return {
            ...data,
            isSelected: false,
            tableAddress: data?.address?.address ? data.address.address : '',
            tableLoads: 'NA',
            tableAverageWatingTimePickup: data?.avgPickupTime
                ? data.avgPickupTime
                : '',
            tableAverageWatingTimeDelivery: data?.avgDeliveryTime
                ? data.avgDeliveryTime
                : '',

            tableAvailableHoursShipping:
                data?.shippingFrom && data?.shippingTo
                    ? data?.shippingFrom +
                      ' Treba AM ili PM' +
                      ' - ' +
                      data?.shippingTo +
                      ' Treba AM ili PM'
                    : '',
            tableAvailableHoursReceiving:
                data?.receivingFrom && data?.receivingTo
                    ? data?.receivingFrom +
                      ' Treba AM ili PM' +
                      ' - ' +
                      data?.receivingTo +
                      ' Treba AM ili PM'
                    : '',
            tableRaiting: {
                hasLiked: data.currentCompanyUserRating === 1,
                hasDislike: data.currentCompanyUserRating === -1,
                likeCount: data?.upCount ? data.upCount : '0',
                dislikeCount: data?.downCount ? data.downCount : '0',
            },
            tableContact: data?.shipperContacts?.length
                ? data.shipperContacts.length
                : 0,
            tableAdded: data.createdAt
                ? this.datePipe.transform(data.createdAt, 'MM/dd/yy')
                : '',
            tableEdited: 'NA', // data.updatedAt
            //? this.datePipe.transform(data.updatedAt, 'MM/dd/yy')
            //: '',
        };
    }

    // Update Broker And Shipper Count
    updateDataCount() {
        const brokerShipperCount = JSON.parse(
            localStorage.getItem('brokerShipperTableCount')
        );

        this.tableData[0].length = brokerShipperCount.broker;
        this.tableData[1].length = brokerShipperCount.shipper;
    }

    // Broker Back Filter Query
    brokerBackFilter(
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
        isSearch?: boolean,
        isShowMore?: boolean
    ) {
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

                    this.viewData = this.viewData.map((data: any) => {
                        return this.mapBrokerData(data);
                    });

                    if (isSearch) {
                        this.tableData[0].length = brokers.pagination.count;
                    }
                } else {
                    let newData = [...this.viewData];

                    brokers.pagination.data.map((data: any) => {
                        newData.push(this.mapBrokerData(data));
                    });

                    this.viewData = [...newData];
                }
            });
    }

    // Shipper Back Filter Query
    shipperBackFilter(
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
        isSearch?: boolean,
        isShowMore?: boolean
    ) {
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

                    this.viewData = this.viewData.map((data: any) => {
                        return this.mapShipperData(data);
                    });

                    if (isSearch) {
                        this.tableData[1].length = shippers.pagination.count;
                    }
                } else {
                    let newData = [...this.viewData];

                    shippers.pagination.data.map((data: any) => {
                        newData.push(this.mapShipperData(data));
                    });

                    this.viewData = [...newData];
                }
            });
    }

    // Toolbar Actions
    onToolBarAction(event: any) {
        // Add Call
        if (event.action === 'open-modal') {
            // Add Broker Call Modal
            if (this.selectedTab === 'active') {
                this.modalService.openModal(BrokerModalComponent, {
                    size: 'medium',
                });
            }
            // Add Shipper Call Modal
            else {
                this.modalService.openModal(ShipperModalComponent, {
                    size: 'medium',
                });
            }
        }
        // Switch Tab Call
        else if (event.action === 'tab-selected') {
            this.selectedTab = event.tabData.field;

            this.backBrokerFilterQuery.pageIndex = 1;
            this.backShipperFilterQuery.pageIndex = 1;

            this.sendCustomerData();
        } else if (event.action === 'view-mode') {
            this.activeViewMode = event.mode;
        }
    }

    // Head Actions
    onTableHeadActions(event: any) {
        if (event.action === 'sort') {
            if (event.direction) {
                if (this.selectedTab === 'active') {
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
    onTableBodyActions(event: any) {
        let businessName = '';
        this.DetailsDataService.setNewData(event.data);
        // Edit Call
        if (event.type === 'show-more') {
            if (this.selectedTab === 'active') {
                this.backBrokerFilterQuery.pageIndex++;

                this.brokerBackFilter(this.backBrokerFilterQuery, false, true);
            } else {
                this.backShipperFilterQuery.pageIndex++;

                this.shipperBackFilter(
                    this.backShipperFilterQuery,
                    false,
                    true
                );
            }
        } else if (event.type === 'edit-cutomer-or-shipper') {
            // Edit Broker Call Modal
            if (this.selectedTab === 'active') {
                this.modalService.openModal(
                    BrokerModalComponent,
                    { size: 'small' },
                    {
                        ...event,
                        type: 'edit',
                        dnuButton: true,
                        bfbButton: true,
                    }
                );
            }
            // Edit Shipper Call Modal
            else {
                this.modalService.openModal(
                    ShipperModalComponent,
                    { size: 'small' },
                    {
                        ...event,
                        type: 'edit',
                    }
                );
            }
        }
        // Delete Call
        else if (event.type === 'delete') {
            businessName = this.getBusinessName(event, businessName);

            // Delete Broker Call
            if (this.selectedTab === 'active') {
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
        else if (event.type === 'raiting') {
            let raitingData = {
                entityTypeRatingId: this.selectedTab === 'active' ? 1 : 3,
                entityTypeId: event.data.id,
                thumb: event.subType === 'like' ? 1 : -1,
                tableData: event.data,
            };

            this.reviewRatingService
                .addRating(raitingData)
                .pipe(takeUntil(this.destroy$))
                .subscribe((res: any) => {
                    this.viewData = this.viewData.map((data: any) => {
                        if (data.id === event.data.id) {
                            data.actionAnimation = 'update';
                            data.raiting = {
                                hasLiked: res.currentCompanyUserRating === 1,
                                hasDislike: res.currentCompanyUserRating === -1,
                                likeCount: res?.upCount ? res.upCount : '0',
                                dislikeCount: res?.downCount
                                    ? res.downCount
                                    : '0',
                            };
                        }

                        return data;
                    });

                    this.ref.detectChanges();

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

    // Get Business Name
    getBusinessName(event: any, businessName: string) {
        if (!businessName) {
            return (businessName = event.data.businessName);
        } else {
            return (businessName =
                businessName + ', ' + event.data.businessName);
        }
    }

    // Add Shipper Or Broker To Viewdata
    addData(dataId: any) {
        this.viewData = this.viewData.map((data: any) => {
            if (data.id === dataId) {
                data.actionAnimation = 'add';
            }
            return data;
        });

        this.updateDataCount();

        const inetval = setInterval(() => {
            this.viewData = closeAnimationAction(false, this.viewData);

            clearInterval(inetval);
        }, 2300);
    }

    // Update Shipper Or Broker In Viewdata
    updateData(dataId: number, updatedData: any) {
        this.viewData = this.viewData.map((data: any) => {
            if (data.id === dataId) {
                data = updatedData;
                data.actionAnimation = 'update';
            }

            return data;
        });

        this.ref.detectChanges();

        const inetval = setInterval(() => {
            this.viewData = closeAnimationAction(false, this.viewData);

            clearInterval(inetval);
        }, 1000);
    }

    // Delete Shipper Or Broker From Viewdata
    deleteDataById(dataId: number) {
        this.viewData = this.viewData.map((data: any) => {
            if (data.id === dataId) {
                data.actionAnimation = 'delete';
            }

            return data;
        });

        this.updateDataCount();

        const inetval = setInterval(() => {
            this.viewData = closeAnimationAction(true, this.viewData);

            clearInterval(inetval);
        }, 900);
    }

    // Multiple Delete Shipper Or Broker From Viewdata
    multipleDeleteData(response: any) {
        this.viewData = this.viewData.map((data: any) => {
            response.map((r: any) => {
                if (data.id === r.id) {
                    data.actionAnimation = 'delete-multiple';
                }
            });

            return data;
        });

        this.updateDataCount();

        const inetval = setInterval(() => {
            this.viewData = closeAnimationAction(true, this.viewData);

            clearInterval(inetval);
        }, 900);

        this.tableService.sendRowsSelected([]);
        this.tableService.sendResetSelectedColumns(true);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.tableService.sendActionAnimation({});
        this.tableService.sendDeleteSelectedRows([]);

        this.resizeObserver.unobserve(
            document.querySelector('.table-container')
        );
        this.resizeObserver.disconnect();
    }

    // MAP
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

        if ( !addData ) {
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
                if ( addData ) {
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
}
