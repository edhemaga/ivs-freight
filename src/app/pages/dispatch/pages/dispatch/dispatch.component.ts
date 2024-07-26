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

// decorators
import { Titles } from '@core/decorators/titles.decorator';

// store
import { DispatcherQuery } from '@pages/dispatch/state/dispatcher.query';

// enums
import { DispatchTableStringEnum } from '@pages/dispatch/pages/dispatch/components/dispatch-table/enums/dispatch-table-string.enum';
import { TableStringEnum } from '@shared/enums/table-string.enum';

// helpers
import { AvatarColorsHelper } from '@shared/utils/helpers/avatar-colors.helper';

// components
import { AssignDispatchLoadModalComponent } from '@pages/dispatch/pages/dispatch/components/dispatch-table/components/dispatch-modals/assign-dispatch-load-modal/assign-dispatch-load-modal.component';

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

    tableOptions: any = {};
    tableData: any[] = [];

    dispatchBoardSmallList: Observable<any>;
    dispatchTableList: Observable<number[]>;

    dispatcherItems: any[];

    selectedDispatcher;

    constructor(
        private cdRef: ChangeDetectorRef,

        // store
        private dispatcherQuery: DispatcherQuery,

        // Services
        public dispatcherService: DispatcherService,
        private tableService: TruckassistTableService,
        private modalService: ModalService
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

        this.getUserId();
    }

    ngOnChanges() {}

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.observTableContainer();

            this.getToolbarWidth();
        }, 10);
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
                this.modalService.openModal(AssignDispatchLoadModalComponent, {
                    size: TableStringEnum.LARGE,
                });

                break;
            case DispatchTableStringEnum.TOGGLE_LOCKED:
                this.isBoardLocked = !this.isBoardLocked;

                break;

            default:
                break;
            case DispatchTableStringEnum.OPEN_DISPATCH_LOAD_MODAL:
                this.openAssignLoadModal();
                break;
        }
    }

    public openAssignLoadModal(): void {
        this.modalService.openModal(
            AssignDispatchLoadModalComponent,
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
                showTruckFilter: true,
                showTrailerFilter: true,
                hideOpenModalButton: true,
                showStatusFilter: true,
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
}
