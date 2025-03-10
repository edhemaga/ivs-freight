// base classes
import { DropdownMenuActionsBase } from '@shared/base-classes';

// enums
import { eDropdownMenu, TableStringEnum } from '@shared/enums';

// models
import { TableCardBodyActions } from '@shared/models';
import { TruckMapped } from '@pages/truck/pages/truck-table/models/truck-mapped.model';

export abstract class TruckDropdownMenuActionsBase extends DropdownMenuActionsBase {
    constructor() {
        super();
    }

    protected handleDropdownMenuActions<T extends TruckMapped>(
        action: TableCardBodyActions<T>,
        tableType: string
    ): void {
        const { type } = action;

        const tabSelected = action.data?.status
            ? TableStringEnum.ACTIVE
            : TableStringEnum.INACTIVE;

        switch (type) {
            case eDropdownMenu.EDIT_TYPE:
                this.handleTruckEditAction(action, tableType, tabSelected);

                break;
            case eDropdownMenu.REGISTRATION_TYPE:
            case eDropdownMenu.FHWA_INSPECTION_TYPE:
            case eDropdownMenu.TITLE_TYPE:
                this.handleTruckAddActions(action, tableType, tabSelected);

                break;
            case eDropdownMenu.ACTIVATE_TYPE:
            case eDropdownMenu.DEACTIVATE_TYPE:
                this.handleTruckActivateDeactivateAction(action, tableType);

                break;
            case eDropdownMenu.DELETE_TYPE:
                this.handleTruckDeleteAction(action, tableType);

                break;
            default:
                // call the parent class method to handle shared cases
                super.handleSharedDropdownMenuActions(action, tableType);

                break;
        }
    }

    private handleTruckEditAction<T>(
        action: TableCardBodyActions<T>,
        tableType: string,
        tabSelected: string
    ): void {
        const additionalProperties = {
            disableButton: true,
            tabSelected,
        };

        const adjustedAction = {
            ...action,
            ...additionalProperties,
        };

        super.handleSharedDropdownMenuActions(adjustedAction, tableType);
    }

    private handleTruckAddActions<T>(
        action: TableCardBodyActions<T>,
        tableType: string,
        tabSelected: string
    ): void {
        const additionalProperties = {
            modal: tableType,
            tabSelected,
        };

        const adjustedAction = {
            ...action,
            ...additionalProperties,
        };

        super.handleSharedDropdownMenuActions(adjustedAction, tableType);
    }

    private handleTruckActivateDeactivateAction<T extends TruckMapped>(
        action: TableCardBodyActions<T>,
        tableType: string
    ): void {
        const {
            data: { truckNumber, tableVin, truckTypeIcon },
            type,
        } = action;

        const adjustedAction = {
            ...action,
            data: {
                ...action.data,
                number: truckNumber,
                vin: tableVin.boldText + tableVin.regularText,
                avatarFile: {
                    url: `/assets/svg/common/trucks/${truckTypeIcon}`,
                },
            },
            template: tableType,
            subType: tableType,
            type,
            tableType,
            modalTitle: ' Unit ' + truckNumber,
            modalSecondTitle: tableVin.boldText + tableVin.regularText,
            svg: true,
        };

        super.handleSharedDropdownMenuActions(adjustedAction, tableType);
    }

    private handleTruckDeleteAction<T extends TruckMapped>(
        action: TableCardBodyActions<T>,
        tableType: string
    ): void {
        const {
            data: { truckNumber, tableVin, truckTypeIcon },
        } = action;

        const adjustedAction = {
            ...action,
            data: {
                ...action.data,
                number: truckNumber,
                vin: tableVin.boldText + tableVin.regularText,
                avatarImg: `/assets/svg/common/trucks/${truckTypeIcon}`,
            },
            svg: true,
        };

        super.handleSharedDropdownMenuActions(adjustedAction, tableType);
    }
}
