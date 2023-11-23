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
} from '@angular/core';
import { TableType } from 'appcoretruckassist';
import { Subject, takeUntil } from 'rxjs';
import { TruckassistTableService } from '../../../../services/truckassist-table/truckassist-table.service';
import {
    UntypedFormControl,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { Titles } from 'src/app/core/utils/application.decorators';
import {
    Confirmation,
    ConfirmationModalComponent,
} from '../../../modals/confirmation-modal/confirmation-modal.component';
import { ModalService } from '../../ta-modal/modal.service';
import { ConfirmationService } from '../../../modals/confirmation-modal/confirmation.service';
import { CommonModule } from '@angular/common';
import { ToolbarFiltersComponent } from './toolbar-filters/toolbar-filters.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { TaInputDropdownComponent } from '../../ta-input-dropdown/ta-input-dropdown.component';
import { LoadDetails } from '../../truckassist-cards/dataTypes';

interface rowSelected {
    id: number;
    tableData: LoadDetails;
}
@Titles()
@Component({
    selector: 'app-truckassist-table-toolbar',
    templateUrl: './truckassist-table-toolbar.component.html',
    styleUrls: ['./truckassist-table-toolbar.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ToolbarFiltersComponent,
        AngularSvgIconModule,
        NgbModule,
        NgbPopoverModule,
        TaInputDropdownComponent,
    ],
})
export class TruckassistTableToolbarComponent
    implements OnInit, OnChanges, OnDestroy
{
    private destroy$ = new Subject<void>();
    dropdownSelection = new UntypedFormControl();
    @Output() toolBarAction: EventEmitter<any> = new EventEmitter();
    @Input() tableData: any[];
    @Input() options: any;
    @Input() selectedTab: string;
    @Input() columns: any[];
    @Input() selectedDispatcher: any;
    @Input() dispathcboardTableLocked: boolean;
    listName: string = '';
    optionsPopup: any;
    optionsPopupOpen: boolean = false;
    tableLocked: boolean = true;
    optionsPopupContent: any[] = [
        {
            text: 'Columns',
            svgPath: 'assets/svg/truckassist-table/columns-new.svg',
            active: false,
            hide: false,
            showBackToList: false,
            hasOwnSubOpions: true,
            backToListIcon:
                'assets/svg/truckassist-table/arrow-back-to-list.svg',
        },
        {
            text: 'Unlock table',
            svgPath: 'assets/svg/truckassist-table/lock-new.svg',
            active: false,
            hide: false,
        },
        {
            text: 'Reset Table',
            svgPath: 'assets/svg/truckassist-table/reset-icon.svg',
            isInactive: true,
            active: false,
            hide: false,
        },
        {
            text: 'Import',
            svgPath: 'assets/svg/truckassist-table/import-new.svg',
            active: false,
            hide: false,
            hasTopBorder: true,
        },
        {
            text: 'Export',
            svgPath: 'assets/svg/truckassist-table/export-new.svg',
            active: false,
            hide: false,
        },
    ];
    tableRowsSelected: any[] = [];
    activeTableData: any = {};
    toolbarWidth: string = '';
    maxToolbarWidth: number = 0;
    timeOutToaggleColumn: any;
    timeOutToaggleGroupColumn: any;
    columnsOptions: any[] = [];
    columnsOptionsWithGroups: any[] = [];
    columnsOptionsWithGroupsActive: number = -1;
    isMapShowning: boolean = false;
    tableConfigurationType: TableType;
    showResetOption: boolean;
    tableReseting: boolean;
    selectedViewMode: string;
    selectedTableData: any = {};
    mySelection: any[] = [];
    // tableTypes = [
    //     { configType: 'LOAD_TEMPLATE', id: 1 },DONE
    //     { configType: 'LOAD_CLOSED', id: 2 }, DONE
    //     { configType: 'LOAD_REGULAR', id: 3 }, DONE
    //     { configType: 'BROKER', id: 4 }, DONE
    //     { configType: 'SHIPPER', id: 5 }, DONE
    //     { configType: 'DRIVER', id: 6 }, DONE
    //     { configType: 'APPLICANT', id: 7 }, DONE
    //     { configType: 'TRUCK', id: 8 }, DONE
    //     { configType: 'TRAILER', id: 9 }, DONE
    //     { configType: 'REPAIR_TRUCK', id: 10 }, DONE
    //     { configType: 'REPAIR_TRAILER', id: 11 }, DONE
    //     { configType: 'REPAIR_SHOP', id: 12 }, DONE
    //     { configType: 'PM_TRUCK', id: 13 }, DONE
    //     { configType: 'PM_TRAILER', id: 14 }, DONE
    //     { configType: 'FUEL_TRANSACTION', id: 15 }, DONE
    //     { configType: 'FUEL_STOP', id: 16 }, DONE
    //     { configType: 'OWNER', id: 17 }, DONE
    //     { configType: 'ACCOUNT', id: 18 }, DONE
    //     { configType: 'CONTACT', id: 19 }, DONE
    //     { configType: 'ROADSIDE_INSPECTION', id: 20 }, DONE
    //     { configType: 'ACCIDENT', id: 21 }, DONE
    //     { configType: 'USER', id: 22 }, DONE
    // ];

    constructor(
        private tableService: TruckassistTableService,
        private modalService: ModalService,
        private confirmationService: ConfirmationService,
        private changeDetectorRef: ChangeDetectorRef
    ) {}

    // --------------------------------NgOnInit---------------------------------
    ngOnInit(): void {
        this.getSelectedViewMode();

        this.getSelectedTabTableData();

        this.getToolbarWidth();

        this.getActiveTableData();

        // Get Table Width
        this.tableService.currentSetTableWidth
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.getToolbarWidth();
            });

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
            .subscribe((response: rowSelected[]) => {
                this.tableRowsSelected = response;

                if (this.options.toolbarActions.showMoneyCount) {
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

        // Confirmation For Reset Table Configuration
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: Confirmation) => {
                    switch (res.type) {
                        case 'delete': {
                            this.onResetTable();
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                },
            });
    }

    // --------------------------------NgOnChanges---------------------------------
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

    // Get Active Table Data
    getActiveTableData() {
        const td = this.tableData.find((t) => t.isActive);

        const tableColumnsConfig = JSON.parse(
            localStorage.getItem(`table-${td.tableConfiguration}-Configuration`)
        );

        this.optionsPopupContent[2].isInactive = tableColumnsConfig
            ? false
            : true;

        this.tableConfigurationType = td.tableConfiguration;

        this.selectedTableData = td;
    }

    // Get Selected View Mode
    getSelectedViewMode() {
        if (this.options.toolbarActions?.viewModeOptions) {
            this.options.toolbarActions.viewModeOptions.map((viewMode: any) => {
                if (viewMode.active) {
                    this.selectedViewMode = viewMode.name;

                    this.isMapShowning = viewMode.name === 'Map';
                }
            });
        }
    }

    // Get Toolbar Width
    getToolbarWidth() {
        const tableContainer = document.querySelector('.table-container');

        this.maxToolbarWidth = tableContainer.clientWidth;

        this.changeDetectorRef.detectChanges();

        this.setToolbarWidth();
    }

    // Set Toolbar Width
    setToolbarWidth() {
        let columnsSumWidth = 0,
            hasMinWidth = false;

        this.columnsOptions = [];

        this.columns.map((c) => {
            if (!c.hidden) {
                columnsSumWidth += c.width < c.minWidth ? c.minWidth : c.width;

                if (
                    c.ngTemplate !== 'checkbox' &&
                    c.ngTemplate !== 'attachments' &&
                    c.ngTemplate !== 'media' &&
                    c.ngTemplate !== 'insurance' &&
                    c.ngTemplate !== 'comment' &&
                    c.ngTemplate !== 'hire' &&
                    c.ngTemplate !== 'favorite' &&
                    c.ngTemplate !== 'note' &&
                    c.ngTemplate !== 'actions' &&
                    c.ngTemplate !== 'user-checkbox'
                ) {
                    columnsSumWidth += 6;
                }
            }

            if (c.minWidth) {
                hasMinWidth = true;
            }

            if (
                c.ngTemplate !== 'checkbox' &&
                c.ngTemplate !== 'attachments' &&
                c.ngTemplate !== 'media' &&
                c.ngTemplate !== 'insurance' &&
                c.ngTemplate !== 'comment' &&
                c.ngTemplate !== 'hire' &&
                c.ngTemplate !== 'favorite' &&
                c.ngTemplate !== 'note' &&
                c.ngTemplate !== 'actions' &&
                c.ngTemplate !== 'user-checkbox'
            ) {
                this.columnsOptions.push(c);
            }
        });

        this.setColumnsOptionsGroups();

        this.toolbarWidth = hasMinWidth
            ? columnsSumWidth + 26 + 'px'
            : 100 + '%';
    }

    // Set Columns Options Groups
    setColumnsOptionsGroups() {
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

    // Select Tab
    onSelectTab(selectedTabData: any) {
        if (this.tableRowsSelected.length) {
            this.tableService.sendSelectOrDeselect('deselect');
        }

        localStorage.setItem(
            `${this.selectedTableData.gridNameTitle}-table-view`,
            JSON.stringify({
                tabSelected: selectedTabData.field,
                viewMode: this.selectedViewMode,
            })
        );

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

    // Toolbar Select Action
    onToolBarSelectAction(actionType: string) {
        this.toolBarAction.emit({
            action: 'select-action',
            data: actionType,
        });
    }

    // Chnage View Mode
    changeModeView(modeView: any) {
        // Treba da se sredi da kada se prebacujes samo na map da brise, al imamo konfilkt logike oko slekta i deslekta pa se u head brise kada se ukolni koponenta
        // && modeView === 'Map'
        if (this.tableRowsSelected.length) {
            this.tableService.sendSelectOrDeselect('deselect');
        }

        this.selectedViewMode = modeView.mode;

        this.toolBarAction.emit({
            action: 'view-mode',
            mode: modeView.mode,
        });

        localStorage.setItem(
            `${this.selectedTableData.gridNameTitle}-table-view`,
            JSON.stringify({
                tabSelected: this.selectedTab,
                viewMode: this.selectedViewMode,
            })
        );

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
        this.optionsPopupContent[0].active = false;

        this.optionsPopupContent.map((option) => {
            if (option.text !== 'Columns') {
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
    onOptions(action: any) {
        if (
            (action.text === 'Unlock table' || action.text === 'Lock table') &&
            this.selectedViewMode === 'List'
        ) {
            action.active = !action.active;

            this.tableLocked = !this.tableLocked;

            this.optionsPopupContent[1].text = this.tableLocked
                ? 'Unlock table'
                : 'Lock table';

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
        } else if (action.text === 'Columns') {
            action.active = !action.active;

            this.checkAreAllSelectedInGroup();

            this.optionsPopupContent.map((option) => {
                if (option.text !== 'Columns') {
                    option.hide = action.active;
                }

                return option;
            });
        } else if (
            action.text === 'Reset Table' &&
            !this.optionsPopupContent[2].isInactive
        ) {
            this.onShowOptions(this.optionsPopup);

            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: 'small' },
                {
                    template: '',
                    type: 'delete',
                }
            );
        }
    }

    // Check Are All Selected In Group
    checkAreAllSelectedInGroup() {
        this.columnsOptionsWithGroups = this.columnsOptionsWithGroups.map(
            (columns) => {
                if (columns.isGroup) {
                    let numOfSelected = 0;

                    columns.group.map((c) => {
                        if (!c.hidden) {
                            numOfSelected++;
                        }
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
    onResetTable() {
        this.tableReseting = true;

        localStorage.removeItem(
            `table-${this.tableConfigurationType}-Configuration`
        );

        this.tableService
            .sendTableConfig({
                tableType: this.tableConfigurationType,
                config: null,
            })
            .subscribe(() => {});

        this.tableService.sendResetColumns(true);
    }

    // Toaggle Column
    onToaggleColumn(column: any, index: number) {
        clearTimeout(this.timeOutToaggleColumn);

        this.timeOutToaggleColumn = setTimeout(() => {
            if (!column.isPined) {
                column.hidden = !column.hidden;

                this.setTableConfig(column, index);
            }
        }, 10);
    }

    // Open Column Grop Dropdown
    openColumnsGroupDropdown(index: number) {
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
    onToaggleAllInGroup(i: number) {
        const columnsOptionsWithGroups = [...this.columnsOptionsWithGroups];
        const tableColumns = [...this.columns];

        columnsOptionsWithGroups[i] = {
            ...columnsOptionsWithGroups[i],
            areAllActive: columnsOptionsWithGroups[i].areSomeSelected
                ? false
                : !columnsOptionsWithGroups[i].areAllActive,
            areSomeSelected: !columnsOptionsWithGroups[i].areSomeSelected,
        };

        columnsOptionsWithGroups[i].group.map((c) => {
            if (!c.isPined) {
                c.hidden = columnsOptionsWithGroups[i].areAllActive
                    ? false
                    : true;

                tableColumns.filter((column, index) => {
                    if (column.title === c.title) {
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
    onToaggleGroupColumn(columnGroup: any, index: number) {
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
    setTableConfig(column: any, index: number) {
        let newColumns = [...this.columns];

        newColumns = newColumns.map((c) => {
            if (c.title === column.title) {
                c = column;
            }

            return c;
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
