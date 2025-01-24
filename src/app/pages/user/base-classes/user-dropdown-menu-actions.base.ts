import { Subject, takeUntil } from 'rxjs';

// base classes
import { DropdownMenuActionsBase } from '@shared/base-classes';

// components
import { ConfirmationActivationModalComponent } from '@shared/components/ta-shared-modals/confirmation-activation-modal/confirmation-activation-modal.component';

// services
import { ModalService } from '@shared/services/modal.service';
import { UserService } from '@pages/user/services/user.service';

// enums
import { DropdownMenuStringEnum, TableStringEnum } from '@shared/enums';

// models
import { TableCardBodyActions } from '@shared/models';
import { CompanyUserResponse } from 'appcoretruckassist';

export abstract class UserDropdownMenuActionsBase extends DropdownMenuActionsBase {
    protected abstract destroy$: Subject<void>;
    protected abstract viewData: CompanyUserResponse[];

    constructor(
        // services
        protected modalService: ModalService,
        protected userService: UserService
    ) {
        super(modalService);
    }

    protected handleDropdownMenuActions<T extends CompanyUserResponse>(
        event: TableCardBodyActions<T>,
        tableType: string
    ) {
        const { id, type } = event;

        switch (type) {
            case DropdownMenuStringEnum.EDIT_TYPE:
                this.handleUserEditAction(event, tableType);

                break;
            case DropdownMenuStringEnum.RESET_PASSWORD_TYPE:
                this.handleResetPasswordAction();

                break;
            case DropdownMenuStringEnum.RESEND_INVITATION_TYPE:
                this.handleResendInvitationAction(id);

                break;
            case DropdownMenuStringEnum.ACTIVATE_TYPE:
            case DropdownMenuStringEnum.DEACTIVATE_TYPE:
                this.handleUserActivateDeactivateAction(event, tableType);

                break;
            case DropdownMenuStringEnum.DELETE_TYPE:
                this.handleUserDeleteAction(event, tableType);

                break;
            default:
                // call the parent class method to handle shared cases
                super.handleSharedDropdownMenuActions(event, tableType);

                break;
        }
    }

    private handleUserEditAction<T extends CompanyUserResponse>(
        event: TableCardBodyActions<T>,
        tableType: string
    ): void {
        const {
            data: { userStatus },
        } = event;

        const adjustedEvent = {
            ...event,
            disableButton:
                userStatus !== TableStringEnum.OWNER &&
                userStatus !== DropdownMenuStringEnum.EXPIRED &&
                userStatus !== DropdownMenuStringEnum.INVITED,
            isDeactivateOnly: true,
        };

        super.handleSharedDropdownMenuActions(adjustedEvent, tableType);
    }

    private handleResetPasswordAction(): void {}

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
        event: TableCardBodyActions<T>,
        tableType: string
    ): void {
        const {
            data: { firstName, lastName, deactivatedAt, ...rest },
        } = event;

        const adjustedEvent = {
            ...event,
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
                ...adjustedEvent,
                template: TableStringEnum.USER,
                subType: TableStringEnum.USER,
                type: !!deactivatedAt
                    ? DropdownMenuStringEnum.ACTIVATE
                    : DropdownMenuStringEnum.DEACTIVATE,
                tableType,
            }
        );
    }

    private handleUserDeleteAction<T extends CompanyUserResponse>(
        event: TableCardBodyActions<T>,
        tableType: string
    ): void {
        const {
            data: { firstName, lastName, ...rest },
        } = event;

        const adjustedEvent = {
            ...event,
            data: {
                ...rest,
                name: `${firstName} ${lastName}`,
            },
            image: true,
        };

        super.handleSharedDropdownMenuActions(adjustedEvent, tableType);
    }

    // protected abstract - dependency
    public mapUserData(
        data: CompanyUserResponse,
        dontMapIndex?: boolean,
        isInvitationSent?: boolean
    ): any {}
}
