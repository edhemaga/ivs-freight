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

// modules
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';

// components
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaCustomScrollbarComponent } from '@shared/components/ta-custom-scrollbar/ta-custom-scrollbar.component';

// svg routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

// pipes
import { TableColumnClassPipe } from '@shared/components/new-table/pipes';

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

        // pipes
        TableColumnClassPipe,

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

    // columns
    public leftPinnedColumns: ITableColumn[] = [];
    public mainColumns: ITableColumn[] = [];
    public rightPinnedColumns: ITableColumn[] = [];
    public hasActiveLeftPinnedColumns: boolean = false;
    public hasActiveRightPinnedColumns: boolean = false;

    // enums
    public ePosition = ePosition;
    public eColor = eColor;
    public eGeneralActions = eGeneralActions;
    public eUnit = eUnit;
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
        this.leftPinnedColumns = columns.filter(
            (col) => col.pinned === ePosition.LEFT
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

    public handleShowMoreClick(): void {
        this.onHandleShowMoreClick.emit(true);
    }

    public onColumnWidthResize(resizeAction: ITableResizeAction): void {
        this.onColumnResize.emit(resizeAction);
    }

    public isRowExpanded(rowId: number): boolean {
        return this.expandedRows?.has(rowId);
    }

    public onHorizontalScroll(scrollEvent: any): void {
        if (scrollEvent.eventAction === 'scrolling') {
            let isMaxScroll = false;

            document
                .querySelectorAll('#table-not-pined-scroll-container')
                .forEach((el) => {
                    el.scrollLeft = scrollEvent.scrollPosition;

                    if (
                        Math.round(scrollEvent.scrollPosition) >=
                        Math.round(el.scrollWidth - el.clientWidth) - 3
                    ) {
                        isMaxScroll = true;
                    }
                });

            if (scrollEvent.scrollPosition > 0) {
                this.isLeftScrollLineShown = true;

                this.isRightScrollLineShown = !isMaxScroll;
            } else this.isLeftScrollLineShown = false;
        } else if (scrollEvent.eventAction === 'isScrollShowing') {
            if (!scrollEvent.isScrollBarShowing) {
                this.isLeftScrollLineShown = false;
                this.isRightScrollLineShown = false;
            } else this.isRightScrollLineShown = true;
        }

        let elements = document.getElementsByClassName('scrollable-columns');
        Array.from(elements).forEach((el) => {
            el.scrollLeft = scrollEvent.scrollPosition;
        });

        this.cdr.detectChanges();
    }
}
