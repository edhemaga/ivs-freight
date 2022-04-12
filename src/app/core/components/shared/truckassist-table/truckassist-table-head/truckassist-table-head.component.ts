import {
  CdkDragDrop,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
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

  constructor(
    private tableService: TruckassistTableService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.setIsPinedFlag();

    // Rows Selected
    this.tableService.currentRowsSelected
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any[]) => {
        this.mySelection = response;
      });

    // Unlock Table
    this.tableService.currentUnlockTable
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        if (response.toaggleUnlockTable) {
          this.locked = !this.locked;
        }
      });

    // Toaggle Columns
    this.tableService.currentToaggleColumn
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        if (response) {
          console.log('Toaggle Columns Head');
          console.log(response);
        }
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.columns && !changes?.columns?.firstChange) {
      this.columns = changes.columns.currentValue;

      this.setIsPinedFlag();
    }

    if (!changes?.options?.firstChange && changes?.options) {
      this.options = changes.options.currentValue;
    }

    if (!changes?.viewData?.firstChange && changes?.viewData) {
      this.viewData = changes.viewData.currentValue;
    }
  }

  setIsPinedFlag() {
    this.columns.map((column, index) => {
      if (!column.hidden) {
        if (!column.hasOwnProperty('isPined')) {
          column.isPined = false;
        }

        if (index === 0 || index === 1) {
          column.isPined = true;
        }
      }
    });

    this.columns = this.columns.sort(
      (a, b) => Number(b.isPined) - Number(a.isPined)
    );
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
  onReorderStart() {
    this.reordering = true;
  }

  onReorder(event: CdkDragDrop<any>) {
    if (!this.columns[event.currentIndex].isPined && event.currentIndex > 1) {
      moveItemInArray(this.columns, event.previousIndex, event.currentIndex);

      this.tableService.sendColumnsOrder({ columnsOrder: this.columns });
    }
  }

  onReorderEnd() {
    this.reordering = false;
  }

  // Rezaize
  onResize(event: any) {
    this.rezaizeing = event.isResizeing;

    if (this.rezaizeing) {
      this.tableService.sendColumnWidth({
        event: event,
        columns: this.columns,
      });
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
    column.hidden = true;

    this.setIsPinedFlag();

    this.tableService.sendColumnsOrder({ columnsOrder: this.columns });
  }

  // Pin Column
  onPinColumn(column: any) {
    column.isPined = !column.isPined;

    this.columns = this.columns.sort(
      (a, b) => Number(b.isPined) - Number(a.isPined)
    );

    this.tableService.sendColumnsOrder({ columnsOrder: this.columns });
  }

  ngOnDestroy(): void {
    this.tableService.sendColumnsOrder({});
    this.tableService.sendColumnWidth({});
    this.tableService.sendSelectOrDeselect('');

    this.destroy$.next();
    this.destroy$.complete();
  }
}
