// External Libraries
import { CommonModule } from '@angular/common';
import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    TemplateRef,
} from '@angular/core';

// Shared Components
import { ToolbarTabsComponent } from '@shared/components/new-table-toolbar/components/toolbar-tabs/toolbar-tabs.component';

// Enums
import { TableStringEnum, eToolbarVariant } from '@shared/enums';
import { eActiveViewMode } from '@shared/enums';

// Models
import { ITableData, TableToolbarActions } from '@shared/models';

// Shared Utils
import { TableViewHelper } from '@shared/utils/helpers';

@Component({
    selector: 'app-toolbar-tabs-wrapper',
    imports: [CommonModule, ToolbarTabsComponent],
    templateUrl: './toolbar-tabs-wrapper.component.html',
    styleUrl: './toolbar-tabs-wrapper.component.scss',
    standalone: true,
})
export class ToolbarTabsWrapperComponent implements OnInit {
    @Input() viewMode = eActiveViewMode.List;
    @Input() data: ITableData[];
    @Input() selectedTab: ITableData;
    @Input() shouldAddMap: boolean = false;
    @Input() betweenTabsTemplate: TemplateRef<any>;

    @Output() onTabChange = new EventEmitter<TableToolbarActions>();

    public tableStringEnum = TableStringEnum;
    public toolbarVariant = eToolbarVariant;
    public tableViewData = [];

    ngOnInit() {
        this.tableViewData = TableViewHelper.createTableViewConts(
            this.shouldAddMap
        );
    }

    public onToolBarAction(event: TableToolbarActions) {
        this.onTabChange.emit(event);
    }
}
