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
import { PayrollDriverMileageExpandedListResponse } from '@pages/accounting/pages/payroll/state/models/payroll.model';
import { PayrollFacadeService } from '@pages/accounting/pages/payroll/state/services/payroll.service';
import { PayrollDriverFlatRateFacadeService } from '@pages/accounting/pages/payroll/state/services/payroll_flat_rate.service';
import { ColumnConfig } from 'ca-components';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-driver-flat-rate-expanded-table',
    templateUrl: './driver-flat-rate-expanded-table.component.html',
    styleUrls: ['./driver-flat-rate-expanded-table.component.scss'],
})
export class DriverFlatRateExpandedTableComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    @Input() driverId: number;
    @Output() expandTableEvent: EventEmitter<any> = new EventEmitter<any>();
    @Input() title: string;
    @Input() expandTable: boolean;

    public loading$: Observable<boolean>;
    tableData$: Observable<PayrollDriverMileageExpandedListResponse[]>;
    columns: ColumnConfig[];

    // TEMPLATES
    @ViewChild('customStatus', { static: false })
    public readonly customStatusTemplate!: ElementRef;
    @ViewChild('customMileageHeader', { static: false })
    public readonly customMileageHeaderTemplate!: ElementRef;

    constructor(
        private payrollDriverFlatRateFacadeService: PayrollDriverFlatRateFacadeService,
        private payrollFacadeService: PayrollFacadeService
    ) {}

    ngAfterViewInit() {
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
            },
            {
                header: 'Debt',
                field: 'debt',
                pipeType: 'currency',
                pipeString: 'USD',
                cellType: 'text',
                cellCustomClasses: 'text-right',
                textCustomClasses: 'b-600',
            },
        ];
    }

    ngOnInit(): void {
        this.subscribeToStoreData();
    }

    subscribeToStoreData() {
        this.payrollDriverFlatRateFacadeService.getPayrollFlatRateMileageExpandedList(
            this.driverId
        );

        this.loading$ = this.payrollFacadeService.payrollLoading$;
        this.tableData$ =
            this.payrollDriverFlatRateFacadeService.selectPayrollDriverFlatRateExpanded$;

        this.payrollDriverFlatRateFacadeService.selectPayrollDriverFlatRateExpanded$.subscribe(
            (res) => console.log('dddd', res)
        );
    }

    selectPayrollReport(report: any) {
        this.expandTableEvent.emit(report);
    }

    ngOnDestroy(): void {}
}
