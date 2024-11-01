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
import { PayrollDriverCommissionFacadeService } from '@pages/accounting/pages/payroll/state/services/payroll_driver_commision.service';
import { ColumnConfig } from 'ca-components';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-driver-commission-expanded-table',
    templateUrl: './driver-commission-expanded-table.component.html',
    styleUrls: ['./driver-commission-expanded-table.component.scss'],
})
export class DriverCommissionExpandedTableComponent
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
        private payrollDriverCommissionFacadeService: PayrollDriverCommissionFacadeService,
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
                header: 'Revenue',
                field: 'revenue',
                pipeType: 'currency',
                pipeString: 'USD',
                cellCustomClasses: 'text-left',
                cellType: 'text', // Pass the template reference
                hiddeOnTableReduce: true,
            },
            {
                header: 'Commission',
                field: 'commission',
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

    subscribeToStoreData() {
        this.payrollDriverCommissionFacadeService.getPayrollCommissionMileageExpandedList(
            this.driverId
        );

        this.loading$ = this.payrollFacadeService.payrollLoading$;
        this.tableData$ =
            this.payrollDriverCommissionFacadeService.selectPayrollDriverCommissionExpanded$;

        this.payrollDriverCommissionFacadeService.selectPayrollDriverCommissionExpanded$.subscribe(
            (res) => console.log('dddd', res)
        );
    }

    selectPayrollReport(report: any) {
        this.expandTableEvent.emit(report);
    }
    ngOnDestroy(): void {}
}
