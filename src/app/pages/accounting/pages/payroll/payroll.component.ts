import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewEncapsulation,
    AfterViewInit,
    ViewChild,
    ElementRef,
    ChangeDetectorRef,
} from '@angular/core';
import { Observable, of } from 'rxjs';

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
import { ColumnConfig } from 'ca-components';

@Component({
    selector: 'app-payroll',
    templateUrl: './payroll.component.html',
    styleUrls: ['./payroll.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [NameInitialsPipe],
})
export class PayrollComponent implements OnInit, AfterViewInit {
    tableOptions: any = {};

    columns: ColumnConfig[];
    showTable: boolean = false;

    //tableData: any;

    

    selectedTab = 'open';
    activeViewMode: string = 'List';
    tableData: any[] = [];
    tableData$: Observable<any> = of(Array.from({ length: 1000 }, () => ({
        driver: 'Neki',
        payrollNumber: 'fsadfdsafda',
        periodStart: '20/20/24',
        payrollDeadLine: '20/20/24',
        salary: 120,
        total: 130,
    })))
    ;
    // columns: any[] = [];
    tableContainerWidth: number = 0;
    viewData: any[] = [];
    resizeObserver: ResizeObserver;

    driversActive: DriverState[] = [];
    driversInactive: DriversInactiveState[] = [];
    mapingIndex: number = 0;
    payrollData: Observable<any>;

    tableExpanded: boolean = true;
    reportTableData: any = {};

    @ViewChild('customCell', { static: false })
    public readonly customCellTemplate!: ElementRef;

    constructor(
        // Store
        private driversActiveQuery: DriverQuery,
        private driversInactiveQuery: DriversInactiveQuery,
        private payrollQuery: PayrollQuery,

        // Pipes
        private nameInitialsPipe: NameInitialsPipe,
        private chng: ChangeDetectorRef
    ) {}

    selectPayrollReport(e: any) {}
    ngAfterViewInit(): void {
        this.columns = [
            {
                header: 'Period ST',
                field: 'periodStart',
                cellType: 'text', // Pass the template reference
            },
            {
                header: 'Period ST',
                field: 'periodStart',
                cellType: 'text', // Pass the template reference
            },
            {
                header: 'Period ST',
                field: 'periodStart',
                cellType: 'text', // Pass the template reference
            },
            {
                header: 'Period ST',
                field: 'periodStart',
                cellType: 'text', // Pass the template reference
            },
            {
                header: 'Salary',
                field: 'salary',
                pipeType: 'currency',
                pipeString: 'USD',
                cellCustomClasses: 'text-center',
                cellType: 'text', // Pass the template reference
                hiddeOnTableReduce: false,
            },
            {
                header: 'Total',
                field: 'total',
                pipeType: 'currency',
                pipeString: 'USD',
                cellType: 'text',
                cellCustomClasses: 'text-right',
                textCustomClasses: 'b-600',
                // Pass the template reference
            },
            {
                header: 'Salary',
                field: 'salary',
                pipeType: 'currency',
                pipeString: 'USD',
                cellCustomClasses: 'text-center',
                cellType: 'text', // Pass the template reference
                hiddeOnTableReduce: false,
            },
            {
                header: 'Total',
                field: 'total',
                pipeType: 'currency',
                pipeString: 'USD',
                cellType: 'text',
                cellCustomClasses: 'text-right',
                textCustomClasses: 'b-600',
                // Pass the template reference
            },
            {
                header: 'Salary',
                field: 'salary',
                pipeType: 'currency',
                pipeString: 'USD',
                cellCustomClasses: 'text-center',
                cellType: 'text', // Pass the template reference
                hiddeOnTableReduce: false,
            },
            {
                header: 'Total',
                field: 'total',
                pipeType: 'currency',
                pipeString: 'USD',
                cellType: 'text',
                cellCustomClasses: 'text-right',
                textCustomClasses: 'b-600',
                // Pass the template reference
            },
            {
                header: 'Period ST',
                field: 'periodStart',
                cellType: 'text', // Pass the template reference
            },
            {
                header: 'Period ST',
                field: 'periodStart',
                cellType: 'text', // Pass the template reference
            },
            {
                header: 'Period ST',
                field: 'periodStart',
                cellType: 'text', // Pass the template reference
            },
            {
                header: 'Period ST',
                field: 'periodStart',
                cellType: 'text', // Pass the template reference
            },
            {
                header: 'Period ST',
                field: 'periodStart',
                cellType: 'text', // Pass the template reference
            },
            {
                header: 'Payroll',
                field: 'payrollNumber',
                cellType: 'template',
                template: this.customCellTemplate, // Pass the template reference
                hiddeOnTableReduce: false,
            },
            {
                header: 'Period ST',
                field: 'periodStart',
                cellType: 'text', // Pass the template reference
            },
            {
                header: 'Status',
                field: 'payrollDeadLine',
                cellType: 'template',
                template: this.customCellTemplate, // Pass the template reference
            },
        ];

        this.showTable = true;
        this.chng.detectChanges();
        // setTimeout(() => {
        //     this.observTableContainer();
        // }, 10);
    }

    expandTable(data: any) {
        this.reportTableData = data;
        this.tableExpanded = !this.tableExpanded;
    }

    observTableContainer() {
        this.resizeObserver = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                this.tableContainerWidth = entry.contentRect.width;
            });
        });

        this.resizeObserver.observe(document.querySelector('.table-container'));
    }

    ngOnInit(): void {
        // this.initTableOptions();
        // this.payrollData = this.payrollQuery.payrolldata$;
        // const driverActiveData =
        //     this.selectedTab === 'open' ? this.getTabData('active') : [];
        // this.tableData = [
        //     {
        //         title: 'Open',
        //         field: 'open',
        //         length: 0,
        //         data: driverActiveData,
        //         extended: true,
        //         gridNameTitle: 'Payroll',
        //         stateName: 'open',
        //         tableConfiguration: 'APPLICANT',
        //         isActive: this.selectedTab === 'open',
        //         gridColumns: getPayrollDriverMilesDefinition(),
        //     },
        //     {
        //         title: 'Closed',
        //         field: 'closed',
        //         length: 0,
        //         data: [],
        //         extended: false,
        //         gridNameTitle: 'Payroll',
        //         stateName: 'closed',
        //         tableConfiguration: 'DRIVER',
        //         isActive: this.selectedTab === 'closed',
        //         gridColumns: [],
        //     },
        // ];
        // const td = this.tableData.find((t) => t.field === this.selectedTab);
        // this.setDriverData(td);
    }

    setDriverData(td: any) {
        this.columns = td.gridColumns;

        if (td.data.length) {
            this.viewData = td.data;
            this.viewData = this.viewData.map((data: any, index: number) => {
                return this.selectedTab === 'open'
                    ? this.mapApplicantsData(data, index)
                    : this.mapApplicantsData(data, index);
            });
        } else {
            this.viewData = [];
        }
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
}
