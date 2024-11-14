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

// Services
import { PayrollFacadeService } from '@pages/accounting/pages/payroll/state/services/payroll.service';
import { PayrollDriverOwnerFacadeService } from '@pages/accounting/pages/payroll/state/services/payroll_owner.service';

// Configs
import { ColumnConfig } from 'ca-components';

// Models
import {
    IDriverOwnerList,
    IDriverOwnerResponse,
} from '@pages/accounting/pages/payroll/state/models/driver_owner.model';

@Component({
    selector: 'app-driver-owner-table',
    templateUrl: './driver-owner-table.component.html',
    styleUrls: ['./driver-owner-table.component.scss'],
})
export class DriverOwnerTableComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    // Expose Javascript Math to template
    public Math = Math;

    @Output() expandTableEvent: EventEmitter<IDriverOwnerResponse> =
        new EventEmitter<IDriverOwnerResponse>();

    @Input() title: string;
    @Input() expandTable: boolean;

    private destroy$ = new Subject<void>();

    public columns: ColumnConfig[];
    public tableData$: Observable<IDriverOwnerList>;
    public loading$: Observable<boolean>;

    // Templates
    @ViewChild('customCell', { static: false })
    public readonly customCellTemplate!: ElementRef;
    @ViewChild('customStatus', { static: false })
    public readonly customStatusTemplate!: ElementRef;

    constructor(
        // Services
        private payrollFacadeService: PayrollFacadeService,
        private payrollDriverOwnerFacadeService: PayrollDriverOwnerFacadeService
    ) {}

    ngAfterViewInit(): void {
        this.columns = [
            {
                header: 'Unit',
                field: 'truck',
                sortable: true,
                cellType: 'template',
                template: this.customCellTemplate, // Pass the template reference
            },
            {
                header: 'Owner',
                field: 'owner',
                cellType: 'text',
                hiddeOnTableReduce: true,
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
                field: 'load',
                cellType: 'text',
                cellCustomClasses: 'text-center',
                hiddeOnTableReduce: true,
            },
            {
                header: 'Miles',
                field: 'miles',
                cellCustomClasses: 'text-center',
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
                header: 'Rate',
                field: 'rate',
                cellType: 'text',
                cellCustomClasses: 'text-center',
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
        this.subscribeToStoreData();
    }

    public subscribeToStoreData(): void {
        this.payrollDriverOwnerFacadeService.getPayrollDriverOwnerList();
        this.loading$ = this.payrollFacadeService.payrollLoading$;
        this.tableData$ =
            this.payrollDriverOwnerFacadeService.selectOwnerDriverList$;
    }

    public selectPayrollReport(report: IDriverOwnerResponse): void {
        this.expandTableEvent.emit(report);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
