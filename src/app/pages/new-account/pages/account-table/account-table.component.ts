import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

// Services
import { AccountStoreService } from '@pages/new-account/state/services/account-store.service';

// Components
import { NewTableComponent } from '@shared/components/new-table/new-table.component';

@Component({
    selector: 'app-account-table',
    templateUrl: './account-table.component.html',
    styleUrl: './account-table.component.scss',
    standalone: true,
    imports: [CommonModule, NewTableComponent],
})
export class AccountTableComponent {
    constructor(public accountStore: AccountStoreService) {}
}
