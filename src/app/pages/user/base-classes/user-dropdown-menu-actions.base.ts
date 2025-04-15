import { Subject, takeUntil } from 'rxjs';

// base classes
import { DropdownMenuActionsBase } from '@shared/base-classes';

// components
import { ConfirmationActivationModalComponent } from '@shared/components/ta-shared-modals/confirmation-activation-modal/confirmation-activation-modal.component';

// services
import { UserService } from '@pages/user/services/user.service';

// enums
import { eDropdownMenu, TableStringEnum } from '@shared/enums';

// models
import { TableCardBodyActions } from '@shared/models';
import { CompanyUserResponse } from 'appcoretruckassist';

export abstract class UserDropdownMenuActionsBase extends DropdownMenuActionsBase {
    protected abstract destroy$: Subject<void>;
    protected abstract viewData: CompanyUserResponse[];

    // services
    protected abstract userService: UserService;

    constructor() {
        super();
    }

    protected handleDropdownMenuActions<T extends CompanyUserResponse>(
        action: TableCardBodyActions<T>,
        tableType: string
    ) {
        const { id, type, data } = action;

        switch (type) {
            case eDropdownMenu.EDIT_TYPE:
                this.handleUserEditAction(action, tableType);

                break;
            case eDropdownMenu.RESET_PASSWORD_TYPE:
                const { email } = data;

                this.handleResetPasswordAction(email);

                break;
            case eDropdownMenu.RESEND_INVITATION_TYPE:
                this.handleResendInvitationAction(id);

                break;
            case eDropdownMenu.ACTIVATE_TYPE:
            case eDropdownMenu.DEACTIVATE_TYPE:
                this.handleUserActivateDeactivateAction(action, tableType);

                break;
            case eDropdownMenu.DELETE_TYPE:
                this.handleUserDeleteAction(action, tableType);

                break;
            default:
                // call the parent class method to handle shared cases
                super.handleSharedDropdownMenuActions(action, tableType);

                break;
        }
    }

    private handleUserEditAction<T extends CompanyUserResponse>(
        action: TableCardBodyActions<T>,
        tableType: string
    ): void {
        const {
            data: { userStatus },
        } = action;

        const adjustedAction = {
            ...action,
            disableButton:
                userStatus !== TableStringEnum.OWNER &&
                userStatus !== eDropdownMenu.EXPIRED &&
                userStatus !== eDropdownMenu.INVITED,
            isDeactivateOnly: true,
        };

        super.handleSharedDropdownMenuActions(adjustedAction, tableType);
    }

    private handleResetPasswordAction(email: string): void {
        this.userService
            .userResetPassword({ email })
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    private handleResendInvitationAction(id: number): void {
        this.userService
            .userResendIvitation(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.viewData = this.viewData.map(
                    (user: CompanyUserResponse) => {
                        return this.mapUserData(user, true, id === user.id);
                    }
                );
            });
    }

    private handleUserActivateDeactivateAction<T extends CompanyUserResponse>(
        action: TableCardBodyActions<T>,
        tableType: string
    ): void {
        const {
            data: { firstName, lastName, deactivatedAt, ...rest },
        } = action;

        const adjustedAction = {
            ...action,
            data: {
                ...rest,
                name: `${firstName} ${lastName}`,
            },
            image: true,
        };

        this.modalService.openModal(
            ConfirmationActivationModalComponent,
            { size: TableStringEnum.SMALL },
            {
                ...adjustedAction,
                template: TableStringEnum.USER,
                subType: TableStringEnum.USER,
                type: !!deactivatedAt
                    ? eDropdownMenu.ACTIVATE_TYPE
                    : eDropdownMenu.DEACTIVATE_TYPE,
                tableType,
            }
        );
    }

    private handleUserDeleteAction<T extends CompanyUserResponse>(
        action: TableCardBodyActions<T>,
        tableType: string
    ): void {
        const {
            data: { firstName, lastName, ...rest },
        } = action;

        const adjustedAction = {
            ...action,
            data: {
                ...rest,
                name: `${firstName} ${lastName}`,
            },
            image: true,
        };

        super.handleSharedDropdownMenuActions(adjustedAction, tableType);
    }

    // protected abstract - dependency
    public mapUserData(
        data: CompanyUserResponse,
        dontMapIndex?: boolean,
        isInvitationSent?: boolean
    ): any {}
}
