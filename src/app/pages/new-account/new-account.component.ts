import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

// Components
import { AccountTableComponent } from '@pages/new-account/pages/account-table/account-table.component';

@Component({
    selector: 'app-new-account',
    standalone: true,
    imports: [CommonModule, AccountTableComponent],
    templateUrl: './new-account.component.html',
    styleUrl: './new-account.component.scss',
})
export class NewAccountComponent {}
