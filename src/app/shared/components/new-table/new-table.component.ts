import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
    TemplateRef,
} from '@angular/core';

// modules
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';

// components
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

// svg routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

// pipes
import {
    TableColumnActionClassPipe,
    TableColumnCellClassPipe,
    TableColumnClassPipe,
    TableColumnLabelWidthPipe,
    TableGroupClassPipe,
    TableGroupLabelIndexPipe,
} from '@shared/components/new-table/pipes';

// enums
import { ePosition, eUnit } from 'ca-components';
import { eColor, eGeneralActions } from '@shared/enums';
import { SortOrder } from 'appcoretruckassist';

// directives
import { ResizableColumnDirective } from '@shared/components/new-table/directives';

// interfaces
import {
    ITableColumn,
    ITableResizeAction,
} from '@shared/components/new-table/interface';

@Component({
    selector: 'app-new-table',
    templateUrl: './new-table.component.html',
    styleUrl: './new-table.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        AngularSvgIconModule,
        NgbTooltipModule,

        // components
        TaAppTooltipV2Component,

        // pipes
        TableColumnClassPipe,
        TableGroupClassPipe,
        TableGroupLabelIndexPipe,
        TableColumnLabelWidthPipe,
        TableColumnActionClassPipe,
        TableColumnCellClassPipe,

        // directives
        ResizableColumnDirective,
    ],
})
export class NewTableComponent<T> {
    @Input() set columns(value: ITableColumn[]) {
        this.processColumns(value);
    }

    @Input() rows: T[] = [];
    @Input() isTableLocked: boolean;
    @Input() totalDataCount: number;
    @Input() headerTemplates: { [key: string]: TemplateRef<T> } = {};
    @Input() templates: { [key: string]: TemplateRef<T> } = {};
    @Input() expandedRows: Set<number> = new Set([]);

    @Output() onHandleShowMoreClick: EventEmitter<boolean> = new EventEmitter();
    @Output() onSortingChange: EventEmitter<ITableColumn> = new EventEmitter();
    @Output() onColumnPinned: EventEmitter<ITableColumn> = new EventEmitter();
    @Output() onColumnResize: EventEmitter<ITableResizeAction> =
        new EventEmitter();

    @Output() onRemoveColumn: EventEmitter<string> = new EventEmitter();

    // columns
    public leftPinnedColumns: ITableColumn[] = [];
    public mainColumns: ITableColumn[] = [];
    public rightPinnedColumns: ITableColumn[] = [];

    // actions
    public headingHoverId: number = null;

    // enums
    public ePosition = ePosition;
    public eColor = eColor;
    public eGeneralActions = eGeneralActions;
    public eUnit = eUnit;
    public sortOrder = SortOrder;

    // svg routes
    public sharedSvgRoutes = SharedSvgRoutes;

    constructor() {}

    private processColumns(columns: ITableColumn[]): void {
        this.leftPinnedColumns = columns.filter(
            (col) => col.pinned === ePosition.LEFT
        );

        this.rightPinnedColumns = columns.filter(
            (col) => col.pinned === ePosition.RIGHT
        );

        this.mainColumns = columns.filter((col) => !col.pinned);
    }

    public handlePinColumnClick(column: ITableColumn): void {
        this.onColumnPinned.emit(column);
    }

    public handleSortColumnClick(column: ITableColumn): void {
        const isSortDisabled =
            !this.isTableLocked || !this.rows.length || !column.hasSort;

        if (isSortDisabled) return;

        this.onSortingChange.emit(column);
    }

    public handleShowMoreClick(): void {
        this.onHandleShowMoreClick.emit(true);
    }

    public onColumnWidthResize(resizeAction: ITableResizeAction): void {
        this.onColumnResize.emit(resizeAction);
    }

    public onColumnHeadingHover(columnId: number): void {
        this.headingHoverId = columnId;
    }

    public onRemoveColumnClick(columnKey: string): void {
        this.onRemoveColumn.emit(columnKey);
    }

    public isRowExpanded(rowId: number): boolean {
        return this.expandedRows?.has(rowId);
    }
}
