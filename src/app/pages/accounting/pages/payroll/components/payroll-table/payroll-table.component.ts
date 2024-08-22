import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewEncapsulation,
} from '@angular/core';
import { PayrollFacadeService } from '../../state/services/payroll.service';
import { ColumnConfig } from '@shared/models/table-models/main-table.model';

@Component({
    selector: 'app-payroll-table',
    templateUrl: './payroll-table.component.html',
    styleUrls: ['./payroll-table.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class PayrollTableComponent implements OnInit {
    @Output() expandTable = new EventEmitter();
    @Input() tableSettings: any[];
    @Input() tableSettingsResizable: any[];

    @Input() title: string;
    @Input() isResizableTable: boolean = false;
    @Input() tableAddClas: string = '';

    @Input() expandedTable: boolean;

    @Input() tableType: 'none' | 'report' = 'none';

    _tableData: any[] = [];

    constructor(
        // Services
        private payrollFacadeService: PayrollFacadeService
    ) {}

    columns: ColumnConfig[];

    ngOnInit(): void {
        this.columns = [
            { header: 'Name', field: 'name', sortable: true, cellType: 'text' },
            { header: 'Payroll', field: 'profile', cellType: 'textWithImage' },
            {
                header: 'Custom',
                field: 'customField',
                cellType: 'component',
                inputs: (rowData) => ({
                    textInput: rowData.name, // String input
                    booleanInput: rowData.isEnabled, // Boolean input
                    modelInput: rowData.profile, // Object input (could be complex)
                }),
                outputs: { clicked: this.handleClick.bind(this) },
            },
        ];
    }

    handleClick() {
        console.log('this is click here');
    }

    openReport(data) {
        //const id = this.getReportBasedOnTitle(this.title, data);
        this.expandTable.emit({ title: this.title, id: data.id });
    }

    getReportBasedOnTitle(title: string, data) {
        switch (title) {
            case 'Owner':
                return data.id;
        }
    }

    dropList() {}
}
