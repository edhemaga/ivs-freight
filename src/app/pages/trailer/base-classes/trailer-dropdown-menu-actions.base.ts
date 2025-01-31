// base classes
import { DropdownMenuActionsBase } from '@shared/base-classes';

// enums
import { DropdownMenuStringEnum, TableStringEnum } from '@shared/enums';

// models
import { TableCardBodyActions } from '@shared/models';
import { TrailerMapped } from '@pages/trailer/pages/trailer-table/models/trailer-mapped.model';

export abstract class TrailerDropdownMenuActionsBase extends DropdownMenuActionsBase {
    constructor() {
        super();
    }

    protected handleDropdownMenuActions<T extends TrailerMapped>(
        event: TableCardBodyActions<T>,
        tableType: string
    ) {
        const { type } = event;

        const tabSelected = event.data?.status
            ? TableStringEnum.ACTIVE
            : TableStringEnum.INACTIVE;

        switch (type) {
            case DropdownMenuStringEnum.EDIT_TYPE:
                this.handleTrailerEditAction(event, tableType, tabSelected);

                break;
            case DropdownMenuStringEnum.REGISTRATION_TYPE:
            case DropdownMenuStringEnum.FHWA_INSPECTION_TYPE:
            case DropdownMenuStringEnum.TITLE_TYPE:
                this.handleTrailerAddActions(event, tableType, tabSelected);

                break;
            case DropdownMenuStringEnum.ACTIVATE_TYPE:
            case DropdownMenuStringEnum.DEACTIVATE_TYPE:
                this.handleTrailerActivateDeactivateAction(event, tableType);

                break;
            case DropdownMenuStringEnum.DELETE_TYPE:
                this.handleTrailerDeleteAction(event, tableType);

                break;
            default:
                // call the parent class method to handle shared cases
                super.handleSharedDropdownMenuActions(event, tableType);

                break;
        }
    }

    private handleTrailerEditAction<T extends TrailerMapped>(
        event: TableCardBodyActions<T>,
        tableType: string,
        tabSelected: string
    ): void {
        const additionalProperties = {
            tabSelected,
        };

        const adjustedEvent = {
            ...event,
            ...additionalProperties,
        };

        super.handleSharedDropdownMenuActions(adjustedEvent, tableType);
    }

    private handleTrailerAddActions<T>(
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

    private handleTrailerActivateDeactivateAction<T extends TrailerMapped>(
        event: TableCardBodyActions<T>,
        tableType: string
    ): void {
        const {
            data: { trailerNumber, tableVin, tableTrailerTypeIcon, vin },
            type,
        } = event;

        const adjustedEvent = {
            ...event,
            data: {
                ...event.data,
                number: trailerNumber,
                vin: tableVin
                    ? tableVin?.regularText + tableVin?.boldText
                    : vin,
                avatarFile: {
                    url: `/assets/svg/common/trailers/${tableTrailerTypeIcon}`,
                },
            },
            template: tableType,
            subType: tableType,
            type,
            tableType,
            modalTitle: ' Unit ' + trailerNumber,
            modalSecondTitle: tableVin
                ? tableVin?.regularText + tableVin?.boldText
                : vin,
            svg: true,
        };

        super.handleSharedDropdownMenuActions(adjustedEvent, tableType);
    }

    private handleTrailerDeleteAction<T extends TrailerMapped>(
        event: TableCardBodyActions<T>,
        tableType: string
    ): void {
        const {
            data: { trailerNumber, tableVin, tableTrailerTypeIcon, vin },
            type,
        } = event;

        const adjustedEvent = {
            ...event,
            data: {
                ...event.data,
                number: trailerNumber,
                vin: tableVin
                    ? tableVin?.regularText + tableVin?.boldText
                    : vin,
                avatarImg: `/assets/svg/common/trailers/${tableTrailerTypeIcon}`,
            },
            template: tableType,
            type,
            svg: true,
        };

        super.handleSharedDropdownMenuActions(adjustedEvent, tableType);
    }
}
