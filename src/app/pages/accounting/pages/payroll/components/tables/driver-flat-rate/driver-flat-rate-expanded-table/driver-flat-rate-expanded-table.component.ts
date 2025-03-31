import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs';

// Models
import { PayrollDriverMileageExpandedListResponse } from '@pages/accounting/pages/payroll/state/models';

// Services
import {
    PayrollFacadeService,
    PayrollDriverFlatRateFacadeService,
} from '@pages/accounting/pages/payroll/state/services';

// Components
import { ColumnConfig } from 'ca-components';

@Component({
    selector: 'app-driver-flat-rate-expanded-table',
    templateUrl: './driver-flat-rate-expanded-table.component.html',
    styleUrls: [
        '../../../../../payroll/payroll.component.scss',
        './driver-flat-rate-expanded-table.component.scss',
    ],
})
export class DriverFlatRateExpandedTableComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    // Inputs
    @Input() driverId: number;
    @Input() title: string;
    @Input() expandTable: boolean;

    // Outputs
    @Output()
    expandTableEvent: EventEmitter<PayrollDriverMileageExpandedListResponse> =
        new EventEmitter<PayrollDriverMileageExpandedListResponse>();

    public loading$: Observable<boolean>;
    public tableData$: Observable<PayrollDriverMileageExpandedListResponse[]>;
    public columns: ColumnConfig[];

    // TEMPLATES
    @ViewChild('customStatus', { static: false })
    public readonly customStatusTemplate!: ElementRef;
    @ViewChild('customMileageHeader', { static: false })
    public readonly customMileageHeaderTemplate!: ElementRef;

    constructor(
        private payrollDriverFlatRateFacadeService: PayrollDriverFlatRateFacadeService,
        private payrollFacadeService: PayrollFacadeService
    ) {}

    ngAfterViewInit(): void {
        this.columns = [
            {
                header: 'Payroll',
                field: 'payrollNumber',
                cellType: 'text',
                cellCustomClasses: 'text-left',
                textCustomClasses: 'b-600',
            },
            {
                header: 'Period',
                field: 'periodStart',
                pipeType: 'date',
                pipeString: 'MM/dd/yy',
                cellType: 'text', // Pass the template reference
            },
            {
                header: 'Closed',
                field: 'periodEnd',
                pipeType: 'date',
                pipeString: 'MM/dd/yy',
                cellType: 'text', // Pass the template reference
            },
            {
                header: 'Status',
                field: 'status',
                cellType: 'template',
                template: this.customStatusTemplate, // Pass the template reference
            },
            {
                header: 'Load',
                field: 'loadCount',
                cellType: 'text', // Pass the template reference
                cellCustomClasses: 'text-center',
                hiddeOnTableReduce: true,
            },
            {
                header: 'Miles',
                field: 'miles',
                cellType: 'text', // Pass the template reference
                hiddeOnTableReduce: true,
            },
            {
                header: 'Rate',
                headerCellType: 'template',
                headerTemplate: this.customMileageHeaderTemplate,
                field: 'rate',
                cellType: 'text',
                cellCustomClasses: 'text-center',
                hiddeOnTableReduce: true,
            },
            {
                header: 'Flat Pay',
                field: 'flatPay',
                pipeType: 'currency',
                pipeString: 'USD',
                cellCustomClasses: 'text-left',
                cellType: 'text', // Pass the template reference
                hiddeOnTableReduce: true,
            },
            {
                header: 'Salary',
                field: 'salary',
                pipeType: 'currency',
                pipeString: 'USD',
                cellCustomClasses: 'text-left',
                cellType: 'text', // Pass the template reference
                hiddeOnTableReduce: true,
            },
            {
                header: 'Earnings',
                field: 'earnings',
                pipeType: 'currency',
                pipeString: 'USD',
                cellType: 'text',
                cellCustomClasses: 'text-right',
                textCustomClasses: 'b-600',
            },
            {
                header: 'Paid',
                field: 'paid',
                pipeType: 'currency',
                pipeString: 'USD',
                cellType: 'text',
                cellCustomClasses: 'text-right',
                textCustomClasses: 'b-600',
                hiddeOnTableReduce: true,
            },
            {
                header: 'Debt',
                field: 'debt',
                pipeType: 'currency',
                pipeString: 'USD',
                cellType: 'text',
                cellCustomClasses: 'text-right',
                textCustomClasses: 'b-600',
                hiddeOnTableReduce: true,
            },
        ];
    }

    ngOnInit(): void {
        this.subscribeToStoreData();
    }

    subscribeToStoreData(): void {
        this.payrollDriverFlatRateFacadeService.getPayrollFlatRateMileageExpandedList(
            this.driverId
        );

        this.loading$ = this.payrollFacadeService.payrollLoading$;
        this.tableData$ =
            this.payrollDriverFlatRateFacadeService.selectPayrollDriverFlatRateExpanded$;
    }

    selectPayrollReport(
        report: PayrollDriverMileageExpandedListResponse
    ): void {
        this.expandTableEvent.emit(report);
    }

    ngOnDestroy(): void {}
}
