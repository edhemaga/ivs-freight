import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Input,
    OnInit,
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
    @Input() title: string;
    columns: ColumnConfig[];
    tableData$: Observable<PayrollDriverMileageListResponse[]>;

    @ViewChild('customCell', { static: false })
    public readonly customCellTemplate!: ElementRef;

    @ViewChild('customText', { static: false })
    public readonly customTextTemplate!: ElementRef;
    @ViewChild('customStatus', { static: false })
    public readonly customStatusTemplate!: ElementRef;

    constructor(
        // Services
        private payrollFacadeService: PayrollFacadeService
    ) { }

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
            },
            {
                header: 'Period',
                field: 'period',
                cellType: 'template',
                template: this.customTextTemplate, // Pass the template reference
            },
            {
                header: 'Status',
                field: 'status',
                cellType: 'template',
                template: this.customStatusTemplate, // Pass the template reference
            },
            {
                header: 'Empty mi',
                field: 'emptyMiles',
                cellType: 'template',
                template: this.customTextTemplate, // Pass the template reference
            },
            {
                header: 'Empty mi',
                field: 'emptyMiles',
                cellType: 'template',
                template: this.customTextTemplate, // Pass the template reference
            },
            {
                header: 'Loaded mi',
                field: 'loadedMiles',
                cellType: 'template',
                template: this.customTextTemplate, // Pass the template reference
            },
            {
                header: 'Total mi',
                field: 'totalMiles',
                cellType: 'template',
                template: this.customTextTemplate, // Pass the template reference
            },
            {
                header: 'Salary',
                field: 'salary',
                cellType: 'template',
                template: this.customTextTemplate, // Pass the template reference
            },
            {
                header: 'Total',
                field: 'total',
                cellType: 'template',
                template: this.customTextTemplate, // Pass the template reference
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

    test() { }
}
