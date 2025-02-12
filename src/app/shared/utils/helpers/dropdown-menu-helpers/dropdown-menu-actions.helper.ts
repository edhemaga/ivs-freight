import { Type } from '@angular/core';

// components
import { AccountModalComponent } from '@pages/account/pages/account-modal/account-modal.component';
import { ContactsModalComponent } from '@pages/contacts/pages/contacts-modal/contacts-modal.component';
import { OwnerModalComponent } from '@pages/owner/pages/owner-modal/owner-modal.component';
import { RepairOrderModalComponent } from '@pages/repair/pages/repair-modals/repair-order-modal/repair-order-modal.component';
import { RepairShopModalComponent } from '@pages/repair/pages/repair-modals/repair-shop-modal/repair-shop-modal.component';
import { UserModalComponent } from '@pages/user/pages/user-modal/user-modal.component';
import { FuelPurchaseModalComponent } from '@pages/fuel/pages/fuel-modals/fuel-purchase-modal/fuel-purchase-modal.component';
import { FuelStopModalComponent } from '@pages/fuel/pages/fuel-modals/fuel-stop-modal/fuel-stop-modal.component';
import { TruckModalComponent } from '@pages/truck/pages/truck-modal/truck-modal.component';
import { TrailerModalComponent } from '@pages/trailer/pages/trailer-modal/trailer-modal.component';
import { DriverModalComponent } from '@pages/driver/pages/driver-modals/driver-modal/driver-modal.component';
import { DriverCdlModalComponent } from '@pages/driver/pages/driver-modals/driver-cdl-modal/driver-cdl-modal.component';
import { DriverDrugAlcoholTestModalComponent } from '@pages/driver/pages/driver-modals/driver-drug-alcohol-test-modal/driver-drug-alcohol-test-modal.component';
import { DriverMedicalModalComponent } from '@pages/driver/pages/driver-modals/driver-medical-modal/driver-medical-modal.component';
import { DriverMvrModalComponent } from '@pages/driver/pages/driver-modals/driver-mvr-modal/driver-mvr-modal.component';
import { TtRegistrationModalComponent } from '@shared/components/ta-shared-modals/truck-trailer-modals/modals/tt-registration-modal/tt-registration-modal.component';
import { TtFhwaInspectionModalComponent } from '@shared/components/ta-shared-modals/truck-trailer-modals/modals/tt-fhwa-inspection-modal/tt-fhwa-inspection-modal.component';
import { TtTitleModalComponent } from '@shared/components/ta-shared-modals/truck-trailer-modals/modals/tt-title-modal/tt-title-modal.component';
import { ShipperModalComponent } from '@pages/customer/pages/shipper-modal/shipper-modal.component';

// enums
import { DropdownMenuStringEnum, TableStringEnum } from '@shared/enums';

// types
import {
    DropdownDriverAddAdditionalActionModal,
    DropdownEditActionModal,
    DropdownTruckTrailerAddAdditionalActionModal,
} from '@shared/types';

// models
import {
    DropdownMenuEditActionAdditional,
    TableCardBodyActions,
} from '@shared/models';
import { PMTrailerUnitResponse, PMTruckUnitResponse } from 'appcoretruckassist';
import { BrokerModalComponent } from '@pages/customer/pages/broker-modal/broker-modal.component';

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
                : tableType === DropdownMenuStringEnum.FUEL_STOP
                  ? DropdownMenuStringEnum.FUEL
                  : tableType;

        const link = `/list/${adjustedTableType}/${id}/details`;

        return link;
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
            [DropdownMenuStringEnum.USER]: UserModalComponent,
            [DropdownMenuStringEnum.FUEL_TRANSACTION]:
                FuelPurchaseModalComponent,
            [DropdownMenuStringEnum.FUEL_STOP]: FuelStopModalComponent,
            [DropdownMenuStringEnum.TRUCK]: TruckModalComponent,
            [DropdownMenuStringEnum.TRAILER]: TrailerModalComponent,
            [DropdownMenuStringEnum.DRIVER]: DriverModalComponent,
            [DropdownMenuStringEnum.SHIPPER]: ShipperModalComponent,
            [DropdownMenuStringEnum.BROKER]: BrokerModalComponent,
        };

        return modalComponentMap[tableType];
    }

    static getAddDriverAdditionalModalComponent(
        type: string
    ): Type<DropdownDriverAddAdditionalActionModal> {
        const modalComponentMap: Record<
            string,
            Type<DropdownDriverAddAdditionalActionModal>
        > = {
            [DropdownMenuStringEnum.CDL_TYPE]: DriverCdlModalComponent,
            [DropdownMenuStringEnum.TEST_TYPE]:
                DriverDrugAlcoholTestModalComponent,
            [DropdownMenuStringEnum.MEDICAL_EXAM_TYPE]:
                DriverMedicalModalComponent,
            [DropdownMenuStringEnum.MVR_TYPE]: DriverMvrModalComponent,
        };

        return modalComponentMap[type];
    }

    static getAddTruckTrailerAdditionalModalComponent(
        type: string
    ): Type<DropdownTruckTrailerAddAdditionalActionModal> {
        const modalComponentMap: Record<
            string,
            Type<DropdownTruckTrailerAddAdditionalActionModal>
        > = {
            [DropdownMenuStringEnum.REGISTRATION_TYPE]:
                TtRegistrationModalComponent,
            [DropdownMenuStringEnum.FHWA_INSPECTION_TYPE]:
                TtFhwaInspectionModalComponent,
            [DropdownMenuStringEnum.TITLE_TYPE]: TtTitleModalComponent,
        };

        return modalComponentMap[type];
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
