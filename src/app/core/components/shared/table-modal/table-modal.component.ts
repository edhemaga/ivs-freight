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

    tableFixedColumns: any[] = [];
    tableScrollableColumns: any[] = [];
    tableActionColumns: any[] = [];

    constructor() {}

    ngOnInit(): void {
        console.log('ngOnInit');
        console.log(this.viewData);

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
                this.tableFixedColumns.push(column);
            }

            if (!column.isPined && !column.isAction) {
                this.tableScrollableColumns.push(column);
            }

            if(column.isAction){
              this.tableActionColumns.push(column);
            }
        });

        console.log('Table Head Fixed Columns');
        console.log(this.tableFixedColumns);

        console.log('Table Head Scrollable Columns');
        console.log(this.tableScrollableColumns);

        console.log('Table Head Action Columns');
        console.log(this.tableActionColumns);
    }
}
