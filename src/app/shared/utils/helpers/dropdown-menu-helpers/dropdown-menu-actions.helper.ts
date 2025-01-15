import { Type } from '@angular/core';

// components
import { AccountModalComponent } from '@pages/account/pages/account-modal/account-modal.component';
import { ContactsModalComponent } from '@pages/contacts/pages/contacts-modal/contacts-modal.component';
import { OwnerModalComponent } from '@pages/owner/pages/owner-modal/owner-modal.component';

// enums
import { DropdownMenuStringEnum, TableStringEnum } from '@shared/enums';

// types
import { DropdownEditActionModal } from '@shared/types';

// models
import { TableCardBodyActions } from '@shared/models';
import { PMTrailerUnitResponse, PMTruckUnitResponse } from 'appcoretruckassist';

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

    static getEditActionModalComponent(
        tableType: string
    ): Type<DropdownEditActionModal> {
        const modalComponentMap: Record<
            string,
            Type<DropdownEditActionModal>
        > = {
            [DropdownMenuStringEnum.ACCOUNT]: AccountModalComponent,
            [DropdownMenuStringEnum.CONTACT]: ContactsModalComponent,
            [DropdownMenuStringEnum.OWNER]: OwnerModalComponent,
        };

        return modalComponentMap[tableType];
    }

    static getPmRepairUnitId(
        data: PMTruckUnitResponse | PMTrailerUnitResponse
    ): { id: number; isTruckUnit: boolean } {
        const checkIsTruckOrTrailerUnit = (
            data: PMTruckUnitResponse | PMTrailerUnitResponse
        ): data is PMTruckUnitResponse => {
            return TableStringEnum.TRUCK in data;
        };

        const isTruckUnit = checkIsTruckOrTrailerUnit(data);

        const { id } = isTruckUnit ? data.truck : data.trailer;

        return { id, isTruckUnit };
    }
}
