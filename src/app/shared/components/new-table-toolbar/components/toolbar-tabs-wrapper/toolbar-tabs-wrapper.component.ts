import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToolbarTabsComponent } from '../toolbar-tabs/toolbar-tabs.component';
import { TableStringEnum, ToolbarVariant } from '@shared/enums';
import { ITableData, TableToolbarActions } from '@shared/models';
import { eActiveViewMode } from '@pages/load/pages/load-table/enums';
import { TableViewConts } from '@shared/utils/constants';

@Component({
    selector: 'app-toolbar-tabs-wrapper',
    standalone: true,
    imports: [CommonModule, ToolbarTabsComponent],
    templateUrl: './toolbar-tabs-wrapper.component.html',
    styleUrl: './toolbar-tabs-wrapper.component.scss',
})
export class ToolbarTabsWrapperComponent {
    @Input() viewMode = eActiveViewMode.List;
    @Input() data: ITableData[];
    @Input() selectedTab: ITableData;
    @Output() onTabChange = new EventEmitter<TableToolbarActions>();

    public tableStringEnum = TableStringEnum;
    public toolbarVariant = ToolbarVariant;
    public tableViewData = TableViewConts;

    public onToolBarAction(event: TableToolbarActions) {
        this.onTabChange.emit(event);
    }
}
