// External Libraries
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

// Shared Components
import { ToolbarTabsComponent } from '../toolbar-tabs/toolbar-tabs.component';

// Enums 
import { TableStringEnum, ToolbarVariant } from '@shared/enums'; 
import { eActiveViewMode } from '@shared/enums';

// Models
import { ITableData, TableToolbarActions } from '@shared/models';

// Shared Utils
import { createTableViewConts } from '@shared/utils/constants';


@Component({
    selector: 'app-toolbar-tabs-wrapper',
    standalone: true,
    imports: [CommonModule, ToolbarTabsComponent],
    templateUrl: './toolbar-tabs-wrapper.component.html',
    styleUrl: './toolbar-tabs-wrapper.component.scss',
})
export class ToolbarTabsWrapperComponent implements OnInit {
    @Input() viewMode = eActiveViewMode.List;
    @Input() data: ITableData[];
    @Input() selectedTab: ITableData;
    @Input() shouldAddMap: boolean = false;
    
    @Output() onTabChange = new EventEmitter<TableToolbarActions>();

    public tableStringEnum = TableStringEnum;
    public toolbarVariant = ToolbarVariant;
    public tableViewData = [];

    ngOnInit() {
        this.tableViewData = createTableViewConts(this.shouldAddMap);
    }

    public onToolBarAction(event: TableToolbarActions) {
        this.onTabChange.emit(event);
    }
}
