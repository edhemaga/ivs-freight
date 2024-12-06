import { CommonModule } from '@angular/common';
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
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';

import { Subject, takeUntil } from 'rxjs';

// modules
import {
    NgbModule,
    NgbPopover,
    NgbPopoverModule,
} from '@ng-bootstrap/ng-bootstrap';

// components
import { TableHeadBorderComponent } from '@shared/components/ta-table/ta-table-head/components/table-head-border/table-head-border.component';
import { TableHeadRowsComponent } from '@shared/components/ta-table/ta-table-head/components/table-head-rows/table-head-rows.component';
import { TableHeadActionsComponent } from '@shared/components/ta-table/ta-table-head/components/table-head-actions/table-head-actions.component';

// services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';

// enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { TableHeadStringEnum } from '@shared/components/ta-table/ta-table-head/enums/table-head-string.enum';

// models
import { TableHeadRowsActionEmit } from '@shared/components/ta-table/ta-table-head/models/table-head-rows-action-emit.model';

@Component({
    selector: 'app-ta-table-head',
    templateUrl: './ta-table-head.component.html',
    styleUrls: ['./ta-table-head.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        NgbModule,
        DragDropModule,
        NgbPopoverModule,

        // components
        TableHeadBorderComponent,
        TableHeadRowsComponent,
        TableHeadActionsComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaTableHeadComponent implements OnInit, OnChanges, OnDestroy {
    @Input() columns: any[];
    @Input() options: any;
    @Input() tableData: any[];
    @Input() viewData: any[];

    @Output() headActions: EventEmitter<any> = new EventEmitter();

    private destroy$ = new Subject<void>();

    private rotate: { [key: string]: string } = {
        asc: '',
        desc: 'asc',
        '': 'desc',
    };

    public mySelection: any[] = [];

    public locked: boolean = true;
    public reordering: boolean = false;
    public resizing: boolean = false;
    public showBorder: boolean = false;
    public resizeIsPined: boolean;

    public isRepairUnitStringBoolean: boolean = false;
    public isRepairShopDetailsStringBoolean: boolean = false;
    public isRepairItemDetailsStringBoolean: boolean = false;

    public visibleColumns: any[] = [];
    public pinedColumns: any[] = [];
    public pinedWidth: number = 0;
    public notPinedColumns: any[] = [];
    public actionsWidth: number = 0;
    public actionColumns: any[] = [];
    public resizeHitLimit: number = -1;
    public notPinedMaxWidth: number = 0;
    public sortDirection: string = '';
    public tableConfigurationType: string = '';
    public selectableRow: any[] = [];

    constructor(
        private tableService: TruckassistTableService,
        private changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.setColumnNameUpperCase();

        this.setVisibleColumns();

        this.getActiveTableData();

        this.getSelectableRows();

        this.getTableWidth();

        this.getTableScroll();

        this.getRowsSelected();

        this.getUnlockTable();

        this.getIsScrollShowing();

        this.getIsScrollReseting();

        setTimeout(() => {
            this.getNotPinedMaxWidth();
        }, 10);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.columns && !changes?.columns?.firstChange) {
            this.columns = changes.columns.currentValue;

            this.setColumnNameUpperCase();
            this.setVisibleColumns(true);
        }

        if (changes?.tableData && !changes?.tableData?.firstChange) {
            this.tableData = changes.tableData.currentValue;

            this.getActiveTableData();
        }

        if (!changes?.options?.firstChange && changes?.options) {
            this.options = changes.options.currentValue;

            this.changeDetectorRef.detectChanges();
        }

        if (!changes?.viewData?.firstChange && changes?.viewData) {
            this.viewData = changes.viewData.currentValue;

            this.getSelectableRows();

            this.changeDetectorRef.detectChanges();
        }
    }

    private setColumnNameUpperCase(): void {
        this.columns = this.columns.map((column) => {
            const headTitle = column.groupName
                ? column.title.replace(column.groupName, '')
                : column.title;

            column.tableHeadTitle = headTitle.toUpperCase();

            return column;
        });
    }

    private setVisibleColumns(getNotPinedMaxWidth?: boolean): void {
        this.visibleColumns = [];
        this.pinedColumns = [];
        this.notPinedColumns = [];
        this.actionColumns = [];
        this.pinedWidth = 0;
        this.actionsWidth = 0;

        this.isRepairItemDetailsStringBoolean = false;
        this.isRepairShopDetailsStringBoolean = false;
        this.isRepairUnitStringBoolean = false;

        this.columns.map((column, index) => {
            if (!column.hasOwnProperty(TableHeadStringEnum.IS_PINED)) {
                column.isPined = false;
            }

            if (index === 0 || index === 1) {
                column.isPined = true;
            }

            if (!column.hidden) {
                this.visibleColumns.push(column);
            }
        });

        this.visibleColumns.map((visibleColumn) => {
            /* Pined Columns */
            if (visibleColumn.isPined && !visibleColumn.isAction) {
                this.pinedColumns.push(visibleColumn);

                this.pinedWidth +=
                    visibleColumn.minWidth > visibleColumn.width
                        ? visibleColumn.minWidth
                        : visibleColumn.width;

                if (
                    visibleColumn.ngTemplate !==
                        TableHeadStringEnum.EMPTY_STRING &&
                    visibleColumn.ngTemplate !== TableHeadStringEnum.CHECKBOX &&
                    visibleColumn.ngTemplate !==
                        TableHeadStringEnum.USER_CHECKBOX
                ) {
                    this.pinedWidth += 6;
                }
            }

            if (
                this.tableData[0]?.gridNameTitle === TableHeadStringEnum.REPAIR
            ) {
                this.setVisibleTableHead(visibleColumn);
            }

            /* Not Pined Columns */
            if (!visibleColumn.isPined && !visibleColumn.isAction) {
                this.notPinedColumns.push(visibleColumn);
            }

            /* Action  Columns */
            if (visibleColumn.isAction) {
                this.actionColumns.push(visibleColumn);

                this.actionsWidth +=
                    visibleColumn.minWidth > visibleColumn.width
                        ? visibleColumn.minWidth
                        : visibleColumn.width;
            }
        });

        this.changeDetectorRef.detectChanges();

        if (getNotPinedMaxWidth) {
            setTimeout(() => {
                this.getNotPinedMaxWidth();
            }, 10);
        }
    }

    private setVisibleTableHead(data): void {
        data.showRepairTitle = false;

        if (
            !this.isRepairUnitStringBoolean &&
            data.groupName === TableStringEnum.UNIT
        ) {
            data.showRepairTitle = true;
            this.isRepairUnitStringBoolean = true;
        }
        if (
            !this.isRepairShopDetailsStringBoolean &&
            data.groupName === TableStringEnum.SHOP_DETAIL
        ) {
            data.showRepairTitle = true;
            this.isRepairShopDetailsStringBoolean = true;
        }
        if (
            !this.isRepairItemDetailsStringBoolean &&
            data.groupName === TableStringEnum.ITEM_DETAIL
        ) {
            data.showRepairTitle = true;
            this.isRepairItemDetailsStringBoolean = true;
        }
    }

    private getActiveTableData(): void {
        const tableData = this.tableData.find(
            (tableData) => tableData.isActive
        );

        if (!tableData) return;
        this.tableConfigurationType = tableData.tableConfiguration;
    }

    private getSelectableRows(): void {
        const selectable = [];

        this.viewData.map((data: any, index: number) => {
            if (!data?.tableCantSelect) selectable.push(index);
        });

        this.selectableRow = [...selectable];
    }

    private getNotPinedMaxWidth(): void {
        if (this.viewData.length) {
            const tableContainer = document.querySelector(
                TableHeadStringEnum.TABLE_CONTAINER_CLASS
            );

            this.notPinedMaxWidth =
                tableContainer?.clientWidth -
                (this.pinedWidth + this.actionsWidth) -
                15;

            this.changeDetectorRef.detectChanges();
        }
    }

    private getTableWidth(): void {
        this.tableService.currentSetTableWidth
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.getNotPinedMaxWidth();
            });
    }

    private getTableScroll(): void {
        this.tableService.currentScroll
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: number) => {
                if (this.viewData.length) {
                    let scroll = document.getElementById(
                        TableHeadStringEnum.SCROLL
                    );
                    if (scroll) scroll.scrollLeft = response;
                }
            });
    }

    private getRowsSelected(): void {
        this.tableService.currentRowsSelected
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: any[]) => {
                this.mySelection = response;

                this.changeDetectorRef.detectChanges();
            });
    }

    private getUnlockTable(): void {
        this.tableService.currentUnlockTable
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: any) => {
                if (response.toaggleUnlockTable) {
                    this.locked = !this.locked;

                    this.changeDetectorRef.detectChanges();
                }
            });
    }

    private getIsScrollShowing(): void {
        this.tableService.isScrollShownig
            .pipe(takeUntil(this.destroy$))
            .subscribe((isScrollShownig: boolean) => {
                if (this.showBorder !== isScrollShownig) {
                    this.showBorder = isScrollShownig;

                    this.changeDetectorRef.detectChanges();
                }
            });
    }

    private getIsScrollReseting(): void {
        this.tableService.isScrollReseting
            .pipe(takeUntil(this.destroy$))
            .subscribe((isScrollReset: boolean) => {
                if (isScrollReset) {
                    let scroll = document.getElementById(
                        TableHeadStringEnum.SCROLL
                    );
                    if (scroll) scroll.scrollLeft = 0;
                }
            });
    }

    private onSelect(action: string): void {
        this.tableService.sendSelectOrDeselect(action);
    }

    private onSelectedOptions(selectedPopover: NgbPopover): void {
        if (selectedPopover.isOpen()) {
            selectedPopover.close();
        } else {
            selectedPopover.open({});
        }
    }

    private onReorder(event: CdkDragDrop<any>): void {
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

        localStorage.setItem(
            `table-${this.tableConfigurationType}-Configuration`,
            JSON.stringify(this.columns)
        );

        this.tableService.sendColumnsOrder({ columnsOrder: this.columns });

        this.setVisibleColumns();
    }

    private onResize(event: any): void {
        this.resizing = event.isResizeing;

        if (this.resizing && !event.beyondTheLimits) {
            this.tableService.sendColumnWidth({
                event: event,
                columns:
                    event.section === TableHeadStringEnum.NOT_PINED
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

        if (!event.isResizeing) {
            localStorage.setItem(
                `table-${this.tableConfigurationType}-Configuration`,
                JSON.stringify(this.columns)
            );
        }
    }

    private sortHeaderClick(column: any): void {
        if (
            column.field &&
            column.sortable &&
            this.locked &&
            this.viewData.length > 1 &&
            column.sortName
        ) {
            this.sortDirection = this.rotate[this.sortDirection];

            this.columns
                .filter((a) => a.sortDirection && a.field !== column.field)
                .forEach((c) => {
                    c.sortDirection = TableHeadStringEnum.EMPTY_STRING;
                    this.sortDirection = TableHeadStringEnum.DESC;
                });

            column.sortDirection = this.sortDirection;

            this.setVisibleColumns();

            const directionSort = column.sortDirection
                ? column.sortName +
                  (column.sortDirection[0]?.toUpperCase() +
                      column.sortDirection?.substr(1).toLowerCase())
                : '';

            this.headActions.emit({
                action: TableHeadStringEnum.SORT,
                direction: directionSort,
            });

            this.changeDetectorRef.detectChanges();
        }
    }

    private onRemoveColumn(column: any): void {
        this.columns.map((c) => {
            if (c.field === column.field) {
                c.hidden = true;
            }
        });

        localStorage.setItem(
            `table-${this.tableConfigurationType}-Configuration`,
            JSON.stringify(this.columns)
        );

        this.setVisibleColumns();

        this.tableService.sendColumnsOrder({ columnsOrder: this.columns });
    }

    private onPinColumn(column: any): void {
        column.isPined = !column.isPined;

        localStorage.setItem(
            `table-${this.tableConfigurationType}-Configuration`,
            JSON.stringify(this.columns)
        );

        this.tableService.sendColumnsOrder({ columnsOrder: this.columns });

        this.setVisibleColumns();

        this.changeDetectorRef.detectChanges();
    }

    public tableHeadRowsActionEmit(event: TableHeadRowsActionEmit): void {
        switch (event.action) {
            case TableHeadStringEnum.SELECTION:
                this.onSelect(event.event);

                break;
            case TableHeadStringEnum.SELECTED_OPTIONS:
                this.onSelectedOptions(event.event);

                break;
            case TableHeadStringEnum.REORDER:
                this.onReorder(event.event);

                break;
            case TableHeadStringEnum.RESIZE:
                this.onResize(event.event);

                break;
            case TableHeadStringEnum.SORT:
                this.sortHeaderClick(event.event);

                break;
            case TableHeadStringEnum.REMOVE_COLUMN:
                this.onRemoveColumn(event.event);

                break;
            case TableHeadStringEnum.PIN_COLUMN:
                this.onPinColumn(event.event);

                break;
            default:
                break;
        }
    }

    ngOnDestroy(): void {
        this.tableService.sendColumnsOrder({});
        this.tableService.sendColumnWidth({});
        this.tableService.sendSelectOrDeselect('');

        this.destroy$.next();
        this.destroy$.complete();
    }
}
