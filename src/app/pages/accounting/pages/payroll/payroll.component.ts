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

// Services
import { PayrollFacadeService } from '@pages/accounting/pages/payroll/state/services';
// Models

import { IPayrollCountsSelector } from '@pages/accounting/pages/payroll/state/models';
import { DriverMileageCollapsedTableComponent } from '@pages/accounting/pages/payroll/components/tables/driver-mileage/driver-mileage-collapsed-table/driver-mileage-collapsed-table.component';

// Enums
import {
    PayrollTables,
    PayrollTablesStatus,
} from '@pages/accounting/pages/payroll/state/enums';

// Components
import { PayrollListSummaryOverview } from 'ca-components';
import { DriverMileageSoloTableComponent } from '@pages/accounting/pages/payroll/components/tables/driver-mileage/driver-mileage-solo-table/driver-mileage-solo-table.component';
import { DriverMileageExpandedTableComponent } from '@pages/accounting/pages/payroll/components/tables/driver-mileage/driver-mileage-expanded-table/driver-mileage-expanded-table.component';
import { DriverCommissionSoloTableComponent } from '@pages/accounting/pages/payroll/components/tables/driver-commission/driver-commission-solo-table/driver-commission-solo-table.component';
import { DriverOwnerTableComponent } from '@pages/accounting/pages/payroll/components/tables/driver-owner/driver-owner-table/driver-owner-table.component';
import { DriverFlatRateTableComponent } from '@pages/accounting/pages/payroll/components/tables/driver-flat-rate/driver-flat-rate-table/driver-flat-rate-table.component';
import { DriverCommissionCollapsedTableComponent } from '@pages/accounting/pages/payroll/components/tables/driver-commission/driver-commission-collapsed-table/driver-commission-collapsed-table.component';
import { DriverFlatRateCollapsedTableComponent } from '@pages/accounting/pages/payroll/components/tables/driver-flat-rate/driver-flat-rate-collapsed-table/driver-flat-rate-collapsed-table.component';
import { DriverOwnerCollapsedTableComponent } from '@pages/accounting/pages/payroll/components/tables/driver-owner/driver-owner-collapsed-table/driver-owner-collapsed-table.component';
import { DriverCommissionExpandedTableComponent } from '@pages/accounting/pages/payroll/components/tables/driver-commission/driver-commission-expanded-table/driver-commission-expanded-table.component';
import { DriverFlatRateExpandedTableComponent } from '@pages/accounting/pages/payroll/components/tables/driver-flat-rate/driver-flat-rate-expanded-table/driver-flat-rate-expanded-table.component';
import { DriverOwnerExpandedTableComponent } from '@pages/accounting/pages/payroll/components/tables/driver-owner/driver-owner-expanded-table/driver-owner-expanded-table.component';
@Component({
    selector: 'app-payroll',
    templateUrl: './payroll.component.html',
    styleUrls: ['./payroll.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [NameInitialsPipe],
})
export class PayrollComponent implements OnInit, AfterViewInit, OnDestroy {
    // Templates
    @ViewChildren('container', { read: ViewContainerRef })
    containers!: QueryList<ViewContainerRef>;


    public PayrollTables = PayrollTables;
    private componentRef: ComponentRef<any> | null = null;

    private environmentInjector = inject(EnvironmentInjector); // Inject the EnvironmentInjector

    public payrollType: string;
    public payrollReportType: string;

    public selectedOpenFromList: {
        fullName: string;
        payrollCount: number;
        id: number;
        title: PayrollTables;
        hideAvatar?: boolean;
    };

    public selectedTabForReport = PayrollTablesStatus.OPEN;
    public selectedTab = PayrollTablesStatus.OPEN;

    // THIS IS TEST FOR TABLE RESIZER
    private tableContainerWidth: number = 0;
    private resizeObserver: ResizeObserver;

    public payrollCountsResponse$: Observable<IPayrollCountsSelector>;

    public reportTableDataId: string = '';
    public reportTableExpanded$: Observable<boolean>;
    public openedIndex: number = -1;

    private destroy$ = new Subject<void>();

    constructor(
        // Services
        private payrollFacadeService: PayrollFacadeService
    ) {}

    public subscribeToStoreData(): void {
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

        this.payrollFacadeService.selectPayrollOpenedTab$
            .pipe(takeUntil(this.destroy$))
            .subscribe((tab) => {
                this.selectedTab = tab;
            });
    }

    ngOnInit(): void {
        this.subscribeToStoreData();
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
    }): void {
        this.openedIndex = this.openedIndex === data.index ? -1 : data.index;
        if (data.status) {
            this.payrollType = `${data.payrollSummary.text}${
                data.payrollSummary.type ? ` ${data.payrollSummary.type}` : ``
            }`;

            this.selectedOpenFromList = undefined;
            this.handleTableShow(data.index);
        }
    }

    private handleTableShow(index?: number): void {
        const containersArray = this.containers.toArray();
        const mainIndx =
            typeof index !== 'undefined' ? index : this.openedIndex;

        const cointainer = containersArray[mainIndx];
        cointainer.clear();

        switch (this.payrollType) {
            case PayrollTables.DRIVER_MILES:
                if (this.selectedTab === PayrollTablesStatus.OPEN) {
                    this.componentRef = cointainer.createComponent(
                        DriverMileageSoloTableComponent,
                        {
                            environmentInjector: this.environmentInjector,
                        }
                    );

                    // Set inputs and subscribe to outputs if componentRef is created
                    if (this.componentRef) {
                        this.componentRef.instance.expandTableEvent.subscribe(
                            (event: { id: string }) => {
                                this.expandTable(
                                    this.payrollType,
                                    event,
                                    this.componentRef.instance.expandTable
                                );
                            }
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
                            (event: { id: string }) => {
                                if (
                                    this.reportTableDataId != event?.id ||
                                    !this.componentRef.instance.expandTable
                                ) {
                                    this.reportTableDataId = event.id;
                                    if (
                                        this.payrollReportType !=
                                        this.payrollType
                                    ) {
                                        this.payrollReportType =
                                            this.payrollType;
                                    }

                                    if (
                                        this.selectedTabForReport !=
                                        this.selectedTab
                                    ) {
                                        this.selectedTabForReport =
                                            this.selectedTab;
                                    }
                                    this.payrollFacadeService.setPayrollReportTableExpanded(
                                        true
                                    );
                                }
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
                        (event: {
                            driver: { fullName: string; id: number };
                            payrollCount: number;
                        }) => {
                            this.selectedOpenFromList = {
                                fullName: event.driver.fullName,
                                payrollCount: event.payrollCount,
                                id: event.driver.id,
                                title: PayrollTables.DRIVER_MILES_TITLE,
                            };

                            this.handleTableShow();
                        }
                    );
                }
                break;
            case PayrollTables.DRIVER_FLAT_RATE:
                if (this.selectedTab === PayrollTablesStatus.OPEN) {
                    this.componentRef = cointainer.createComponent(
                        DriverFlatRateTableComponent,
                        {
                            environmentInjector: this.environmentInjector,
                        }
                    );

                    // Set inputs and subscribe to outputs if componentRef is created
                    if (this.componentRef) {
                        this.componentRef.instance.expandTableEvent.subscribe(
                            (event: { id: string }) =>
                                this.expandTable(
                                    this.payrollType,
                                    event,
                                    this.componentRef.instance.expandTable
                                )
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
                            (event: { id: string }) => {
                                if (
                                    this.reportTableDataId != event?.id ||
                                    !this.componentRef.instance.expandTable
                                ) {
                                    this.reportTableDataId = event.id;
                                    if (
                                        this.payrollReportType !=
                                        this.payrollType
                                    ) {
                                        this.payrollReportType =
                                            this.payrollType;
                                    }

                                    if (
                                        this.selectedTabForReport !=
                                        this.selectedTab
                                    ) {
                                        this.selectedTabForReport =
                                            this.selectedTab;
                                    }
                                    this.payrollFacadeService.setPayrollReportTableExpanded(
                                        true
                                    );
                                }
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
                        (event: {
                            driver: { fullName: string; id: number };
                            payrollCount: number;
                        }) => {
                            this.selectedOpenFromList = {
                                fullName: event.driver.fullName,
                                payrollCount: event.payrollCount,
                                id: event.driver.id,
                                title: PayrollTables.DRIVER_FLAT_RATE_TITLE,
                            };

                            this.handleTableShow();
                        }
                    );
                }
                break;
            case PayrollTables.DRIVER_COMMISSION:
                if (this.selectedTab === PayrollTablesStatus.OPEN) {
                    this.componentRef = cointainer.createComponent(
                        DriverCommissionSoloTableComponent,
                        {
                            environmentInjector: this.environmentInjector,
                        }
                    );

                    // Set inputs and subscribe to outputs if componentRef is created
                    if (this.componentRef) {
                        this.componentRef.instance.expandTableEvent.subscribe(
                            (event: { id: string }) =>
                                this.expandTable(
                                    this.payrollType,
                                    event,
                                    this.componentRef.instance.expandTable
                                )
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
                            (event: { id: string }) => {
                                if (
                                    this.reportTableDataId != event?.id ||
                                    !this.componentRef.instance.expandTable
                                ) {
                                    this.reportTableDataId = event.id;
                                    if (
                                        this.payrollReportType !=
                                        this.payrollType
                                    ) {
                                        this.payrollReportType =
                                            this.payrollType;
                                    }

                                    if (
                                        this.selectedTabForReport !=
                                        this.selectedTab
                                    ) {
                                        this.selectedTabForReport =
                                            this.selectedTab;
                                    }
                                    this.payrollFacadeService.setPayrollReportTableExpanded(
                                        true
                                    );
                                }
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
                        (event: {
                            driver: { fullName: string; id: number };
                            payrollCount: number;
                        }) => {
                            this.selectedOpenFromList = {
                                fullName: event.driver.fullName,
                                payrollCount: event.payrollCount,
                                id: event.driver.id,
                                title: PayrollTables.DRIVER_COMMISSION_TITLE,
                            };

                            this.handleTableShow();
                        }
                    );
                }
                break;
            case PayrollTables.DRIVER_OWNER:
                if (this.selectedTab === PayrollTablesStatus.OPEN) {
                    this.componentRef = cointainer.createComponent(
                        DriverOwnerTableComponent,
                        {
                            environmentInjector: this.environmentInjector,
                        }
                    );

                    // Set inputs and subscribe to outputs if componentRef is created
                    if (this.componentRef) {
                        this.componentRef.instance.expandTableEvent.subscribe(
                            (event: { id: string }) =>
                                this.expandTable(
                                    this.payrollType,
                                    event,
                                    this.componentRef.instance.expandTable
                                )
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
                            (event: { id: string }) => {
                                if (
                                    this.reportTableDataId != event?.id ||
                                    !this.componentRef.instance.expandTable
                                ) {
                                    this.reportTableDataId = event.id;

                                    if (
                                        this.payrollReportType !=
                                        this.payrollType
                                    ) {
                                        this.payrollReportType =
                                            this.payrollType;
                                    }

                                    if (
                                        this.selectedTabForReport !=
                                        this.selectedTab
                                    ) {
                                        this.selectedTabForReport =
                                            this.selectedTab;
                                    }
                                    this.payrollFacadeService.setPayrollReportTableExpanded(
                                        true
                                    );
                                }
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
                        (event: {
                            truck: { truckNumber: string; id: number };
                            owner: string;
                            payrollCount: number;
                        }) => {
                            this.selectedOpenFromList = {
                                fullName: `${event.truck.truckNumber} - ${event.owner}`,
                                payrollCount: event.payrollCount,
                                id: event.truck.id,
                                title: PayrollTables.DRIVER_OWNER_TITLE,
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

    private expandTable<T extends { id: string }>(
        payrollType?: string,
        data?: T,
        expandedTable?: boolean
    ): void {
        if (data && (this.reportTableDataId != data?.id || !expandedTable)) {
            this.reportTableDataId = data.id;
            this.payrollFacadeService.setPayrollReportTableExpanded(true);

            if (payrollType) {
                if (this.payrollReportType != payrollType) {
                    this.selectedTabForReport = this.selectedTab;
                    this.payrollReportType = payrollType;
                }
            }
        }
    }

    private observTableContainer() {
        this.resizeObserver = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                this.tableContainerWidth = entry.contentRect.width;
            });
        });

        this.resizeObserver.observe(document.querySelector('.table-container'));
    }

    public onToolBarAction(tabStatus: PayrollTablesStatus): void {
        this.payrollFacadeService.setPayrollOpenedTab(tabStatus);
        this.openedIndex = -1;
        this.expandTable();
        this.payrollFacadeService.getPayrollCounts();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    trackByIndex(index: number, item: any): number {
        return index;
      }

    public closeOpenPreview(e: Event): void {
        e.preventDefault();
        e.stopPropagation();

        this.selectedOpenFromList = undefined;
        this.handleTableShow();
    }
}
