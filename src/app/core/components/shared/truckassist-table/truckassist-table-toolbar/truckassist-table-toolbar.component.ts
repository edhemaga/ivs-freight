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
  ChangeDetectionStrategy,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-truckassist-table-toolbar',
  templateUrl: './truckassist-table-toolbar.component.html',
  styleUrls: ['./truckassist-table-toolbar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TruckassistTableToolbarComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy
{
  @Output() toolBarAction: EventEmitter<any> = new EventEmitter();
  @Input() tableData: any[];
  @Input() options: any;
  @Input() selectedTab: string;
  @Input() columns: any[];
  listName: string = '';
  optionsPopup: any;
  optionsPopupOpen: boolean = false;
  tableLocked: boolean = true;
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
      svgPath: 'assets/svg/truckassist-table/new-reset-icon.svg',
      width: 16,
      height: 16,
    },
    {
      text: 'Columns',
      svgPath: 'assets/svg/truckassist-table/columns.svg',
      width: 16,
      height: 16,
      active: false,
      additionalDropIcon: {
        path: 'assets/svg/truckassist-table/arrow-columns-drop.svg',
        width: 6,
        height: 8,
      },
    },
  ];
  tableRowsSelected: any[] = [];
  activeTableData: any = {};
  toolbarWidth: number = 0;

  constructor(
    private tableService: TruckassistTableService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getSelectedTabTableData();

    // Columns Reorder
    this.tableService.currentColumnsOrder
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.columnsOrder) {
          this.columns = this.columns.map((c) => {
            response.columnsOrder.map((r) => {
              if (r.field === c.field) {
                c.isPined = r.isPined;
                c.hidden = r.hidden;
              }
            });

            return c;
          });
        }
      });

    // Rows Selected
    this.tableService.currentRowsSelected
      .pipe(untilDestroyed(this))
      .subscribe((response: any[]) => {
        this.tableRowsSelected = response;
      });

    // Rezaize
    this.tableService.currentColumnWidth
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response?.event?.width) {
          this.getToolbarWidth();
        }
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes?.options?.firstChange && changes?.options) {
      this.options = changes.options.currentValue;
    }

    if (!changes?.tableData?.firstChange && changes?.tableData) {
      this.tableData = changes.tableData.currentValue;

      this.getSelectedTabTableData();
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

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.getToolbarWidth();
    }, 10)
  }

  getToolbarWidth() {
    const pinedColumns = document.querySelector('.pined-tr');
    const notPinedColumns = document.querySelector('.not-pined-tr');
    const actionColumns = document.querySelector('.actions');
    const borderColumns = document.querySelector('.not-pined-border');

    this.toolbarWidth =
      pinedColumns.clientWidth +
      notPinedColumns.clientWidth +
      actionColumns.clientWidth +
      (borderColumns ? 6 : 0);

    this.changeDetectorRef.detectChanges();
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

  changeModeView(modeView: string) {
    this.toolBarAction.emit({
      action: 'view-mode',
      mode: modeView,
    });
  }

  deleteSelectedRows() {
    this.tableService.sendDeleteSelectedRows(this.tableRowsSelected);
  }

  getSelectedTabTableData() {
    if (this.tableData.length) {
      this.activeTableData = this.tableData.find(
        (t) => t.field === this.selectedTab
      );
    }
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
    if (action.text === 'Unlock table' || action.text === 'Lock table') {
      this.tableLocked = !this.tableLocked;

      this.optionsPopupContent[0].text = this.tableLocked
        ? 'Unlock table'
        : 'Lock table';

      this.optionsPopupContent[0].svgPath = this.tableLocked
        ? 'assets/svg/truckassist-table/lock.svg'
        : 'assets/svg/truckassist-table/unlocked-table.svg';

      this.tableService.sendUnlockTable({
        toaggleUnlockTable: true,
      });
    } else if (action.text === 'Columns') {
      action.active = !action.active;
    } else if (action.text === 'Reset Columns') {
      this.tableService.sendResetColumns(true);
    } else {
      alert('Treba da se odradi!');
    }

    if (action.text !== 'Columns') {
      this.optionsPopup.close();
    }
  }

  onToaggleColumn(column: any, index: number) {
    column.hidden = !column.hidden;

    this.tableService.sendToaggleColumn({
      column: column,
      index: index,
    });
  }

  ngOnDestroy(): void {
    this.tableService.sendUnlockTable({});
    this.tableService.sendToaggleColumn(null);
    this.tableService.sendResetColumns(false);
  }
}
