// Modules
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbPopover, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

// Services
import { UserStoreService } from '@pages/new-user/state/services/user-store.service';

// interfaces
import { ITableColumn } from '@shared/components/new-table/interface';

// Components
import { NewTableComponent } from '@shared/components/new-table/new-table.component';
import {
    CaCheckboxComponent,
    CaCheckboxSelectedCountComponent,
    CaProfileImageComponent,
} from 'ca-components';

@Component({
    selector: 'app-user-table',
    templateUrl: './user-table.component.html',
    styleUrl: './user-table.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        NgbTooltip,
        NgbPopover,

        // Components
        NewTableComponent,
        CaCheckboxComponent,
        CaCheckboxSelectedCountComponent,
        CaProfileImageComponent,
    ],
})
export class UserTableComponent {
    constructor(public userStoreService: UserStoreService) {}

    public onShowMoreClick(): void {
        // this.loadStoreService.getNewPage();
    }

    public onSortingChange(column: ITableColumn): void {
        // this.loadStoreService.dispatchSortingChange(column);
    }
}
