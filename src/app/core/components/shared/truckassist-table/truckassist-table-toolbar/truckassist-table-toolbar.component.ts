import {
    Component,
    Input,
    OnInit,
    OnChanges,
    SimpleChanges,
    Output,
    EventEmitter,
    OnDestroy,
} from '@angular/core';
import { TableType } from 'appcoretruckassist';
import { Subject, takeUntil } from 'rxjs';
import { TruckassistTableService } from '../../../../services/truckassist-table/truckassist-table.service';

@Component({
    selector: 'app-truckassist-table-toolbar',
    templateUrl: './truckassist-table-toolbar.component.html',
    styleUrls: ['./truckassist-table-toolbar.component.scss'],
})
export class TruckassistTableToolbarComponent
    implements OnInit, OnChanges, OnDestroy
{
    private destroy$ = new Subject<void>();
    @Output() toolBarAction: EventEmitter<any> = new EventEmitter();
    @Input() tableData: any[];
    @Input() options: any;
    @Input() selectedTab: string;
    @Input() columns: any[];
    @Input() tableContainerWidth: number;
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
            show: true,
        },
        {
            text: 'Import',
            svgPath: 'assets/svg/truckassist-table/import.svg',
            width: 16,
            height: 16,
            show: true,
        },
        {
            text: 'Export',
            svgPath: 'assets/svg/truckassist-table/export.svg',
            width: 16,
            height: 16,
            show: true,
        },
        {
            text: 'Reset Columns',
            svgPath: 'assets/svg/truckassist-table/new-reset-icon.svg',
            width: 16,
            height: 16,
            show: true,
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
            show: true,
        },
    ];
    tableRowsSelected: any[] = [];
    activeTableData: any = {};
    toolbarWidth: string = '';
    maxToolbarWidth: number = 0;
    inactiveTimeOutInterval: any;
    timeOutToaggleColumn: any;
    columnsOptions: any[] = [];
    isMapShowning: boolean = false;
    tableConfigurationType: TableType;
    showResetOption: boolean;

    constructor(private tableService: TruckassistTableService) {}

    // --------------------------------NgOnInit---------------------------------
    ngOnInit(): void {
        this.getSelectedTabTableData();

        this.getToolbarWidth();

        this.getActiveTableData();

        // Columns Reorder
        this.tableService.currentColumnsOrder
            .pipe(takeUntil(this.destroy$))
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

                    this.getToolbarWidth();
                }
            });

        // Rows Selected
        this.tableService.currentRowsSelected
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: any[]) => {
                this.tableRowsSelected = response;
            });
    }

    // --------------------------------NgOnChanges---------------------------------
    ngOnChanges(changes: SimpleChanges) {
        if (!changes?.options?.firstChange && changes?.options) {
            this.options = changes.options.currentValue;
        }

        if (
            !changes?.tableContainerWidth?.firstChange &&
            changes?.tableContainerWidth
        ) {
            this.getToolbarWidth();
        }

        if (!changes?.tableData?.firstChange && changes?.tableData) {
            this.tableData = changes.tableData.currentValue;

            this.getActiveTableData();

            this.getSelectedTabTableData();
        }

        if (!changes?.columns?.firstChange && changes?.columns) {
            this.columns = changes.columns.currentValue;

            this.getToolbarWidth();
        }

        if (changes?.selectedTab) {
            this.selectedTab = changes.selectedTab.currentValue;

            const td = this.tableData.find((t) => t.field === this.selectedTab);

            this.listName = td.gridNameTitle;
        }
    }

    // Get Active Table Data
    getActiveTableData() {
        const td = this.tableData.find((t) => t.isActive);

        const tableColumnsConfig = JSON.parse(
            localStorage.getItem(`table-${td.tableConfiguration}-Configuration`)
        );

        this.optionsPopupContent[3].show = tableColumnsConfig ? true : false;

        this.tableConfigurationType = td.tableConfiguration;
    }

    // Get Toolbar Width
    getToolbarWidth() {
        const tableContainer = document.querySelector('.table-container');

        this.maxToolbarWidth = tableContainer.clientWidth;

        this.setToolbarWidth();

        /* if (!this.tableLocked) {
      this.resetInactivityTimer();
    } */
    }

    // Set Toolbar Width
    setToolbarWidth() {
        let columnsSumWidth = 0,
            hasMinWidth = false;

        this.columnsOptions = [];

        this.columns.map((c) => {
            if (!c.hidden) {
                columnsSumWidth += c.width < c.minWidth ? c.minWidth : c.width;
            }

            if (c.minWidth) {
                hasMinWidth = true;
            }

            if (
                c.ngTemplate !== 'checkbox' &&
                c.ngTemplate !== 'attachments' &&
                c.ngTemplate !== 'note' &&
                c.ngTemplate !== 'actions'
            ) {
                this.columnsOptions.push(c);
            }
        });

        this.toolbarWidth = hasMinWidth
            ? columnsSumWidth + 12 + 'px'
            : 100 + '%';
    }

    // Select Tab
    onSelectTab(selectedTabData: any) {
        this.toolBarAction.emit({
            action: 'tab-selected',
            tabData: selectedTabData,
        });
    }

    // Toolbar Action
    onToolBarAction(actionType: string) {
        this.toolBarAction.emit({
            action: actionType,
        });
    }

    // Chnage View Mode
    changeModeView(modeView: any) {
        this.toolBarAction.emit({
            action: 'view-mode',
            mode: modeView.mode,
        });

        this.isMapShowning = modeView.mode === 'Map';
    }

    // Delete Selected Rows
    deleteSelectedRows() {
        this.tableService.sendDeleteSelectedRows(this.tableRowsSelected);
    }

    // Get Tab Data For Selected Tab
    getSelectedTabTableData() {
        if (this.tableData.length) {
            this.activeTableData = this.tableData.find(
                (t) => t.field === this.selectedTab
            );
        }
    }

    // Show Toolbar Options Popup
    onShowOptions(optionsPopup: any) {
        this.optionsPopup = optionsPopup;

        if (optionsPopup.isOpen()) {
            optionsPopup.close();
        } else {
            this.getActiveTableData();

            optionsPopup.open({});
        }

        this.optionsPopupOpen = optionsPopup.isOpen();
        this.optionsPopupContent[4].active = false;
    }

    //  On Toolbar Option Actions
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

            if (this.tableLocked) {
                const tableConfig = localStorage.getItem(
                    `table-${this.tableConfigurationType}-Configuration`
                );

                this.tableService
                    .sendTableConfig({
                        tableType: this.tableConfigurationType,
                        config: tableConfig,
                    })
                    .subscribe(() => {});
            }

            /* if (!this.tableLocked) {
        this.setInactivityTimer();
      } else {
        clearTimeout(this.inactiveTimeOutInterval);
      } */
        } else if (action.text === 'Columns') {
            action.active = !action.active;
        } else if (action.text === 'Reset Columns') {
            localStorage.removeItem(
                `table-${this.tableConfigurationType}-Configuration`
            );

            this.tableService.sendResetColumns(true);

            /* this.tableService
        .deleteTableConfig(this.tableConfigurationType)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          console.log(
            'Brise se konfiguracija tabele: ' + this.tableConfigurationType
          );

          localStorage.removeItem(
            `table-${this.tableConfigurationType}-Configuration`
          );

          this.tableService.sendResetColumns(true);
        }); */
        } else {
            alert('Treba da se odradi!');
        }

        if (action.text !== 'Columns') {
            this.optionsPopup.close();
        }
    }

    // Reset Inactivity Timer
    /* resetInactivityTimer() {
    clearTimeout(this.inactiveTimeOutInterval);

    setTimeout(() => {
      this.setInactivityTimer();
    }, 100);
  } */

    // Set Inactivity Timer
    /* setInactivityTimer() {
    this.inactiveTimeOutInterval = setTimeout(() => {
      this.tableLocked = true;

      this.optionsPopupContent[0].text = 'Unlock table';
      this.optionsPopupContent[0].svgPath =
        'assets/svg/truckassist-table/lock.svg';

      this.tableService.sendUnlockTable({
        toaggleUnlockTable: true,
      });
    }, 60000);
  } */

    // Toaggle Column
    onToaggleColumn(column: any, index: number) {
        clearTimeout(this.timeOutToaggleColumn);

        this.timeOutToaggleColumn = setTimeout(() => {
            if (!column.isPined) {
                column.hidden = !column.hidden;

                localStorage.setItem(
                    `table-${this.tableConfigurationType}-Configuration`,
                    JSON.stringify(this.columns)
                );

                this.tableService.sendToaggleColumn({
                    column: column,
                    index: index,
                });

                this.getActiveTableData();
            }
        }, 10);
    }

    // --------------------------------ON DESTROY---------------------------------
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.tableService.sendUnlockTable({});
        this.tableService.sendToaggleColumn(null);
        this.tableService.sendResetColumns(false);
        clearTimeout(this.inactiveTimeOutInterval);

        const tableConfig = localStorage.getItem(
            `table-${this.tableConfigurationType}-Configuration`
        );

        if (tableConfig) {
            this.tableService
                .sendTableConfig({
                    tableType: this.tableConfigurationType,
                    config: tableConfig,
                })
                .subscribe(() => {});
        }
    }
}
