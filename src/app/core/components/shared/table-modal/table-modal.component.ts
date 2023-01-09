import {
    Component,
    Input,
    OnInit,
    OnChanges,
    SimpleChanges,
} from '@angular/core';

@Component({
    selector: 'app-table-modal',
    templateUrl: './table-modal.component.html',
    styleUrls: ['./table-modal.component.scss'],
})
export class TableModalComponent implements OnInit, OnChanges {
    @Input() columns: any[];
    @Input() viewData: any[];

    tableHeadFixedColumns: any[] = [];
    tableHeadScrollableColumns: any[] = [];
    tableHeadActionColumns: any[] = [];

    constructor() {}

    ngOnInit(): void {
        console.log('ngOnInit');
        console.log(this.columns);

        this.setHeadColumns();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.columns && !changes?.columns?.firstChange) {
            this.columns = changes.columns.currentValue;

            this.setHeadColumns();
        }
    }

    setHeadColumns() {
        this.columns.map((column) => {
            if (column.isPined) {
                this.tableHeadFixedColumns.push(column);
            }

            if (!column.isPined && !column.isAction) {
                this.tableHeadScrollableColumns.push(column);
            }

            if(column.isAction){
              this.tableHeadActionColumns.push(column);
            }
        });

        console.log('Table Head Fixed Columns');
        console.log(this.tableHeadFixedColumns);

        console.log('Table Head Scrollable Columns');
        console.log(this.tableHeadScrollableColumns);

        console.log('Table Head Action Columns');
        console.log(this.tableHeadActionColumns);
    }
}
