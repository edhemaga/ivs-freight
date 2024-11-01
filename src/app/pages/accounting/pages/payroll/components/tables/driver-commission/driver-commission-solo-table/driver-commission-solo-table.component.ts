import {
    Component,
    Output,
    EventEmitter,
    Input,
    OnInit,
    AfterViewInit,
    OnDestroy,
    ViewChild,
    ElementRef,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';

// Config
import { ColumnConfig } from 'ca-components';

// Services
import { PayrollDriverCommissionFacadeService } from '@pages/accounting/pages/payroll/state/services/payroll_driver_commision.service';

// Models
import { IDriverCommissionList } from '@pages/accounting/pages/payroll/state/models/driver_commission.model';
import { PayrollFacadeService } from '@pages/accounting/pages/payroll/state/services/payroll.service';

@Component({
    selector: 'app-driver-commission-solo-table',
    templateUrl: './driver-commission-solo-table.component.html',
    styleUrls: ['./driver-commission-solo-table.component.scss'],
})
export class DriverCommissionSoloTableComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    // Expose Javascript Math to template
    Math = Math;

    @Output() expandTableEvent: EventEmitter<any> = new EventEmitter<any>();

    @Input() title: string;
    @Input() expandTable: boolean;

    private destroy$ = new Subject<void>();

    columns: ColumnConfig[];
    tableData$: Observable<IDriverCommissionList>;
    public loading$: Observable<boolean>;

    // Templates
    @ViewChild('customCell', { static: false })
    public readonly customCellTemplate!: ElementRef;
    @ViewChild('customStatus', { static: false })
    public readonly customStatusTemplate!: ElementRef;

    constructor(
        // Services
        private payrollFacadeService: PayrollFacadeService,
        private payrollCommissionFacadeService: PayrollDriverCommissionFacadeService
    ) {}

    ngAfterViewInit() {
        this.columns = [
            {
                header: 'Name',
                field: 'driver',
                sortable: true,
                cellType: 'template',
                template: this.customCellTemplate, // Pass the template reference
            },
            {
                header: 'Payroll',
                field: 'payrollNumber',
                cellType: 'text',
                hiddeOnTableReduce: true,
            },
            {
                header: 'Period',
                field: 'periodStart',
                pipeType: 'date',
                pipeString: 'MM/dd/yy',
                cellType: 'text', // Pass the template reference
            },
            {
                header: 'Status',
                field: 'payrollDeadLine',
                cellType: 'template',
                template: this.customStatusTemplate, // Pass the template reference
            },
            {
                header: 'Miles',
                field: 'mileage',
                cellType: 'text',
                hiddeOnTableReduce: true,
            },
            {
                header: 'Revenue',
                field: 'revenue',
                pipeType: 'currency',
                pipeString: 'USD',
                cellCustomClasses: 'text-center',
                cellType: 'text', // Pass the template reference
                hiddeOnTableReduce: true,
            },
            {
                header: 'Salary',
                field: 'salary',
                pipeType: 'currency',
                pipeString: 'USD',
                cellCustomClasses: 'text-center',
                cellType: 'text', // Pass the template reference
                hiddeOnTableReduce: true,
            },
            {
                header: 'Total',
                field: 'earnings',
                pipeType: 'currency',
                pipeString: 'USD',
                cellType: 'text',
                cellCustomClasses: 'text-right',
                textCustomClasses: 'b-600',
            },
        ];
    }

    ngOnInit(): void {
        // this.registerAllTemplates();
        this.subscribeToStoreData();
    }

    subscribeToStoreData() {
        this.payrollCommissionFacadeService.getPayrollDriverCommissionList();
        this.tableData$ =
            this.payrollCommissionFacadeService.selectCommissionDriverList$;

        this.loading$ = this.payrollFacadeService.payrollLoading$;
    }

    selectPayrollReport(report: any) {
        this.expandTableEvent.emit(report);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
