import { CdkDragDrop } from '@angular/cdk/drag-drop';
import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TruckassistTableHeadComponent
  implements OnInit, OnChanges, OnDestroy
{
  private destroy$ = new Subject<void>();
  @Input() columns: any[];
  @Input() options: any;
  @Input() viewData: any[];
  @Input() tableContainerWidth: number;
  @Output() headActions: EventEmitter<any> = new EventEmitter();
  mySelection: any[] = [];
  locked: boolean = true;
  reordering: boolean = false;
  rezaizeing: boolean = false;
  optionsPopup: any;
  visibleColumns: any[] = [];
  pinedColumns: any[] = [];
  pinedWidth: number = 0;
  notPinedColumns: any[] = [];
  actionsWidth: number = 0;
  actionColumns: any[] = [];
  resizeHitLimit: number = -1;
  resizeIsPined: boolean;
  notPinedMaxWidth: number = 0;

  constructor(
    private tableService: TruckassistTableService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  // --------------------------------NgOnInit---------------------------------
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

    setTimeout(() => {
      this.getNotPinedMaxWidth();
    }, 10);
  }

  // --------------------------------NgOnChanges---------------------------------
  ngOnChanges(changes: SimpleChanges) {
    if (changes?.columns && !changes?.columns?.firstChange) {
      this.columns = changes.columns.currentValue;

      this.setVisibleColumns(true);
    }

    if (
      !changes?.tableContainerWidth?.firstChange &&
      changes?.tableContainerWidth
    ) {
      this.getNotPinedMaxWidth();
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

  // Set Visible Column
  setVisibleColumns(getNotPinedMaxWidth?: boolean) {
    this.visibleColumns = [];
    this.pinedColumns = [];
    this.notPinedColumns = [];
    this.actionColumns = [];
    this.pinedWidth = 0;
    this.actionsWidth = 0;

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
      if (v.isPined && !v.isAction) {
        this.pinedColumns.push(v);

        this.pinedWidth += v.minWidth > v.width ? v.minWidth : v.width;
      }

      /* Not Pined Columns */
      if (!v.isPined && !v.isAction) {
        this.notPinedColumns.push(v);
      }

      /* Action  Columns */
      if (v.isAction) {
        this.actionColumns.push(v);

        this.actionsWidth += v.minWidth > v.width ? v.minWidth : v.width;
      }
    });

    this.changeDetectorRef.detectChanges();

    if (getNotPinedMaxWidth) {
      setTimeout(() => {
        this.getNotPinedMaxWidth();
      }, 10);
    }
  }

  // Get Not Pined Section Of Table Max Width
  getNotPinedMaxWidth() {
    if (this.viewData.length) {
      const tableContainer = document.querySelector('.table-container');

      this.notPinedMaxWidth =
        tableContainer.clientWidth - (this.pinedWidth + this.actionsWidth) - 8;

      this.changeDetectorRef.detectChanges();
    }
  }

  // Sort
  sortHeaderClick(column: any): void {
    if (
      column.field &&
      column.sortable &&
      this.locked &&
      this.viewData.length > 1 &&
      column.sortName
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
    } else if (!column.sortable) {
      alert('Kolona nije podesena u konfig tabele da bude sortable');
    } else if (this.viewData.length <= 1) {
      alert('U tabeli ima samo jedan podatak, sort se nece zbog toga odraditi');
    } else if (!column.sortName) {
      alert('Nije postavljen sortName za ovu kolonu');
    }
  }

  // Reorder
  onReorderStart() {
    this.reordering = true;
  }

  // Reorder
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

  // Reorder End
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

      this.getNotPinedMaxWidth();
    }

    if (event.beyondTheLimits) {
      this.resizeHitLimit = event.index;
      this.resizeIsPined = event.isPined;

      setTimeout(() => {
        this.resizeHitLimit = -1;
      }, 1000);
    }
  }

  // Open Row Select Popup
  onSelectedOptions(selectedPopover: any) {
    this.optionsPopup = selectedPopover;

    if (selectedPopover.isOpen()) {
      selectedPopover.close();
    } else {
      selectedPopover.open({});
    }
  }

  // On Select Option From Select Popup
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

  // --------------------------------ON DESTROY---------------------------------
  ngOnDestroy(): void {
    this.tableService.sendColumnsOrder({});
    this.tableService.sendColumnWidth({});
    this.tableService.sendSelectOrDeselect('');

    this.destroy$.next();
    this.destroy$.complete();
  }
}
