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
import { BrokerModalComponent } from '@pages/customer/pages/broker-modal/broker-modal.component';

// enums
import { eDropdownMenu, TableStringEnum } from '@shared/enums';

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

export class DropdownMenuActionsHelper {
    static createDropdownMenuActionsEmitAction<T extends { id?: number }>(
        type: string,
        data: T
    ): TableCardBodyActions<T> {
        const { id } = data;

        const emitAction = {
            type,
            id,
            data,
        };

        return emitAction;
    }

    static createEditActionModalAdditionalProperties(
        type: string
    ): DropdownMenuEditActionAdditional {
        const additionalProperty =
            type === eDropdownMenu.FINISH_ORDER_TYPE
                ? { isFinishOrder: true }
                : { openedTab: TableStringEnum.REVIEW };

        return additionalProperty;
    }

    static createViewDetailsActionLink(id: number, tableType: string): string {
        let adjustedTableType: string;
        let detailsPath = eDropdownMenu.DETAILS;

        switch (tableType) {
            case eDropdownMenu.REPAIR_SHOP:
                adjustedTableType = eDropdownMenu.REPAIR;

                break;
            case eDropdownMenu.FUEL_STOP:
                adjustedTableType = eDropdownMenu.FUEL;

                break;
            case eDropdownMenu.SHIPPER:
                adjustedTableType = eDropdownMenu.CUSTOMER;
                detailsPath = eDropdownMenu.SHIPPER_DETAILS;

                break;
            case eDropdownMenu.BROKER:
                adjustedTableType = eDropdownMenu.CUSTOMER;
                detailsPath = eDropdownMenu.BROKER_DETAILS;

                break;
            case eDropdownMenu.LOAD:
                adjustedTableType = eDropdownMenu.NEW_LOAD;

                break;
            default:
                adjustedTableType = tableType;
        }

        return `/list/${adjustedTableType}/${id}/${detailsPath}`;
    }

    static getEditActionModalComponent(
        tableType: string
    ): Type<DropdownEditActionModal> {
        const modalComponentMap: Record<
            string,
            Type<DropdownEditActionModal>
        > = {
            [eDropdownMenu.CONTACT]: ContactsModalComponent,
            [eDropdownMenu.ACCOUNT]: AccountModalComponent,
            [eDropdownMenu.OWNER]: OwnerModalComponent,
            [eDropdownMenu.REPAIR]: RepairOrderModalComponent,
            [eDropdownMenu.REPAIR_SHOP]: RepairShopModalComponent,
            [eDropdownMenu.USER]: UserModalComponent,
            [eDropdownMenu.FUEL_TRANSACTION]: FuelPurchaseModalComponent,
            [eDropdownMenu.FUEL_STOP]: FuelStopModalComponent,
            [eDropdownMenu.TRUCK]: TruckModalComponent,
            [eDropdownMenu.TRAILER]: TrailerModalComponent,
            [eDropdownMenu.DRIVER]: DriverModalComponent,
            [eDropdownMenu.SHIPPER]: ShipperModalComponent,
            [eDropdownMenu.BROKER]: BrokerModalComponent,
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
            [eDropdownMenu.CDL_TYPE]: DriverCdlModalComponent,
            [eDropdownMenu.TEST_TYPE]: DriverDrugAlcoholTestModalComponent,
            [eDropdownMenu.MEDICAL_EXAM_TYPE]: DriverMedicalModalComponent,
            [eDropdownMenu.MVR_TYPE]: DriverMvrModalComponent,
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
            [eDropdownMenu.REGISTRATION_TYPE]: TtRegistrationModalComponent,
            [eDropdownMenu.FHWA_INSPECTION_TYPE]:
                TtFhwaInspectionModalComponent,
            [eDropdownMenu.TITLE_TYPE]: TtTitleModalComponent,
        };

        return modalComponentMap[type];
    }

    static getPmRepairUnitId(
        data: PMTruckUnitResponse | PMTrailerUnitResponse,
        tableType?: string
    ): { id: number; isTruckUnit: boolean } {
        if (tableType === eDropdownMenu.REPAIR_SHOP)
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
