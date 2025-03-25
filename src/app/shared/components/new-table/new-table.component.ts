import { CommonModule } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    Output,
    TemplateRef,
    ViewChild,
} from '@angular/core';

// modules
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';

// components
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

// svg routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

// pipes
import { TableColumnClassPipe } from '@shared/components/new-table/pipes';

// constants
import { TableConstants } from '@shared/components/new-table/utils/constants';

// enums
import { ePosition } from 'ca-components';
import { eColor, eGeneralActions } from '@shared/enums';

// Interface
import { ITableColumn } from '@shared/components/new-table/interface';

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
    ],
})
export class NewTableComponent<T> implements AfterViewInit, OnDestroy {
    @ViewChild('header') header!: ElementRef;
    @ViewChild('tableRow') tableRow!: ElementRef<HTMLDivElement>;

    @Input() expandedRows: Set<number> = new Set([]);
    @Input() isTableLocked: boolean;
    @Input() rows: T[] = [];
    @Input() templates: { [key: string]: TemplateRef<T> } = {};
    @Input() headerTemplates: { [key: string]: TemplateRef<T> } = {};

    @Input() set columns(value: ITableColumn[]) {
        this.processColumns(value);
    }

    @Output() onSortingChange: EventEmitter<ITableColumn> = new EventEmitter();
    @Output() onColumnPinned: EventEmitter<ITableColumn> = new EventEmitter();

    private resizeObserver!: ResizeObserver;

    public rowWidth: number;

    // columns
    public leftPinnedColumns: ITableColumn[] = [];
    public mainColumns: ITableColumn[] = [];
    public rightPinnedColumns: ITableColumn[] = [];

    // enums
    public ePosition = ePosition;
    public eColor = eColor;
    public eGeneralActions = eGeneralActions;

    // svg routes
    public sharedSvgRoutes = SharedSvgRoutes;

    constructor(
        // ref
        private cdRef: ChangeDetectorRef
    ) {}

    ngAfterViewInit() {
        this.getTableWidth();
    }

    private getTableWidth(): void {
        this.resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                const rowWidth =
                    entry.contentRect.width +
                    TableConstants.TABLE_WIDTH_ADDITIONAL_PX; // add additional 16px (empty space)

                this.rowWidth = rowWidth;
            }

            this.cdRef.detectChanges();
        });

        this.resizeObserver.observe(this.tableRow.nativeElement);
    }

    private processColumns(columns: ITableColumn[]): void {
        this.leftPinnedColumns = columns.filter(
            (col) => col.pinned === ePosition.LEFT
        );

        this.rightPinnedColumns = columns.filter(
            (col) => col.pinned === ePosition.RIGHT
        );

        this.mainColumns = columns.filter((col) => !col.pinned);
    }

    public onScroll(event: Event): void {
        const target = event.target as HTMLElement;
        const scrollLeft = target.scrollLeft;

        if (this.header) this.header.nativeElement.scrollLeft = scrollLeft;
    }

    public isRowExpanded(rowId: number): boolean {
        return this.expandedRows?.has(rowId);
    }

    public pinColumn(column: ITableColumn): void {
        this.onColumnPinned.emit(column);
    }

    public setSorting(sort: ITableColumn): void {
        if (this.isTableLocked) return;

        this.onSortingChange.emit(sort);
    }

    public handleShowMoreClick(): void {}

    ngOnDestroy() {
        this.resizeObserver.disconnect();
    }
}
