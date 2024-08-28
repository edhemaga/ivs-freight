import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    TemplateRef,
    ViewChild,
} from '@angular/core';
import { PayrollFacadeService } from '../../../state/services/payroll.service';
import { ColumnConfig } from '@shared/models/table-models/main-table.model';
import { Observable } from 'rxjs';
import { PayrollDriverMileageListResponse } from 'appcoretruckassist';
import { AfterViewInit } from '@angular/core';

@Component({
    selector: 'app-driver-mileage-solo-table',
    templateUrl: './driver-mileage-solo-table.component.html',
    styleUrls: ['./driver-mileage-solo-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverMileageSoloTableComponent implements OnInit, AfterViewInit {
    // Expose Javascript Math to template
    Math = Math;

    @Output() expandTableEvent: EventEmitter<any> = new EventEmitter<any>();

    @Input() title: string;
    @Input() expandTable: boolean;
    columns: ColumnConfig[];
    tableData$: Observable<PayrollDriverMileageListResponse[]>;

    @ViewChild('customCell', { static: false })
    public readonly customCellTemplate!: ElementRef;

    @ViewChild('customText', { static: false })
    public readonly customTextTemplate!: ElementRef;
    @ViewChild('customStatus', { static: false })
    public readonly customStatusTemplate!: ElementRef;

    @ViewChild('customMileageHeader', { static: false })
    public readonly customMileageHeaderTemplate!: ElementRef;

    constructor(
        // Services
        private payrollFacadeService: PayrollFacadeService
    ) {}

    ngAfterViewInit() {
        this.columns = [
            {
                header: 'Name',
                field: 'driverName',
                sortable: true,
                cellType: 'template',
                template: this.customCellTemplate, // Pass the template reference
            },
            {
                header: 'Payroll',
                field: 'payroll',
                cellType: 'template',
                template: this.customTextTemplate, // Pass the template reference
                hiddeOnTableReduce: true,
            },
            {
                header: 'Period',
                field: 'period',
                pipeType: 'date',
                pipeString: 'shortDate',
                cellType: 'text', // Pass the template reference
            },
            {
                header: 'Status',
                field: 'daysUntilPayment',
                cellType: 'template',
                template: this.customStatusTemplate, // Pass the template reference
            },
            {
                header: 'Empty',
                field: 'emptyMiles',
                headerCellType: 'template',
                headerTemplate: this.customMileageHeaderTemplate,
                cellType: 'template',
                template: this.customTextTemplate, // Pass the template reference
                hiddeOnTableReduce: true,
            },
            {
                header: 'Loaded',
                headerCellType: 'template',
                headerTemplate: this.customMileageHeaderTemplate,
                field: 'loadedMiles',
                cellType: 'template',
                template: this.customTextTemplate, // Pass the template reference
                hiddeOnTableReduce: true,
            },
            {
                header: 'Total',
                field: 'totalMiles',
                headerCellType: 'template',
                headerTemplate: this.customMileageHeaderTemplate,
                cellType: 'template',
                template: this.customTextTemplate, // Pass the template reference
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
                field: 'total',
                pipeType: 'currency',
                pipeString: 'USD',
                cellType: 'text',
                cellCustomClasses: 'text-right',
                textCustomClasses: 'b-600',
                // Pass the template reference
            },
        ];
    }

    ngOnInit(): void {
        this.subscribeToStoreData();
    }

    public handleClick() {
        console.log('fdsadfsadfds');
    }

    subscribeToStoreData() {
        this.payrollFacadeService.getPayrollDriverMileageSoloList();
        this.tableData$ =
            this.payrollFacadeService.selectPayrollDriverSoloMileage$;
        this.payrollFacadeService.selectPayrollDriverSoloMileage$.subscribe(
            (res) => {
                console.log('AAAAAAAA=----------', res);
            }
        );
    }

    selectPayrollReport(report: any) {
        console.log('reportt', report);
        this.expandTableEvent.emit(report);
    }
}
