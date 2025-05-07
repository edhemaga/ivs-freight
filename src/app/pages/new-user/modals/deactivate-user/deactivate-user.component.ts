import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

// Interfaces
import { IUserDeleteModal } from '@pages/new-user/interfaces';

// Services
import { UserStoreService } from '@pages/new-user/state/services/user-store.service';

// Enums
import { eGeneralActions, eStatusTab } from '@shared/enums';

// Routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

// Components
import {
    CaActivateModalComponent,
    CaDeactivateModalComponent,
    CaDeleteModalComponent,
    CaProfileImageComponent,
} from 'ca-components';

@Component({
    selector: 'app-deactivate-user',
    templateUrl: './deactivate-user.component.html',
    styleUrl: './deactivate-user.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        AngularSvgIconModule,

        // Components
        CaDeleteModalComponent,
        CaProfileImageComponent,
        CaDeactivateModalComponent,
        CaActivateModalComponent,
    ],
})
export class DeactivateUserComponent {
    @Input() modalData: IUserDeleteModal;

    public sharedIcons = SharedSvgRoutes;
    public eStatusTab = eStatusTab;
    public eGeneralActions = eGeneralActions;

    constructor(public userStoreService: UserStoreService) {}
}
