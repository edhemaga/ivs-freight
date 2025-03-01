import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';
import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    TemplateRef,
    ViewChild,
} from '@angular/core';


import { ILoadDisplay, ITableColumn } from '@shared/models';

// Components
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

@Component({
  selector: 'app-new-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
      CommonModule,
      ScrollingModule,
      AngularSvgIconModule,
      NgbTooltipModule,
      TaAppTooltipV2Component,
  ],
  templateUrl: './new-table.component.html',
  styleUrl: './new-table.component.scss'
})
export class NewTableComponent {
  @ViewChild('header') header!: ElementRef;
  @Input() rows: any[] = [];
  @Input() templates: { [key: string]: TemplateRef<any> } = {};
  @Input() headerTemplates: { [key: string]: TemplateRef<any> } = {};

  @Input() set columns(value: ITableColumn[]) {
      this.processColumns(value);
  }

  @Output() onSortingChange$: EventEmitter<any> = new EventEmitter();

  public setSorting(sort) {
      if (this.isTableLocked) return;
      this.onSortingChange$.emit(sort);
  }

  leftPinnedColumns: ITableColumn[] = [];
  mainColumns: ITableColumn[] = [];
  rightPinnedColumns: ITableColumn[] = [];

  @Input() expandedRows: Set<number> = new Set([]);
  @Input() isTableLocked: boolean;

  private processColumns(columns: ITableColumn[]) {
      console.log(columns, 'COLOMUNSSS');
      this.leftPinnedColumns = columns.filter((col) => col.pinned === 'left');
      this.rightPinnedColumns = columns.filter(
          (col) => col.pinned === 'right'
      );
      this.mainColumns = columns.filter((col) => !col.pinned);

      console.log(this.leftPinnedColumns, 'left');
      console.log(this.mainColumns, 'maincol');
      console.log(this.rightPinnedColumns, 'right');
  }

  onScroll(event: Event): void {
      const target = event.target as HTMLElement;
      const scrollLeft = target.scrollLeft;
      console.log(scrollLeft, 'scrollLeft');
      if (this.header) {
          this.header.nativeElement.scrollLeft = scrollLeft; // Pomeranje drugog elementa
      }
  }

  isRowExpanded(rowId: number): boolean {
      return this.expandedRows?.has(rowId);
  }

  public trackTableRow(item: ILoadDisplay) {
      return item.id;
  }

  public pinColumn(column: ITableColumn): void {
      column.pinned = null;
  }
}
