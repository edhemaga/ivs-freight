// Modules
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
    NgbActiveModal,
    NgbPopover,
    NgbTooltip,
} from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule, SvgIconComponent } from 'angular-svg-icon';

// Services
import { UserStoreService } from '@pages/new-user/state/services/user-store.service';

// interfaces
import { ITableColumn } from '@shared/components/new-table/interfaces';
import { IDropdownMenuOptionEmit } from '@ca-shared/components/ca-dropdown-menu/interfaces';
import { IMappedUser, IUserDeleteModal } from '@pages/new-user/interfaces';

// Enums
import {
    eDateTimeFormat,
    eDropdownMenu,
    eSharedString,
    eStatusTab,
    eStringPlaceholder,
    TableStringEnum,
} from '@shared/enums';

// Svg routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

// Components
import { NewTableComponent } from '@shared/components/new-table/new-table.component';
import {
    CaCheckboxComponent,
    CaCheckboxSelectedCountComponent,
    CaDropdownMenuComponent,
    CaProfileImageComponent,
} from 'ca-components';
import { TaPasswordAccountHiddenCharactersComponent } from '@shared/components/ta-password-account-hidden-characters/ta-password-account-hidden-characters.component';

// Pipes
import { TableHighlightSearchTextPipe } from '@shared/components/new-table/pipes';
import {
    ActivityTimePipe,
    FormatCurrencyPipe,
    NameInitialsPipe,
} from '@shared/pipes';
import { AddressFullnamePipe } from '@shared/pipes/address-fullname.pipe';

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
        TaPasswordAccountHiddenCharactersComponent,
        CaDropdownMenuComponent,

        // Pipes
        TableHighlightSearchTextPipe,
        NameInitialsPipe,
        ActivityTimePipe,
        NameInitialsPipe,
        AddressFullnamePipe,
        FormatCurrencyPipe,
    ],
})
export class UserTableComponent {
    // Enums
    public eStatusTab = eStatusTab;
    public eSharedString = eSharedString;
    public eStringPlaceholder = eStringPlaceholder;
    public etableStringEnum = TableStringEnum;
    public eDateTimeFormat = eDateTimeFormat;
    public eDropdownMenu = eDropdownMenu;

    // Svg routes
    public sharedSvgRoutes = SharedSvgRoutes;

    constructor(
        public userStoreService: UserStoreService,
        private ngbActiveModal: NgbActiveModal
    ) {}

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

    public openEditModal(userId: number): void {
        this.userStoreService.dispatchOpenUserModal(true, userId);
    }

    public onToggleDropdownMenuActions(
        action: IDropdownMenuOptionEmit,
        data: IMappedUser
    ) {
        const { type } = action;
        const { id, email } = data;

        switch (type) {
            case eDropdownMenu.OPEN_TYPE:
                this.setTableDropdownMenuOptions(data);

                break;
            case eDropdownMenu.EDIT_TYPE:
                this.openEditModal(id);

                break;
            case eDropdownMenu.SEND_MESSAGE_TYPE:
                // todo
                break;
            case eDropdownMenu.RESET_PASSWORD_TYPE:
                this.resetPassword(email);

                break;
            case eDropdownMenu.RESEND_INVITATION_TYPE:
                this.resendInvitation(id);

                break;
            case eDropdownMenu.SHARE_TYPE:
                // todo
                break;
            case eDropdownMenu.PRINT_TYPE:
                // todo
                break;
            case eDropdownMenu.DEACTIVATE_TYPE:
            case eDropdownMenu.ACTIVATE_TYPE:
                this.userStatusChange(data);

                break;
            case eDropdownMenu.DELETE_TYPE:
                this.deleteUser(data);

                break;
            default:
                break;
        }
    }

    private setTableDropdownMenuOptions(user: IMappedUser): void {
        this.userStoreService.dispatchSetTableDropdownMenuOptions(user);
    }

    private resetPassword(email: string): void {
        this.userStoreService.dispatchResetPassword(email);
    }
    private resendInvitation(id: number): void {
        this.userStoreService.dispatchResendInvitation(id);
    }
    private userStatusChange(user: IMappedUser): void {
        const modalData: IUserDeleteModal = {
            users: [user],
        };

        this.userStoreService.dispatchUserStatusChange(
            modalData,
            this.ngbActiveModal
        );
    }

    private deleteUser(user: IMappedUser): void {
        const modalData: IUserDeleteModal = {
            users: [user],
        };

        this.userStoreService.dispatchDeleteUsers(
            modalData,
            this.ngbActiveModal
        );
    }
}
