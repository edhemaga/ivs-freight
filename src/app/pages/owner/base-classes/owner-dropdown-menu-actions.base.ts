// base classes
import { DropdownMenuActionsBase } from '@shared/base-classes';

// components
import { TruckModalComponent } from '@pages/truck/pages/truck-modal/truck-modal.component';
import { TrailerModalComponent } from '@pages/trailer/pages/trailer-modal/trailer-modal.component';

// enums
import { DropdownMenuStringEnum, TableStringEnum } from '@shared/enums';

// models
import { TableCardBodyActions } from '@shared/models';
import { OwnerResponse } from 'appcoretruckassist';

export abstract class OwnerDropdownMenuActionsBase extends DropdownMenuActionsBase {
    constructor() {
        super();
    }

    protected handleDropdownMenuActions<T extends OwnerResponse>(
        event: TableCardBodyActions<T>,
        tableType: string
    ) {
        const { type } = event;

        switch (type) {
            case DropdownMenuStringEnum.ADD_TRUCK_TYPE:
            case DropdownMenuStringEnum.ADD_TRAILER_TYPE:
                this.handleAddTruckTrailerAction(type);

                break;
            default:
                // call the parent class method to handle shared cases
                super.handleSharedDropdownMenuActions(event, tableType);

                break;
        }
    }

    private handleAddTruckTrailerAction(type: string): void {
        const addTruckTrailerModalComponent =
            type === DropdownMenuStringEnum.ADD_TRUCK_TYPE
                ? TruckModalComponent
                : TrailerModalComponent;

        this.modalService.openModal(addTruckTrailerModalComponent, {
            size: TableStringEnum.SMALL,
        });
    }
}

// TODO V2

/* this.modalService.openModal(
                ConfirmationModalComponent,
                { size: TableStringEnum.SMALL },
                {
                    ...event,
                    template: TableStringEnum.OWNER_3,
                    type: event.data.isSelected
                        ? TableStringEnum.DEACTIVATE
                        : TableStringEnum.ACTIVATE,
                    svg: true,
                }
            ); */
