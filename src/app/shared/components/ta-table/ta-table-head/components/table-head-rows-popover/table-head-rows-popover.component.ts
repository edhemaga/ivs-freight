import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

// models
import { TableHeadRowsPopoverData } from '@shared/components/ta-table/ta-table-head/models/table-head-rows-popover-data.model';

@Component({
    selector: 'app-table-head-rows-popover',
    templateUrl: './table-head-rows-popover.component.html',
    styleUrls: ['./table-head-rows-popover.component.scss'],
    standalone: true,
    imports: [CommonModule],
})
export class TableHeadRowsPopoverComponent {
    @Input() tableHeadRowsPopoverData: TableHeadRowsPopoverData;

    @Output() tableHeadRowsPopoverActionsEmitter: EventEmitter<string> =
        new EventEmitter();

    constructor() {}

    public handlePopoverActionClick(action: string): void {
        this.tableHeadRowsPopoverActionsEmitter.emit(action);
    }
}
