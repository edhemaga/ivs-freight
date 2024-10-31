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
import { PayrollFacadeService } from '../../../state/services/payroll.service';
import { PayrollDriverFlatRateFacadeService } from '../../../state/services/payroll_flat_rate.service';

// Models
import { IDriverFlatRateList } from '../../../state/models/driver_flat_rate.model';

@Component({
    selector: 'app-driver-flat-rate-table',
    templateUrl: './driver-flat-rate-table.component.html',
    styleUrls: ['./driver-flat-rate-table.component.scss'],
})
export class DriverFlatRateTableComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    // Expose Javascript Math to template
    Math = Math;

    @Output() expandTableEvent: EventEmitter<any> = new EventEmitter<any>();

    @Input() title: string;
    @Input() expandTable: boolean;

    private destroy$ = new Subject<void>();

    columns: ColumnConfig[];
    tableData$: Observable<IDriverFlatRateList>;
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

    subscribeToStoreData() {
        this.payrollFlatRateFacadeService.getPayrollDriverFlatRateList();
        this.tableData$ =
            this.payrollFlatRateFacadeService.selectFlatListDriverList$;

        this.loading$ = this.payrollFacadeService.payrollLoading$;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
