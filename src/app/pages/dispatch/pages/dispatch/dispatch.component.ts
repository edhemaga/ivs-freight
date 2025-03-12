import {
    Component,
    OnInit,
    AfterViewInit,
    ChangeDetectorRef,
    ViewEncapsulation,
    OnChanges,
    OnDestroy,
} from '@angular/core';

import { Observable, Subject, takeUntil } from 'rxjs';

// services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { DispatcherService } from '@pages/dispatch/services/dispatcher.service';
import { ModalService } from '@shared/services/modal.service';
import { CaSearchMultipleStatesService, eFilterDropdownEnum } from 'ca-components';

// decorators
import { Titles } from '@core/decorators/titles.decorator';

// store
import { DispatcherQuery } from '@pages/dispatch/state/dispatcher.query';

// enums
import { DispatchTableStringEnum } from '@pages/dispatch/pages/dispatch/components/dispatch-table/enums';
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { ToolbarFilterStringEnum } from '@shared/components/ta-filter/enums/toolbar-filter-string.enum';

// models
import { DispatchColumn } from '@pages/dispatch/pages/dispatch/components/dispatch-table/models';

// constants
import { TableDropdownComponentConstants } from '@shared/utils/constants/table-dropdown-component.constants';
import { DispatchSortDirectionsConstants } from './components/dispatch-table/utils/constants/dispatch-sort-directions.constants';

// helpers
import { AvatarColorsHelper } from '@shared/utils/helpers/avatar-colors.helper';
import { DispatchSortByPropertyHelper } from './components/dispatch-table/utils/helpers/dispatch-sort-by-property.helper';

// components
import { DispatchAssignLoadModalComponent } from '@pages/dispatch/pages/dispatch/components/dispatch-table/components/dispatch-modals/dispatch-assign-load-modal/dispatch-assign-load-modal.component';
import { DispatchHistoryModalComponent } from '@pages/dispatch/pages/dispatch/components/dispatch-table/components/dispatch-modals/dispatch-history-modal/dispatch-history-modal.component';
import { getDispatchColumnDefinition } from '@shared/utils/settings/table-settings/dispatch-columns';

@Titles()
@Component({
    selector: 'app-dispatch',
    templateUrl: './dispatch.component.html',
    styleUrls: ['./dispatch.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class DispatchComponent
    implements OnInit, AfterViewInit, OnChanges, OnDestroy
{
    private destroy$ = new Subject<void>();

    public userId: number;

    private resizeObserver: ResizeObserver;

    public activeViewMode: string = DispatchTableStringEnum.BOARD_2;

    public maxToolbarWidth: number = 0;

    public isBoardLocked = true;

    public isAllBoardsList: boolean = false;

    public backFilterQuery = JSON.parse(
        JSON.stringify(TableDropdownComponentConstants.DISPATCH_BACK_FILTER)
    );

    tableOptions: any = {};
    tableData: any[] = [];

    dispatchBoardSmallList: Observable<any>;
    dispatchTableList: Observable<number[]>;

    dispatcherItems: any[];
    columns: DispatchColumn[];

    selectedDispatcher;

    public isNoteExpanded: boolean = true;

    public sortBy: string = null;

    public sortDirection: string = '';

    private rotate = DispatchSortDirectionsConstants.sortDirectionsRotate;

    constructor(
        private cdRef: ChangeDetectorRef,

        // store
        private dispatcherQuery: DispatcherQuery,

        // services
        public dispatcherService: DispatcherService,
        private tableService: TruckassistTableService,
        private modalService: ModalService,
        private caSearchMultipleStatesService: CaSearchMultipleStatesService
    ) {}

    ngOnInit(): void {
        this.getUserId();

        this.getDispatchData();

        this.sendDispatchData();

        this.setTableFilter();

        this.search();

        this.getDispatchColumns();

        this.toggleColumns();

        this.resetColumnsSubscribe();
    }

    ngOnChanges() {}

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.observTableContainer();

            this.getToolbarWidth();
        }, 10);
    }

    public setTableFilter(): void {
        this.tableService.currentSetTableFilter
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res?.filterType) {
                    switch (res.filterType) {
                        case eFilterDropdownEnum.TRUCK_TYPE:
                            this.backFilterQuery.truckTypes = res.selectedIds;
                            break;

                        case eFilterDropdownEnum.TRAILER_TYPE:
                            this.backFilterQuery.trailerTypes = res.selectedIds;

                            break;
                        case eFilterDropdownEnum.STATUS:
                            this.backFilterQuery.statuses = res.selectedIds;
                            break;

                        case eFilterDropdownEnum.PARKING:
                            this.backFilterQuery.parkings = res.selectedIds;
                            break;

                        case ToolbarFilterStringEnum.LOCATION_FILTER:
                            this.backFilterQuery.longitude =
                                res.queryParams?.longValue;
                            this.backFilterQuery.latitude =
                                res.queryParams?.latValue;
                            this.backFilterQuery.distance =
                                res.queryParams?.rangeValue;
                            break;

                        case ToolbarFilterStringEnum.VACATION_FILTER:
                            this.backFilterQuery.vacation = res.vacation;
                            break;

                        default:
                            break;
                    }

                    this.dispatchFilters(this.backFilterQuery);
                }
            });
    }

    private getUserId(): void {
        this.userId = localStorage.getItem(TableStringEnum.USER_1)
            ? JSON.parse(localStorage.getItem(TableStringEnum.USER_1)).userId
            : null;
    }

    onToolBarAction(event: any) {
        switch (event.action) {
            case TableStringEnum.SELECT_ACTION:
                this.changeDisparcher(event.data);

                break;
            case DispatchTableStringEnum.STATUS_HISTORY_MODAL:
                this.openDispatchHistoryModal();

                break;
            case DispatchTableStringEnum.TOGGLE_LOCKED:
                this.isBoardLocked = !this.isBoardLocked;

                break;
            case DispatchTableStringEnum.OPEN_DISPATCH_LOAD_MODAL:
                this.openAssignLoadModal();

                break;
            case TableStringEnum.SORT:
                this.sortDetails(event);

                break;
            case TableStringEnum.COLUMN_TOGGLE:
                this.columns = this.columns.map((column: DispatchColumn) => {
                    if (column.field === event.column) {
                        return { ...column, hidden: true };
                    }
                    return column;
                });
                break;
            default:
                break;
        }
    }

    private openAssignLoadModal(): void {
        this.modalService.openModal(
            DispatchAssignLoadModalComponent,
            {
                size: TableStringEnum.SMALL,
            },
            {
                data: null,
                truck: null,
                driver: null,
                trailer: null,
            }
        );
    }

    private openDispatchHistoryModal(): void {
        this.modalService.openModal(DispatchHistoryModalComponent, {
            size: TableStringEnum.LARGE,
        });
    }

    getDispatcherData(result?) {
        this.dispatcherItems = JSON.parse(JSON.stringify(result));

        let fullDispatchCount = 0;

        this.dispatcherItems = this.dispatcherItems.map((item, index) => {
            fullDispatchCount += parseInt(item.dispatchCount);
            if (item.teamBoard) {
                item = {
                    ...item,
                    avatar: null,
                    name: DispatchTableStringEnum.TEAM_BOARD,
                };
            } else {
                item = {
                    ...item,
                    ...item.dispatcher,
                    name: item.dispatcher.fullName,
                    id: item.id,
                    avatarColor: AvatarColorsHelper.getAvatarColors(index),
                    shortName: item.dispatcher.fullName
                        .split(' ')
                        .map((part) => part.charAt(0).toUpperCase())
                        .join(''),
                };
            }

            delete item.dispatcher;

            return item;
        });

        this.dispatcherItems.unshift({
            dispatchCount: fullDispatchCount,
            id: -1,
            selected: true,
            avatar: null,
            name: DispatchTableStringEnum.ALL_BOARDS,
        });

        const selectedDispatcherId = localStorage.getItem(
            DispatchTableStringEnum.DISPATCH_USER_SELECT
        )
            ? JSON.parse(
                  localStorage.getItem(
                      DispatchTableStringEnum.DISPATCH_USER_SELECT
                  )
              ).id
            : -1;

        this.selectedDispatcher =
            this.dispatcherItems.find(
                (dispatcher) => dispatcher.id === selectedDispatcherId
            ) ?? this.dispatcherItems[0];

        if (!this.userId) this.getUserId();

        this.selectedDispatcher.canUnlock =
            this.selectedDispatcher.name ===
                DispatchTableStringEnum.TEAM_BOARD ||
            this.selectedDispatcher?.userId === this.userId
                ? true
                : false;

        this.initTableOptions();
    }

    sortDetails(e: any) {
        this.sortDirection =
            this.sortBy !== e.sortBy ? 'desc' : this.rotate[this.sortDirection];

        DispatchSortByPropertyHelper.sortByProperty(
            e.list.dispatches,
            e.column,
            e.sortBy,
            this.sortDirection
        );

        this.sortBy = e.sortBy;
    }

    private toggleColumns(): void {
        this.tableService.currentToaggleColumn
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
                if (response?.column) {
                    this.columns = this.columns.map((col) => {
                        if (col.field === response.column.field) {
                            col.hidden = response.column.hidden;
                        }
                        return col;
                    });

                    localStorage.setItem(
                        DispatchTableStringEnum.DISPATCH_TABLE_CONFIG,
                        JSON.stringify(this.columns)
                    );
                }
            });
    }

    initTableOptions(): void {
        this.tableOptions = {
            toolbarActions: {
                showTruckDispatchFilter:
                    !!this.selectedDispatcher?.dispatchCount,
                showTrailerDispatchFilter:
                    !!this.selectedDispatcher?.dispatchCount,
                showParkingFilter: !!this.selectedDispatcher?.dispatchCount,
                hideOpenModalButton: true,
                showStatusDispatchFilter:
                    !!this.selectedDispatcher?.dispatchCount,
                showLocationFilter: !!this.selectedDispatcher?.dispatchCount,
                showDispatchVacationFilter:
                    !!this.selectedDispatcher?.dispatchCount,
                showDispatchAdd: true,
                disableSearch: !this.selectedDispatcher?.dispatchCount,
                hideListColumn: true,
                showDispatchSettings: true,
                showDropdown: true,
                hideDataCount: true,
                filtersOrder: {
                    truck: 1,
                    trailer: 2,
                    parking: 3,
                    vacation: 4,
                    location: 5,
                    status: 6,
                },
                viewModeOptions: [
                    {
                        name: DispatchTableStringEnum.BOARD,
                        active:
                            this.activeViewMode ===
                            DispatchTableStringEnum.BOARD_2,
                    },
                ],
            },
        };
    }

    getToolbarWidth() {
        const tableContainer = document.querySelector(
            TableStringEnum.TABLE_CONTAINER
        );

        this.maxToolbarWidth = tableContainer.clientWidth;
        this.cdRef.detectChanges();
    }

    observTableContainer() {
        this.resizeObserver = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                this.tableService.sendCurrentSetTableWidth(
                    entry.contentRect.width
                );
            });
        });

        this.resizeObserver.observe(
            document.querySelector(TableStringEnum.TABLE_CONTAINER)
        );
    }

    changeDisparcher(dispatcher) {
        const dispatcherId = dispatcher.id;
        if (dispatcherId > -1) {
            this.dispatcherService.getDispatchBoardByDispatcherListAndUpdate(
                dispatcherId
            );
        } else {
            this.dispatcherService.getDispatchboardAllListAndUpdate();
        }

        this.selectedDispatcher = dispatcher;
        this.selectedDispatcher.canUnlock =
            dispatcher.name === DispatchTableStringEnum.TEAM_BOARD ||
            dispatcher?.userId === this.userId
                ? true
                : false;

        this.isBoardLocked = true;

        this.initTableOptions();

        localStorage.setItem(
            DispatchTableStringEnum.DISPATCH_USER_SELECT,
            JSON.stringify(this.selectedDispatcher)
        );
    }

    sendDispatchData() {
        this.initTableOptions();
        this.tableData = [
            {
                title: DispatchTableStringEnum.TEAM_BOARD,
                field: TableStringEnum.ACTIVE,
                length: 0,
                data: [],
                gridNameTitle: DispatchTableStringEnum.DISPATCH,
                type: DispatchTableStringEnum.DROPDOWN,
                template: DispatchTableStringEnum.LOAD_DISPATCHER,
                actionType: DispatchTableStringEnum.DISPATCHER,
                selectedDispatcher: this.selectedDispatcher,
                isActive: true,
                dropdownData: this.dispatcherItems,
            },
        ];
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private dispatchFilters(filter: {
        dispatcherId: number;
        teamBoard: number;
        truckTypes?: number[] | undefined;
        trailerTypes?: number[] | undefined;
        statuses?: number[] | undefined;
        parkings?: number[] | undefined;
        vacation?: boolean | undefined;
        search?: string | undefined;
        longitude?: number | undefined;
        latitude?: number | undefined;
        distance?: number | undefined;
    }): void {
        this.dispatcherService
            .getDispatchBoardFilterList(
                filter.dispatcherId,
                filter.teamBoard,
                filter.truckTypes,
                filter.trailerTypes,
                filter.statuses,
                filter.parkings,
                filter.vacation,
                filter.search,
                filter.longitude,
                filter.latitude,
                filter.distance
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe((dispatchers) => {
                let dispatchersList = {
                    ...dispatchers,
                };

                if (
                    this.selectedDispatcher?.name !==
                    DispatchTableStringEnum.ALL_BOARDS
                ) {
                    const currentDispatcher = dispatchers.dispatchBoards.find(
                        (item) => item.id === this.selectedDispatcher.id
                    );
                    dispatchersList = {
                        ...dispatchers,
                        dispatchBoards: [currentDispatcher],
                    };
                }

                this.dispatcherService.dispatchList = dispatchersList;
            });
    }

    private search(): void {
        this.caSearchMultipleStatesService.currentSearchTableData
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) {
                    this.backFilterQuery.search = res.search;
                    this.dispatchFilters(this.backFilterQuery);
                }
            });
    }

    public toggleNote(isNoteExpanded: boolean): void {
        this.isNoteExpanded = isNoteExpanded;
    }

    // Reset Columns
    public resetColumnsSubscribe(): void {
        this.tableService.currentResetColumns
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: boolean) => {
                if (response) {
                    this.columns = getDispatchColumnDefinition();

                    localStorage.setItem(
                        DispatchTableStringEnum.DISPATCH_TABLE_CONFIG,
                        JSON.stringify(this.columns)
                    );
                }
            });
    }

    public getDispatchColumns(): void {
        this.columns = localStorage.getItem(
            DispatchTableStringEnum.DISPATCH_TABLE_CONFIG
        )
            ? JSON.parse(
                  localStorage.getItem(
                      DispatchTableStringEnum.DISPATCH_TABLE_CONFIG
                  )
              )
            : getDispatchColumnDefinition();
    }

    public getDispatchData(): void {
        this.dispatcherQuery.modalBoardListData$
            .pipe(takeUntil(this.destroy$))
            .subscribe((result) => {
                this.getDispatcherData(result.dispatchBoards);
            });

        this.dispatchTableList = this.dispatcherQuery.dispatchBoardListData$;

        this.dispatcherQuery.dispatchBoardListData$
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.isAllBoardsList =
                    this.selectedDispatcher?.name ===
                    DispatchTableStringEnum.ALL_BOARDS;
            });

        this.dispatchBoardSmallList =
            this.dispatcherQuery.dispatchboardShortList$;
    }
}
