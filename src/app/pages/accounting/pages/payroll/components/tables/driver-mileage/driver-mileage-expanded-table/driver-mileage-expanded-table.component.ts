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

// Services
import { PayrollFacadeService } from '@pages/accounting/pages/payroll/state/services';

// Models
import { PayrollDriverMileageExpandedListResponse } from '@pages/accounting/pages/payroll/state/models';
import { ColumnConfig } from 'ca-components';

@Component({
    selector: 'app-driver-mileage-expanded-table',
    templateUrl: './driver-mileage-expanded-table.component.html',
    styleUrls: [
        '../../../../../payroll/payroll.component.scss',
        './driver-mileage-expanded-table.component.scss',
    ],
})
export class DriverMileageExpandedTableComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    @Input() driverId: number;
    @Output()
    expandTableEvent: EventEmitter<PayrollDriverMileageExpandedListResponse> =
        new EventEmitter<PayrollDriverMileageExpandedListResponse>();
    @Input() title: string;
    @Input() expandTable: boolean;

    @ViewChild('customStatus', { static: false })
    public readonly customStatusTemplate!: ElementRef;
    @ViewChild('customMileageHeader', { static: false })
    public readonly customMileageHeaderTemplate!: ElementRef;

    public loading$: Observable<boolean>;
    public tableData$: Observable<PayrollDriverMileageExpandedListResponse[]>;
    public columns: ColumnConfig[];

    constructor(private payrollFacadeService: PayrollFacadeService) {}

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
                field: 'payrollStatus',
                cellType: 'template',
                template: this.customStatusTemplate, // Pass the template reference
            },
            {
                header: 'Empty',
                field: 'emptyMiles',
                headerCellType: 'template',
                headerTemplate: this.customMileageHeaderTemplate,
                cellType: 'text', // Pass the template reference
                hiddeOnTableReduce: true,
            },
            {
                header: 'Loaded',
                field: 'loadedMiles',
                headerCellType: 'template',
                headerTemplate: this.customMileageHeaderTemplate,
                cellType: 'text', // Pass the template reference
                hiddeOnTableReduce: true,
            },
            {
                header: 'Total',
                field: 'totalMiles',
                headerCellType: 'template',
                headerTemplate: this.customMileageHeaderTemplate,
                cellType: 'text', // Pass the template reference
                hiddeOnTableReduce: true,
            },
            {
                header: 'Mile Pay',
                field: 'milePay',
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

    private subscribeToStoreData(): void {
        this.payrollFacadeService.getPayrollDriverMileageExpandedList(
            this.driverId
        );

        this.loading$ = this.payrollFacadeService.payrollLoading$;
        this.tableData$ =
            this.payrollFacadeService.selectPayrollDriverMileageExpanded$;
    }

    ngOnDestroy(): void {}

    public selectPayrollReport(
        report: PayrollDriverMileageExpandedListResponse
    ): void {
        this.expandTableEvent.emit(report);
    }
}
