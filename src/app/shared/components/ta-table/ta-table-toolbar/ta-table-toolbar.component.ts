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

import { CommonModule } from '@angular/common';

import { Subject, takeUntil } from 'rxjs';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// bootstrap
import {
    NgbModule,
    NgbPopover,
    NgbPopoverModule,
} from '@ng-bootstrap/ng-bootstrap';

// services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { ModalService } from '@shared/services/modal.service';
import { ConfirmationResetService } from '@shared/components/ta-shared-modals/confirmation-reset-modal/services/confirmation-reset.service';

// decorators
import { Titles } from '@core/decorators/titles.decorator';

// components
import { TaToolbarFiltersComponent } from '@shared/components/ta-table/ta-table-toolbar/components/ta-toolbar-filters/ta-toolbar-filters.component';
import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { TaAppTooltipComponent } from '@shared/components/ta-app-tooltip/ta-app-tooltip.component';
import { LoadCardModalComponent } from '@pages/load/pages/load-card-modal/load-card-modal.component';
import { ConfirmationResetModalComponent } from '@shared/components/ta-shared-modals/confirmation-reset-modal/confirmation-reset-modal.component';
import { TruckCardModalComponent } from '@pages/truck/pages/truck-card-modal/truck-card-modal.component';
import { PMCardModalComponent } from '@pages/pm-truck-trailer/pages/pm-card-modal/pm-card-modal.component';
import { AccountCardModalComponent } from '@pages/account/pages/account-card-modal/account-card-modal.component';
import { OwnerCardModalComponent } from '@pages/owner/pages/owner-card-modal/owner-card-modal.component';
import { RepairCardModalComponent } from '@pages/repair/pages/repair-card-modal/repair-card-modal.component';
import { CustomerCardModalComponent } from '@pages/customer/pages/customer-table/components/customer-card-modal/customer-card-modal.component';
import { TrailerCardModalComponent } from '@pages/trailer/pages/trailer-card-modal/trailer-card-modal.component';
import { DriverCardModalComponent } from '@pages/driver/pages/driver-card-modal/driver-card-modal.component';
import { UserCardModalComponent } from '@pages/user/pages/user-card-modal/user-card-modal.component';

// enums
import { TableStringEnum } from '@shared/enums/table-string.enum';

// models
import { TableType } from 'appcoretruckassist';
import { OptionsPopupContent } from '@shared/components/ta-table/ta-table-toolbar/models/options-popup-content.model';

// Pipes
import { ListNameCasePipe } from '@shared/components/ta-table/ta-table-toolbar/pipes/list-name-case.pipe';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormControl,
} from '@angular/forms';

// Directive
import { PreventMultipleclicksDirective } from '@shared/directives/prevent-multipleclicks.directive';

// Const
import {
    TableToolbarRoutes,
    TableToolbarConstants,
} from '@shared/components/ta-table/ta-table-toolbar/utils/constants';

@Titles()
@Component({
    selector: 'app-ta-table-toolbar',
    templateUrl: './ta-table-toolbar.component.html',
    styleUrls: ['./ta-table-toolbar.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        NgbPopoverModule,
        AngularSvgIconModule,

        // components
        TaAppTooltipComponent,
        TaToolbarFiltersComponent,
        TruckCardModalComponent,
        TaInputDropdownComponent,
        ConfirmationResetModalComponent,

        // Pipes
        ListNameCasePipe,

        // Directives
        PreventMultipleclicksDirective,
    ],
})
export class TaTableToolbarComponent implements OnInit, OnChanges, OnDestroy {
    public svgRoutes = TableToolbarRoutes;
    @ViewChild('op') popover: NgbPopover;

    private destroy$ = new Subject<void>();
    public dropdownSelection = new UntypedFormControl();
    @Output() toolBarAction: EventEmitter<any> = new EventEmitter();
    @Input() tableData: any[];
    @Input() options: any;
    @Input() selectedTab: string;
    @Input() activeViewMode: string;
    @Input() columns: any[];
    @Input() set selectedDispatcherData(value) {
        this.selectedDispatcher = value;
    }
    @Input() dispathcboardTableLocked: boolean;

    public listName: string = '';
    public optionsPopup: string | TemplateRef<any>;
    public dispatchPopoup: string | TemplateRef<any>;
    public dispatchPopoverOpen: boolean = false;
    public optionsPopupOpen: boolean = false;
    public selectedDispatcher: any;

    public tableLocked: boolean = true;
    public optionsPopupContent: OptionsPopupContent[] =
        TableToolbarConstants.optionsPopupContent;
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
    public isUpperCaseTitle: boolean = false;

    constructor(
        private tableService: TruckassistTableService,
        private modalService: ModalService,
        private confirmationResetService: ConfirmationResetService,
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
            if (!td) return;

            this.listName = td.gridNameTitle;

            if (td.isUpperCaseTitle) this.isUpperCaseTitle = true;
            else this.isUpperCaseTitle = false;
        }
    }

    public openCards(): void {
        if (this.listName === TableStringEnum.TRUCK_2) {
            this.modalService.openModal(TruckCardModalComponent, {
                size: TableStringEnum.SMALL,
            });
        } else if (this.listName === TableStringEnum.PM_2) {
            this.modalService.openModal(PMCardModalComponent, {
                size: TableStringEnum.SMALL,
            });
        } else if (this.listName === TableStringEnum.ACCOUNT) {
            this.modalService.openModal(AccountCardModalComponent, {
                size: TableStringEnum.SMALL,
            });
        } else if (this.listName === TableStringEnum.OWNER) {
            this.modalService.openModal(OwnerCardModalComponent, {
                size: TableStringEnum.SMALL,
            });
        } else if (this.listName === TableStringEnum.REPAIR) {
            this.modalService.openModal(RepairCardModalComponent, {
                size: TableStringEnum.SMALL,
            });
        } else if (this.listName === TableStringEnum.CUSTOMER) {
            this.modalService.openModal(CustomerCardModalComponent, {
                size: TableStringEnum.SMALL,
            });
        } else if (this.listName === TableStringEnum.TRAILER_3) {
            this.modalService.openModal(TrailerCardModalComponent, {
                size: TableStringEnum.SMALL,
            });
        } else if (this.listName === TableStringEnum.DRIVER_1) {
            this.modalService.openModal(DriverCardModalComponent, {
                size: TableStringEnum.SMALL,
            });
        } else if (this.listName === TableStringEnum.USER) {
            this.modalService.openModal(UserCardModalComponent, {
                size: TableStringEnum.SMALL,
            });
        } else {
            this.modalService.openModal(LoadCardModalComponent, {
                size: TableStringEnum.SMALL,
            });
        }

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
        this.confirmationResetService.getConfirmationResetData$
            .pipe(takeUntil(this.destroy$))
            .subscribe((isTableReset) => {
                if (isTableReset) this.onResetTable();
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

                    this.activeTableData.moneyCount =
                        this.tableRowsSelected.reduce((total, selectRow) => {
                            let cost: string;

                            if (
                                this.activeTableData.title ===
                                TableStringEnum.BROKER
                            ) {
                                cost =
                                    selectRow.tableData
                                        ?.tablePaymentDetailCreditLimit;
                            } else {
                                cost = selectRow.tableData?.tableCost;
                            }

                            if (cost) {
                                const num = parseFloat(
                                    cost.replace(/\$|,/g, '')
                                );
                                total += num;
                            }
                            return total;
                        }, 0);
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
        if (!td) return;

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

                    this.isMapShowning = viewMode.name === TableStringEnum.MAP;
                }
            });
        }
    }

    private getToolbarWidth(): void {
        const tableContainer = document.querySelector('.table-container');

        this.maxToolbarWidth = tableContainer?.clientWidth;

        this.changeDetectorRef.detectChanges();

        this.setToolbarWidth();
    }

    private setToolbarWidth(): void {
        let columnsSumWidth = 0,
            hasMinWidth = false;

        this.columnsOptions = [];

        let activeCard = false;

        this.options.toolbarActions.viewModeOptions.filter((viewMode) => {
            if (viewMode.name === TableStringEnum.CARD && viewMode.active)
                activeCard = true;
        });

        if (activeCard) {
            this.toolbarWidth = TableStringEnum.NUMBER_100;
        } else if (this.columns) {
            this.columns.map((column) => {
                if (!column.hidden && column.width) {
                    columnsSumWidth +=
                        column.width < column.minWidth
                            ? column.minWidth
                            : column.width;

                    if (
                        column.ngTemplate !== TableStringEnum.CHECKBOX &&
                        column.ngTemplate !== TableStringEnum.ATTACHMENTS &&
                        column.ngTemplate !== TableStringEnum.MEDIA &&
                        column.ngTemplate !== TableStringEnum.INSURANCE &&
                        column.ngTemplate !== TableStringEnum.COMMENT &&
                        column.ngTemplate !== TableStringEnum.HIRE &&
                        column.ngTemplate !== TableStringEnum.FAVORITE &&
                        column.ngTemplate !== TableStringEnum.NOTE &&
                        column.ngTemplate !== TableStringEnum.ACTIONS &&
                        column.ngTemplate !== TableStringEnum.USER_CHECKBOX
                    ) {
                        columnsSumWidth += 6;
                    }
                }

                if (column.minWidth) hasMinWidth = true;

                if (
                    column.ngTemplate !== TableStringEnum.CHECKBOX &&
                    column.ngTemplate !== TableStringEnum.ATTACHMENTS &&
                    column.ngTemplate !== TableStringEnum.MEDIA &&
                    column.ngTemplate !== TableStringEnum.INSURANCE &&
                    column.ngTemplate !== TableStringEnum.COMMENT &&
                    column.ngTemplate !== TableStringEnum.HIRE &&
                    column.ngTemplate !== TableStringEnum.FAVORITE &&
                    column.ngTemplate !== TableStringEnum.NOTE &&
                    column.ngTemplate !== TableStringEnum.ACTIONS &&
                    column.ngTemplate !== TableStringEnum.USER_CHECKBOX
                ) {
                    this.columnsOptions.push(column);
                }
            });

            this.setColumnsOptionsGroups();

            this.toolbarWidth =
                this.activeViewMode === TableStringEnum.DISPATCH
                    ? TableStringEnum.NUMBER_100
                    : hasMinWidth
                    ? columnsSumWidth + 26 + TableStringEnum.PX
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
            this.tableService.sendSelectOrDeselect(TableStringEnum.DESELECT);
        }

        localStorage.setItem(
            `${this.selectedTableData.gridNameTitle}-table-view`,
            JSON.stringify({
                tabSelected: selectedTabData.field,
                viewMode: this.selectedViewMode,
            })
        );

        this.toolBarAction.emit({
            action: TableStringEnum.TAB_SELECTED,
            tabData: selectedTabData,
        });

        // There is bug if popover is open and we click on new tab, data is not updated
        // If we first close popover then select tab data is changed
        this.optionsPopupOpen = false;
        this.setColumnsOptionsGroups();
    }

    public onToolBarAction(actionType: string): void {
        this.toolBarAction.emit({
            action: actionType,
        });
    }

    public onToolBarSelectAction(actionType: string): void {
        this.toolBarAction.emit({
            action: TableStringEnum.SELECT_ACTION,
            data: actionType,
        });
    }

    // Chnage View Mode
    public changeModeView(modeView: any): void {
        if (this.tableRowsSelected.length) {
            this.tableService.sendSelectOrDeselect(TableStringEnum.DESELECT);
        }

        this.selectedViewMode = modeView.mode;

        localStorage.setItem(
            `${this.selectedTableData.gridNameTitle}-table-view`,
            JSON.stringify({
                tabSelected: this.selectedTab,
                viewMode: this.selectedViewMode,
            })
        );

        this.toolBarAction.emit({
            action: TableStringEnum.VIEW_MODE,
            mode: modeView.mode,
        });

        this.isMapShowning = modeView.mode === TableStringEnum.MAP;
    }

    public hireSelectedRows(): void {
        this.tableService.sendHireSelectedRows(this.tableRowsSelected);
    }

    public banSelectedRows(): void {
        this.tableService.sendBanListSelectedRows(this.tableRowsSelected);
    }

    public dnuSelectedRows(): void {
        this.tableService.sendDnuListSelectedRows(this.tableRowsSelected);
    }

    public bussinessSelectedRows(): void {
        this.tableService.sendBussinessSelectedRows(this.tableRowsSelected);
    }

    public deleteSelectedRows(): void {
        this.tableService.sendDeleteSelectedRows(this.tableRowsSelected);
    }

    public activeSelectedRows(): void {
        this.toolBarAction.emit({
            action: TableStringEnum.ACTIVATE_ITEM,
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
            if (this.activeViewMode === 'Dispatch') {
                if (option.text === TableStringEnum.COLUMNS) {
                    option.active = true;
                } else {
                    option.hide = true;
                }
                this.checkAreAllSelectedInGroup();
                return option;
            }
            if (option.text !== TableStringEnum.COLUMNS) {
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

    public showDispatchList(optionsPopup): void {
        this.dispatchPopoup = optionsPopup;

        if (optionsPopup.isOpen()) {
            optionsPopup.close();
        } else {
            optionsPopup.open({});
        }

        this.dispatchPopoverOpen = !this.dispatchPopoverOpen;
    }

    //  On Toolbar Option Actions
    public onOptions(action: any): void {
        if (
            (action.text === TableStringEnum.UNLOCK_TABLE ||
                action.text === TableStringEnum.LOCK_TABLE) &&
            this.selectedViewMode === TableStringEnum.LIST
        ) {
            action.active = !action.active;

            this.tableLocked = !this.tableLocked;

            this.optionsPopupContent[1].text = this.tableLocked
                ? TableStringEnum.UNLOCK_TABLE
                : TableStringEnum.LOCK_TABLE;

            this.optionsPopupContent[1].svgPath = this.tableLocked
                ? 'assets/svg/truckassist-table/lock-new.svg'
                : 'assets/svg/truckassist-table/new-unlocked-table.svg';

            this.tableService.sendUnlockTable({
                toaggleUnlockTable: true,
            });

            const tableConfig = localStorage.getItem(
                `table-${this.tableConfigurationType}-Configuration`
            );

            if (this.tableLocked && tableConfig) {
                this.tableService
                    .sendTableConfig({
                        tableType: this.tableConfigurationType,
                        config: tableConfig,
                    })
                    .subscribe(() => {});
            }
        } else if (
            action.text === TableStringEnum.COLUMNS &&
            this.activeViewMode !== 'Dispatch'
        ) {
            action.active = !action.active;

            this.checkAreAllSelectedInGroup();

            this.optionsPopupContent.map((option) => {
                if (option.text !== TableStringEnum.COLUMNS) {
                    option.hide = action.active;
                }

                return option;
            });
        } else if (
            action.text === TableStringEnum.RESET_TABLE &&
            !this.optionsPopupContent[2].isInactive
        ) {
            this.onShowOptions(this.optionsPopup);

            this.modalService.openModal(
                ConfirmationResetModalComponent,
                { size: TableStringEnum.SMALL },
                {
                    template: TableStringEnum.RESET_MODAL,
                    type: TableStringEnum.RESET,
                    modalTitle: TableStringEnum.RESET_MODAL_CONTACTS_TITLE,
                    tableType: TableStringEnum.RESET_MODAL_CONTACTS_TABLE_TYPE,
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
        if (this.tableConfigurationType) {
            localStorage.removeItem(
                `table-${this.tableConfigurationType}-Configuration`
            );

            this.tableService
                .sendTableConfig({
                    tableType: this.tableConfigurationType,
                    config: null,
                })
                .subscribe(() => {});
        }

        this.tableService.sendResetColumns(true);
    }

    // Toaggle Column
    public onToaggleColumn(column: any, index: number): void {
        if (column.isPined || column.disabled) return;

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

        if (this.activeViewMode !== 'Dispatch') {
            this.tableService
                .sendTableConfig({
                    tableType: this.tableConfigurationType,
                    config: JSON.stringify(newColumns),
                })
                .subscribe(() => {});
        }

        this.tableService.sendToaggleColumn({
            column: column,
            index: index,
        });

        this.getActiveTableData();
    }

    public identity(index: number, item: any): number {
        return item.id;
    }

    // --------------------------------ON DESTROY---------------------------------
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.tableService.sendUnlockTable({});
        this.tableService.sendToaggleColumn(null);
        this.tableService.sendResetColumns(false);
        this.tableService.sendDeleteSelectedRows([]);

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
