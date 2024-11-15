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
import { Observable, Subject } from 'rxjs';

// Models
import { ColumnConfig } from 'ca-components';
import { PayrollDriverMileageCollapsedListResponse } from '@pages/accounting/pages/payroll/state/models/payroll.model';

// Services
import { PayrollFacadeService } from '@pages/accounting/pages/payroll/state/services/payroll.service';
import { PayrollDriverCommissionFacadeService } from '@pages/accounting/pages/payroll/state/services/payroll_driver_commision.service';
@Component({
    selector: 'app-driver-commission-collapsed-table',
    templateUrl: './driver-commission-collapsed-table.component.html',
    styleUrls: [
        '../../../../../payroll/payroll.component.scss',
        './driver-commission-collapsed-table.component.scss',
    ],
})
export class DriverCommissionCollapsedTableComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    // Expose Javascript Math to template
    public Math = Math;

    @Output()
    expandTableEvent: EventEmitter<PayrollDriverMileageCollapsedListResponse> =
        new EventEmitter<PayrollDriverMileageCollapsedListResponse>();
    @Input() title: string;
    @Input() expandTable: boolean;

    public loading$: Observable<boolean>;
    public tableData$: Observable<PayrollDriverMileageCollapsedListResponse[]>;
    public columns: ColumnConfig[];

    // TEMPLATES
    @ViewChild('customDriverTemplate', { static: false })
    public readonly customDriverTemplate!: ElementRef;
    @ViewChild('customStatus', { static: false })
    public readonly customStatusTemplate!: ElementRef;
    @ViewChild('customMileageHeader', { static: false })
    public readonly customMileageHeaderTemplate!: ElementRef;

    private destroy$ = new Subject<void>();

    constructor(
        private payrollDriverCommissionFacadeService: PayrollDriverCommissionFacadeService,
        private payrollFacadeService: PayrollFacadeService
    ) {}

    ngOnInit(): void {
        this.subscribeToStoreData();
    }

    private subscribeToStoreData(): void {
        this.payrollDriverCommissionFacadeService.getPayrollDriverCommissionCollapsedList();
        this.loading$ = this.payrollFacadeService.payrollLoading$;
        this.tableData$ =
            this.payrollDriverCommissionFacadeService.selectPayrollDriverCommissionCollapsed$;
    }

    ngAfterViewInit(): void {
        this.columns = [
            {
                row: true,
                header: 'Name',
                field: 'driver',
                sortable: false,
                cellType: 'template',
                template: this.customDriverTemplate, // Pass the template reference
            },
            {
                header: 'First',
                field: 'firstPayroll',
                pipeType: 'date',
                pipeString: 'MM/dd/yy',
                cellType: 'text', // Pass the template reference
            },
            {
                header: 'Last',
                field: 'lastPayroll',
                pipeType: 'date',
                pipeString: 'MM/dd/yy',
                cellType: 'text', // Pass the template reference
            },
            {
                header: 'Status',
                field: 'statusUnpaidCount',
                cellType: 'template',
                template: this.customStatusTemplate, // Pass the template reference
            },
            {
                header: 'Load',
                field: 'loadsCount',
                cellType: 'text', // Pass the template reference
                hiddeOnTableReduce: true,
            },
            {
                header: 'Miles',
                field: 'mileage',
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

    public selectPayrollReport(
        report: PayrollDriverMileageCollapsedListResponse
    ): void {
        this.expandTableEvent.emit(report);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
