import { Type } from '@angular/core';

// components
import { AccountModalComponent } from '@pages/account/pages/account-modal/account-modal.component';
import { ContactsModalComponent } from '@pages/contacts/pages/contacts-modal/contacts-modal.component';
import { OwnerModalComponent } from '@pages/owner/pages/owner-modal/owner-modal.component';
import { RepairOrderModalComponent } from '@pages/repair/pages/repair-modals/repair-order-modal/repair-order-modal.component';
import { RepairShopModalComponent } from '@pages/repair/pages/repair-modals/repair-shop-modal/repair-shop-modal.component';

// enums
import { DropdownMenuStringEnum, TableStringEnum } from '@shared/enums';

// types
import { DropdownEditActionModal } from '@shared/types';

// models
import {
    DropdownMenuEditActionAdditional,
    TableCardBodyActions,
} from '@shared/models';
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
            [DropdownMenuStringEnum.CONTACT]: ContactsModalComponent,
            [DropdownMenuStringEnum.ACCOUNT]: AccountModalComponent,
            [DropdownMenuStringEnum.OWNER]: OwnerModalComponent,
            [DropdownMenuStringEnum.REPAIR]: RepairOrderModalComponent,
            [DropdownMenuStringEnum.REPAIR_SHOP]: RepairShopModalComponent,
        };

        return modalComponentMap[tableType];
    }

    static createEditActionModalAdditionalProperties(
        type: string
    ): DropdownMenuEditActionAdditional {
        const additionalProperty =
            type === DropdownMenuStringEnum.FINISH_ORDER_TYPE
                ? { isFinishOrder: true }
                : { openedTab: TableStringEnum.REVIEW };

        return additionalProperty;
    }

    static createViewDetailsActionLink(id: number, tableType: string): string {
        const adjustedTableType =
            tableType === DropdownMenuStringEnum.REPAIR_SHOP
                ? DropdownMenuStringEnum.REPAIR
                : tableType;

        const link = `/list/${adjustedTableType}/${id}/details`;

        return link;
    }

    static getPmRepairUnitId(
        data: PMTruckUnitResponse | PMTrailerUnitResponse,
        tableType?: string
    ): { id: number; isTruckUnit: boolean } {
        if (tableType === DropdownMenuStringEnum.REPAIR_SHOP)
            return { id: null, isTruckUnit: null };

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
