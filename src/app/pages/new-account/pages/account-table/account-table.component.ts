import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NewAccountModalComponent } from '@pages/new-account/components/new-account-modal/new-account-modal.component';

// Services
import { AccountStoreService } from '@pages/new-account/state/services/account-store.service';
import { ModalService } from '@shared/services';

// Enums
import { eSize } from '@shared/enums';

// Components
import { NewTableComponent } from '@shared/components/new-table/new-table.component';
import {
    CaCheckboxComponent,
    CaCheckboxSelectedCountComponent,
} from 'ca-components';
import { AccountHelper } from '@pages/new-account/utils/helpers';

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
    constructor(
        public accountStore: AccountStoreService,
        private modalService: ModalService
    ) {}

    public onCheckboxCountClick(action: string): void {
        this.accountStore.dispatchSelectAll(action);
    }

    public onSelectAccount(userId: number): void {
        this.accountStore.dispatchSelectAccount(userId);
    }

    public onShowMoreClick(): void {
        this.accountStore.getNewPage();
    }

    public onOpenEditModal(id: number): void {
        this.modalService.openModal(
            NewAccountModalComponent,
            {
                size: eSize.MEDIUM_LOWERCASE,
            },
            {
                id,
                isEdit: true,
            }
        );
    }
}
