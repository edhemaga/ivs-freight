import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

// Enums
import { eLoadStatusType } from '@pages/load/pages/load-table/enums';
import {
    eActiveViewMode,
    eGeneralActions,
    TableStringEnum,
} from '@shared/enums';

// Models
import { IGetLoadListParam } from '@pages/load/pages/load-table/models';
import { TableToolbarActions } from '@shared/models';

// Services
import { LoadStoreService } from '@pages/load/pages/load-table/services/load-store.service';

// Components
import { ToolbarTabsWrapperComponent } from '@shared/components/new-table-toolbar/components/toolbar-tabs-wrapper/toolbar-tabs-wrapper.component';
import { NewTableToolbarComponent } from '@shared/components/new-table-toolbar/new-table-toolbar.component';
import {
    CaFilterComponent,
    CaFilterListDropdownComponent,
    CaFilterTimeDropdownComponent,
} from 'ca-components';
import { NewLoadCardsComponent } from '@pages/new-load/pages/new-load-cards/new-load-cards.component';
import { NewLoadTableComponent } from '@pages/new-load/pages/new-load-table/new-load-table.component';
// Constants
import { TableDropdownComponentConstants } from '@shared/utils/constants';

@Component({
    selector: 'app-new-load',
    templateUrl: './new-load.component.html',
    styleUrl: './new-load.component.scss',
    standalone: true,
    imports: [
        CommonModule,

        // Components
        NewTableToolbarComponent,
        NewLoadCardsComponent,
        NewLoadTableComponent,
        ToolbarTabsWrapperComponent,
        CaFilterComponent,
        CaFilterTimeDropdownComponent,
        CaFilterListDropdownComponent,
    ],
})
export class NewLoadComponent {
    public selectedTab: string = TableStringEnum.ACTIVE_2;
    public generalActions = eGeneralActions;
    private filter: IGetLoadListParam = TableDropdownComponentConstants.FILTER;

    constructor(protected loadStoreService: LoadStoreService) {}

    public onToolBarAction(event: TableToolbarActions): void {
        if (!event) return;

        const { action, mode } = event;

        switch (action) {
            case eGeneralActions.OPEN_MODAL:
                this.handleOpenModal();
                break;

            case eGeneralActions.TAB_SELECTED:
                this.handleTabSelected(mode);
                break;

            case eGeneralActions.VIEW_MODE:
                this.handleViewModeChange(mode);
                break;
        }
    }

    private handleOpenModal(): void {
        // TODO: Denis Implement modal opening logic
    }

    private handleTabSelected(mode: string): void {
        this.selectedTab = mode;
        this.resetFilters();
        this.getLoadStatusFilter();
    }

    private resetFilters(): void {
        this.filter = {
            statusType: eLoadStatusType[this.selectedTab],
            pageIndex: 1,
            pageSize: 25,
        };
    }

    private handleViewModeChange(mode: string): void {
        this.loadStoreService.dispatchSetActiveViewMode(eActiveViewMode[mode]);
    }

    private getLoadStatusFilter(): void {
        if (this.selectedTab === TableStringEnum.TEMPLATE_2) {
            this.loadStoreService.dispatchLoadTemplateList(this.filter);
        } else {
            this.loadStoreService.loadDispatchFilters({
                loadStatusType: this.selectedTab,
            });

            this.loadStoreService.dispatchGetList(
                this.filter,
                eLoadStatusType[this.selectedTab]
            );
        }
    }
}
