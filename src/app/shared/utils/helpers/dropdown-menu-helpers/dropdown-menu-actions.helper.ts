import { Type } from '@angular/core';

// components
import { AccountModalComponent } from '@pages/account/pages/account-modal/account-modal.component';
import { ContactsModalComponent } from '@pages/contacts/pages/contacts-modal/contacts-modal.component';

// enums
import { DropdownMenuStringEnum } from '@shared/enums';

// types
import { DropdownEditActionModal } from '@shared/types';

// models
import { TableCardBodyActions } from '@shared/models';

export class DropdownMenuActionsHelper {
    static createDropdownMenuActionsEmitEvent<T extends { id?: number }>(
        type: string,
        data: T
    ): TableCardBodyActions<T> {
        const { id } = data;

        const emitEvent = {
            type,
            id,
            data,
        };

        return emitEvent;
    }

    static getEditActionModal(
        tableType: string
    ): Type<DropdownEditActionModal> {
        switch (tableType) {
            case DropdownMenuStringEnum.ACCOUNT:
                return AccountModalComponent;
            case DropdownMenuStringEnum.CONTACT:
                return ContactsModalComponent;
            default:
                return;
        }
    }
}
