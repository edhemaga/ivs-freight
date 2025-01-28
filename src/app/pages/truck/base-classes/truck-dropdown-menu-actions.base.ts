// base classes
import { DropdownMenuActionsBase } from '@shared/base-classes';

// enums
import { DropdownMenuStringEnum, TableStringEnum } from '@shared/enums';

// models
import { TableCardBodyActions } from '@shared/models';
import { TruckMapped } from '@pages/truck/pages/truck-table/models/truck-mapped.model';

export abstract class TruckDropdownMenuActionsBase extends DropdownMenuActionsBase {
    constructor() {
        super();
    }

    protected handleDropdownMenuActions<T extends TruckMapped>(
        event: TableCardBodyActions<T>,
        tableType: string
    ) {
        const {
            data: { status },
            type,
        } = event;

        const tabSelected = status
            ? TableStringEnum.ACTIVE
            : TableStringEnum.INACTIVE;

        switch (type) {
            case DropdownMenuStringEnum.EDIT_TYPE:
                this.handleTruckEditAction(event, tableType, tabSelected);

                break;
            case DropdownMenuStringEnum.REGISTRATION_TYPE:
            case DropdownMenuStringEnum.FHWA_INSPECTION_TYPE:
            case DropdownMenuStringEnum.TITLE_TYPE:
                this.handleTruckAddActions(event, tableType, tabSelected);

                break;
            case DropdownMenuStringEnum.ACTIVATE_TYPE:
            case DropdownMenuStringEnum.DEACTIVATE_TYPE:
                this.handleTruckActivateDeactivateAction(event, tableType);

                break;
            case DropdownMenuStringEnum.DELETE_TYPE:
                this.handleTruckDeleteAction(event, tableType);

                break;
            default:
                // call the parent class method to handle shared cases
                super.handleSharedDropdownMenuActions(event, tableType);

                break;
        }
    }

    private handleTruckEditAction<T>(
        event: TableCardBodyActions<T>,
        tableType: string,
        tabSelected: string
    ): void {
        const additionalProperties = {
            disableButton: true,
            tabSelected,
        };

        const adjustedEvent = {
            ...event,
            ...additionalProperties,
        };

        super.handleSharedDropdownMenuActions(adjustedEvent, tableType);
    }

    private handleTruckAddActions<T>(
        event: TableCardBodyActions<T>,
        tableType: string,
        tabSelected: string
    ): void {
        const additionalProperties = {
            modal: tableType,
            tabSelected,
        };

        const adjustedEvent = {
            ...event,
            ...additionalProperties,
        };

        super.handleSharedDropdownMenuActions(adjustedEvent, tableType);
    }

    private handleTruckActivateDeactivateAction<T extends TruckMapped>(
        event: TableCardBodyActions<T>,
        tableType: string
    ): void {
        const {
            data: { truckNumber, tableVin, truckTypeIcon },
            type,
        } = event;

        const adjustedEvent = {
            ...event,
            data: {
                ...event.data,
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

        super.handleSharedDropdownMenuActions(adjustedEvent, tableType);
    }

    private handleTruckDeleteAction<T extends TruckMapped>(
        event: TableCardBodyActions<T>,
        tableType: string
    ): void {
        const {
            data: { truckNumber, tableVin, truckTypeIcon },
        } = event;

        const adjustedEvent = {
            ...event,
            data: {
                ...event.data,
                number: truckNumber,
                vin: tableVin.boldText + tableVin.regularText,
                avatarImg: `/assets/svg/common/trucks/${truckTypeIcon}`,
            },
            svg: true,
        };

        super.handleSharedDropdownMenuActions(adjustedEvent, tableType);
    }
}
