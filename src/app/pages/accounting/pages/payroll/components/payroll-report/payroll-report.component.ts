import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

// services
import { PayrollService } from '@pages/accounting/services/payroll.service';

// constants
import { PayrollCommisionDriverOpenLoads } from '@pages/accounting/pages/payroll/components/payroll-report/utils/constants/payroll-commision-driver-open-loads.constants';
import {
    PayrollOwnerOpenLoads,
    PayrollOwnerOpenLoadsResizable,
} from '@pages/accounting/pages/payroll/components/payroll-report/utils/constants/payroll-owner-open-load.constants';
import {
    PayrollMilesDriverOpenLoads,
    PayrollMilesDriverOpenLoadsResizable,
} from '@pages/accounting/pages/payroll/components/payroll-report/utils/constants/payroll-miles-driver-open-loads.constants';
import { PayrollFacadeService } from '../../state/services/payroll.service';
import { Observable } from 'rxjs';
import { PayrollDriverMileageResponse } from 'appcoretruckassist/model/payrollDriverMileageResponse';
import { ColumnConfig } from '@shared/models/table-models/main-table.model';
import { MilesStopShortResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-payroll-report',
    templateUrl: './payroll-report.component.html',
    styleUrls: ['./payroll-report.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class PayrollReportComponent implements OnInit {
    columns: ColumnConfig[];
    @Input() reportId: number;
    payrollReport$: Observable<PayrollDriverMileageResponse>;
    payrollMileageDriverLoads$: Observable<MilesStopShortResponse[]>;
    public loading$: Observable<boolean>;

    @ViewChild('customCountTemplate', { static: false })
    public readonly customCountTemplate!: ElementRef;
    @ViewChild('customLocationTypeLoad', { static: false })
    public readonly customLocationTypeLoad!: ElementRef;

    reportMainData: any = { loads: [], truck: {}, owner: {}, driver: {} };
    tableSettings: any[] = [];
    tableSettingsResizable: any[] = [];
    title: string = '';

    public payAmount: UntypedFormControl = new UntypedFormControl();

    // @Input() set reportTableData(value) {
    //     if (value.id) {
    //         this.getDataBasedOnTitle(value);
    //     }
    // }

    constructor(
        // Services
        private payrollService: PayrollService,

        // Ref
        private dch: ChangeDetectorRef,
        // Services
        private payrollFacadeService: PayrollFacadeService
    ) {}

    ngAfterViewInit() {
        this.columns = [
            {
                header: '#',
                field: '',
                sortable: true,
                cellType: 'template',
                template: this.customCountTemplate, // Pass the template reference
            },
            {
                header: 'LOCATION, TYPE',
                row: true,
                cellType: 'template',
                template: this.customLocationTypeLoad, // Pass the template reference
            },
            // {
            //     header: 'Period ST',
            //     field: 'periodStart',
            //     pipeType: 'date',
            //     pipeString: 'shortDate',
            //     cellType: 'text', // Pass the template reference
            // },
            // {
            //     header: 'Status',
            //     field: 'payrollDeadLine',
            //     cellType: 'template',
            //     template: this.customStatusTemplate, // Pass the template reference
            // },
            // {
            //     header: 'Empty',
            //     field: 'emptyMiles',
            //     headerCellType: 'template',
            //     headerTemplate: this.customMileageHeaderTemplate,
            //     cellType: 'template',
            //     template: this.customTextTemplate, // Pass the template reference
            //     hiddeOnTableReduce: true,
            // },
            // {
            //     header: 'Loaded',
            //     headerCellType: 'template',
            //     headerTemplate: this.customMileageHeaderTemplate,
            //     field: 'loadedMiles',
            //     cellType: 'template',
            //     template: this.customTextTemplate, // Pass the template reference
            //     hiddeOnTableReduce: true,
            // },
            // {
            //     header: 'Total',
            //     field: 'totalMiles',
            //     headerCellType: 'template',
            //     headerTemplate: this.customMileageHeaderTemplate,
            //     cellType: 'template',
            //     template: this.customTextTemplate, // Pass the template reference
            //     hiddeOnTableReduce: true,
            // },
            // {
            //     header: 'Salary',
            //     field: 'salary',
            //     pipeType: 'currency',
            //     pipeString: 'USD',
            //     cellCustomClasses: 'text-center',
            //     cellType: 'text', // Pass the template reference
            //     hiddeOnTableReduce: true,
            // },
            // {
            //     header: 'Total',
            //     field: 'total',
            //     pipeType: 'currency',
            //     pipeString: 'USD',
            //     cellType: 'text',
            //     cellCustomClasses: 'text-right',
            //     textCustomClasses: 'b-600',
            // },
        ];
    }

    ngOnInit(): void {
        this.subscribeToStoreData();
    }

    subscribeToStoreData() {
        this.payrollFacadeService.getPayrollDriverMileageReport(
            `${this.reportId}`
        );
        this.loading$ = this.payrollFacadeService.payrollLoading$;
        this.payrollReport$ =
            this.payrollFacadeService.selectPayrollOpenedReport$;

        this.payrollMileageDriverLoads$ =
            this.payrollFacadeService.selectPayrollReportDriverMileageLoads$;

            this.payrollFacadeService.selectPayrollReportDriverMileageLoads$.subscribe(aa => {
                console.log("LOAD INFO", aa);
            })
        this.payrollFacadeService.selectPayrollReportDriverMileageLoads$.subscribe(
            (payroll) => {
                console.log('PAYROLLL', payroll);
            }
        );
    }

    getDataBasedOnTitle(data: { id: number; title: string }) {
        this.title = data.title;
        switch (data.title) {
            case 'Owner':
                this.tableSettings = PayrollOwnerOpenLoads;
                this.tableSettingsResizable = PayrollOwnerOpenLoadsResizable;
                // They changed back in service is same error it need to be checked further to resolve error
                // this.payrollService.getPayrollOwnerOpenReport(data.id).subscribe((res) => {
                //     this.reportMainData = res;
                //     this.dch.detectChanges();
                // });
                break;
            case 'Driver (Commission)':
                this.tableSettings = PayrollCommisionDriverOpenLoads;
                this.payrollService
                    .getPayrollCommisionDriverOpenReport(data.id)
                    .subscribe((res) => {
                        this.reportMainData = res;
                        this.dch.detectChanges();
                    });
                break;
            case 'Driver (Miles)':
                this.tableSettings = PayrollMilesDriverOpenLoads;
                this.tableSettingsResizable =
                    PayrollMilesDriverOpenLoadsResizable;
                this.payrollService.getPayrollMileageDriverOpenReport();
                // Same error as above
                // .subscribe((res) => {
                //     this.reportMainData = res;
                //     this.dch.detectChanges();
                // });
                break;
        }
    }
}
