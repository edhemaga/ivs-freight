import {
    ChangeDetectionStrategy,
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
import { AfterViewInit } from '@angular/core';

// Models
import { PayrollDriverMileageListResponse } from 'appcoretruckassist';

// Services
import { TemplateManagerService } from '@shared/services/template-manager.service';
import { PayrollFacadeService } from '@pages/accounting/pages/payroll/state/services';

// Components
import { ColumnConfig } from 'ca-components';

@Component({
    selector: 'app-driver-mileage-solo-table',
    templateUrl: './driver-mileage-solo-table.component.html',
    styleUrls: [
        '../../../../../payroll/payroll.component.scss',
        './driver-mileage-solo-table.component.scss',
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverMileageSoloTableComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    // Expose Javascript Math to template
    public Math = Math;

    @Output() expandTableEvent: EventEmitter<PayrollDriverMileageListResponse> =
        new EventEmitter<PayrollDriverMileageListResponse>();

    @Input() title: string;
    @Input() expandTable: boolean;

    public columns: ColumnConfig[];
    public tableData$: Observable<PayrollDriverMileageListResponse[]>;
    private destroy$ = new Subject<void>();

    @ViewChild('customCell', { static: false })
    public readonly customCellTemplate!: ElementRef;

    @ViewChild('customText', { static: false })
    public readonly customTextTemplate!: ElementRef;
    @ViewChild('customStatus', { static: false })
    public readonly customStatusTemplate!: ElementRef;

    @ViewChild('customMileageHeader', { static: false })
    public readonly customMileageHeaderTemplate!: ElementRef;

    public testTemplate: ElementRef;
    public loading$: Observable<boolean>;

    constructor(
        // Services
        private payrollFacadeService: PayrollFacadeService,
        private templateManager: TemplateManagerService
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
                cellType: 'template',
                template: this.customTextTemplate, // Pass the template reference
                hiddeOnTableReduce: true,
            },
            {
                header: 'Period ST',
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
        this.registerAllTemplates();
        this.subscribeToStoreData();
    }

    public registerAllTemplates(): void {
        this.testTemplate = this.templateManager.getTemplate('templateOne');
    }

    public handleClick(): void {}

    public subscribeToStoreData(): void {
        this.payrollFacadeService.getPayrollDriverMileageSoloList();
        this.tableData$ =
            this.payrollFacadeService.selectPayrollDriverSoloMileage$;

        this.loading$ = this.payrollFacadeService.payrollLoading$;
    }

    public selectPayrollReport(report: PayrollDriverMileageListResponse): void {
        this.expandTableEvent.emit(report);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
