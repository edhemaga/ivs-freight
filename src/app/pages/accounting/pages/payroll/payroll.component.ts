import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewEncapsulation,
    AfterViewInit,
    EnvironmentInjector,
    ViewChild,
    ViewContainerRef,
    inject,
    ComponentRef,
    ChangeDetectorRef,
    OnDestroy,
} from '@angular/core';
import { Observable, takeUntil, Subject } from 'rxjs';

// Pipes
import { NameInitialsPipe } from '@shared/pipes/name-initials.pipe';

// Helpers
import { getPayrollDriverMilesDefinition } from '@shared/utils/settings/table-settings/payroll-columns';

// Store
import { DriverQuery } from '@pages/driver/state/driver-state/driver.query';
import { DriverState } from '@pages/driver/state/driver-state/driver.store';
import { DriversInactiveQuery } from '@pages/driver/state/driver-inactive-state/driver-inactive.query';
import { DriversInactiveState } from '@pages/driver/state/driver-inactive-state/driver-inactive.store';
import { PayrollQuery } from '@pages/accounting/pages/payroll/state/payroll.query';
import { PayrollFacadeService } from './state/services/payroll.service';
import { IPayrollCountsSelector } from './state/models/payroll.model';
import { DriverMileageSoloTableComponent } from './components/tables/driver-mileage-solo-table/driver-mileage-solo-table.component';
import { DriverMileageCollapsedTableComponent } from './components/tables/driver-mileage-collapsed-table/driver-mileage-collapsed-table.component';

import { PayrollListSummaryOverview } from 'ca-components';
import { DriverShortResponse } from 'appcoretruckassist';
import { DriverMileageExpandedTableComponent } from './components/tables/driver-mileage-expanded-table/driver-mileage-expanded-table.component';
@Component({
    selector: 'app-payroll',
    templateUrl: './payroll.component.html',
    styleUrls: ['./payroll.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [NameInitialsPipe],
})
export class PayrollComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('container', { read: ViewContainerRef, static: false })
    container!: ViewContainerRef;

    componentRef: ComponentRef<any> | null = null;

    environmentInjector = inject(EnvironmentInjector); // Inject the EnvironmentInjector

    tableOptions: any = {};

    selectedTab = 'open';
    activeViewMode: string = 'List';
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
    payrollData: Observable<any>;

    reportTableData: any = {};
    reportTableExpanded$: Observable<boolean>;
    openedIndex: number = -1;

    private destroy$ = new Subject<void>();

    constructor(
        // Store
        private driversActiveQuery: DriverQuery,
        private driversInactiveQuery: DriversInactiveQuery,
        private payrollQuery: PayrollQuery,

        // Pipes
        private nameInitialsPipe: NameInitialsPipe,

        // Services
        private payrollFacadeService: PayrollFacadeService,
        private chRef: ChangeDetectorRef
    ) {}

    public subscribeToStoreData() {
        this.reportTableExpanded$ =
            this.payrollFacadeService.reportTableExpanded$;
        this.payrollFacadeService.getPayrollCounts(this.selectedTab === 'open');
        this.payrollCountsResponse$ =
            this.payrollFacadeService.selectPayrollCounts$;
        this.payrollFacadeService.selectPayrollCounts$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                console.log('fsdfsdfdsfsdfsd', res);
            });

        this.payrollFacadeService.selectPayrollTabCounts$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (this.tableData.length) {
                    this.tableData[0].length = res.open;
                    this.tableData[1].length = res.closed;
                }
            });
    }

    ngOnInit(): void {
        this.initTableOptions();
        this.subscribeToStoreData();

        this.payrollData = this.payrollQuery.payrolldata$;

        const driverActiveData =
            this.selectedTab === 'open' ? this.getTabData('active') : [];

        this.tableData = [
            {
                title: 'Open',
                field: 'open',
                length: 0,
                data: driverActiveData,
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
            this.handleTableShow();
        }
    }

    payrollType: string;
    selectedDriver: DriverShortResponse;

    handleTableShow() {
        this.container.clear();
        switch (this.payrollType) {
            case 'Driver Miles':
                if (this.selectedTab === 'open') {
                    this.componentRef = this.container.createComponent(
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
                } else if (this.selectedDriver) {
                    this.componentRef = this.container.createComponent(
                        DriverMileageExpandedTableComponent,
                        {
                            environmentInjector: this.environmentInjector,
                        }
                    );
                    if (this.componentRef) {
                        this.componentRef.instance.driverId =
                            this.selectedDriver.id; // Example input property

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
                    this.componentRef = this.container.createComponent(
                        DriverMileageCollapsedTableComponent,
                        {
                            environmentInjector: this.environmentInjector,
                        }
                    );

                    this.componentRef.instance.expandTableEvent.subscribe(
                        (event: any) => this.expandTable(event)
                    );
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
    }

    expandTable(data?: any) {
        if (data) {
            if (this.selectedTab === 'open') {
                this.reportTableData = data;
                this.payrollFacadeService.setPayrollReportTableExpanded(true);
            } else {
                console.log('WHAT IS DATAA HEREEE', data.driver);
                this.selectedDriver = data.driver;
                this.handleTableShow();
            }

            // this.tableExpanded = !this.tableExpanded;
            // this.tableExpanded$.next(this.tableExpanded);
        } else {
            // this.tableExpanded = true;
            // this.tableExpanded$.next(true);
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

    getTabData(dataType: string) {
        if (dataType === 'active') {
            this.driversActive = this.driversActiveQuery.getAll();

            return this.driversActive?.length ? this.driversActive : [];
        } else if (dataType === 'inactive') {
            this.driversInactive = this.driversInactiveQuery.getAll();

            return this.driversInactive?.length ? this.driversInactive : [];
        } else {
            let mockData = [];

            for (let i = 0; i < 10; i++) {
                mockData.push({});
            }

            return mockData;
        }
    }

    public summaryControll() {}

    onToolBarAction(event: any) {
        if (event.action === 'tab-selected') {
            this.selectedTab = event.tabData.field;
            this.openedIndex = -1;
            this.expandTable();
            this.payrollFacadeService.getPayrollCounts(
                event.tabData.field === 'open'
            );
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

    mapApplicantsData(data: any, index: number) {
        return {
            fullName: 'Angelo Trotter',
            payroll: 'LA59OSK',
            period: '04/04/44',
            total: '2,300.2',
            empty: '500',
            salary: '2,300.2',
            loaded: '1,500.2',
            'MI Pay': '$1,842.06',
            dob: '04/04/44',
            textShortName: this.nameInitialsPipe.transform('Angelo Trotter'),
            avatarColor: this.getAvatarColors(),
            status: '444 DAYS',
            email: 'angelo.T@gmail.com',
            applicantProgress: [
                {
                    title: 'App.',
                    status: 'Done',
                    width: 34,
                    class: 'complete-icon',
                    percentage: 34,
                },
                {
                    title: 'Mvr',
                    status: 'In Progres',
                    width: 34,
                    class: 'complete-icon',
                    percentage: 34,
                },
                {
                    title: 'Psp',
                    status: 'Wrong',
                    width: 29,
                    class: 'wrong-icon',
                    percentage: 34,
                },
                {
                    title: 'Sph',
                    status: 'No Started',
                    width: 30,
                    class: 'complete-icon',
                    percentage: 34,
                },
                {
                    title: 'Hos',
                    status: 'Done',
                    width: 32,
                    class: 'done-icon',
                    percentage: 34,
                },
                {
                    title: 'Ssn',
                    status: 'Done',
                    width: 29,
                    class: 'wrong-icon',
                    percentage: 34,
                },
            ],
            // Complete, Done, Wrong, In Progres, Not Started
            medical: {
                class:
                    index === 0
                        ? 'complete-icon'
                        : index === 1
                        ? 'done-icon'
                        : index === 2
                        ? 'wrong-icon'
                        : '',
                hideProgres: index !== 3,
                isApplicant: true,
                expirationDays: '3233',
                percentage: 34,
            },
            cdl: {
                class:
                    index === 0
                        ? 'complete-icon'
                        : index === 1
                        ? 'done-icon'
                        : index === 2
                        ? 'wrong-icon'
                        : '',
                hideProgres: index !== 3,
                isApplicant: true,
                expirationDays: '22',
                percentage: 10,
            },
            rev: {
                title:
                    index === 0
                        ? 'Reviewed'
                        : index === 1
                        ? 'Finished'
                        : index === 2
                        ? 'Incomplete'
                        : 'Ready',
                iconLink:
                    index === 0 || index === 2
                        ? 'assets/svg/truckassist-table/applicant-wrong-icon.svg'
                        : 'assets/svg/truckassist-table/applicant-done-icon.svg',
            },
            hire: true,
            favorite: false,
        };
    }
    // Get Avatar Color
    getAvatarColors() {
        let textColors: string[] = [
            '#6D82C7',
            '#4DB6A2',
            '#E57373',
            '#E3B00F',
            '#BA68C8',
            '#BEAB80',
            '#81C784',
            '#FF8A65',
            '#64B5F6',
            '#F26EC2',
            '#A1887F',
            '#919191',
        ];

        let backgroundColors: string[] = [
            '#DAE0F1',
            '#D2EDE8',
            '#F9DCDC',
            '#F8EBC2',
            '#EED9F1',
            '#EFEADF',
            '#DFF1E0',
            '#FFE2D8',
            '#D8ECFD',
            '#FCDAF0',
            '#E7E1DF',
            '#E3E3E3',
        ];

        this.mapingIndex = this.mapingIndex <= 11 ? this.mapingIndex : 0;

        return {
            background: backgroundColors[this.mapingIndex],
            color: textColors[this.mapingIndex],
        };
    }

    openPayrollReport() {}

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
