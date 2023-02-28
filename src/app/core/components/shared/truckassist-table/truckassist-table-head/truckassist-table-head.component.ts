import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { TruckassistTableService } from '../../../../services/truckassist-table/truckassist-table.service';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { ResizeColumnDirective } from 'src/app/core/directives/resize-column.directive';

const rotate: { [key: string]: any } = {
    asc: '',
    desc: 'asc',
    '': 'desc',
};

@Component({
    selector: 'app-truckassist-table-head',
    templateUrl: './truckassist-table-head.component.html',
    styleUrls: ['./truckassist-table-head.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AngularSvgIconModule,
        NgbModule,
        ResizeColumnDirective,
        DragDropModule,
        NgbPopoverModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TruckassistTableHeadComponent
    implements OnInit, OnChanges, OnDestroy
{
    private destroy$ = new Subject<void>();
    @Input() columns: any[];
    @Input() options: any;
    @Input() tableData: any[];
    @Input() viewData: any[];
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
    sortDirection: string = '';
    tableConfigurationType: string = '';
    selectableRow: any[] = [];
    showBorder: boolean = false;

    constructor(
        private tableService: TruckassistTableService,
        private changeDetectorRef: ChangeDetectorRef
    ) {}

    // --------------------------------NgOnInit---------------------------------
    ngOnInit(): void {
        this.setColumnNameUpperCase();
        this.setVisibleColumns();
        this.getActiveTableData();
        this.getSelectableRows();

        // Get Table Width
        this.tableService.currentSetTableWidth
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.getNotPinedMaxWidth();
            });

        // Scroll
        this.tableService.currentScroll
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: number) => {
                if (this.viewData.length) {
                    let scroll = document.getElementById('scroll');
                    scroll.scrollLeft = response;
                }
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

        // Is Scroll Showing
        this.tableService.isScrollShownig
            .pipe(takeUntil(this.destroy$))
            .subscribe((isScrollShownig: boolean) => {
                if (this.showBorder !== isScrollShownig) {
                    this.showBorder = isScrollShownig;

                    this.changeDetectorRef.detectChanges();
                }
            });

        this.tableService.isScrollReseting
            .pipe(takeUntil(this.destroy$))
            .subscribe((isScrollReset: boolean) => {
                if (isScrollReset) {
                    let scroll = document.getElementById('scroll');
                    scroll.scrollLeft = 0;

                    // this.changeDetectorRef.detectChanges();
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

    // Set Column Name To Upper Case
    setColumnNameUpperCase() {
        this.columns = this.columns.map((column) => {
            let headTitle = column.groupName
                ? column.title.replace(column.groupName, '')
                : column.title;

            column.tableHeadTitle = headTitle.toUpperCase();

            return column;
        });
    }

    // Get Active Table Data
    getActiveTableData() {
        const td = this.tableData.find((t) => t.isActive);

        this.tableConfigurationType = td.tableConfiguration;
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

                if (
                    v.ngTemplate !== '' &&
                    v.ngTemplate !== 'checkbox' &&
                    v.ngTemplate !== 'user-checkbox'
                ) {
                    this.pinedWidth += 6;
                }
            }

            /* Not Pined Columns */
            if (!v.isPined && !v.isAction) {
                this.notPinedColumns.push(v);
            }

            /* Action  Columns */
            if (v.isAction) {
                this.actionColumns.push(v);

                this.actionsWidth +=
                    v.minWidth > v.width ? v.minWidth : v.width;
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
                tableContainer.clientWidth -
                (this.pinedWidth + this.actionsWidth) -
                15;

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
            this.sortDirection = rotate[this.sortDirection];

            this.columns
                .filter((a) => a.sortDirection && a.field !== column.field)
                .forEach((c) => {
                    c.sortDirection = '';
                    this.sortDirection = 'desc';
                });

            column.sortDirection = this.sortDirection;

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
            alert(
                'U tabeli ima samo jedan podatak, sort se nece zbog toga odraditi'
            );
        } else if (!column.sortName) {
            alert('Nije postavljen sortName za ovu kolonu');
        }
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

        localStorage.setItem(
            `table-${this.tableConfigurationType}-Configuration`,
            JSON.stringify(this.columns)
        );

        this.tableService.sendColumnsOrder({ columnsOrder: this.columns });

        this.setVisibleColumns();
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

        if (!event.isResizeing) {
            localStorage.setItem(
                `table-${this.tableConfigurationType}-Configuration`,
                JSON.stringify(this.columns)
            );
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

    // Get Selectable Row
    getSelectableRows() {
        let selectable = [];

        this.viewData.map((data: any, index: number) => {
            if (!data?.tableCantSelect) {
                selectable.push(index);
            }
        });

        this.selectableRow = [...selectable];
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

        localStorage.setItem(
            `table-${this.tableConfigurationType}-Configuration`,
            JSON.stringify(this.columns)
        );

        this.setVisibleColumns();

        this.tableService.sendColumnsOrder({ columnsOrder: this.columns });
    }

    // Pin Column
    onPinColumn(column: any) {
        column.isPined = !column.isPined;

        localStorage.setItem(
            `table-${this.tableConfigurationType}-Configuration`,
            JSON.stringify(this.columns)
        );

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
