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

    _tableData: any[] = [];
    @Input() set tableData(value) {
        if (this.tableSettingsResizable) {
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

        this._tableData = value;
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
