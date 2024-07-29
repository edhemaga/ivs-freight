import {
    Component,
    OnInit,
    AfterViewInit,
    ChangeDetectorRef,
    ViewEncapsulation,
    OnChanges,
} from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';

// Services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { DispatcherService } from '@pages/dispatch/services/dispatcher.service';

// Decorators
import { Titles } from '@core/decorators/titles.decorator';

// Store
import { DispatcherQuery } from '@pages/dispatch/state/dispatcher.query';

// Enums
import { DispatchTableStringEnum } from '@pages/dispatch/pages/dispatch/components/dispatch-table/enums/dispatch-table-string.enum';
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { ToolbarFilterStringEnum } from '@shared/components/ta-filter/enums/toolbar-filter-string.enum';

//constants
import { TableDropdownComponentConstants } from '@shared/utils/constants/table-dropdown-component.constants';

//helpers
import { AvatarColorsHelper } from '@shared/utils/helpers/avatar-colors.helper';

@Titles()
@Component({
    selector: 'app-dispatch',
    templateUrl: './dispatch.component.html',
    styleUrls: ['./dispatch.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class DispatchComponent implements OnInit, AfterViewInit, OnChanges {
    tableOptions: any = {};
    tableData: any[] = [];
    public activeViewMode: string = DispatchTableStringEnum.BOARD_2;
    public backFilterQuery = JSON.parse(
        JSON.stringify(TableDropdownComponentConstants.DISPATCH_BACK_FILTER)
    );
    selectedTab = 'active';
    columns: any[] = [];
    dispatchBoardSmallList: Observable<any>;
    dispatchTableList: Observable<number[]>;
    resizeObserver: ResizeObserver;
    private destroy$ = new Subject<void>();
    dispatcherItems: any[];
    isBoardLocked = true;
    maxToolbarWidth: number = 0;

    selectedDispatcher;

    public user = localStorage.getItem(TableStringEnum.USER_1)
        ? JSON.parse(localStorage.getItem(TableStringEnum.USER_1)).userId
        : null;

    constructor(
        private cd: ChangeDetectorRef,

        // Store
        private dispatcherQuery: DispatcherQuery,

        // Services
        public dispatcherService: DispatcherService,
        private tableService: TruckassistTableService
    ) {}

    ngOnInit(): void {
        this.dispatcherQuery.modalBoardListData$
            .pipe(takeUntil(this.destroy$))
            .subscribe((result) => {
                this.getDispatcherData(result.dispatchBoards);
            });
        this.dispatchTableList = this.dispatcherQuery.dispatchBoardListData$;
        this.dispatchBoardSmallList =
            this.dispatcherQuery.dispatchboardShortList$;
        this.sendDispatchData();

        this.setTableFilter();
    }

    public setTableFilter(): void {
        this.tableService.currentSetTableFilter
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res?.filterType) {
                    if (
                        res.filterType === ToolbarFilterStringEnum.TRUCK_FILTER
                    ) {
                        this.backFilterQuery.truckTypes = res.queryParams;
                        this.dispatchFilters(this.backFilterQuery);
                    }
                    if (
                        res.filterType ===
                        ToolbarFilterStringEnum.TRAILER_FILTER
                    ) {
                        this.backFilterQuery.trailerTypes = res.queryParams;
                        this.dispatchFilters(this.backFilterQuery);
                    }
                    if (
                        res.filterType === ToolbarFilterStringEnum.STATUS_FILTER
                    ) {
                        this.backFilterQuery.statuses = res.queryParams;
                        this.dispatchFilters(this.backFilterQuery);
                    }
                    if (
                        res.filterType ===
                        ToolbarFilterStringEnum.PARKING_FILTER
                    ) {
                        this.backFilterQuery.parkings = res.queryParams;
                        this.dispatchFilters(this.backFilterQuery);
                    }

                    if (res.action === TableStringEnum.CLEAR)
                        this.dispatchTableList = this.dispatchTableList;
                }
            });
    }

    onToolBarAction(event: any) {
        switch (event.action) {
            case TableStringEnum.SELECT_ACTION:
                this.changeDisparcher(event.data);
                break;
            case DispatchTableStringEnum.TOGGLE_LOCKED:
                this.isBoardLocked = !this.isBoardLocked;
                break;
        }
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

        this.selectedDispatcher = localStorage.getItem(
            DispatchTableStringEnum.DISPATCH_USER_SELECT
        )
            ? JSON.parse(
                  localStorage.getItem(
                      DispatchTableStringEnum.DISPATCH_USER_SELECT
                  )
              )
            : this.dispatcherItems[0];
    }

    initTableOptions(): void {
        this.tableOptions = {
            toolbarActions: {
                showTruckDispatchFilter: true,
                showTrailerDispatchFilter: true,
                showParkingFilter: true,
                hideOpenModalButton: true,
                showStatusDispatchFilter: true,
                showLocationFilter: true,
                showDispatchAdd: true,
                hideListColumn: true,
                showDispatchSettings: true,
                showDropdown: true,
                hideDataCount: true,
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

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.observTableContainer();
            this.getToolbarWidth();
        }, 10);
    }

    getToolbarWidth() {
        const tableContainer = document.querySelector(
            TableStringEnum.TABLE_CONTAINER
        );

        this.maxToolbarWidth = tableContainer.clientWidth;
        this.cd.detectChanges();
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
            dispatcher?.userId === this.user
                ? true
                : false;
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

    ngOnChanges() {}

    private dispatchFilters(filter: {
        dispatcherId: number;
        teamBoard: number;
        truckTypes?: number[] | undefined;
        trailerTypes?: number[] | undefined;
        statuses?: number[] | undefined;
        parkings?: number[] | undefined;
    }): void {
        this.dispatcherService
            .getDispatchBoardFilterList(
                filter.dispatcherId,
                filter.teamBoard,
                filter.truckTypes,
                filter.trailerTypes,
                filter.statuses,
                filter.parkings
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe((dispatchers) => {
                this.dispatcherService.dispatchList = dispatchers;
                this.backFilterQuery = JSON.parse(
                    JSON.stringify(
                        TableDropdownComponentConstants.DISPATCH_BACK_FILTER
                    )
                );
            });
    }
}
