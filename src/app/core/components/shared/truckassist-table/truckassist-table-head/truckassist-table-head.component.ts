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
  ChangeDetectionStrategy,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  locked: boolean = true;
  reordering: boolean = false;
  rezaizeing: boolean = false;
  optionsPopup: any;
  visibleColumns: any[] = [];
  pinedColumns: any[] = [];
  notPinedColumns: any[] = [];
  actionColumns: any[] = [];
  showBorder: boolean = false;
  resizeHitLimit: number = -1;
  resizeIsPined: boolean;

  constructor(
    private tableService: TruckassistTableService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.setVisibleColumns();

    // Scroll
    this.tableService.currentScroll
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: number) => {
        let scroll = document.getElementById('scroll');
        scroll.scrollLeft = response;
      });

    // Rows Selected
    this.tableService.currentRowsSelected
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any[]) => {
        this.mySelection = response;

        this.changeDetectorRef.detectChanges();
      });

    // Unlock Table
    this.tableService.currentUnlockTable
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        if (response.toaggleUnlockTable) {
          this.locked = !this.locked;

          this.changeDetectorRef.detectChanges();
        }
      });

    // Toaggle Columns
    this.tableService.currentToaggleColumn
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        if (response) {
          this.columns = this.columns.map((c) => {
            if (c.field === response.column.field) {
              c.hidden = response.column.hidden;
            }

            return c;
          });

          this.setVisibleColumns();
        }
      });

    // Showing Scroll
    this.tableService.currentShowingScroll
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: boolean) => {
        this.showBorder = response;
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.columns && !changes?.columns?.firstChange) {
      this.columns = changes.columns.currentValue;

      this.setVisibleColumns();
    }

    if (!changes?.options?.firstChange && changes?.options) {
      this.options = changes.options.currentValue;

      this.changeDetectorRef.detectChanges();
    }

    if (!changes?.viewData?.firstChange && changes?.viewData) {
      this.viewData = changes.viewData.currentValue;

      this.changeDetectorRef.detectChanges();
    }
  }

  setVisibleColumns() {
    this.visibleColumns = [];
    this.pinedColumns = [];
    this.notPinedColumns = [];
    this.actionColumns = [];

    this.columns.map((column, index) => {
      if (!column.hasOwnProperty('isPined')) {
        column.isPined = false;
      }

      if (index === 0 || index === 1) {
        column.isPined = true;
      }

      if (!column.hidden) {
        this.visibleColumns.push(column);
      }
    });

    this.visibleColumns.map((v) => {
      /* Pined Columns */
      if (v.isPined) {
        this.pinedColumns.push(v);
      }

      /* Not Pined Columns */
      if (!v.isPined && !v.isAction) {
        this.notPinedColumns.push(v);
      }

      /* Action  Columns */
      if (v.isAction) {
        this.actionColumns.push(v);
      }
    });

    this.changeDetectorRef.detectChanges();
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

      this.setVisibleColumns();

      const directionSort = column.sortDirection
        ? column.sortName +
          (column.sortDirection[0]?.toUpperCase() +
            column.sortDirection?.substr(1).toLowerCase())
        : '';

      this.headActions.emit({ action: 'sort', direction: directionSort });

      this.changeDetectorRef.detectChanges();
    }
  }

  // Reorder
  onReorderStart() {
    this.reordering = true;
  }

  onReorder(event: CdkDragDrop<any>) {
    let previousIndex: number = null,
      currentIndex: number = null;

    this.columns.map((c, i) => {
      if (this.notPinedColumns[event.previousIndex].field === c.field) {
        previousIndex = i;
      }

      if (this.notPinedColumns[event.currentIndex].field === c.field) {
        currentIndex = i;
      }
    });

    let column: any[] = this.columns.splice(previousIndex, 1);

    this.columns.splice(currentIndex, 0, column[0]);

    this.tableService.sendColumnsOrder({ columnsOrder: this.columns });

    this.setVisibleColumns();
  }

  onReorderEnd() {
    this.reordering = false;
  }

  // Rezaize
  onResize(event: any) {
    this.rezaizeing = event.isResizeing;

    if (this.rezaizeing && !event.beyondTheLimits) {
      this.tableService.sendColumnWidth({
        event: event,
        columns:
          event.section === 'not-pined'
            ? this.notPinedColumns
            : this.pinedColumns,
      });
    }

    if (event.beyondTheLimits) {
      this.resizeHitLimit = event.index;
      this.resizeIsPined = event.isPined;

      setTimeout(() => {
        this.resizeHitLimit = -1;
      }, 1000);
    }
  }

  // Select
  onSelectedOptions(selectedPopover: any) {
    this.optionsPopup = selectedPopover;

    if (selectedPopover.isOpen()) {
      selectedPopover.close();
    } else {
      selectedPopover.open({});
    }
  }

  onSelect(action: string) {
    this.tableService.sendSelectOrDeselect(action);
  }

  // Remove Column
  onRemoveColumn(column: any) {
    this.columns.map((c) => {
      if (c.field === column.field) {
        c.hidden = true;
      }
    });

    this.setVisibleColumns();

    this.tableService.sendColumnsOrder({ columnsOrder: this.columns });
  }

  // Pin Column
  onPinColumn(column: any) {
    column.isPined = !column.isPined;

    this.tableService.sendColumnsOrder({ columnsOrder: this.columns });

    this.setVisibleColumns();

    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.tableService.sendColumnsOrder({});
    this.tableService.sendColumnWidth({});
    this.tableService.sendSelectOrDeselect('');

    this.destroy$.next();
    this.destroy$.complete();
  }
}
