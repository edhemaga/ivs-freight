import {
    Component,
    OnInit,
    OnDestroy,
    ViewChild,
    AfterViewInit,
    ChangeDetectorRef,
} from '@angular/core';
import { RepairShopModalComponent } from '../../modals/repair-modals/repair-shop-modal/repair-shop-modal.component';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { Router } from '@angular/router';
import { RepairOrderModalComponent } from '../../modals/repair-modals/repair-order-modal/repair-order-modal.component';
import { ShopQuery } from '../state/shop-state/shop.query';
import { ShopState } from '../state/shop-state/shop.store';

import { RepairTruckState } from '../state/repair-truck-state/repair-truck.store';
import { RepairTrailerState } from '../state/repair-trailer-state/repair-trailer.store';
import { RepairTruckQuery } from '../state/repair-truck-state/repair-truck.query';
import { RepairTrailerQuery } from '../state/repair-trailer-state/repair-trailer.query';
import { DatePipe } from '@angular/common';
import { RepairTService } from '../state/repair.service';
import { RepairListResponse, RepairShopListResponse } from 'appcoretruckassist';
import { Subject, takeUntil } from 'rxjs';
import { TaThousandSeparatorPipe } from '../../../pipes/taThousandSeparator.pipe';
import { TruckassistTableService } from '../../../services/truckassist-table/truckassist-table.service';
import { ReviewsRatingService } from '../../../services/reviews-rating/reviewsRating.service';
import { MapsService } from '../../../services/shared/maps.service';
import {
    tableSearch,
    closeAnimationAction,
} from '../../../utils/methods.globals';
import {
    getRepairsShopColumnDefinition,
    getRepairTruckAndTrailerColumnDefinition,
} from '../../../../../assets/utils/settings/repair-columns';

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

    tableOptions: any = {};
    tableData: any[] = [];
    viewData: any[] = [];
    columns: any[] = [];
    selectedTab = 'active';
    activeViewMode: string = 'List';
    repairTrucks: RepairTruckState[] = [];
    repairTrailers: RepairTrailerState[] = [];
    repairShops: ShopState[] = [];
    resizeObserver: ResizeObserver;

    backFilterQuery = {
        repairShopId: undefined,
        unitType: 1,
        dateFrom: undefined,
        dateTo: undefined,
        isPM: undefined,
        categoryIds: undefined,
        pmTruckTitles: undefined,
        pmTrailerTitles: undefined,
        isOrder: undefined,
        truckId: undefined,
        pageIndex: 1,
        pageSize: 25,
        companyId: undefined,
        sort: undefined,
        searchOne: undefined,
        searchTwo: undefined,
        searchThree: undefined,
    };

    shopFilterQuery = {
        active: 1,
        pinned: undefined,
        companyOwned: undefined,
        categoryIds: undefined,
        long: undefined,
        lat: undefined,
        distance: undefined,
        costFrom: undefined,
        costTo: undefined,
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
        public router: Router,
        private shopQuery: ShopQuery,
        private repairTruckQuery: RepairTruckQuery,
        private repairTrailerQuery: RepairTrailerQuery,
        private repairService: RepairTService,
        public datePipe: DatePipe,
        private thousandSeparator: TaThousandSeparatorPipe,
        private reviewRatingService: ReviewsRatingService,
        private ref: ChangeDetectorRef,
        private mapsService: MapsService
    ) {}

    ngOnInit(): void {
        this.sendRepairData();

        // Reset Columns
        this.tableService.currentResetColumns
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: boolean) => {
                if (response) {
                    this.sendRepairData();
                }
            });

        // Switch Selected
        this.tableService.currentSwitchOptionSelected
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
                if (res) {
                    if (res.switchType === 'PM') {
                        this.router.navigate([`pm`]);
                    }
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

        // Search
        this.tableService.currentSearchTableData
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
                if (res) {
                    this.backFilterQuery.pageIndex = 1;
                    this.shopFilterQuery.pageIndex = 1;

                    const searchEvent = tableSearch(
                        res,
                        this.selectedTab !== 'repair-shop'
                            ? this.backFilterQuery
                            : this.shopFilterQuery
                    );

                    console.log(searchEvent);

                    if (searchEvent) {
                        if (searchEvent.action === 'api') {
                            if (this.selectedTab !== 'repair-shop') {
                                this.backFilterQuery.unitType =
                                    this.selectedTab === 'active' ? 1 : 2;

                                this.repairBackFilter(this.backFilterQuery);
                            } else {
                                this.shopBackFilter(this.shopFilterQuery);
                            }
                        } else if (searchEvent.action === 'store') {
                            this.sendRepairData();
                        }
                    }
                }
            });

        // Repair Actions
        this.tableService.currentActionAnimation
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
                this.updateDataCount();

                // On Add Repair
                if (res.animation === 'add' && this.selectedTab === res.tab) {
                    this.viewData.push(
                        res.tab !== 'repair-shop'
                            ? this.mapTruckAndTrailerData(res.data)
                            : this.mapShopData(res.data)
                    );

                    this.viewData = this.viewData.map((repair: any) => {
                        if (repair.id === res.id) {
                            repair.actionAnimation = 'add';
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
                    res.animation === 'update' &&
                    this.selectedTab === res.tab
                ) {
                    const updatedRepair =
                        res.tab !== 'repair-shop'
                            ? this.mapTruckAndTrailerData(res.data)
                            : this.mapShopData(res.data);

                    this.viewData = this.viewData.map((repair: any) => {
                        if (repair.id === res.id) {
                            repair = updatedRepair;
                            repair.actionAnimation = 'update';
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
                    res.animation === 'delete' &&
                    this.selectedTab === res.tab
                ) {
                    let repairIndex: number;

                    this.viewData = this.viewData.map(
                        (repair: any, index: number) => {
                            if (repair.id === res.id) {
                                repair.actionAnimation = 'delete';
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

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.observTableContainer();
        }, 10);
    }

    // Observ Table Container
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

    // Repair Table Options
    initTableOptions(): void {
        this.tableOptions = {
            toolbarActions: {
                showTimeFilter: this.selectedTab !== 'repair-shop',
                showRepairOrderFilter: this.selectedTab !== 'repair-shop',
                showPMFilter: this.selectedTab !== 'repair-shop',
                showCategoryRepairFilter: true,
                showMoneyFilter: true,
                hideMoneySubType: true,
                showLocationFilter: true,
                showMoneyCount: this.selectedTab !== 'repair-shop',
                viewModeOptions: this.getViewModeOptions(),
            },
        };
    }

    // Get View Mode Options
    getViewModeOptions() {
        return this.selectedTab === 'repair-shop'
            ? [
                  { name: 'List', active: this.activeViewMode === 'List' },
                  { name: 'Card', active: this.activeViewMode === 'Card' },
                  { name: 'Map', active: this.activeViewMode === 'Map' },
              ]
            : [
                  { name: 'List', active: this.activeViewMode === 'List' },
                  { name: 'Card', active: this.activeViewMode === 'Card' },
              ];
    }

    // Send Repair Data
    sendRepairData() {
        this.initTableOptions();

        this.checkActiveViewMode();

        const repairTruckTrailerCount = JSON.parse(
            localStorage.getItem('repairTruckTrailerTableCount')
        );

        const repairShopCount = JSON.parse(
            localStorage.getItem('repairShopTableCount')
        );

        const repairTruckData =
            this.selectedTab === 'active' ? this.getTabData('active') : [];

        const repairTrailerData =
            this.selectedTab === 'inactive' ? this.getTabData('inactive') : [];

        const repairShopData =
            this.selectedTab === 'repair-shop'
                ? this.getTabData('repair-shop')
                : [];

        this.tableData = [
            {
                title: 'Truck',
                field: 'active',
                length: repairTruckTrailerCount.repairTrucks,
                moneyCount:
                    this.selectedTab === 'active'
                        ? repairTruckTrailerCount.truckMoneyTotal
                        : 0,
                moneyCountSelected: false,
                data: repairTruckData,
                gridNameTitle: 'Repair',
                stateName: 'repair_trucks',
                tableConfiguration: 'REPAIR_TRUCK',
                isActive: this.selectedTab === 'active',
                gridColumns: this.getGridColumns('REPAIR_TRUCK'),
            },
            {
                title: 'Trailer',
                field: 'inactive',
                length: repairTruckTrailerCount.repairTrailers,
                moneyCount:
                    this.selectedTab === 'inactive'
                        ? repairTruckTrailerCount.trailerMoneyTotal
                        : 0,
                moneyCountSelected: false,
                data: repairTrailerData,
                gridNameTitle: 'Repair',
                stateName: 'repair_trailers',
                tableConfiguration: 'REPAIR_TRAILER',
                isActive: this.selectedTab === 'inactive',
                gridColumns: this.getGridColumns('REPAIR_TRAILER'),
            },
            {
                title: 'Shop',
                field: 'repair-shop',
                length: repairShopCount.repairShops,
                data: repairShopData,
                gridNameTitle: 'Repair',
                stateName: 'repair_shops',
                tableConfiguration: 'REPAIR_SHOP',
                isActive: this.selectedTab === 'repair-shop',
                gridColumns: this.getGridColumns('REPAIR_SHOP'),
            },
        ];

        const td = this.tableData.find((t) => t.field === this.selectedTab);

        this.setRepairData(td);
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

    // Get Tab Data From Store Or Via Api
    getTabData(dataType: string) {
        if (dataType === 'active') {
            this.repairTrucks = this.repairTruckQuery.getAll();

            return this.repairTrucks?.length ? this.repairTrucks : [];
        } else if (dataType === 'inactive') {
            this.repairTrailers = this.repairTrailerQuery.getAll();

            return this.repairTrailers?.length ? this.repairTrailers : [];
        } else if (dataType === 'repair-shop') {
            this.repairShops = this.shopQuery.getAll();

            return this.repairShops?.length ? this.repairShops : [];
        }
    }

    // Get Repair Columns
    getGridColumns(configType: string) {
        const tableColumnsConfig = JSON.parse(
            localStorage.getItem(`table-${configType}-Configuration`)
        );

        if (configType === 'REPAIR_TRUCK' || configType === 'REPAIR_TRAILER') {
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
    setRepairData(td: any) {
        this.columns = td.gridColumns;

        if (td.data.length) {
            this.viewData = td.data;

            this.mapListData = JSON.parse(JSON.stringify(this.viewData));

            this.viewData = this.viewData.map((data: any, index: number) => {
                if (
                    this.selectedTab === 'active' ||
                    this.selectedTab === 'inactive'
                ) {
                    return this.mapTruckAndTrailerData(data);
                } else {
                    return this.mapShopData(data);
                }
            });
        } else {
            this.viewData = [];
        }
    }

    // Map Truck And Trailer Data
    mapTruckAndTrailerData(data: any) {
        return {
            ...data,
            isSelected: false,
            isRepairOrder: data?.repairType?.name === 'Order',
            tableUnit: data?.truck?.truckNumber
                ? data.truck.truckNumber
                : data?.trailer?.trailerNumber
                ? data.trailer.trailerNumber
                : '',
            tableType: 'NA',
            tableMake: 'NA',
            tableModel: 'NA',
            tableYear: 'NA',
            tableOdometer: data.odometer
                ? this.thousandSeparator.transform(data.odometer)
                : '',
            tableIssued: data?.date
                ? this.datePipe.transform(data.date, 'MM/dd/yy')
                : '',
            tableShopName: data?.repairShop?.name ? data.repairShop.name : '',
            tableShopAdress: data?.repairShop?.address?.address
                ? data.repairShop.address.address
                : '',
            tableServices: data?.serviceTypes ? data?.serviceTypes : null,

            tableDescription: data?.items
                ? data.items
                      .map((item) => item.description?.trim())
                      .join(
                          '<div class="description-dot-container"><span class="description-dot"></span></div>'
                      )
                : null,
            descriptionItems: data?.items
                ? data.items.map((item) => {
                      return {
                          ...item,
                          descriptionPrice: item?.price
                              ? '$' +
                                this.thousandSeparator.transform(item.price)
                              : '',
                          descriptionTotalPrice: item?.subtotal
                              ? '$' +
                                this.thousandSeparator.transform(item.subtotal)
                              : '',
                          pmDescription: item?.pmTruck
                              ? item.pmTruck
                              : item?.pmTrailer
                              ? item.pmTrailer
                              : '',
                      };
                  })
                : null,
            tabelDescriptionDropTotal: data?.total
                ? '$' + this.thousandSeparator.transform(data.total)
                : '',
            tableCost: data?.total
                ? '$' + this.thousandSeparator.transform(data.total)
                : '',
            tableAdded: data.createdAt
                ? this.datePipe.transform(data.createdAt, 'MM/dd/yy')
                : '',
            tableEdited: data.updatedAt
                ? this.datePipe.transform(data.updatedAt, 'MM/dd/yy')
                : '',
            tableAttachments: data?.files ? data.files : [],
            fileCount: data?.fileCount,
            tableDropdownContent: {
                hasContent: true,
                content: this.getRepairDropdownContent(data),
            },
        };
    }

    // Map Shop Data
    mapShopData(data: any) {
        return {
            ...data,
            isSelected: false,
            tableAddress: data?.address?.address ? data.address.address : '',
            tableShopServices: data?.serviceTypes ? data?.serviceTypes : null,
            tableOpenHours: 'Treba Novi Template',
            tableBankDetailsBankName: data?.bank?.name ? data.bank.name : '',
            tableBankDetailsRouting: data?.routing ? data.routing : '',
            tableBankDetailsAccount: data?.account ? data.account : '',
            tableRepairCountBill: 'NA',
            tableRepairCountOrder: data?.order
                ? this.thousandSeparator.transform(data.order)
                : '',
            tableShopRaiting: {
                hasLiked: data.currentCompanyUserRating === 1,
                hasDislike: data.currentCompanyUserRating === -1,
                likeCount: data?.upCount ? data.upCount : '0',
                dislikeCount: data?.downCount ? data.downCount : '0',
            },
            tableContact: data?.contacts?.length ? data.contacts.length : 0,
            tableExpense: data?.cost
                ? '$' + this.thousandSeparator.transform(data.cost)
                : '',
            tableLUsed: data.lastVisited
                ? this.datePipe.transform(data.lastVisited, 'MM/dd/yy')
                : '',
            tableAdded: data.createdAt
                ? this.datePipe.transform(data.createdAt, 'MM/dd/yy')
                : '',
            tableEdited: data.updatedAt
                ? this.datePipe.transform(data.updatedAt, 'MM/dd/yy')
                : '',
            isFavorite: data.pinned,
            tableAttachments: data?.files ? data.files : [],
            fileCount: data?.fileCount,

            tableDropdownContent: {
                hasContent: true,
                content: this.getShopDropdownContent(data),
            },
        };
    }

    // Get Repair Dropdown Content
    getRepairDropdownContent(data: any) {
        return [
            {
                title: 'Edit',
                name: 'edit',
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Edit.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: 'regular',
                hasBorder: true,
            },
            {
                title: 'View Details',
                name: 'view-details',
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
            },
            {
                title: 'All Bills',
                name: 'all-bills',
                hasBorder: true,
            },
            {
                title: 'Share',
                name: 'share',
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
            },
            {
                title: 'Print',
                name: 'print',
                hasBorder: true,
            },
            {
                title: 'Delete',
                name: 'delete-repair',
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Delete.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: 'delete',
            },
        ];
    }

    // Get Repair Dropdown Content
    getShopDropdownContent(data: any) {
        return [
            {
                title: 'Edit',
                name: 'edit',
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Edit.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: 'regular',
                hasBorder: true,
            },
            {
                title: 'View Details',
                name: 'view-details',
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
            },
            {
                title: 'All Bill',
                name: 'all-bill',
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
            },
            {
                title: 'Move to Favourite',
                name: 'move-to-favourite',
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
            },
            {
                title: 'Write Review',
                name: 'write-review',
                hasBorder: true,
            },
            {
                title: 'Share',
                name: 'share',
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
            },
            {
                title: 'Print',
                name: 'print',
                hasBorder: true,
            },
            {
                title: 'Close Business',
                name: 'close-business',
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
            },
            {
                title: 'Delete',
                name: 'delete-repair',
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Delete.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: 'delete',
            },
        ];
    }

    // Repair Back Filters
    repairBackFilter(
        filter: {
            repairShopId: number;
            unitType: number;
            dateFrom: string;
            dateTo: string;
            isPM: number;
            categoryIds: Array<number>;
            pmTruckTitles: Array<string>;
            pmTrailerTitles: Array<string>;
            isOrder: boolean;
            truckId: number;
            pageIndex: number;
            pageSize: number;
            companyId: number;
            sort: string;
            searchOne: string | undefined;
            searchTwo: string | undefined;
            searchThree: string | undefined;
        },
        isShowMore?: boolean
    ) {
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

                    this.viewData = this.viewData.map((data: any) => {
                        return this.mapTruckAndTrailerData(data);
                    });
                } else {
                    let newData = [...this.viewData];

                    repair.pagination.data.map((data: any) => {
                        newData.push(this.mapTruckAndTrailerData(data));
                    });

                    this.viewData = [...newData];
                }
            });
    }

    // Shop Back Filters
    shopBackFilter(
        filter: {
            active?: number;
            pinned?: boolean | undefined;
            companyOwned?: boolean | undefined;
            categoryIds?: Array<number> | undefined;
            long?: number | undefined;
            lat?: number | undefined;
            distance?: number | undefined;
            costFrom?: number | undefined;
            costTo?: number | undefined;
            pageIndex?: number;
            pageSize?: number;
            companyId?: number | undefined;
            sort?: string | undefined;
            searchOne: string | undefined;
            searchTwo: string | undefined;
            searchThree: string | undefined;
        },
        isShowMore?: boolean
    ) {
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
            .subscribe((shop: RepairShopListResponse) => {
                if (!isShowMore) {
                    this.viewData = shop.pagination.data;

                    this.viewData = this.viewData.map((data: any) => {
                        return this.mapShopData(data);
                    });
                } else {
                    let newData = [...this.viewData];

                    shop.pagination.data.map((data: any) => {
                        newData.push(this.mapShopData(data));
                    });

                    this.viewData = [...newData];
                }
            });
    }

    // Update Data Count
    updateDataCount() {
        const repairTruckTrailerCount = JSON.parse(
            localStorage.getItem('repairTruckTrailerTableCount')
        );
        const repairShopCount = JSON.parse(
            localStorage.getItem('repairShopTableCount')
        );

        const updatedTableData = [...this.tableData];

        updatedTableData[0].length = repairTruckTrailerCount.repairTrucks;
        updatedTableData[0].moneyCount =
            repairTruckTrailerCount.truckMoneyTotal;
        updatedTableData[1].length = repairTruckTrailerCount.repairTrailers;
        updatedTableData[1].moneyCount =
            repairTruckTrailerCount.trailerMoneyTotal;
        updatedTableData[2].length = repairShopCount.repairShops;

        this.tableData = [...updatedTableData];
    }

    // Table Toolbar Actions
    onToolBarAction(event: any) {
        if (event.action === 'tab-selected') {
            this.selectedTab = event.tabData.field;

            this.backFilterQuery.unitType =
                this.selectedTab === 'active' ? 1 : 2;

            this.backFilterQuery.pageIndex = 1;
            this.shopFilterQuery.pageIndex = 1;

            this.sendRepairData();
        } else if (event.action === 'open-modal') {
            if (this.selectedTab === 'active') {
                this.modalService.openModal(
                    RepairOrderModalComponent,
                    {
                        size: 'large',
                    },
                    {
                        type: 'new-truck',
                    }
                );
            } else if (this.selectedTab === 'inactive') {
                this.modalService.openModal(
                    RepairOrderModalComponent,
                    {
                        size: 'large',
                    },
                    {
                        type: 'new-trailer',
                    }
                );
            } else {
                this.modalService.openModal(RepairShopModalComponent, {
                    size: 'small',
                });
            }
        } else if (event.action === 'view-mode') {
            this.activeViewMode = event.mode;
            
            this.tableOptions.toolbarActions.hideSearch = event.mode == 'Map';
        }
    }

    // Table Head Actions
    onTableHeadActions(event: any) {
        if (event.action === 'sort') {
            if (event.direction) {
                this.backFilterQuery.sort = event.direction;
                this.backFilterQuery.pageIndex = 1;
                this.shopFilterQuery.pageIndex = 1;

                if (this.selectedTab !== 'repair-shop') {
                    this.backFilterQuery.unitType =
                        this.selectedTab === 'active' ? 1 : 2;

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
    onTableBodyActions(event: any) {
        // Show More
        if (event.type === 'show-more') {
            this.selectedTab !== 'repair-shop'
                ? this.backFilterQuery.pageIndex++
                : this.shopFilterQuery.pageIndex++;

            this.selectedTab !== 'repair-shop'
                ? this.repairBackFilter(this.backFilterQuery, true)
                : this.shopBackFilter(this.shopFilterQuery, true);
        }
        // Edit
        else if (event.type === 'edit') {
            switch (this.selectedTab) {
                case 'active': {
                    this.modalService.openModal(
                        RepairOrderModalComponent,
                        { size: 'large' },
                        { ...event, type: 'edit-truck' }
                    );
                    break;
                }
                case 'inactive': {
                    this.modalService.openModal(
                        RepairOrderModalComponent,
                        { size: 'large' },
                        { ...event, type: 'edit-trailer' }
                    );
                    break;
                }
                default: {
                    this.modalService.openModal(
                        RepairShopModalComponent,
                        { size: 'small' },
                        event
                    );
                    break;
                }
            }
        }
        // Delete
        else if (event.type === 'delete-repair') {
            if (this.selectedTab !== 'repair-shop') {
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
        else if (event.type === 'finish-order') {
            switch (this.selectedTab) {
                case 'active': {
                    this.modalService.openModal(
                        RepairOrderModalComponent,
                        { size: 'large' },
                        { ...event.data, type: 'edit-fo-truck' }
                    );
                    break;
                }
                case 'inactive': {
                    this.modalService.openModal(
                        RepairOrderModalComponent,
                        { size: 'large' },
                        { ...event.data, type: 'edit-fo-trailer' }
                    );
                    break;
                }
                default: {
                    break;
                }
            }
        }
        // Raiting
        else if (event.type === 'raiting') {
            let raitingData = {
                entityTypeRatingId: 2,
                entityTypeId: event.data.id,
                thumb: event.subType === 'like' ? 1 : -1,
                tableData: event.data,
            };

            this.reviewRatingService
                .addRating(raitingData)
                .pipe(takeUntil(this.destroy$))
                .subscribe((res: any) => {
                    let newViewData = [...this.viewData];

                    newViewData.map((data: any) => {
                        if (data.id === event.data.id) {
                            data.actionAnimation = 'update';
                            data.tableShopRaiting = {
                                hasLiked: res.currentCompanyUserRating === 1,
                                hasDislike: res.currentCompanyUserRating === -1,
                                likeCount: res?.upCount ? res.upCount : '0',
                                dislikeCount: res?.downCount
                                    ? res.downCount
                                    : '0',
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
        else if (event.type === 'favorite') {
            this.repairService
                .addShopFavorite(event.data.id)
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => {
                    const newViewData = [...this.viewData];

                    newViewData.map((data: any) => {
                        if (data.id === event.data.id) {
                            data.actionAnimation = 'update';
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

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.tableService.sendActionAnimation({});
        this.tableService.sendCurrentSwitchOptionSelected(null);
        // this.resizeObserver.unobserve(
        //     document.querySelector('.table-container')
        // );
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
            //this.tableData[2].length = mapListResponse.pagination.count;
            this.ref.detectChanges();
        }
    }
}
