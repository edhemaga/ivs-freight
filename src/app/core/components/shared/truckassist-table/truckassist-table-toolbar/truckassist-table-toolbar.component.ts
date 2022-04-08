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
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-truckassist-table-toolbar',
  templateUrl: './truckassist-table-toolbar.component.html',
  styleUrls: ['./truckassist-table-toolbar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TruckassistTableToolbarComponent
  implements OnInit, OnChanges, OnDestroy
{
  private destroy$: Subject<void> = new Subject<void>();

  @Output() toolBarAction: EventEmitter<any> = new EventEmitter();
  @Input() tableData: any[];
  @Input() options: any;
  @Input() selectedTab: string;
  @Input() columns: any[];
  listName: string = '';
  optionsPopup: any;
  optionsPopupOpen: boolean = false;
  optionsPopupContent: any[] = [
    {
      text: 'Unlock table',
      svgPath: 'assets/svg/truckassist-table/lock.svg',
      width: 14,
      height: 16,
    },
    {
      text: 'Import',
      svgPath: 'assets/svg/truckassist-table/import.svg',
      width: 16,
      height: 16,
    },
    {
      text: 'Export',
      svgPath: 'assets/svg/truckassist-table/export.svg',
      width: 16,
      height: 16,
    },
    {
      text: 'Reset Columns',
      svgPath: 'assets/svg/truckassist-table/reset.svg',
      width: 16,
      height: 16,
    },
    {
      text: 'Columns',
      svgPath: 'assets/svg/truckassist-table/columns.svg',
      width: 16,
      height: 16,
      active: false,
    },
  ];

  constructor(private tableService: TruckassistTableService) {}

  ngOnInit(): void {
    // Columns Reorder
    this.tableService.currentColumnsOrder
    .pipe(takeUntil(this.destroy$))
    .subscribe((response: any) => {
      if (response.columnsOrder) {
        this.columns = this.columns.map((c) => {
          response.columnsOrder.map((r) => {
            if(r.field === c.field){
              c.isPined = r.isPined;
              c.hidden = r.hidden;
            }
          })

          return c;
        })
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes?.options?.firstChange && changes?.options) {
      this.options = changes.options.currentValue;
    }

    if (!changes?.tableData?.firstChange && changes?.tableData) {
      this.tableData = changes.tableData.currentValue;
    }

    if (!changes?.columns?.firstChange && changes?.columns) {
      this.columns = changes.columns.currentValue;
    }

    if (changes?.selectedTab) {
      this.selectedTab = changes.selectedTab.currentValue;

      const td = this.tableData.find((t) => t.field === this.selectedTab);

      this.listName = td.gridNameTitle;
    }
  }

  onSelectTab(selectedTabData: any) {
    this.toolBarAction.emit({
      action: 'tab-selected',
      tabData: selectedTabData,
    });
  }

  onToolBarAction(actionType: string) {
    this.toolBarAction.emit({
      action: actionType,
    });
  }

  onShowOptions(optionsPopup: any) {
    this.optionsPopup = optionsPopup;

    if (optionsPopup.isOpen()) {
      optionsPopup.close();
    } else {
      optionsPopup.open({});
    }

    this.optionsPopupOpen = optionsPopup.isOpen();
    this.optionsPopupContent[4].active = false;
  }

  onOptions(action: any) {
    if (action.text === 'Unlock table') {
      this.tableService.sendUnlockTable({
        toaggleUnlockTable: true,
      });
    } else if (action.text === 'Columns') {
      action.active = !action.active;
    } else {
      alert('Treba da se odradi!');
    }


    if(action.text !== 'Columns'){
      this.optionsPopup.close();
    }
  }

  onToaggleColumn(column: any) {
    column.hidden = !column.hidden;

    this.tableService.sendToaggleColumn(this.columns);
  }

  ngOnDestroy(): void {
    this.tableService.sendUnlockTable({});
    this.tableService.sendToaggleColumn([]);

    this.destroy$.next();
    this.destroy$.complete();
  }
}
