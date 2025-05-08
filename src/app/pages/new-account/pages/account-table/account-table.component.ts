import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

// Services
import { AccountStoreService } from '@pages/new-account/state/services/account-store.service';

// Components
import { NewTableComponent } from '@shared/components/new-table/new-table.component';
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
    ],
})
export class AccountTableComponent {
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
