import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

// Enums
import { eColor, eDropdownMenu } from '@shared/enums';
import { eLoadStatusStringType } from '@pages/new-load/enums';

// base classes
import { LoadDropdownMenuActionsBase } from '@pages/load/base-classes';

// Components
import { CaDropdownMenuComponent, CaLoadStatusComponent } from 'ca-components';
import { NewTableComponent } from '@shared/components/new-table/new-table.component';

// Services
import { LoadStoreService } from '@pages/new-load/state/services/load-store.service';
import { ModalService } from '@shared/services';

// interfaces
import { IDropdownMenuOptionEmit } from '@ca-shared/components/ca-dropdown-menu/interfaces';

// helpers
import { DropdownMenuActionsHelper } from '@shared/utils/helpers/dropdown-menu-helpers';

@Component({
    selector: 'app-new-load-table',
    templateUrl: './new-load-table.component.html',
    styleUrl: './new-load-table.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        // Components
        NewTableComponent,
        CaLoadStatusComponent,
        CaDropdownMenuComponent,
    ],
})
export class NewLoadTableComponent extends LoadDropdownMenuActionsBase {
    public eColor = eColor;
    public eDropdownMenu = eDropdownMenu;

    constructor(
        protected router: Router,

        // services
        protected loadStoreService: LoadStoreService,
        protected modalService: ModalService
    ) {
        super();
    }

    public navigateToLoadDetails(id: number): void {
        this.loadStoreService.navigateToLoadDetails(id);
    }

    public onOpenModal(id: number, selectedTab: eLoadStatusStringType): void {
        const isTemplate = selectedTab === eLoadStatusStringType.TEMPLATE;

        this.loadStoreService.onOpenModal({
            id,
            isTemplate,
            isEdit: true,
        });
    }

    public onToggleDropdownMenuActions(
        action: IDropdownMenuOptionEmit,
        data,
        selectedTab
    ): void {
        const { type } = action;

        const tableAction =
            DropdownMenuActionsHelper.createDropdownMenuActionsEmitAction(
                type,
                data
            );

        this.handleDropdownMenuActions(
            tableAction,
            eDropdownMenu.LOAD,
            selectedTab
        );
    }
}
