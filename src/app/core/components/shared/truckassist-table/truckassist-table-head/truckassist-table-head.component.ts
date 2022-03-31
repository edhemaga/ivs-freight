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
} from '@angular/core';
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
  @Input() columns: any[];
  @Input() options: any;
  @Input() viewData: any[];
  @Output() headActions: EventEmitter<any> = new EventEmitter();
  mySelection: any[] = [];
  locked: boolean = false;

  constructor(private tableService: TruckassistTableService) {}

  ngOnInit(): void {
    this.setVisibleColumns();
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

  onReorder(event: CdkDragDrop<any>) {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);

    this.tableService.sendColumnsOrder({ columnsOrder: this.columns });
  }

  public sortHeaderClick(column: any): void {
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

  onDeselect() {
    this.toggleSelect(false);
  }

  onSelect() {
    this.toggleSelect(true);
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
  }
}
