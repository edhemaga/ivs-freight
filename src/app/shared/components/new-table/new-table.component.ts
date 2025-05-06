import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    QueryList,
    TemplateRef,
    ViewChildren,
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
    TableColumnCellWidthPipe,
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
        TableColumnCellWidthPipe,

        // directives
        ResizableColumnDirective,

        // drag & drop
        CdkDropList,
        CdkDrag,
    ],
})
export class NewTableComponent<T> {
    @ViewChildren('scrollableColumns')
    scrollableColumns!: QueryList<ElementRef>;

    @Input() set columns(value: ITableColumn[]) {
        this.processColumns(value);
    }

    @Input() rows: T[] = [];
    @Input() isTableLocked: boolean;
    @Input() totalDataCount: number;
    @Input() headerTemplates: { [key: string]: TemplateRef<T> } = {};
    @Input() templates: { [key: string]: TemplateRef<T> } = {};
    @Input() expandedRows: Set<number> = new Set([]);

    @Output() onColumnSort: EventEmitter<ITableColumn> = new EventEmitter();
    @Output() onColumnPin: EventEmitter<ITableColumn> = new EventEmitter();
    @Output() onColumnRemove: EventEmitter<string> = new EventEmitter();
    @Output() onColumnResize: EventEmitter<ITableResizeAction> =
        new EventEmitter();
    @Output() onColumnReorder: EventEmitter<ITableReorderAction> =
        new EventEmitter();
    @Output() onShowMore: EventEmitter<boolean> = new EventEmitter();

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

        this.processScrollProperties();
    }

    private processScrollProperties(): void {
        this.hasActiveLeftPinnedColumns = !!this.leftPinnedColumns?.length;
        this.hasActiveRightPinnedColumns = !!this.rightPinnedColumns?.length;

        this.leftPinnedBorderWidth =
            TableScrollHelper.getTotalColumnWidth(this.leftPinnedColumns) + 8;
        this.rightPinnedBorderWidth =
            TableScrollHelper.getTotalColumnWidth(this.rightPinnedColumns) + 8;
    }

    public onHeadingHover(columnId: number, groupLabel: string): void {
        if (!this.isTableLocked && !this.isReorder) {
            this.headingHoverId = columnId;
            this.groupHeadingHoverLabel = groupLabel;
        }
    }

    public onColumnSortAction(column: ITableColumn): void {
        const isSortDisabled =
            !this.isTableLocked || !this.rows.length || !column.hasSort;

        if (isSortDisabled) return;

        this.onColumnSort.emit(column);
    }

    public onColumnPinAction(column: ITableColumn): void {
        this.onColumnPin.emit(column);
    }

    public onColumnRemoveAction(columnKey: string): void {
        this.onColumnRemove.emit(columnKey);
    }

    public onColumnResizeAction(resizeAction: ITableResizeAction): void {
        this.onColumnResize.emit(resizeAction);
    }

    public onColumnResizing(isResize: boolean): void {
        this.isResize = isResize;
    }

    public onReorderStart(): void {
        this.isReorder = true;
    }

    public onColumnReorderAction(
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

    public onShowMoreAction(): void {
        this.onShowMore.emit();
    }

    public onHorizontalScroll(scrollEvent: ICustomScrollEvent): void {
        if (scrollEvent.eventAction === eCustomScroll.SCROLLING) {
            let isMaxScroll = false;

            this.scrollableColumns.forEach((column) => {
                column.nativeElement.scrollLeft = scrollEvent.scrollPosition;

                if (
                    Math.round(scrollEvent.scrollPosition) >=
                    Math.round(
                        column.nativeElement.scrollWidth -
                            column.nativeElement.clientWidth
                    ) -
                        3
                ) {
                    isMaxScroll = true;
                }
            });

            const isLeftBorderCurrentlyShown = this.isLeftScrollLineShown;
            const isRightBorderCurrentlyShown = this.isRightScrollLineShown;

            if (scrollEvent.scrollPosition) {
                this.isLeftScrollLineShown = true;

                this.isRightScrollLineShown = !isMaxScroll;
            } else this.isLeftScrollLineShown = false;

            if (
                isLeftBorderCurrentlyShown !== this.isLeftScrollLineShown ||
                isRightBorderCurrentlyShown !== this.isRightScrollLineShown
            )
                this.cdr.detectChanges();
        } else if (
            scrollEvent.eventAction === eCustomScroll.IS_SCROLL_SHOWING
        ) {
            if (!scrollEvent.isScrollBarShowing) {
                this.isLeftScrollLineShown = false;
                this.isRightScrollLineShown = false;
            } else this.isRightScrollLineShown = true;
        }
    }

    //TODO documents drawer
    public isRowExpanded(rowId: number): boolean {
        return this.expandedRows?.has(rowId);
    }
}
