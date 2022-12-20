import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { DispatcherQuery } from '../../dispatcher/state/dispatcher.query';

@Component({
    selector: 'app-dispatch',
    templateUrl: './dispatch.component.html',
    styleUrls: ['./dispatch.component.scss'],
})
export class DispatchComponent implements OnInit, AfterViewInit {
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

    constructor(private dispatcherQuery: DispatcherQuery) {}

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
    }

    onToolBarAction(event: any) {}

    getDispatcherData(result?) {
        this.dispatcherItems = JSON.parse(JSON.stringify(result));

        let fullDispatchCount = 0;
        this.dispatcherItems = this.dispatcherItems.map((item) => {
            fullDispatchCount += parseInt(item.dispatchCount);
            if (item.teamBoard) {
                item = {
                    ...item,
                    avatar: null,
                    name: 'Team Board'
                };
            }else{
                item = {
                    ...item,
                    ...item.dispatcher,
                    name: item.dispatcher.fullName
                }
            }

            delete item.dispatcher;

            return item;
        });

        this.dispatcherItems.unshift({
            dispatchCount: fullDispatchCount,
            id: -1,
            selected: true,
            avatar: null,
            name: 'All Boards'
        });

        console.log('WHAT IS DISPATCH ITEM`');
        console.log(this.dispatcherItems);
    }

    initTableOptions(): void {
        this.tableOptions = {
            toolbarActions: {
                showTruckFilter: true,
                showTrailerFilter: true,
                hideOpenModalButton: true,
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
                selected: true,
                length: 0,
                data: [],
                gridNameTitle: 'Dispatch Board',
            },
            {
                title: 'Dispatch History',
                field: 'inactive',
                length: 0,
                data: [],
                gridNameTitle: 'Dispatch Board',
            },
        ];
    }
}
