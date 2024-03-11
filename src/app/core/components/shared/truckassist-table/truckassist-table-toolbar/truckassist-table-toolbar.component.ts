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
    TemplateRef,
    ViewChild,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import {
    UntypedFormControl,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import {
    NgbModule,
    NgbPopover,
    NgbPopoverModule,
} from '@ng-bootstrap/ng-bootstrap';

//Type
import { TableType } from 'appcoretruckassist';

//Services
import { TruckassistTableService } from '../../../../services/truckassist-table/truckassist-table.service';
import { ModalService } from '../../ta-modal/modal.service';
import { ConfirmationService } from '../../../modals/confirmation-modal/confirmation.service';

//Decorators
import { Titles } from 'src/app/core/utils/application.decorators';

//Components
import {
    Confirmation,
    ConfirmationModalComponent,
} from '../../../modals/confirmation-modal/confirmation-modal.component';
import { ToolbarFiltersComponent } from './toolbar-filters/toolbar-filters.component';
import { TaInputDropdownComponent } from '../../ta-input-dropdown/ta-input-dropdown.component';
import { AppTooltipComponent } from '../../app-tooltip/app-tooltip.component';

//Enum
import { ConstantStringTableComponentsEnum } from 'src/app/core/utils/enums/table-components.enum';

//Model
import { optionsPopupContent } from '../../model/toolbar';
import { LoadCardsModalComponent } from '../../../modals/cards-modal/load-cards-modal/load-cards-modal.component';

@Titles()
@Component({
    selector: 'app-truckassist-table-toolbar',
    templateUrl: './truckassist-table-toolbar.component.html',
    styleUrls: ['./truckassist-table-toolbar.component.scss'],
    standalone: true,
    imports: [
        AppTooltipComponent,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ToolbarFiltersComponent,
        AngularSvgIconModule,
        NgbModule,
        NgbPopoverModule,
        TaInputDropdownComponent,
        LoadCardsModalComponent,
    ],
})
export class TruckassistTableToolbarComponent
    implements OnInit, OnChanges, OnDestroy
{
    @ViewChild('op') popover: NgbPopover;

    private destroy$ = new Subject<void>();
    public dropdownSelection = new UntypedFormControl();
    @Output() toolBarAction: EventEmitter<any> = new EventEmitter();
    @Input() tableData: any[];
    @Input() options: any;
    @Input() selectedTab: string;
    @Input() activeViewMode: string;
    @Input() columns: any[];
    @Input() selectedDispatcher: any;
    @Input() dispathcboardTableLocked: boolean;
    public listName: string = '';
    public optionsPopup: string | TemplateRef<any>;
    public optionsPopupOpen: boolean = false;
    public tableLocked: boolean = true;
    public optionsPopupContent: optionsPopupContent[] = [
        {
            text: ConstantStringTableComponentsEnum.COLUMNS,
            svgPath: 'assets/svg/truckassist-table/columns-new.svg',
            active: false,
            hide: false,
            showBackToList: false,
            hasOwnSubOpions: true,
            backToListIcon:
                'assets/svg/truckassist-table/arrow-back-to-list.svg',
        },
        {
            text: ConstantStringTableComponentsEnum.UNLOCK_TABLE,
            svgPath: 'assets/svg/truckassist-table/lock-new.svg',
            active: false,
            hide: false,
        },
        {
            text: ConstantStringTableComponentsEnum.RESET_TABLE,
            svgPath: 'assets/svg/truckassist-table/reset-icon.svg',
            isInactive: true,
            active: false,
            hide: false,
        },
        {
            text: ConstantStringTableComponentsEnum.IMPORT,
            svgPath: 'assets/svg/truckassist-table/import-new.svg',
            active: false,
            hide: false,
            hasTopBorder: true,
        },
        {
            text: ConstantStringTableComponentsEnum.EXPORT,
            svgPath: 'assets/svg/truckassist-table/export-new.svg',
            active: false,
            hide: false,
        },
    ];
    public tableRowsSelected: any[] = [];
    public activeTableData: any = {};
    public toolbarWidth: string = '';
    public maxToolbarWidth: number = 0;
    public timeOutToaggleColumn: NodeJS.Timeout;
    public timeOutToaggleGroupColumn: NodeJS.Timeout;
    public columnsOptions: any[] = [];
    public columnsOptionsWithGroups: any[] = [];
    public columnsOptionsWithGroupsActive: number = -1;
    public isMapShowning: boolean = false;
    public tableConfigurationType: TableType;
    public showResetOption: boolean;
    public tableReseting: boolean;
    public selectedViewMode: string;
    public selectedTableData: any = {};

    public flipAllCards: boolean = false;

    constructor(
        private tableService: TruckassistTableService,
        private modalService: ModalService,
        private confirmationService: ConfirmationService,
        private changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.getSelectedViewMode();

        this.getSelectedTabTableData();

        this.getToolbarWidth();

        this.getActiveTableData();

        this.currentSetTableWidth();

        this.columsReorder();

        this.rowsSelected();

        this.confirmationData();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!changes?.options?.firstChange && changes?.options) {
            this.options = changes.options.currentValue;

            this.getSelectedViewMode();
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

    public openCards(): void {
        this.modalService.openModal(LoadCardsModalComponent, {
            size: ConstantStringTableComponentsEnum.SMALL,
        });

        this.popover.close();
    }

    public flipCards(flip: boolean): void {
        this.flipAllCards = flip;
        this.tableService.sendAllCardsFlipped(this.flipAllCards);
    }

    private currentSetTableWidth(): void {
        this.tableService.currentSetTableWidth
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.getToolbarWidth();
            });
    }

    private confirmationData(): void {
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: Confirmation) => {
                    if (res.type === ConstantStringTableComponentsEnum.DELETE) {
                        this.onResetTable();
                    }
                },
            });
    }

    private rowsSelected(): void {
        this.tableService.currentRowsSelected
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
                this.tableRowsSelected = response;

                if (this.options.toolbarActions.showMoneyFilter) {
                    this.activeTableData.moneyCountSelected = this
                        .tableRowsSelected.length
                        ? true
                        : false;
                }

                if (this.options.toolbarActions.showCountSelectedInList) {
                    this.activeTableData = {
                        ...this.activeTableData,
                        listSelectedCount: response.length,
                    };
                }
            });
    }

    private columsReorder(): void {
        this.tableService.currentColumnsOrder
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: any) => {
                if (response.columnsOrder) {
                    this.columns = this.columns.map((column) => {
                        response.columnsOrder.map((res) => {
                            if (res.field === column.field) {
                                column.isPined = res.isPined;
                                column.hidden = res.hidden;
                            }
                        });

                        return column;
                    });

                    this.getToolbarWidth();
                }
            });
    }

    private getActiveTableData(): void {
        const td = this.tableData.find((table) => table.isActive);

        const tableColumnsConfig = JSON.parse(
            localStorage.getItem(`table-${td.tableConfiguration}-Configuration`)
        );

        this.optionsPopupContent[2].isInactive = tableColumnsConfig
            ? false
            : true;

        this.tableConfigurationType = td.tableConfiguration;

        this.selectedTableData = td;
    }

    private getSelectedViewMode(): void {
        if (this.options.toolbarActions?.viewModeOptions) {
            this.options.toolbarActions.viewModeOptions.map((viewMode) => {
                if (viewMode.active) {
                    this.selectedViewMode = viewMode.name;

                    this.isMapShowning =
                        viewMode.name === ConstantStringTableComponentsEnum.MAP;
                }
            });
        }
    }

    private getToolbarWidth(): void {
        const tableContainer = document.querySelector('.table-container');

        this.maxToolbarWidth = tableContainer.clientWidth;

        this.changeDetectorRef.detectChanges();

        this.setToolbarWidth();
    }

    private setToolbarWidth(): void {
        let columnsSumWidth = 0,
            hasMinWidth = false;

        this.columnsOptions = [];

        let activeCard = false;

        this.options.toolbarActions.viewModeOptions.filter((viewMode) => {
            if (
                viewMode.name === ConstantStringTableComponentsEnum.CARD &&
                viewMode.active
            )
                activeCard = true;
        });

        if (activeCard) {
            this.toolbarWidth = ConstantStringTableComponentsEnum.NUMBER_100;
        } else {
            this.columns.map((column) => {
                if (!column.hidden) {
                    columnsSumWidth +=
                        column.width < column.minWidth
                            ? column.minWidth
                            : column.width;
                    if (
                        column.ngTemplate !==
                            ConstantStringTableComponentsEnum.CHECKBOX &&
                        column.ngTemplate !==
                            ConstantStringTableComponentsEnum.ATTACHMENTS &&
                        column.ngTemplate !==
                            ConstantStringTableComponentsEnum.MEDIA &&
                        column.ngTemplate !==
                            ConstantStringTableComponentsEnum.INSURANCE &&
                        column.ngTemplate !==
                            ConstantStringTableComponentsEnum.COMMENT &&
                        column.ngTemplate !==
                            ConstantStringTableComponentsEnum.HIRE &&
                        column.ngTemplate !==
                            ConstantStringTableComponentsEnum.FAVORITE &&
                        column.ngTemplate !==
                            ConstantStringTableComponentsEnum.NOTE &&
                        column.ngTemplate !==
                            ConstantStringTableComponentsEnum.ACTIONS &&
                        column.ngTemplate !==
                            ConstantStringTableComponentsEnum.USER_CHECKBOX
                    ) {
                        columnsSumWidth += 6;
                    }
                }

                if (column.minWidth) hasMinWidth = true;

                if (
                    column.ngTemplate !==
                        ConstantStringTableComponentsEnum.CHECKBOX &&
                    column.ngTemplate !==
                        ConstantStringTableComponentsEnum.ATTACHMENTS &&
                    column.ngTemplate !==
                        ConstantStringTableComponentsEnum.MEDIA &&
                    column.ngTemplate !==
                        ConstantStringTableComponentsEnum.INSURANCE &&
                    column.ngTemplate !==
                        ConstantStringTableComponentsEnum.COMMENT &&
                    column.ngTemplate !==
                        ConstantStringTableComponentsEnum.HIRE &&
                    column.ngTemplate !==
                        ConstantStringTableComponentsEnum.FAVORITE &&
                    column.ngTemplate !==
                        ConstantStringTableComponentsEnum.NOTE &&
                    column.ngTemplate !==
                        ConstantStringTableComponentsEnum.ACTIONS &&
                    column.ngTemplate !==
                        ConstantStringTableComponentsEnum.USER_CHECKBOX
                ) {
                    this.columnsOptions.push(column);
                }
            });

            this.setColumnsOptionsGroups();

            this.toolbarWidth = hasMinWidth
                ? columnsSumWidth + 26 + ConstantStringTableComponentsEnum.PX
                : 100 + '%';
        }
    }

    private setColumnsOptionsGroups(): void {
        if (!this.optionsPopupOpen || this.tableReseting) {
            this.columnsOptionsWithGroups = [];

            let curentGroupName = '',
                index = null;

            this.columnsOptions.map((column) => {
                if (
                    column?.groupName &&
                    curentGroupName !== column?.groupName
                ) {
                    index = this.columnsOptionsWithGroups.length;
                    curentGroupName = column.groupName;
                }

                if (curentGroupName === column?.groupName) {
                    if (!this.columnsOptionsWithGroups[index]) {
                        this.columnsOptionsWithGroups.push({
                            isOpen: false,
                            isGroup: true,
                            areAllActive: false,
                            areSomeSelected: false,
                            optionsGroupName: curentGroupName,
                            group: [],
                        });
                    }

                    this.columnsOptionsWithGroups[index].group.push({
                        ...column,
                        groupColumnTitle: column.title.replace(
                            curentGroupName,
                            ''
                        ),
                    });
                } else {
                    this.columnsOptionsWithGroups.push({
                        ...column,
                        isGroup: false,
                    });
                }
            });
        }

        this.tableReseting = false;
    }

    public onSelectTab(selectedTabData: any): void {
        if (this.tableRowsSelected.length) {
            this.tableService.sendSelectOrDeselect(
                ConstantStringTableComponentsEnum.DESELECT
            );
        }

        localStorage.setItem(
            `${this.selectedTableData.gridNameTitle}-table-view`,
            JSON.stringify({
                tabSelected: selectedTabData.field,
                viewMode: this.selectedViewMode,
            })
        );

        this.toolBarAction.emit({
            action: ConstantStringTableComponentsEnum.TAB_SELECTED,
            tabData: selectedTabData,
        });
    }

    public onToolBarAction(actionType: string): void {
        this.toolBarAction.emit({
            action: actionType,
        });
    }

    public onToolBarSelectAction(actionType: string): void {
        this.toolBarAction.emit({
            action: ConstantStringTableComponentsEnum.SELECT_ACTION,
            data: actionType,
        });
    }

    // Chnage View Mode
    public changeModeView(modeView: any): void {
        if (this.tableRowsSelected.length) {
            this.tableService.sendSelectOrDeselect(
                ConstantStringTableComponentsEnum.DESELECT
            );
        }

        this.selectedViewMode = modeView.mode;

        this.toolBarAction.emit({
            action: ConstantStringTableComponentsEnum.VIEW_MODE,
            mode: modeView.mode,
        });

        localStorage.setItem(
            `${this.selectedTableData.gridNameTitle}-table-view`,
            JSON.stringify({
                tabSelected: this.selectedTab,
                viewMode: this.selectedViewMode,
            })
        );

        this.isMapShowning =
            modeView.mode === ConstantStringTableComponentsEnum.MAP;
    }

    public deleteSelectedRows(): void {
        this.tableService.sendDeleteSelectedRows(this.tableRowsSelected);
    }

    public activeSelectedRows(): void {
        this.toolBarAction.emit({
            action: ConstantStringTableComponentsEnum.ACTIVATE_ITEM,
            tabData: {
                data: this.tableRowsSelected.map((data) => data.tableData.id),
            },
        });
    }

    public getSelectedTabTableData(): void {
        if (this.tableData.length) {
            this.activeTableData = this.tableData.find(
                (table) => table.field === this.selectedTab
            );
        }
    }

    // Show Toolbar Options Popup
    public onShowOptions(optionsPopup): void {
        this.optionsPopupContent[0].active = false;
        this.optionsPopupContent.map((option) => {
            if (option.text !== ConstantStringTableComponentsEnum.COLUMNS) {
                option.hide = false;
            }

            return option;
        });

        this.optionsPopup = optionsPopup;

        if (optionsPopup.isOpen()) {
            optionsPopup.close();
        } else {
            this.getActiveTableData();

            optionsPopup.open({});
        }

        this.optionsPopupOpen = optionsPopup.isOpen();
    }

    //  On Toolbar Option Actions
    public onOptions(action: any): void {
        if (
            (action.text === ConstantStringTableComponentsEnum.UNLOCK_TABLE ||
                action.text === ConstantStringTableComponentsEnum.LOCK_TABLE) &&
            this.selectedViewMode === ConstantStringTableComponentsEnum.LIST
        ) {
            action.active = !action.active;

            this.tableLocked = !this.tableLocked;

            this.optionsPopupContent[1].text = this.tableLocked
                ? ConstantStringTableComponentsEnum.UNLOCK_TABLE
                : ConstantStringTableComponentsEnum.LOCK_TABLE;

            this.optionsPopupContent[1].svgPath = this.tableLocked
                ? 'assets/svg/truckassist-table/lock-new.svg'
                : 'assets/svg/truckassist-table/new-unlocked-table.svg';

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
        } else if (action.text === ConstantStringTableComponentsEnum.COLUMNS) {
            action.active = !action.active;

            this.checkAreAllSelectedInGroup();

            this.optionsPopupContent.map((option) => {
                if (option.text !== ConstantStringTableComponentsEnum.COLUMNS) {
                    option.hide = action.active;
                }

                return option;
            });
        } else if (
            action.text === ConstantStringTableComponentsEnum.RESET_TABLE &&
            !this.optionsPopupContent[2].isInactive
        ) {
            this.onShowOptions(this.optionsPopup);

            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: ConstantStringTableComponentsEnum.SMALL },
                {
                    template: '',
                    type: ConstantStringTableComponentsEnum.DELETE,
                }
            );
        }
    }

    // Check Are All Selected In Group
    public checkAreAllSelectedInGroup(): void {
        this.columnsOptionsWithGroups = this.columnsOptionsWithGroups.map(
            (columns) => {
                if (columns.isGroup) {
                    let numOfSelected = 0;

                    columns.group.map((column) => {
                        if (!column.hidden) numOfSelected++;
                    });

                    columns.areSomeSelected = numOfSelected ? true : false;

                    columns.areAllActive =
                        numOfSelected === columns.group.length;
                }

                return columns;
            }
        );
    }

    // Reset Table
    public onResetTable(): void {
        this.tableReseting = true;

        localStorage.removeItem(
            `table-${this.tableConfigurationType}-Configuration`
        );

        // this.tableService
        //     .sendTableConfig({
        //         tableType: this.tableConfigurationType,
        //         config: null,
        //     })
        //     .subscribe(() => {});

        this.tableService.sendResetColumns(true);
    }

    // Toaggle Column
    public onToaggleColumn(column: any, index: number): void {
        clearTimeout(this.timeOutToaggleColumn);

        this.timeOutToaggleColumn = setTimeout(() => {
            if (!column.isPined) {
                column.hidden = !column.hidden;

                this.setTableConfig(column, index);
            }
        }, 10);
    }

    // Open Column Grop Dropdown
    public openColumnsGroupDropdown(index: number): void {
        if (
            this.columnsOptionsWithGroupsActive !== index &&
            this.columnsOptionsWithGroupsActive !== -1
        ) {
            this.columnsOptionsWithGroups[
                this.columnsOptionsWithGroupsActive
            ].isOpen = false;
        }

        this.columnsOptionsWithGroups[index].isOpen =
            !this.columnsOptionsWithGroups[index].isOpen;

        this.columnsOptionsWithGroupsActive = this.columnsOptionsWithGroups[
            index
        ].isOpen
            ? index
            : -1;
    }

    // Toaggle All In Group
    public onToaggleAllInGroup(i: number): void {
        const columnsOptionsWithGroups = [...this.columnsOptionsWithGroups];
        const tableColumns = [...this.columns];

        columnsOptionsWithGroups[i] = {
            ...columnsOptionsWithGroups[i],
            areAllActive: columnsOptionsWithGroups[i].areSomeSelected
                ? false
                : !columnsOptionsWithGroups[i].areAllActive,
            areSomeSelected: !columnsOptionsWithGroups[i].areSomeSelected,
        };

        columnsOptionsWithGroups[i].group.map((columnOption) => {
            if (!columnOption.isPined) {
                columnOption.hidden = columnsOptionsWithGroups[i].areAllActive
                    ? false
                    : true;

                tableColumns.filter((column, index) => {
                    if (column.title === columnOption.title) {
                        column.hidden = columnsOptionsWithGroups[i].areAllActive
                            ? false
                            : true;

                        this.setTableConfig(column, index);
                    }
                });
            }
        });

        this.columnsOptionsWithGroups = [...columnsOptionsWithGroups];
        this.columns = [...tableColumns];
    }

    // Toaggle Group Column
    public onToaggleGroupColumn(columnGroup: any, index: number): void {
        clearTimeout(this.timeOutToaggleGroupColumn);

        this.timeOutToaggleGroupColumn = setTimeout(() => {
            if (!columnGroup.isPined) {
                columnGroup.hidden = !columnGroup.hidden;

                this.columns.filter((column) => {
                    if (column.title === columnGroup.title) {
                        column.hidden = !column.hidden;

                        this.checkAreAllSelectedInGroup();

                        this.setTableConfig(column, index);
                    }
                });
            }
        }, 10);
    }

    // Set Table Configuration
    public setTableConfig(column: any, index: number): void {
        let newColumns = [...this.columns];

        newColumns = newColumns.map((newColumn) => {
            if (newColumn.title === column.title) newColumn = column;

            return newColumn;
        });

        localStorage.setItem(
            `table-${this.tableConfigurationType}-Configuration`,
            JSON.stringify(newColumns)
        );

        this.tableService
            .sendTableConfig({
                tableType: this.tableConfigurationType,
                config: JSON.stringify(newColumns),
            })
            .subscribe(() => {});

        this.tableService.sendToaggleColumn({
            column: column,
            index: index,
        });

        this.getActiveTableData();
    }

    // --------------------------------ON DESTROY---------------------------------
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.tableService.sendUnlockTable({});
        this.tableService.sendToaggleColumn(null);
        this.tableService.sendResetColumns(false);

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
