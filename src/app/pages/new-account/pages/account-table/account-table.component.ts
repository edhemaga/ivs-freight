import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
// import { ReactiveFormsModule } from '@angular/forms';

// Enums
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

// Interface
import { ITableColumn } from '@shared/components/new-table/interfaces';

@Component({
    selector: 'app-account-table',
    templateUrl: './account-table.component.html',
    styleUrl: './account-table.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        // ReactiveFormsModule,

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
    // colorLabels = [
    //     {
    //         id: 2,
    //         name: 'tax2',
    //         colorId: 6,
    //         color: 'Red',
    //         code: '#F27B8E',
    //         hoverCode: '#ED445E',
    //         count: 9,
    //         createdAt: '0001-01-01T00:00:00',
    //         updatedAt: '0001-01-01T00:00:00',
    //     },
    //     {
    //         id: 3,
    //         name: '123',
    //         colorId: 4,
    //         color: 'Dark Green',
    //         code: '#6DC089',
    //         hoverCode: '#2FA558',
    //         count: 12,
    //         createdAt: '0001-01-01T00:00:00',
    //         updatedAt: '0001-01-01T00:00:00',
    //     },
    //     {
    //         id: 4,
    //         name: 'phone',
    //         colorId: 5,
    //         color: 'Light Green',
    //         code: '#BDE08E',
    //         hoverCode: '#A2D35F',
    //         count: 4,
    //         createdAt: '0001-01-01T00:00:00',
    //         updatedAt: '0001-01-01T00:00:00',
    //     },
    //     {
    //         id: 5,
    //         name: 'dispatch',
    //         colorId: 10,
    //         color: 'Pink',
    //         code: '#F69FF3',
    //         hoverCode: '#F276EF',
    //         count: 7,
    //         createdAt: '0001-01-01T00:00:00',
    //         updatedAt: '0001-01-01T00:00:00',
    //     },
    //     {
    //         id: 6,
    //         name: 'fuel',
    //         colorId: 3,
    //         color: 'Light Blue',
    //         code: '#73D0F1',
    //         hoverCode: '#38BDEB',
    //         count: 1,
    //         createdAt: '0001-01-01T00:00:00',
    //         updatedAt: '0001-01-01T00:00:00',
    //     },
    //     {
    //         id: 7,
    //         name: 'triumph',
    //         colorId: 4,
    //         color: 'Dark Green',
    //         code: '#6DC089',
    //         hoverCode: '#2FA558',
    //         count: 3,
    //         createdAt: '0001-01-01T00:00:00',
    //         updatedAt: '0001-01-01T00:00:00',
    //     },
    //     {
    //         id: 8,
    //         name: 'insurance',
    //         colorId: 7,
    //         color: 'Orange',
    //         code: '#FDB46B',
    //         hoverCode: '#FD952D',
    //         count: 1,
    //         createdAt: '0001-01-01T00:00:00',
    //         updatedAt: '0001-01-01T00:00:00',
    //     },
    //     {
    //         id: 14,
    //         name: 'load board',
    //         colorId: 11,
    //         color: 'Brown',
    //         code: '#A1887F',
    //         hoverCode: '#8D6E63',
    //         count: 0,
    //         createdAt: '0001-01-01T00:00:00',
    //         updatedAt: '0001-01-01T00:00:00',
    //     },
    // ];
    // colorRes = [
    //     {
    //         id: 1,
    //         name: 'No Color',
    //         code: '#AAAAAA',
    //         hoverCode: '#919191',
    //         count: 2,
    //     },
    //     {
    //         id: 2,
    //         name: 'Dark Blue',
    //         code: '#8A9AEF',
    //         hoverCode: '#596FE8',
    //         count: 7,
    //     },
    //     {
    //         id: 3,
    //         name: 'Light Blue',
    //         code: '#73D0F1',
    //         hoverCode: '#38BDEB',
    //         count: 3,
    //     },
    //     {
    //         id: 4,
    //         name: 'Dark Green',
    //         code: '#6DC089',
    //         hoverCode: '#2FA558',
    //         count: 4,
    //     },
    //     {
    //         id: 5,
    //         name: 'Light Green',
    //         code: '#BDE08E',
    //         hoverCode: '#A2D35F',
    //         count: 5,
    //     },
    //     {
    //         id: 6,
    //         name: 'Red',
    //         code: '#F27B8E',
    //         hoverCode: '#ED445E',
    //         count: 7,
    //     },
    //     {
    //         id: 7,
    //         name: 'Orange',
    //         code: '#FDB46B',
    //         hoverCode: '#FD952D',
    //         count: 3,
    //     },
    //     {
    //         id: 8,
    //         name: 'Yellow',
    //         code: '#FFD54F',
    //         hoverCode: '#FFCA28',
    //         count: 0,
    //     },
    //     {
    //         id: 9,
    //         name: 'Purple',
    //         code: '#A574C3',
    //         hoverCode: '#7F39AA',
    //         count: 0,
    //     },
    //     {
    //         id: 10,
    //         name: 'Pink',
    //         code: '#F69FF3',
    //         hoverCode: '#F276EF',
    //         count: 1,
    //     },
    //     {
    //         id: 11,
    //         name: 'Brown',
    //         code: '#A1887F',
    //         hoverCode: '#8D6E63',
    //         count: 2,
    //     },
    // ];
    public eDateTimeFormat = eDateTimeFormat;
    public eDropdownMenu = eDropdownMenu;

    // selectedContactColor = {};
    constructor(public accountStore: AccountStoreService) {}

    public onCheckboxCountClick(action: string): void {
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
    public onSortingChange(column: ITableColumn): void {
        this.accountStore.dispatchSortingChange(column);
    }
}
