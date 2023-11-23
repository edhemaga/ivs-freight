import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { LoadModalComponent } from '../../modals/load-modal/load-modal.component';
import { ModalService } from '../../shared/ta-modal/modal.service';
import {
    getLoadActiveAndPendingColumnDefinition,
    getLoadClosedColumnDefinition,
    getLoadTemplateColumnDefinition,
} from '../../../../../assets/utils/settings/load-columns';
import { TruckassistTableService } from '../../../services/truckassist-table/truckassist-table.service';
import { LoadActiveQuery } from '../state/load-active-state/load-active.query';
import { LoadClosedQuery } from '../state/load-closed-state/load-closed.query';
import { LoadPandinQuery } from '../state/load-pending-state/load-pending.query';
import { LoadTemplateQuery } from '../state/load-template-state/load-template.query';
import { LoadActiveState } from '../state/load-active-state/load-active.store';
import { LoadClosedState } from '../state/load-closed-state/load-closed.store';
import { LoadPandingState } from '../state/load-pending-state/load-panding.store';
import { LoadTemplateState } from '../state/load-template-state/load-template.store';
import { TaThousandSeparatorPipe } from '../../../pipes/taThousandSeparator.pipe';
import { tableSearch } from 'src/app/core/utils/methods.globals';
import { LoadTService } from '../state/load.service';
import { LoadListResponse } from 'appcoretruckassist';
import { ImageBase64Service } from 'src/app/core/utils/base64.image';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-load-table',
    templateUrl: './load-table.component.html',
    styleUrls: ['./load-table.component.scss'],
    providers: [TaThousandSeparatorPipe],
})
export class LoadTableComponent implements OnInit, AfterViewInit, OnDestroy {
    private destroy$ = new Subject<void>();

    tableOptions: any = {};
    tableData: any[] = [];
    viewData: any[] = [];
    columns: any[] = [];
    selectedTab = 'pending';
    activeViewMode: string = 'List';
    resizeObserver: ResizeObserver;
    loadActive: LoadActiveState[] = [];
    loadClosed: LoadClosedState[] = [];
    loadPanding: LoadPandingState[] = [];
    loadTemplate: LoadTemplateState[] = [];
    backLoadFilterQuery = {
        loadType: undefined,
        statusType: 1,
        status: undefined,
        dispatcherId: undefined,
        dispatchId: undefined,
        brokerId: undefined,
        shipperId: undefined,
        dateFrom: undefined,
        dateTo: undefined,
        revenueFrom: undefined,
        revenueTo: undefined,
        truckId: undefined,
        pageIndex: 1,
        pageSize: 25,
        companyId: undefined,
        sort: undefined,
        searchOne: undefined,
        searchTwo: undefined,
        searchThree: undefined,
    };

    constructor(
        private tableService: TruckassistTableService,
        private modalService: ModalService,
        private loadActiveQuery: LoadActiveQuery,
        private loadClosedQuery: LoadClosedQuery,
        private loadPandinQuery: LoadPandinQuery,
        private loadTemplateQuery: LoadTemplateQuery,
        private thousandSeparator: TaThousandSeparatorPipe,
        private loadServices: LoadTService,
        private imageBase64Service: ImageBase64Service,
        public datePipe: DatePipe
    ) {}

    // ---------------------------- ngOnInit ------------------------------
    ngOnInit(): void {
        this.sendLoadData();
        // Confirmation Subscribe
        /* this.confirmationService.confirmationData$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: Confirmation) => {
          switch (res.type) {
            case 'delete': {
              if (res.template === 'driver') {
                this.deleteDriverById(res.id);
              }
              break;
            }
            case 'activate': {
              this.changeDriverStatus(res.id);
              break;
            }
            case 'deactivate': {
              this.changeDriverStatus(res.id);
              break;
            }
            case 'multiple delete': {
              this.multipleDeleteDrivers(res.array);
              break;
            }
            default: {
              break;
            }
          }
        },
      }); */

        // Reset Columns
        this.tableService.currentResetColumns
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: boolean) => {
                if (response) {
                    this.sendLoadData();
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
                    this.backLoadFilterQuery.statusType =
                        this.selectedTab === 'template'
                            ? undefined
                            : this.selectedTab === 'active'
                            ? 2
                            : this.selectedTab === 'closed'
                            ? 3
                            : 1;
                    this.backLoadFilterQuery.pageIndex = 1;

                    const searchEvent = tableSearch(
                        res,
                        this.backLoadFilterQuery
                    );
                    if (searchEvent) {
                        if (searchEvent.action === 'api') {
                            this.loadBackFilter(searchEvent.query);
                        } else if (searchEvent.action === 'store') {
                            this.sendLoadData();
                        }
                    }
                }
            });

        // Delete Selected Rows
        this.tableService.currentDeleteSelectedRows
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: any[]) => {
                if (response.length) {
                    // let mappedRes = response.map((item) => {
                    //   return {
                    //     id: item.id,
                    //     data: { ...item.tableData, name: item.tableData?.fullName },
                    //   };
                    // });
                    /* this.modalService.openModal(
            ConfirmationModalComponent,
            { size: 'small' },
            {
              data: null,
              array: mappedRes,
              template: 'driver',
              type: 'multiple delete',
              image: true,
            }
          ); */
                }
            });

        // Driver Actions
        this.tableService.currentActionAnimation
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
                // On Add Driver Active
                if (res.animation === 'add' && this.selectedTab === 'active') {
                    /*  this.viewData.push(this.mapDriverData(res.data));

          this.viewData = this.viewData.map((driver: any) => {
            if (driver.id === res.id) {
              driver.actionAnimation = 'add';
            }

            return driver;
          });

          this.updateDataCount();

          const inetval = setInterval(() => {
            this.viewData = closeAnimationAction(false, this.viewData);

            clearInterval(inetval);
          }, 2300); */
                }
                // On Add Driver Inactive
                else if (
                    res.animation === 'add' &&
                    this.selectedTab === 'inactive'
                ) {
                    /* this.updateDataCount(); */
                }
                // On Update Driver
                else if (res.animation === 'update') {
                    /*  const updatedDriver = this.mapDriverData(res.data);

          this.viewData = this.viewData.map((driver: any) => {
            if (driver.id === res.id) {
              driver = updatedDriver;
              driver.actionAnimation = 'update';
            }

            return driver;
          });

          const inetval = setInterval(() => {
            this.viewData = closeAnimationAction(false, this.viewData);

            clearInterval(inetval);
          }, 1000); */
                }
                // On Update Driver Status
                else if (res.animation === 'update-status') {
                    /* let driverIndex: number;

          this.viewData = this.viewData.map((driver: any, index: number) => {
            if (driver.id === res.id) {
              driver.actionAnimation = this.selectedTab === 'active' ? 'deactivate' : 'activate';;
              driverIndex = index;
            }

            return driver;
          });

          this.updateDataCount();

          const inetval = setInterval(() => {
            this.viewData = closeAnimationAction(false, this.viewData);

            this.viewData.splice(driverIndex, 1);
            clearInterval(inetval);
          }, 900); */
                }
                // On Delete Driver
                else if (res.animation === 'delete') {
                    /* let driverIndex: number;

          this.viewData = this.viewData.map((driver: any, index: number) => {
            if (driver.id === res.id) {
              driver.actionAnimation = 'delete';
              driverIndex = index;
            }

            return driver;
          });

          this.updateDataCount();

          const inetval = setInterval(() => {
            this.viewData = closeAnimationAction(false, this.viewData);

            this.viewData.splice(driverIndex, 1);
            clearInterval(inetval);
          }, 900); */
                }
            });
    }

    // ---------------------------- ngAfterViewInit ------------------------------
    ngAfterViewInit(): void {
        setTimeout(() => {
            this.observTableContainer();
        }, 10);
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
                showTimeFilter: this.selectedTab !== 'template',
                showDispatcherFilter: this.selectedTab !== 'template',
                showStatusFilter: this.selectedTab !== 'template',
                showLtlFilter: true,
                showMoneyFilter: true,
                viewModeOptions: [
                    { name: 'List', active: this.activeViewMode === 'List' },
                    { name: 'Card', active: this.activeViewMode === 'Card' },
                ],
            },
        };
    }

    sendLoadData() {
        const tableView = JSON.parse(localStorage.getItem(`Load-table-view`));

        if (tableView) {
            this.selectedTab = tableView.tabSelected;
            this.activeViewMode = tableView.viewMode;
        }

        this.initTableOptions();

        const loadCount = JSON.parse(localStorage.getItem('loadTableCount'));

        const loadTemplateData =
            this.selectedTab === 'template' ? this.getTabData('template') : [];

        const loadPendingData =
            this.selectedTab === 'pending' ? this.getTabData('pending') : [];

        const loadActiveData =
            this.selectedTab === 'active' ? this.getTabData('active') : [];

        const repairClosedData =
            this.selectedTab === 'closed' ? this.getTabData('closed') : [];

        this.tableData = [
            {
                title: 'Template',
                field: 'template',
                length: loadCount.templateCount,
                data: loadTemplateData,
                extended: false,
                gridNameTitle: 'Load',
                stateName: 'loads',
                tableConfiguration: 'LOAD_TEMPLATE',
                isActive: this.selectedTab === 'template',
                gridColumns: this.getGridColumns('template', 'LOAD_TEMPLATE'),
            },
            {
                title: 'Pending',
                field: 'pending',
                length: loadCount.pendingCount,
                data: loadPendingData,
                extended: false,
                gridNameTitle: 'Load',
                stateName: 'loads',
                tableConfiguration: 'LOAD_REGULAR',
                isActive: this.selectedTab === 'pending',
                gridColumns: this.getGridColumns('pending', 'LOAD_REGULAR'),
            },
            {
                title: 'Active',
                field: 'active',
                length: loadCount.activeCount,
                data: loadActiveData,
                extended: false,
                gridNameTitle: 'Load',
                stateName: 'loads',
                tableConfiguration: 'LOAD_REGULAR',
                isActive: this.selectedTab === 'active',
                gridColumns: this.getGridColumns('active', 'LOAD_REGULAR'),
            },
            {
                title: 'Closed',
                field: 'closed',
                length: loadCount.closedCount,
                data: repairClosedData,
                extended: false,
                gridNameTitle: 'Load',
                stateName: 'loads',
                tableConfiguration: 'LOAD_CLOSED',
                isActive: this.selectedTab === 'closed',
                gridColumns: this.getGridColumns('closed', 'LOAD_CLOSED'),
            },
        ];

        const td = this.tableData.find((t) => t.field === this.selectedTab);
        this.setLoadData(td);
    }

    getGridColumns(activeTab: string, configType: string) {
        const tableColumnsConfig = JSON.parse(
            localStorage.getItem(`table-${configType}-Configuration`)
        );

        if (activeTab === 'template') {
            return tableColumnsConfig
                ? tableColumnsConfig
                : getLoadTemplateColumnDefinition();
        } else if (activeTab === 'closed') {
            return tableColumnsConfig
                ? tableColumnsConfig
                : getLoadClosedColumnDefinition();
        } else {
            return tableColumnsConfig
                ? tableColumnsConfig
                : getLoadActiveAndPendingColumnDefinition();
        }
    }

    setLoadData(td: any) {
        this.columns = td.gridColumns;
        if (td.data?.length) {
            this.viewData = td.data;

            this.viewData = this.viewData.map((data) => {
                return this.mapLoadData(data);
            });
        } else {
            this.viewData = [];
        }
    }

    mapLoadData(data: any) {
        return {
            ...data,
            isSelected: false,
            loadInvoice: {
                invoice: data?.loadNumber ? data.loadNumber : '',
                type: data?.type?.name ? data.type.name : '',
            },
            loadDispatcher: {
                name: data?.dispatcher?.fullName
                    ? data.dispatcher.fullName
                    : '',
                avatar: data?.dispatcher?.avatar
                    ? this.imageBase64Service.sanitizer(data.dispatcher.avatar)
                    : null,
            },
            loadTotal: {
                total: data?.totalRate
                    ? '$' + this.thousandSeparator.transform(data.totalRate)
                    : '',
                subTotal: data?.totalAdjustedRate
                    ? '$' +
                      this.thousandSeparator.transform(data.totalAdjustedRate)
                    : '',
            },
            loadBroker: {
                hasBanDnu: data?.broker?.ban || data?.broker?.dnu,
                isDnu: data?.broker?.dnu,
                name: data?.broker?.businessName
                    ? data.broker.businessName
                    : '',
            },
            loadTruckNumber: {
                number: data?.dispatch?.truck?.truckNumber
                    ? data.dispatch.truck.truckNumber
                    : '',
                color: '',
            },
            loadTrailerNumber: {
                number: data?.dispatch?.trailer?.trailerNumber
                    ? data.dispatch.trailer.trailerNumber
                    : '',
                color: '',
            },
            loadPickup: {
                count: data?.stops[0]?.stopLoadOrder
                    ? data.stops[0].stopLoadOrder
                    : '',
                location:
                    data?.stops[0]?.shipper?.address?.city +
                    ', ' +
                    data?.stops[0]?.shipper?.address?.stateShortName,
                date: data?.stops[0]?.dateFrom
                    ? this.datePipe.transform(
                          data.stops[0].dateFrom,
                          'MM/dd/yy'
                      )
                    : '',
                time: data?.stops[0]?.timeFrom ? data.stops[0].timeFrom : '',
            },
            loadDelivery: {
                count: data?.stops[data.stops.length - 1]?.stopLoadOrder
                    ? data.stops[data.stops.length - 1].stopLoadOrder
                    : '',
                location:
                    data?.stops[data.stops.length - 1]?.shipper?.address?.city +
                    ', ' +
                    data?.stops[data.stops.length - 1]?.shipper?.address
                        ?.stateShortName,
                date: data?.stops[data.stops.length - 1]?.dateFrom
                    ? this.datePipe.transform(
                          data.stops[data.stops.length - 1].dateFrom,
                          'MM/dd/yy'
                      )
                    : '',
                time: data?.stops[data.stops.length - 1]?.timeFrom
                    ? data.stops[data.stops.length - 1].timeFrom
                    : '',
            },
            loadStatus: {
                status: data?.status?.name ? data.status?.name : '',
                color: '',
                time:
                    data?.lastStatusPassed?.hours +
                    'h ' +
                    data?.lastStatusPassed?.minutes +
                    'min',
            },
            textMiles: data?.totalMiles ? data.totalMiles + ' mi' : '',
            textCommodity: data?.generalCommodity?.name
                ? data.generalCommodity.name
                : '',
            textWeight: data?.weight ? data.weight + ' lbs' : '',
            textBase: data?.baseRate
                ? '$' + this.thousandSeparator.transform(data.baseRate)
                : '',
            textAdditional: data?.additionalBillingRatesTotal
                ? '$' +
                  this.thousandSeparator.transform(
                      data?.additionalBillingRatesTotal
                  )
                : '',
            textAdvance: data?.advancePay
                ? '$' + this.thousandSeparator.transform(data.advancePay)
                : '',
            textPayTerms: data?.broker?.payTerm?.name
                ? data.broker.payTerm?.name
                : '',
            textDriver:
                data?.dispatch?.driver?.firstName &&
                data?.dispatch?.driver?.lastName
                    ? data?.dispatch?.driver?.firstName.charAt(0) +
                      '. ' +
                      data?.dispatch?.driver?.lastName
                    : '',
            loadComment: {
                count: data?.commentsCount ? data.commentsCount : '',
                comments: data.comments,
            },
            tableAttachments: data?.files ? data.files : [],
            fileCount: data?.fileCount,
            tableDropdownContent: {
                hasContent: true,
                content: this.getDropdownLoadContent(data),
            },
        };
    }

    getDropdownLoadContent(data: any) {
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
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Information.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: 'regular',
                hasBorder: true,
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
            },
            {
                title: 'Share',
                name: 'share',
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Share.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: 'regular',
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
            },
            {
                title: 'Print',
                name: 'print',
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Print.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: 'regular',
                hasBorder: true,
            },
            {
                title: 'Delete',
                name: 'delete',
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Delete.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: 'delete',
            },
        ];
    }

    getTabData(dataType: string) {
        if (dataType === 'active') {
            this.loadActive = this.loadActiveQuery.getAll();

            return this.loadActive?.length ? this.loadActive : [];
        } else if (dataType === 'closed') {
            this.loadClosed = this.loadClosedQuery.getAll();

            return this.loadClosed?.length ? this.loadClosed : [];
        } else if (dataType === 'pending') {
            this.loadPanding = this.loadPandinQuery.getAll();
            return this.loadPanding?.length ? this.loadPanding : [];
        } else if (dataType === 'template') {
            this.loadTemplate = this.loadTemplateQuery.getAll();

            return this.loadTemplate?.length ? this.loadTemplate : [];
        }
    }
    // Load Back Filter Query
    loadBackFilter(
        filter: {
            loadType: number | undefined;
            statusType: number | undefined;
            status: number | undefined;
            dispatcherId: number | undefined;
            dispatchId: number | undefined;
            brokerId: number | undefined;
            shipperId: number | undefined;
            dateFrom: string | undefined;
            dateTo: string | undefined;
            revenueFrom: number | undefined;
            revenueTo: number | undefined;
            truckId: number | undefined;
            pageIndex: number;
            pageSize: number;
            companyId: number | undefined;
            sort: string | undefined;
            searchOne: string | undefined;
            searchTwo: string | undefined;
            searchThree: string | undefined;
        },
        isShowMore?: boolean
    ) {
        this.loadServices
            .getLoadList(
                filter.loadType,
                filter.statusType,
                filter.status,
                filter.dispatcherId,
                filter.dispatchId,
                filter.brokerId,
                filter.shipperId,
                filter.dateFrom,
                filter.dateTo,
                filter.revenueFrom,
                filter.revenueTo,
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
            .subscribe((loads: LoadListResponse) => {
                if (!isShowMore) {
                    this.viewData = loads.pagination.data;

                    this.viewData = this.viewData.map((data: any) => {
                        return this.mapLoadData(data);
                    });
                } else {
                    let newData = [...this.viewData];

                    loads.pagination.data.map((data: any) => {
                        newData.push(this.mapLoadData(data));
                    });

                    this.viewData = [...newData];
                }
            });
    }

    // ---------------------------- Table Actions ------------------------------
    onToolBarAction(event: any) {
        if (event.action === 'open-modal') {
            this.modalService.openModal(LoadModalComponent, { size: 'load' });
        } else if (event.action === 'tab-selected') {
            this.selectedTab = event.tabData.field;

            this.backLoadFilterQuery.statusType =
                this.selectedTab === 'template'
                    ? undefined
                    : this.selectedTab === 'active'
                    ? 2
                    : this.selectedTab === 'closed'
                    ? 3
                    : 1;

            this.backLoadFilterQuery.pageIndex = 1;

            this.sendLoadData();
        } else if (event.action === 'view-mode') {
            this.activeViewMode = event.mode;
        }
    }

    onTableHeadActions(event: any) {
        if (event.action === 'sort') {
            if (event.direction) {
                this.backLoadFilterQuery.statusType =
                    this.selectedTab === 'template'
                        ? undefined
                        : this.selectedTab === 'active'
                        ? 2
                        : this.selectedTab === 'closed'
                        ? 3
                        : 1;
                this.backLoadFilterQuery.pageIndex = 1;
                this.backLoadFilterQuery.sort = event.direction;

                this.loadBackFilter(this.backLoadFilterQuery);
            } else {
                this.sendLoadData();
            }
        }
    }

    onTableBodyActions(event: any) {
        if (event.type === 'show-more') {
            this.backLoadFilterQuery.statusType =
                this.selectedTab === 'template'
                    ? undefined
                    : this.selectedTab === 'active'
                    ? 2
                    : this.selectedTab === 'closed'
                    ? 3
                    : 1;
            this.backLoadFilterQuery.pageIndex++;
            this.loadBackFilter(this.backLoadFilterQuery, true);
        } else if (event.type === 'edit') {
            this.modalService.openModal(
                LoadModalComponent,
                { size: 'load' },
                {
                    ...event,
                    disableButton: true,
                }
            );
        }
    }

    // ---------------------------- ngOnDestroy ------------------------------
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.tableService.sendActionAnimation({});
        // this.resizeObserver.unobserve(
        //     document.querySelector('.table-container')
        // );
        this.resizeObserver.disconnect();
    }
}
