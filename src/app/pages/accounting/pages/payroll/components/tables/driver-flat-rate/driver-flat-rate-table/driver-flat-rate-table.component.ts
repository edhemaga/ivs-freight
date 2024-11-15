import {
    AfterViewInit,
    Component,
    Input,
    OnDestroy,
    OnInit,
    EventEmitter,
    Output,
    ViewChild,
    ElementRef,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';

// Config
import { ColumnConfig } from 'ca-components';

// Services
import { PayrollFacadeService } from '@pages/accounting/pages/payroll/state/services';
import { PayrollDriverFlatRateFacadeService } from '@pages/accounting/pages/payroll/state/services';

// Models
import { IDriverFlatRateList } from '@pages/accounting/pages/payroll/state/models';

@Component({
    selector: 'app-driver-flat-rate-table',
    templateUrl: './driver-flat-rate-table.component.html',
    styleUrls: [
        '../../../../../payroll/payroll.component.scss',
        './driver-flat-rate-table.component.scss',
    ],
})
export class DriverFlatRateTableComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    // Expose Javascript Math to template
    public Math = Math;

    @Output() expandTableEvent: EventEmitter<IDriverFlatRateList> =
        new EventEmitter<IDriverFlatRateList>();

    @Input() title: string;
    @Input() expandTable: boolean;

    private destroy$ = new Subject<void>();

    public columns: ColumnConfig[];
    public tableData$: Observable<IDriverFlatRateList>;
    public loading$: Observable<boolean>;

    // Templates
    @ViewChild('customCell', { static: false })
    public readonly customCellTemplate!: ElementRef;
    @ViewChild('customStatus', { static: false })
    public readonly customStatusTemplate!: ElementRef;
    @ViewChild('customMileageHeader', { static: false })
    public readonly customMileageHeaderTemplate!: ElementRef;

    constructor(
        // Services
        private payrollFacadeService: PayrollFacadeService,
        private payrollFlatRateFacadeService: PayrollDriverFlatRateFacadeService
    ) {}

    ngAfterViewInit(): void {
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
                header: 'Load',
                field: 'loadCount',
                cellType: 'text',
                cellCustomClasses: 'text-center',
                hiddeOnTableReduce: true,
            },
            {
                header: 'Miles',
                field: 'miles',
                cellType: 'text',
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

    private subscribeToStoreData(): void {
        this.payrollFlatRateFacadeService.getPayrollDriverFlatRateList();
        this.tableData$ =
            this.payrollFlatRateFacadeService.selectFlatListDriverList$;

        this.loading$ = this.payrollFacadeService.payrollLoading$;
    }

    public selectPayrollReport(report: IDriverFlatRateList): void {
        this.expandTableEvent.emit(report);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
