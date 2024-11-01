import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewEncapsulation,
    AfterViewInit,
    EnvironmentInjector,
    ViewContainerRef,
    inject,
    ComponentRef,
    OnDestroy,
    ViewChildren,
    QueryList,
} from '@angular/core';
import { Observable, takeUntil, Subject } from 'rxjs';

// Pipes
import { NameInitialsPipe } from '@shared/pipes/name-initials.pipe';

// Helpers
import { getPayrollDriverMilesDefinition } from '@shared/utils/settings/table-settings/payroll-columns';

// Store
import { DriverState } from '@pages/driver/state/driver-state/driver.store';
import { DriversInactiveState } from '@pages/driver/state/driver-inactive-state/driver-inactive.store';
import { PayrollFacadeService } from './state/services/payroll.service';

// Models
import { IPayrollCountsSelector } from './state/models/payroll.model';
import { DriverMileageCollapsedTableComponent } from './components/tables/driver-mileage/driver-mileage-collapsed-table/driver-mileage-collapsed-table.component';

// Components
import { PayrollListSummaryOverview } from 'ca-components';
import { DriverMileageSoloTableComponent } from './components/tables/driver-mileage/driver-mileage-solo-table/driver-mileage-solo-table.component';
import { DriverMileageExpandedTableComponent } from './components/tables/driver-mileage/driver-mileage-expanded-table/driver-mileage-expanded-table.component';
import { DriverCommissionSoloTableComponent } from './components/tables/driver-commission/driver-commission-solo-table/driver-commission-solo-table.component';
import { DriverOwnerTableComponent } from './components/tables/driver-owner/driver-owner-table/driver-owner-table.component';
import { DriverFlatRateTableComponent } from './components/tables/driver-flat-rate/driver-flat-rate-table/driver-flat-rate-table.component';
import { DriverCommissionCollapsedTableComponent } from './components/tables/driver-commission/driver-commission-collapsed-table/driver-commission-collapsed-table.component';
import { DriverFlatRateCollapsedTableComponent } from './components/tables/driver-flat-rate/driver-flat-rate-collapsed-table/driver-flat-rate-collapsed-table.component';
import { DriverOwnerCollapsedTableComponent } from './components/tables/driver-owner/driver-owner-collapsed-table/driver-owner-collapsed-table.component';
import { DriverCommissionExpandedTableComponent } from './components/tables/driver-commission/driver-commission-expanded-table/driver-commission-expanded-table.component';
import { DriverFlatRateExpandedTableComponent } from './components/tables/driver-flat-rate/driver-flat-rate-expanded-table/driver-flat-rate-expanded-table.component';
import { DriverOwnerExpandedTableComponent } from './components/tables/driver-owner/driver-owner-expanded-table/driver-owner-expanded-table.component';
@Component({
    selector: 'app-payroll',
    templateUrl: './payroll.component.html',
    styleUrls: ['./payroll.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [NameInitialsPipe],
})
export class PayrollComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChildren('container', { read: ViewContainerRef })
    containers!: QueryList<ViewContainerRef>;

    componentRef: ComponentRef<any> | null = null;

    environmentInjector = inject(EnvironmentInjector); // Inject the EnvironmentInjector

    tableOptions: any = {};
    payrollType: string;
    selectedOpenFromList: any;

    selectedTab = 'open';
    tableData: any[] = [];
    columns: any[] = [];
    tableContainerWidth: number = 0;
    viewData: any[] = [];
    resizeObserver: ResizeObserver;

    driversActive: DriverState[] = [];
    driversInactive: DriversInactiveState[] = [];
    mapingIndex: number = 0;

    payrollCountsResponse$: Observable<IPayrollCountsSelector>;
    payrollTabCountResponse$: Observable<{
        open: number;
        closed: number;
    }>;

    reportTableData: any = {};
    reportTableExpanded$: Observable<boolean>;
    openedIndex: number = -1;

    private destroy$ = new Subject<void>();

    constructor(
        // Services
        private payrollFacadeService: PayrollFacadeService
    ) {}

    public subscribeToStoreData() {
        this.reportTableExpanded$ =
            this.payrollFacadeService.reportTableExpanded$;
        this.payrollFacadeService.getPayrollCounts();
        this.payrollCountsResponse$ =
            this.payrollFacadeService.selectPayrollCounts$;
        this.payrollFacadeService.selectPayrollCounts$
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.openedIndex = -1;
            });

        this.payrollFacadeService.selectPayrollTabCounts$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (this.tableData.length) {
                    this.tableData[0].length = res.open;
                    this.tableData[1].length = res.closed;
                }
            });

        this.payrollFacadeService.selectPayrollOpenedTab$
            .pipe(takeUntil(this.destroy$))
            .subscribe((tab) => {
                this.selectedTab = tab;
            });
    }

    ngOnInit(): void {
        this.initTableOptions();
        this.subscribeToStoreData();

        this.tableData = [
            {
                title: 'Open',
                field: 'open',
                length: 0,
                data: [],
                extended: true,
                gridNameTitle: 'Payroll',
                stateName: 'open',
                tableConfiguration: 'APPLICANT',
                isActive: this.selectedTab === 'open',
                gridColumns: getPayrollDriverMilesDefinition(),
            },
            {
                title: 'Closed',
                field: 'closed',
                length: 0,
                data: [],
                extended: false,
                gridNameTitle: 'Payroll',
                stateName: 'closed',
                tableConfiguration: 'DRIVER',
                isActive: this.selectedTab === 'closed',
                gridColumns: [],
            },
        ];
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.observTableContainer();
        }, 10);
    }

    public hideShowTables(data: {
        payrollSummary: PayrollListSummaryOverview;
        status: boolean;
        index: number;
    }) {
        this.openedIndex = this.openedIndex === data.index ? -1 : data.index;
        if (data.status) {
            this.payrollType = `${data.payrollSummary.text} ${data.payrollSummary.type}`;

            this.selectedOpenFromList = undefined;
            this.handleTableShow(data.index);
        }
    }

    handleTableShow(index?: number) {
        const containersArray = this.containers.toArray();
        const mainIndx =
            typeof index !== 'undefined' ? index : this.openedIndex;

        const cointainer = containersArray[mainIndx];
        cointainer.clear();

        switch (this.payrollType) {
            case 'Driver Miles':
                if (this.selectedTab === 'open') {
                    this.componentRef = cointainer.createComponent(
                        DriverMileageSoloTableComponent,
                        {
                            environmentInjector: this.environmentInjector,
                        }
                    );

                    // Set inputs and subscribe to outputs if componentRef is created
                    if (this.componentRef) {
                        this.componentRef.instance.expandTableEvent.subscribe(
                            (event: any) => this.expandTable(event)
                        );
                    }
                } else if (this.selectedOpenFromList) {
                    this.componentRef = cointainer.createComponent(
                        DriverMileageExpandedTableComponent,
                        {
                            environmentInjector: this.environmentInjector,
                        }
                    );
                    if (this.componentRef) {
                        this.componentRef.instance.driverId =
                            this.selectedOpenFromList.id; // Example input property

                        this.componentRef.instance.expandTableEvent.subscribe(
                            (event: any) => {
                                this.reportTableData = event;
                                this.payrollFacadeService.setPayrollReportTableExpanded(
                                    true
                                );
                            }
                        );
                    }
                } else {
                    this.componentRef = cointainer.createComponent(
                        DriverMileageCollapsedTableComponent,
                        {
                            environmentInjector: this.environmentInjector,
                        }
                    );

                    this.componentRef.instance.expandTableEvent.subscribe(
                        (event: any) => {
                            this.selectedOpenFromList = {
                                fullName: event.driver.fullName,
                                payrollCount: event.payrollCount,
                                id: event.driver.id,
                                title: 'Driver (Mile)',
                            };
                            this.handleTableShow();
                        }
                    );
                }
                break;
            case 'Driver Flat Rate':
                if (this.selectedTab === 'open') {
                    this.componentRef = cointainer.createComponent(
                        DriverFlatRateTableComponent,
                        {
                            environmentInjector: this.environmentInjector,
                        }
                    );

                    // Set inputs and subscribe to outputs if componentRef is created
                    if (this.componentRef) {
                        this.componentRef.instance.expandTableEvent.subscribe(
                            (event: any) => this.expandTable(event)
                        );
                    }
                } else if (this.selectedOpenFromList) {
                    this.componentRef = cointainer.createComponent(
                        DriverFlatRateExpandedTableComponent,
                        {
                            environmentInjector: this.environmentInjector,
                        }
                    );
                    if (this.componentRef) {
                        this.componentRef.instance.driverId =
                            this.selectedOpenFromList.id; // Example input property

                        this.componentRef.instance.expandTableEvent.subscribe(
                            (event: any) => {
                                this.reportTableData = event;
                                this.payrollFacadeService.setPayrollReportTableExpanded(
                                    true
                                );
                                console.log(
                                    'EVENT FROM EXAPNDED TABLE BLAH',
                                    event
                                );
                            }
                        );
                    }
                } else {
                    this.componentRef = cointainer.createComponent(
                        DriverFlatRateCollapsedTableComponent,
                        {
                            environmentInjector: this.environmentInjector,
                        }
                    );

                    this.componentRef.instance.expandTableEvent.subscribe(
                        (event: any) => {
                            this.selectedOpenFromList = {
                                fullName: event.driver.fullName,
                                payrollCount: event.payrollCount,
                                id: event.driver.id,
                                title: 'Driver (Flat Rate)',
                            };
                            this.handleTableShow();
                        }
                    );
                }
                break;
            case 'Driver Commission':
                if (this.selectedTab === 'open') {
                    this.componentRef = cointainer.createComponent(
                        DriverCommissionSoloTableComponent,
                        {
                            environmentInjector: this.environmentInjector,
                        }
                    );

                    // Set inputs and subscribe to outputs if componentRef is created
                    if (this.componentRef) {
                        this.componentRef.instance.expandTableEvent.subscribe(
                            (event: any) => this.expandTable(event)
                        );
                    }
                } else if (this.selectedOpenFromList) {
                    this.componentRef = cointainer.createComponent(
                        DriverCommissionExpandedTableComponent,
                        {
                            environmentInjector: this.environmentInjector,
                        }
                    );
                    if (this.componentRef) {
                        this.componentRef.instance.driverId =
                            this.selectedOpenFromList.id; // Example input property

                        this.componentRef.instance.expandTableEvent.subscribe(
                            (event: any) => {
                                this.reportTableData = event;
                                this.payrollFacadeService.setPayrollReportTableExpanded(
                                    true
                                );
                                console.log(
                                    'EVENT FROM EXAPNDED TABLE BLAH',
                                    event
                                );
                            }
                        );
                    }
                } else {
                    this.componentRef = cointainer.createComponent(
                        DriverCommissionCollapsedTableComponent,
                        {
                            environmentInjector: this.environmentInjector,
                        }
                    );

                    this.componentRef.instance.expandTableEvent.subscribe(
                        (event: any) => {
                            this.selectedOpenFromList = {
                                fullName: event.driver.fullName,
                                payrollCount: event.payrollCount,
                                id: event.driver.id,
                                title: 'Driver (Commission)',
                            };
                            this.handleTableShow();
                        }
                    );
                }
                break;
            case 'Owner ':
                if (this.selectedTab === 'open') {
                    this.componentRef = cointainer.createComponent(
                        DriverOwnerTableComponent,
                        {
                            environmentInjector: this.environmentInjector,
                        }
                    );

                    // Set inputs and subscribe to outputs if componentRef is created
                    if (this.componentRef) {
                        this.componentRef.instance.expandTableEvent.subscribe(
                            (event: any) => this.expandTable(event)
                        );
                    }
                } else if (this.selectedOpenFromList) {
                    this.componentRef = cointainer.createComponent(
                        DriverOwnerExpandedTableComponent,
                        {
                            environmentInjector: this.environmentInjector,
                        }
                    );
                    if (this.componentRef) {
                        this.componentRef.instance.driverId =
                            this.selectedOpenFromList.id; // Example input property

                        this.componentRef.instance.expandTableEvent.subscribe(
                            (event: any) => {
                                this.reportTableData = event;
                                this.payrollFacadeService.setPayrollReportTableExpanded(
                                    true
                                );
                            }
                        );
                    }
                } else {
                    this.componentRef = cointainer.createComponent(
                        DriverOwnerCollapsedTableComponent,
                        {
                            environmentInjector: this.environmentInjector,
                        }
                    );

                    this.componentRef.instance.expandTableEvent.subscribe(
                        (event: any) => {
                            this.selectedOpenFromList = {
                                fullName: `${event.truck.truckNumber} - ${event.owner}`,
                                payrollCount: event.payrollCount,
                                id: event.truck.id,
                                title: 'Owner',
                                hideAvatar: true,
                            };
                            this.handleTableShow();
                        }
                    );
                }
                break;
        }

        // Set inputs and subscribe to outputs if componentRef is created
        if (this.componentRef) {
            // Setting Inputs
            this.componentRef.instance.expandTable = false; // Example input property

            // Bind the expandTable input using an Observable
            this.reportTableExpanded$
                .pipe(takeUntil(this.destroy$))
                .subscribe((value) => {
                    this.componentRef!.instance.expandTable = value; // The input is updated automatically
                });
        }
    }

    expandTable(data?: any) {
        if (data) {
            this.reportTableData = data;
            this.payrollFacadeService.setPayrollReportTableExpanded(true);
        }
    }

    observTableContainer() {
        this.resizeObserver = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                this.tableContainerWidth = entry.contentRect.width;
            });
        });

        this.resizeObserver.observe(document.querySelector('.table-container'));
    }

    public summaryControll() {}

    onToolBarAction(event: any) {
        if (event.action === 'tab-selected') {
            this.payrollFacadeService.setPayrollOpenedTab(event.tabData.field);
            this.openedIndex = -1;
            this.expandTable();
            this.payrollFacadeService.getPayrollCounts();
            this.payrollFacadeService.setPayrollReportTableExpanded(false);
        }
    }

    initTableOptions(): void {
        this.tableOptions = {
            toolbarActions: {
                showMoneyFilter: true,
                hideOpenModalButton: true,
                hideWidth: true,
            },
            actions: this.getTableActions(),
        };
    }

    getTableActions() {
        return this.selectedTab === 'applicants'
            ? [
                  {
                      title: 'Hire Applicant',
                      name: 'hire-applicant',
                      class: '',
                      contentType: '',
                  },
                  {
                      title: 'Resend Invitation',
                      name: 'resend-invitation',
                      class: '',
                      contentType: '',
                  },
                  {
                      title: 'Add to Favourites',
                      name: 'add-to-favourites',
                      class: '',
                      contentType: '',
                  },
                  {
                      title: 'Add to Favourites',
                      name: 'add-to-favourites',
                      class: '',
                      contentType: '',
                  },
                  {
                      title: 'Delete',
                      name: 'delete-applicant',
                      type: 'driver',
                      text: 'Are you sure you want to delete applicant(s)?',
                      class: 'delete-text',
                      contentType: 'delete',
                  },
              ]
            : [
                  {
                      title: 'Edit Driver',
                      name: 'edit',
                      class: 'regular-text',
                      contentType: 'edit',
                  },
                  {
                      title: 'Add CDL',
                      name: 'new-licence',
                      class: 'regular-text',
                      contentType: 'add',
                  },
                  {
                      title: 'Add Medical',
                      name: 'new-medical',
                      class: 'regular-text',
                      contentType: 'add',
                  },
                  {
                      title: 'Add MVR',
                      name: 'new-mvr',
                      class: 'regular-text',
                      contentType: 'add',
                  },
                  {
                      title: 'Add Test',
                      name: 'new-drug',
                      class: 'regular-text',
                      contentType: 'add',
                  },
                  {
                      title:
                          this.selectedTab === 'inactive'
                              ? 'Activate'
                              : 'Deactivate',
                      name: 'activate-item',
                      class: 'regular-text',
                      contentType: 'activate',
                  },
                  {
                      title: 'Delete',
                      name: 'delete-item',
                      type: 'driver',
                      text: 'Are you sure you want to delete driver(s)?',
                      class: 'delete-text',
                      contentType: 'delete',
                  },
              ];
    }

    openPayrollReport() {}

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    closeOpenPreview(e: any) {
        e.preventDefault();
        e.stopPropagation();

        this.selectedOpenFromList = undefined;
        this.payrollFacadeService.setPayrollReportTableExpanded(false);
        this.handleTableShow();
    }
}
