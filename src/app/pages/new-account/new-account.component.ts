import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import {
    eCommonElement,
    eDropdownMenuColumns,
    eGeneralActions,
    eSize,
    eStatusTab,
} from '@shared/enums';

// Services
import { AccountStoreService } from './state/services/account-store.service';
import { ModalService } from '@shared/services';

// Components
import { AccountTableComponent } from '@pages/new-account/pages/account-table/account-table.component';
import { ToolbarTabsWrapperComponent } from '@shared/components/new-table-toolbar/components/toolbar-tabs-wrapper/toolbar-tabs-wrapper.component';
import { NewTableToolbarComponent } from '@shared/components/new-table-toolbar/new-table-toolbar.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { SvgIconComponent } from 'angular-svg-icon';
import { NewAccountModalComponent } from './components/new-account-modal/new-account-modal.component';
import {
    CaCheckboxSelectedCountComponent,
    CaFilterListDropdownComponent,
    CaSearchMultipleStates2Component,
} from 'ca-components';

// Models
import { TableCardBodyActions, TableToolbarActions } from '@shared/models';

import { SharedSvgRoutes } from '@shared/utils/svg-routes';

@Component({
    selector: 'app-new-account',
    standalone: true,
    providers: [NgbActiveModal],

    imports: [
        CommonModule,
        AccountTableComponent,
        // Components
        NewTableToolbarComponent,
        ToolbarTabsWrapperComponent,
        CaSearchMultipleStates2Component,
        CaFilterListDropdownComponent,
        SvgIconComponent,
        CaCheckboxSelectedCountComponent,
        TaAppTooltipV2Component,
    ],
    templateUrl: './new-account.component.html',
    styleUrl: './new-account.component.scss',
})
export class NewAccountComponent {
    public eCommonElement = eCommonElement;
    public eStatusTab = eStatusTab;
    public generalActions = eGeneralActions;
    public sharedIcons = SharedSvgRoutes;

    constructor(
        public accountStoreService: AccountStoreService,
        private modalService: ModalService,
        private ngbActiveModal: NgbActiveModal
    ) {}

    private onViewModeChange(viewMode: string): void {
        this.accountStoreService.dispatchViewModeChange(
            viewMode as eCommonElement
        );
    }

    private setToolbarDropdownMenuColumnsActive(isActive: boolean): void {
        this.accountStoreService.dispatchSetToolbarDropdownMenuColumnsActive(
            isActive
        );
    }

    private toggleColumnVisibility(
        columnType: string,
        isChecked: boolean
    ): void {
        this.accountStoreService.dispatchToggleColumnsVisibility(
            columnType,
            isChecked
        );
    }

    // TODO Waiting for BE
    // public onDeleteAccountList(accounts: IMappedAccount[]): void {
    //     this.accountStoreService.dispatchDeleteAccounts(
    //         { accounts },
    //         this.ngbActiveModal
    //     );
    // }

    public onSearchQueryChange(query: string[]): void {
        this.accountStoreService.dispatchSearchChange(query);
    }

    public onToolBarAction(event: TableToolbarActions): void {
        if (!event) return;
        const { action, mode } = event;

        switch (action) {
            case eGeneralActions.OPEN_MODAL:
                this.modalService.openModal(
                    NewAccountModalComponent,
                    {
                        size: eSize.MEDIUM_LOWERCASE,
                    },
                    {
                        id: null,
                        isEdit: false,
                    }
                );
                break;

            case eGeneralActions.VIEW_MODE:
                this.onViewModeChange(mode);
                break;
        }
    }

    public onToolbarDropdownMenuActions<T>(action: TableCardBodyActions<T>) {
        const { type, isActive } = action;
        switch (type) {
            case eDropdownMenuColumns.OPEN_TYPE:
                break;
            case eDropdownMenuColumns.CLOSE_TYPE:
                this.setToolbarDropdownMenuColumnsActive(false);
                break;
            case eDropdownMenuColumns.COLUMNS_TYPE:
                this.setToolbarDropdownMenuColumnsActive(true);
                break;
            case eDropdownMenuColumns.COLUMNS_BACK_TYPE:
                this.setToolbarDropdownMenuColumnsActive(false);
                break;
            default:
                this.toggleColumnVisibility(type, isActive);
                break;
        }
    }
}
