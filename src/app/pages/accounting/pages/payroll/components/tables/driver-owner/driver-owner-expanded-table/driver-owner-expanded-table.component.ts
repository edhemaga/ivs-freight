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

// Models
import { PayrollDriverMileageExpandedListResponse } from '@pages/accounting/pages/payroll/state/models/payroll.model';
import { ColumnConfig } from 'ca-components';

// Services
import { PayrollFacadeService } from '@pages/accounting/pages/payroll/state/services/payroll.service';
import { PayrollDriverOwnerFacadeService } from '@pages/accounting/pages/payroll/state/services/payroll_owner.service';

@Component({
    selector: 'app-driver-owner-expanded-table',
    templateUrl: './driver-owner-expanded-table.component.html',
    styleUrls: [
        '../../../../../payroll/payroll.component.scss',
        './driver-owner-expanded-table.component.scss',
    ],
})
export class DriverOwnerExpandedTableComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    @Input() driverId: number;
    @Output()
    expandTableEvent: EventEmitter<PayrollDriverMileageExpandedListResponse> =
        new EventEmitter<PayrollDriverMileageExpandedListResponse>();
    @Input() title: string;
    @Input() expandTable: boolean;

    public loading$: Observable<boolean>;
    public tableData$: Observable<PayrollDriverMileageExpandedListResponse[]>;
    public columns: ColumnConfig[];

    // TEMPLATES
    @ViewChild('customStatus', { static: false })
    public readonly customStatusTemplate!: ElementRef;
    @ViewChild('customMileageHeader', { static: false })
    public readonly customMileageHeaderTemplate!: ElementRef;

    ngOnInit(): void {
        this.subscribeToStoreData();
    }

    constructor(
        private payrollDriverOwnerFacadeService: PayrollDriverOwnerFacadeService,
        private payrollFacadeService: PayrollFacadeService
    ) {}

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
                header: 'First',
                field: 'periodStart',
                pipeType: 'date',
                pipeString: 'MM/dd/yy',
                cellType: 'text', // Pass the template reference
            },
            {
                header: 'Last',
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
                header: 'Load',
                field: 'load',
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

    private subscribeToStoreData(): void {
        this.payrollDriverOwnerFacadeService.getPayrollOwnerMileageExpandedList(
            this.driverId
        );

        this.loading$ = this.payrollFacadeService.payrollLoading$;
        this.tableData$ =
            this.payrollDriverOwnerFacadeService.selectPayrollDriverOwnerExpanded$;
    }

    public selectPayrollReport(
        report: PayrollDriverMileageExpandedListResponse
    ) {
        this.expandTableEvent.emit(report);
    }

    ngOnDestroy(): void {}
}
