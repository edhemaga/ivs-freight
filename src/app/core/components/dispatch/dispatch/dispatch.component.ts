import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
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
    
    constructor(private dispatcherQuery: DispatcherQuery) {}

    ngOnInit(): void {
        this.dispatchTableList = this.dispatcherQuery.dispatchBoardListData$;
        this.dispatchBoardSmallList =
            this.dispatcherQuery.dispatchboardShortList$;
        this.sendDispatchData();
    }

    onToolBarAction(event: any) {}

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
            },
            {
                title: 'Active Load',
                field: 'inactive',
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
