import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { eDateTimeFormat, eDropdownMenu } from '@shared/enums';

// Services
import { AccountStoreService } from '@pages/new-account/state/services/account-store.service';

// Components
import { NewTableComponent } from '@shared/components/new-table/new-table.component';
import { TableHighlightSearchTextPipe } from '@shared/components/new-table/pipes';
import { TaInputDropdownLabelComponent } from '@shared/components/ta-input-dropdown-label/ta-input-dropdown-label.component';
import { TaPasswordAccountHiddenCharactersComponent } from '@shared/components/ta-password-account-hidden-characters/ta-password-account-hidden-characters.component';
import {
    CaCheckboxComponent,
    CaCheckboxSelectedCountComponent,
} from 'ca-components';

@Component({
    selector: 'app-account-table',
    templateUrl: './account-table.component.html',
    styleUrl: './account-table.component.scss',
    standalone: true,
    imports: [
        CommonModule,

        // Components
        NewTableComponent,
        CaCheckboxComponent,
        CaCheckboxSelectedCountComponent,
        TaPasswordAccountHiddenCharactersComponent,
        TaInputDropdownLabelComponent,

        // Pipes
        TableHighlightSearchTextPipe,
    ],
})
export class AccountTableComponent {
    public eDateTimeFormat = eDateTimeFormat;
    public eDropdownMenu = eDropdownMenu;

    constructor(public accountStore: AccountStoreService) {}

    public onCheckboxCountClick(action: string): void {
        console.log(action);
        this.accountStore.dispatchSelectAll(action);
    }

    public onSelectAccount(userId: number): void {
        this.accountStore.dispatchSelectAccount(userId);
    }

    public onShowMoreClick(): void {
        this.accountStore.getNewPage();
    }

    public openEditModal(accountId: number): void {
        this.accountStore.dispatchOpenUserModal(true, accountId);
    }
}
