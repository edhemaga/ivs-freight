import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';

// modules
import { NgbModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';

// directives
import { ResizeColumnDirective } from '@shared/components/ta-table/ta-table-head/directives/resize-column.directive';

// pipes
import { TableDoubleHeadPipe } from '@shared/components/ta-table/ta-table-head/pipes/table-double-head.pipe';
import { TableDoubleHeadTextPipe } from '@shared/components/ta-table/ta-table-head/pipes/table-double-head-text.pipe';
import { TableDoubleHeadHeightPipe } from '@shared/components/ta-table/ta-table-head/pipes/table-double-head-height.pipe';
import { TableHeadConditionsPipe } from '@shared/components/ta-table/ta-table-head/pipes/table-head-conditions.pipe';
import { TableHeadAdditionalTextPipe } from '@shared/components/ta-table/ta-table-head/pipes/table-head-additional-text.pipe';

// components
import { TableHeadRowsPopoverComponent } from '@shared/components/ta-table/ta-table-head/components/table-head-rows-popover/table-head-rows-popover.component';

// models
import { TableHeadRowsData } from '@shared/components/ta-table/ta-table-head/models/table-head-rows-data.model';
import { TableHeadRowsActionEmit } from '@shared/components/ta-table/ta-table-head/models/table-head-rows-action-emit.model';

@Component({
    selector: 'app-table-head-rows',
    templateUrl: './table-head-rows.component.html',
    styleUrls: ['./table-head-rows.component.scss'],
    standalone: true,
    // https://ivanjeboss.atlassian.net/browse/CAR-2736
    encapsulation: ViewEncapsulation.ShadowDom,
    imports: [
        // modules
        CommonModule,
        NgbModule,
        NgbPopoverModule,
        DragDropModule,
        AngularSvgIconModule,

        // directives
        ResizeColumnDirective,

        // pipes
        TableDoubleHeadPipe,
        TableDoubleHeadTextPipe,
        TableDoubleHeadHeightPipe,
        TableHeadConditionsPipe,
        TableHeadAdditionalTextPipe,

        // components
        TableHeadRowsPopoverComponent,
    ],
})
export class TableHeadRowsComponent {
    @Input() tableHeadRowsData: TableHeadRowsData;

    @Output()
    tableHeadRowsActionEmitter: EventEmitter<TableHeadRowsActionEmit> =
        new EventEmitter();

    constructor() {}

    public trackByIdentity(_: number, item: any): string {
        return item.name || item.title;
    }

    public handleTableHeadRowsActionClick(event: any, action: string): void {
        const eventEmit: TableHeadRowsActionEmit = {
            event,
            action,
        };

        this.tableHeadRowsActionEmitter.emit(eventEmit);
    }
}
