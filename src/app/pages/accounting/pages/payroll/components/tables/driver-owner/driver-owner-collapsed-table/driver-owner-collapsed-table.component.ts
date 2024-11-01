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
import { PayrollDriverMileageCollapsedListResponse } from '@pages/accounting/pages/payroll/state/models/payroll.model';
import { PayrollFacadeService } from '@pages/accounting/pages/payroll/state/services/payroll.service';
import { PayrollDriverOwnerFacadeService } from '@pages/accounting/pages/payroll/state/services/payroll_owner.service';
import { ColumnConfig } from 'ca-components';
import { Observable, Subject } from 'rxjs';

@Component({
    selector: 'app-driver-owner-collapsed-table',
    templateUrl: './driver-owner-collapsed-table.component.html',
    styleUrls: ['./driver-owner-collapsed-table.component.scss'],
})
export class DriverOwnerCollapsedTableComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    // Expose Javascript Math to template
    Math = Math;

    @Output() expandTableEvent: EventEmitter<any> = new EventEmitter<any>();
    @Input() title: string;
    @Input() expandTable: boolean;

    public loading$: Observable<boolean>;
    tableData$: Observable<PayrollDriverMileageCollapsedListResponse[]>;
    columns: ColumnConfig[];

    private destroy$ = new Subject<void>();

    // Templates
    @ViewChild('customCell', { static: false })
    public readonly customCellTemplate!: ElementRef;
    @ViewChild('customStatus', { static: false })
    public readonly customStatusTemplate!: ElementRef;

    constructor(
        private payrollDriverOwnerFacadeService: PayrollDriverOwnerFacadeService,
        private payrollFacadeService: PayrollFacadeService
    ) {}

    ngOnInit(): void {
        this.subscribeToStoreData();
    }

    subscribeToStoreData() {
        this.payrollDriverOwnerFacadeService.getPayrollDriverOwnerCollapsedList();
        this.loading$ = this.payrollFacadeService.payrollLoading$;
        this.tableData$ =
            this.payrollDriverOwnerFacadeService.selectPayrollDriverOwnerCollapsed$;
    }

    ngAfterViewInit() {
        this.columns = [
            {
                row: true,
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
                header: 'First',
                field: 'firstPeriod',
                pipeType: 'date',
                pipeString: 'MM/dd/yy',
                cellType: 'text', // Pass the template reference
            },
            {
                header: 'Last',
                field: 'lastPeriod',
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
                field: 'load',
                cellCustomClasses: 'text-center',
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
                header: 'Rate',
                field: 'rate',
                cellCustomClasses: 'text-left',
                cellType: 'text', // Pass the template reference
                hiddeOnTableReduce: true,
            },
            {
                header: 'Salary',
                field: 'salary',
                pipeType: 'currency',
                pipeString: 'USD',
                cellType: 'text',
                cellCustomClasses: 'text-right'
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
        ]
    }

    selectPayrollReport(report: any) {
        this.expandTableEvent.emit(report);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
