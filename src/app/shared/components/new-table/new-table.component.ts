import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    Renderer2,
    TemplateRef,
    ViewChild,
} from '@angular/core';

import { ITableColumn } from '@shared/models';

// Components
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

// Svg routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

@Component({
    selector: 'app-new-table',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        ScrollingModule,
        AngularSvgIconModule,
        NgbTooltipModule,

        // Components
        TaAppTooltipV2Component,
    ],
    templateUrl: './new-table.component.html',
    styleUrl: './new-table.component.scss',
})
export class NewTableComponent implements AfterViewInit {
    @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;
    @ViewChild('header') header!: ElementRef;
    @Input() expandedRows: Set<number> = new Set([]);
    @Input() isTableLocked: boolean;
    @Input() rows: any[] = [];
    @Input() templates: { [key: string]: TemplateRef<any> } = {};
    @Input() headerTemplates: { [key: string]: TemplateRef<any> } = {};

    @Input() set columns(value: ITableColumn[]) {
        this.processColumns(value);
    }

    @Output() onSortingChange$: EventEmitter<any> = new EventEmitter();

    public sharedSvgRoutes = SharedSvgRoutes;

    public leftPinnedColumns: ITableColumn[] = [];
    public mainColumns: ITableColumn[] = [];
    public rightPinnedColumns: ITableColumn[] = [];

    constructor(private renderer: Renderer2) {}

    ngAfterViewInit() {
        this.updateHeight();
    }

    public onScroll(event: Event): void {
        const target = event.target as HTMLElement;
        const scrollLeft = target.scrollLeft;

        if (this.header) this.header.nativeElement.scrollLeft = scrollLeft;
    }

    public isRowExpanded(rowId: number): boolean {
        return this.expandedRows?.has(rowId);
    }

    public trackTableRow(item: any) {
        return item.id;
    }

    public pinColumn(column: ITableColumn): void {
        column.pinned = null;
    }

    private processColumns(columns: ITableColumn[]): void {
        this.leftPinnedColumns = columns.filter((col) => col.pinned === 'left');
        this.rightPinnedColumns = columns.filter(
            (col) => col.pinned === 'right'
        );
        this.mainColumns = columns.filter((col) => !col.pinned);
    }

    public setSorting(sort: any): void {
        if (this.isTableLocked) return;
        this.onSortingChange$.emit(sort);
    }

    private updateHeight() {
        if (this.viewport) {
          const offsetTop = this.viewport.elementRef.nativeElement.offsetTop;
          this.renderer.setStyle(this.viewport.elementRef.nativeElement, 'height', `calc(100vh - ${offsetTop}px)`);
        }
    }
}
