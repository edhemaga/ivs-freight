import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-dispatch',
    templateUrl: './dispatch.component.html',
    styleUrls: ['./dispatch.component.scss'],
})
export class DispatchComponent implements OnInit {
    tableOptions: any = {};
    tableData: any[] = [];
    selectedTab = 'active';
    columns: any[] = [];
    tableContainerWidth: number = 0;
    constructor() {}

    ngOnInit(): void {
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
