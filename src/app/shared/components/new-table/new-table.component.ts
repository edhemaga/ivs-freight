import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    Output,
    TemplateRef,
} from '@angular/core';
import {
    CdkDragDrop,
    CdkDrag,
    CdkDropList,
    moveItemInArray,
} from '@angular/cdk/drag-drop';

// modules
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';

// components
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaCustomScrollbarComponent } from '@shared/components/ta-custom-scrollbar/ta-custom-scrollbar.component';
import { CaShowMoreComponent } from 'ca-components';

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
import { eColor, eCommonElement, eGeneralActions } from '@shared/enums';
import { SortOrder } from 'appcoretruckassist';
import { eCustomScroll } from '@shared/components/ta-custom-scrollbar/enums';

// directives
import { ResizableColumnDirective } from '@shared/components/new-table/directives';

// interfaces
import {
    ITableColumn,
    ITableReorderAction,
    ITableResizeAction,
} from '@shared/components/new-table/interfaces';
import { ICustomScrollEvent } from '@shared/components/ta-custom-scrollbar/interfaces';

// helpers
import { TableScrollHelper } from '@shared/components/new-table/utils/helpers';

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
        TaCustomScrollbarComponent,
        CaShowMoreComponent,

        // pipes
        TableColumnClassPipe,
        TableGroupClassPipe,
        TableGroupLabelIndexPipe,
        TableColumnLabelWidthPipe,
        TableColumnActionClassPipe,
        TableColumnCellClassPipe,

        // directives
        ResizableColumnDirective,

        // drag & drop
        CdkDropList,
        CdkDrag,
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

    @Output() onShowMore: EventEmitter<boolean> = new EventEmitter();
    @Output() onSortingChange: EventEmitter<ITableColumn> = new EventEmitter();
    @Output() onColumnPinned: EventEmitter<ITableColumn> = new EventEmitter();
    @Output() onColumnResize: EventEmitter<ITableResizeAction> =
        new EventEmitter();
    @Output() onColumnReorder: EventEmitter<ITableReorderAction> =
        new EventEmitter();

    @Output() onRemoveColumn: EventEmitter<string> = new EventEmitter();

    // columns
    public leftPinnedColumns: ITableColumn[] = [];
    public leftPinnedDisabledColumns: ITableColumn[] = [];
    public mainColumns: ITableColumn[] = [];
    public rightPinnedColumns: ITableColumn[] = [];
    public hasActiveLeftPinnedColumns: boolean = false;
    public hasActiveRightPinnedColumns: boolean = false;

    // actions
    public headingHoverId: number = null;
    public groupHeadingHoverLabel: string = null;

    public isResize: boolean = false;
    public isReorder: boolean = false;

    // enums
    public ePosition = ePosition;
    public eColor = eColor;
    public eGeneralActions = eGeneralActions;
    public eUnit = eUnit;
    public eCommonElement = eCommonElement;
    public sortOrder = SortOrder;

    // scroll
    public isLeftScrollLineShown: boolean = false;
    public isRightScrollLineShown: boolean = false;
    public leftPinnedBorderWidth: number = 8;
    public rightPinnedBorderWidth: number = 8;

    // svg routes
    public sharedSvgRoutes = SharedSvgRoutes;

    constructor(private cdr: ChangeDetectorRef) {}

    private processColumns(columns: ITableColumn[]): void {
        this.leftPinnedDisabledColumns = columns.filter(
            (col) => col.pinned === ePosition.LEFT && col.isDisabled
        );

        this.leftPinnedColumns = columns.filter(
            (col) => col.pinned === ePosition.LEFT && !col.isDisabled
        );

        this.rightPinnedColumns = columns.filter(
            (col) => col.pinned === ePosition.RIGHT
        );

        this.mainColumns = columns.filter((col) => !col.pinned);

        this.hasActiveLeftPinnedColumns =
            TableScrollHelper.countCheckedColumns(this.leftPinnedColumns) > 0;
        this.hasActiveRightPinnedColumns =
            TableScrollHelper.countCheckedColumns(this.rightPinnedColumns) > 0;

        this.leftPinnedBorderWidth =
            TableScrollHelper.getTotalColumnWidth(this.leftPinnedColumns) + 8;
        this.rightPinnedBorderWidth =
            TableScrollHelper.getTotalColumnWidth(this.rightPinnedColumns) + 8;
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

    public onShowMoreClick(): void {
        this.onShowMore.emit();
    }

    public onColumnResizing(isResize: boolean): void {
        this.isResize = isResize;
    }

    public onColumnWidthResize(resizeAction: ITableResizeAction): void {
        this.onColumnResize.emit(resizeAction);
    }

    public onHeadingHover(columnId: number, groupLabel: string): void {
        if (!this.isTableLocked && !this.isReorder) {
            this.headingHoverId = columnId;
            this.groupHeadingHoverLabel = groupLabel;
        }
    }

    public onRemoveColumnClick(columnKey: string): void {
        this.onRemoveColumn.emit(columnKey);
    }

    public onReorderStart(): void {
        this.isReorder = true;
    }

    public onReorderEnd(
        event: CdkDragDrop<string[]>,
        selectedColumns: ITableColumn[],
        groupColumnKey?: string
    ): void {
        const previousColumnKey = selectedColumns[event.previousIndex].key;
        const currentColumnKey = selectedColumns[event.currentIndex].key;

        const reorderAction = {
            previousColumnKey,
            currentColumnKey,
            groupColumnKey,
        };

        this.onColumnReorder.emit(reorderAction);

        const targetArray = groupColumnKey
            ? [...selectedColumns]
            : selectedColumns;

        moveItemInArray(targetArray, event.previousIndex, event.currentIndex);

        this.isReorder = false;

        this.headingHoverId = null;
        this.groupHeadingHoverLabel = null;
    }

    //TODO documents drawer
    public isRowExpanded(rowId: number): boolean {
        return this.expandedRows?.has(rowId);
    }

    public onHorizontalScroll(scrollEvent: ICustomScrollEvent): void {
        if (scrollEvent.eventAction === eCustomScroll.SCROLLING) {
            let isMaxScroll = false;

            document
                .querySelectorAll(eCustomScroll.NOT_PINNED_SCROLL_CONTAINER)
                .forEach((element) => {
                    element.scrollLeft = scrollEvent.scrollPosition;

                    if (
                        Math.round(scrollEvent.scrollPosition) >=
                        Math.round(element.scrollWidth - element.clientWidth) -
                            3
                    ) {
                        isMaxScroll = true;
                    }
                });

            const elements = document.getElementsByClassName(
                eCustomScroll.SCROLLABLE_COLUMNS
            );

            Array.from(elements).forEach((element) => {
                element.scrollLeft = scrollEvent.scrollPosition;
            });

            if (scrollEvent.scrollPosition) {
                this.isLeftScrollLineShown = true;

                this.isRightScrollLineShown = !isMaxScroll;
            } else this.isLeftScrollLineShown = false;
        } else if (
            scrollEvent.eventAction === eCustomScroll.IS_SCROLL_SHOWING
        ) {
            if (!scrollEvent.isScrollBarShowing) {
                this.isLeftScrollLineShown = false;
                this.isRightScrollLineShown = false;
            } else this.isRightScrollLineShown = true;
        }

        this.cdr.detectChanges();
    }
}
