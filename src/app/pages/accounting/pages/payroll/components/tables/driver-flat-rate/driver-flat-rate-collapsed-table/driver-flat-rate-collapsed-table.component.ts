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
import { PayrollDriverMileageCollapsedListResponse } from '@pages/accounting/pages/payroll/state/models/payroll.model';

// Services
import { PayrollFacadeService } from '@pages/accounting/pages/payroll/state/services/payroll.service';
import { PayrollDriverFlatRateFacadeService } from '@pages/accounting/pages/payroll/state/services/payroll_flat_rate.service';

// Components
import { ColumnConfig } from 'ca-components';

@Component({
    selector: 'app-driver-flat-rate-collapsed-table',
    templateUrl: './driver-flat-rate-collapsed-table.component.html',
    styleUrls: ['./driver-flat-rate-collapsed-table.component.scss'],
})
export class DriverFlatRateCollapsedTableComponent
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

    private destroy$ = new Subject<void>();

    // TEMPLATES
    @ViewChild('customDriverTemplate', { static: false })
    public readonly customDriverTemplate!: ElementRef;
    @ViewChild('customStatus', { static: false })
    public readonly customStatusTemplate!: ElementRef;
    @ViewChild('customMileageHeader', { static: false })
    public readonly customMileageHeaderTemplate!: ElementRef;

    constructor(
        private payrollDriverFlatRateFacadeService: PayrollDriverFlatRateFacadeService,
        private payrollFacadeService: PayrollFacadeService
    ) {}

    ngOnInit(): void {
        this.subscribeToStoreData();
    }

    private subscribeToStoreData(): void {
        this.payrollDriverFlatRateFacadeService.getPayrollDriverFlatRateCollapsedList();
        this.loading$ = this.payrollFacadeService.payrollLoading$;
        this.tableData$ =
            this.payrollDriverFlatRateFacadeService.selectPayrollDriverFlatRateCollapsed$;
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
                cellCustomClasses: 'text-center',
                hiddeOnTableReduce: true,
            },
            {
                header: 'Miles',
                field: 'mileage',
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
