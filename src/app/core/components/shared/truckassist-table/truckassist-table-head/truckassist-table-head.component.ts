import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';

const rotate: { [key: string]: any } = {
  asc: '',
  desc: 'asc',
  '': 'desc',
};

@Component({
  selector: 'app-truckassist-table-head',
  templateUrl: './truckassist-table-head.component.html',
  styleUrls: ['./truckassist-table-head.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TruckassistTableHeadComponent
  implements OnInit, OnChanges, OnDestroy
{
  private destroy$: Subject<void> = new Subject<void>();
  @Input() columns: any[];
  @Input() options: any;
  @Input() viewData: any[];
  @Output() headActions: EventEmitter<any> = new EventEmitter();
  mySelection: any[] = [];
  locked: boolean = false;
  rezaizeing: boolean = false;

  constructor(
    private tableService: TruckassistTableService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.setVisibleColumns();

    // Unlock Table
    this.tableService.currentUnlockTable
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        if (response.toaggleUnlockTable) {
          this.locked = !this.locked;
        }
      });

    // Toaggle Columns
    this.tableService.currentToaggleColumn.subscribe((response: any) => {
      if (response.length) {
        this.columns = response;

        this.setVisibleColumns();

        this.changeDetectorRef.detectChanges();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.columns && !changes?.columns?.firstChange) {
      this.columns = changes.columns.currentValue;

      this.setVisibleColumns();
    }

    if (
      changes?.columns &&
      !changes?.options?.firstChange &&
      changes?.options
    ) {
      this.options = changes.options.currentValue;
    }

    if (
      changes?.columns &&
      !changes?.viewData?.firstChange &&
      changes?.viewData
    ) {
      this.viewData = changes.viewData.currentValue;
    }
  }

  setVisibleColumns() {
    let columns = [];

    this.columns.map((column) => {
      if (!column.hidden) {
        columns.push(column);
      }
    });

    this.columns = columns;
  }

  // Sort
  sortHeaderClick(column: any): void {
    if (
      column.field &&
      column.sortable &&
      this.locked &&
      this.viewData.length > 1
    ) {
      this.options.config.sortBy = column.field;
      this.options.config.sortDirection =
        rotate[this.options.config.sortDirection];

      this.columns
        .filter((a) => a.sortDirection && a.field !== column.field)
        .forEach((c) => {
          c.sortDirection = '';
          this.options.config.sortDirection = 'desc';
        });

      column.sortDirection = this.options.config.sortDirection;

      const directionSort = column.sortDirection
        ? column.sortName +
          (column.sortDirection[0]?.toUpperCase() +
            column.sortDirection?.substr(1).toLowerCase())
        : '';

      /* this.headActions.emit({ action: 'sort', direction: directionSort }); */
    }
  }

  // Reorder
  onReorder(event: CdkDragDrop<any>) {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);

    this.tableService.sendColumnsOrder({ columnsOrder: this.columns });
  }

  // Rezaize
  onRezaize() {
    this.rezaizeing = false;
  }

  // Select
  onSelect() {
    this.toggleSelect(true);
  }

  onDeselect() {
    this.toggleSelect(false);
  }

  toggleSelect(selected: boolean) {
    this.mySelection = [];

    this.viewData = this.viewData.map((data) => {
      data.isSelected = selected;

      if (selected) {
        this.mySelection.push({ id: data.id });
      }

      return data;
    });

    /* this.tableService.sendData({
      viewData: this.viewData,
      mySelection: this.mySelection,
    }); */
  }

  ngOnDestroy(): void {
    this.tableService.sendColumnsOrder({});

    this.destroy$.next();
    this.destroy$.complete();
  }
}
