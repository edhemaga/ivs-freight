import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewEncapsulation,
} from '@angular/core';

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
    @Input() set tableData(value) {
        if (this.tableSettingsResizable) {
            if (this.tableType != 'report') {
                const tableSettingsValue = [...value].reduce(
                    (tbrez, item) => {
                        this.tableSettingsResizable.map((data) => {
                            if (data.data_field) {
                                if (!tbrez[data.data_field])
                                    tbrez[data.data_field] = 0;
                                tbrez[data.data_field] += item[data.data_field]
                                    ? item[data.data_field]
                                    : 0;
                            }
                            return data;
                        });

                        return tbrez;
                    },
                    { reorderItem: true }
                );

                value.push(tableSettingsValue);
            }
        }

        this._tableData = value;
    }

    @Input() set data(value) {
        if (this.tableType == 'report' && value.stops) {
            const openPayrollIdIndex = this._tableData
                .map((item) => item.payrollId)
                .lastIndexOf(value.id);
            let resizableItem = { reorderItem: true };
            this.tableSettingsResizable.map((data) => {
                if (data.data_field) {
                    resizableItem[data.data_field] = value[data.data_field]
                        ? value[data.data_field]
                        : 0;
                }
                return data;
            });

            const newData = [
                ...this._tableData.slice(0, openPayrollIdIndex + 1),
                resizableItem,
                ...this._tableData.slice(openPayrollIdIndex + 1),
            ];
            this._tableData = newData;
        }
    }

    constructor() {}

    ngOnInit(): void {}

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

    dropList(event) {}
}
