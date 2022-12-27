import { Component, OnInit, AfterViewInit, SimpleChanges, Input, ChangeDetectorRef, DoCheck, ViewEncapsulation } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Titles } from 'src/app/core/utils/application.decorators';
import { DispatcherQuery } from '../state/dispatcher.query';
import { DispatcherStoreService } from '../state/dispatcher.service';

@Titles()
@Component({
    selector: 'app-dispatch',
    templateUrl: './dispatch.component.html',
    styleUrls: ['./dispatch.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class DispatchComponent implements OnInit, AfterViewInit, DoCheck {
    @Input() test: any = "test";
    tableOptions: any = {};
    tableData: any[] = [];
    selectedTab = 'active';
    columns: any[] = [];
    tableContainerWidth: number = 0;
    dispatchBoardSmallList: Observable<any>;
    dispatchTableList: Observable<number[]>;
    resizeObserver: ResizeObserver;
    private destroy$ = new Subject<void>();
    dispatcherItems: any[];
    isBoardLocked = true;

    selectedDispatcher = localStorage.getItem('dispatchUserSelect') ? JSON.parse(localStorage.getItem('dispatchUserSelect')) : -1;

    constructor(
        private dispatcherQuery: DispatcherQuery,
        public dispatcherStoreService: DispatcherStoreService,
        private cd: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        setTimeout(() => {
            this.test = "333";
            this.cd.detectChanges();
        }, 5000);
        this.dispatcherQuery.modalBoardListData$
            .pipe(takeUntil(this.destroy$))
            .subscribe((result) => {
                this.getDispatcherData(result.dispatchBoards);
            });
        this.dispatchTableList = this.dispatcherQuery.dispatchBoardListData$;
        this.dispatchBoardSmallList =
            this.dispatcherQuery.dispatchboardShortList$;
        this.sendDispatchData();
    }

    onToolBarAction(event: any) {
        switch (event.action) {
            case 'select-action':
                this.changeDisparcher(event.data);
                break;
            case 'toggle-locked': 
                this.isBoardLocked = !this.isBoardLocked;
            break;
        }
    }

    getDispatcherData(result?) {
        this.dispatcherItems = JSON.parse(JSON.stringify(result));

        let fullDispatchCount = 0;
        this.dispatcherItems = this.dispatcherItems.map((item) => {
            fullDispatchCount += parseInt(item.dispatchCount);
            if (item.teamBoard) {
                item = {
                    ...item,
                    avatar: null,
                    name: 'Team Board',
                };
            } else {
                item = {
                    ...item,
                    ...item.dispatcher,
                    name: item.dispatcher.fullName,
                    id: item.id,
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
            name: 'All Boards',
        });
    }

    initTableOptions(): void {
        this.tableOptions = {
            toolbarActions: {
                showTruckFilter: true,
                showTrailerFilter: true,
                hideOpenModalButton: true,
                showDispatchAdd: true,
                hideListColumn: true,
                showDispatchSettings: true
            },
        };
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.observTableContainer();
        }, 10);
    }

    observTableContainer() {
        this.resizeObserver = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                this.tableContainerWidth = entry.contentRect.width;
            });
        });

        this.resizeObserver.observe(document.querySelector('.table-container'));
    }

    changeDisparcher(dispatcher: { id: number }) {
        const dispatcherId = dispatcher.id;
        if (dispatcherId > -1) {
            this.dispatcherStoreService.getDispatchBoardByDispatcherListAndUpdate(
                dispatcherId
            );
        } else {
            this.dispatcherStoreService.getDispatchboardAllListAndUpdate();
        }

        this.selectedDispatcher = dispatcher;
        localStorage.setItem('dispatchUserSelect', JSON.stringify(dispatcher));
    }

    sendDispatchData() {
        this.initTableOptions();
        this.tableData = [
            {
                title: 'Team Board',
                field: 'active',
                length: 0,
                data: [],
                gridNameTitle: 'Dispatch Board',
                type: 'dropdown',
                template: 'load-dispatcher',
                actionType: 'dispatcher',
                selectedDispatcher: this.dispatcherItems[0],
                dropdownData: this.dispatcherItems,
                inputConfig: {
                    name: 'Input Dropdown',
                    type: 'text',
                    label: 'Dispatcher',
                    isDropdown: true,
                    placeholderInsteadOfLabel: true,
                    dropdownImageInput: {
                        withText: true,
                        svg: false,
                        image: true,
                        template: 'user',
                    },
                    textTransform: 'capitalize',
                    dropdownWidthClass: 'w-col-192',
                },
            },
            {
                title: 'Active Load',
                field: 'active',
                selected: true,
                tableConfiguration: 'ACTIVE-DISPATCHER',
                length: 0,
                data: [],
                gridNameTitle: 'Dispatch Board',
                isActive: this.selectedTab === 'active',
            },
            {
                title: 'Dispatch History',
                field: 'inactive',
                tableConfiguration: 'DISPATCH-HISTORY',
                length: 0,
                data: [],
                isActive: this.selectedTab === 'history',
                gridNameTitle: 'Dispatch Board',
            },
        ];
    }

    ngDoCheck(): void {
    }

    ngOnChanges(){

    }
}
