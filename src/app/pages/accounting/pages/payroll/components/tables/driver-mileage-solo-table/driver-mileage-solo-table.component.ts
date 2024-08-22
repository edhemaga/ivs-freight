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

@Component({
    selector: 'app-driver-mileage-solo-table',
    templateUrl: './driver-mileage-solo-table.component.html',
    styleUrls: ['./driver-mileage-solo-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverMileageSoloTableComponent implements OnInit {
    @Input() title: string;
    columns: ColumnConfig[];
    tableData$: Observable<PayrollDriverMileageListResponse>;
    // @ViewChild('customCell') customCellTemplate: TemplateRef<any>;

    @ViewChild('customCell', { static: false })
    public readonly customCellTemplate!: ElementRef;

    constructor(
        // Services
        private payrollFacadeService: PayrollFacadeService
    ) {}

    ngOnInit(): void {
        setTimeout(() => {
            console.log(
                this.customCellTemplate,
                'customCellTemplatecustomCellTemplatecustomCellTemplate'
            );
            this.columns = [
                {
                    header: 'Name',
                    field: 'driverName',
                    sortable: true,
                    cellType: 'text',
                },
                {
                    header: 'Payroll',
                    field: 'payroll',
                    cellType: 'template',
                    template: this.customCellTemplate, // Pass the template reference
                },
                {
                    header: 'Period',
                    field: 'period',
                    cellType: 'text',
                },
                // {
                //   header: 'Actions',
                //   field: 'actions',
                //   cellType: 'customComponent',
                //   component: CustomCellComponent,
                //   inputs: { someInput: 'some value' },
                //   outputs: { clicked: this.handleClick.bind(this) }
                // }
            ];
        }, 1200);

        this.subscribeToStoreData();
    }

    public handleClick() {
        console.log('fdsadfsadfds');
    }

    subscribeToStoreData() {
        this.payrollFacadeService.getPayrollDriverMileageSoloList();
        this.tableData$ =
            this.payrollFacadeService.selectPayrollDriverSoloMileage$;
        // this.payrollFacadeService.selectPayrollDriverSoloMileage$.subscribe(
        //     (res) => {
        //         console.log('AAAAAAAA=----------', res);
        //     }
        // );
    }

    test() {}
}
