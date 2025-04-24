// Modules
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbPopover, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule, SvgIconComponent } from 'angular-svg-icon';

// Services
import { UserStoreService } from '@pages/new-user/state/services/user-store.service';

// interfaces
import { ITableColumn } from '@shared/components/new-table/interface';

// Enums
import { eStatusTab } from '@shared/enums';

// Svg routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

// Components
import { NewTableComponent } from '@shared/components/new-table/new-table.component';
import {
    CaCheckboxComponent,
    CaCheckboxSelectedCountComponent,
    CaProfileImageComponent,
} from 'ca-components';

// Pipes
import { TableHighlightSearchTextPipe } from '@shared/components/new-table/pipes';

@Component({
    selector: 'app-user-table',
    templateUrl: './user-table.component.html',
    styleUrl: './user-table.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        NgbTooltip,
        NgbPopover,
        AngularSvgIconModule,

        // Components
        NewTableComponent,
        CaCheckboxComponent,
        CaCheckboxSelectedCountComponent,
        CaProfileImageComponent,
        SvgIconComponent,

        // Pipes
        TableHighlightSearchTextPipe,
    ],
})
export class UserTableComponent {
    // Enums
    public eStatusTab = eStatusTab;

    // Svg routes
    public sharedSvgRoutes = SharedSvgRoutes;

    constructor(public userStoreService: UserStoreService) {}

    public onShowMoreClick(): void {
        this.userStoreService.getNewPage();
    }

    public onSortingChange(column: ITableColumn): void {
        this.userStoreService.dispatchSortingChange(column);
    }

    public onSelectUser(userId: number): void {
        this.userStoreService.dispatchSelectUser(userId);
    }

    public onCheckboxCountClick(action: string): void {
        this.userStoreService.dispatchSelectAll(action);
    }
}
