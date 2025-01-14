// components
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';

// enums
import { DropdownMenuStringEnum, TableStringEnum } from '@shared/enums';

// helpers
import { DropdownMenuActionsHelper } from '@shared/utils/helpers/dropdown-menu-helpers';

// services
import { ModalService } from '@shared/services/modal.service';

// models
import { TableCardBodyActions } from '@shared/models';

export abstract class DropdownMenuActionsBase {
    constructor(protected modalService: ModalService) {}

    protected handleDropdowMenuActions<T>(
        event: TableCardBodyActions<T>,
        tableType: string
    ): void {
        const { type } = event;

        switch (type) {
            case DropdownMenuStringEnum.EDIT_TYPE:
                this.handleEditAction(event, tableType);

                break;
            case DropdownMenuStringEnum.DELETE_TYPE:
                this.handleDeleteAction(event, tableType);

                break;
            case DropdownMenuStringEnum.SHOW_MORE:
                this.handleShowMoreAction();

                break;
            default:
                break;
        }
    }

    private handleEditAction<T>(
        event: TableCardBodyActions<T>,
        tableType: string
    ): void {
        const editActionModal =
            DropdownMenuActionsHelper.getEditActionModal(tableType);

        this.modalService.openModal(
            editActionModal,
            { size: TableStringEnum.SMALL },
            {
                ...event,
            }
        );
    }

    private handleDeleteAction<T>(
        event: TableCardBodyActions<T>,
        tableType: string
    ): void {
        this.modalService.openModal(
            ConfirmationModalComponent,
            { size: TableStringEnum.SMALL },
            {
                ...event,
                template: tableType,
            }
        );
    }

    // protected abstract - dependency
    protected abstract handleShowMoreAction(): void;
}
