// base classes
import { DropdownMenuActionsBase } from '@shared/base-classes';

// components
import { TruckModalComponent } from '@pages/truck/pages/truck-modal/truck-modal.component';
import { TrailerModalComponent } from '@pages/trailer/pages/trailer-modal/trailer-modal.component';

// enums
import { eDropdownMenu, TableStringEnum } from '@shared/enums';

// models
import { TableCardBodyActions } from '@shared/models';
import { OwnerResponse } from 'appcoretruckassist';

export abstract class OwnerDropdownMenuActionsBase extends DropdownMenuActionsBase {
    constructor() {
        super();
    }

    protected handleDropdownMenuActions<T extends OwnerResponse>(
        action: TableCardBodyActions<T>,
        tableType: string
    ) {
        const { type, data } = action;

        switch (type) {
            case eDropdownMenu.ADD_TRUCK_TYPE:
            case eDropdownMenu.ADD_TRAILER_TYPE:
                this.handleAddTruckTrailerAction(type, data);

                break;
            default:
                // call the parent class method to handle shared cases
                super.handleSharedDropdownMenuActions(action, tableType);

                break;
        }
    }

    private handleAddTruckTrailerAction(
        type: string,
        ownerData: OwnerResponse
    ): void {
        const addTruckTrailerModalComponent =
            type === eDropdownMenu.ADD_TRUCK_TYPE
                ? TruckModalComponent
                : TrailerModalComponent;

        this.modalService.openModal(
            addTruckTrailerModalComponent,
            {
                size: TableStringEnum.SMALL,
            },
            {
                ownerData,
            }
        );
    }
}

// TODO V2

/* this.modalService.openModal(
                ConfirmationModalComponent,
                { size: TableStringEnum.SMALL },
                {
                    ...action,
                    template: TableStringEnum.OWNER_3,
                    type: action.data.isSelected
                        ? TableStringEnum.DEACTIVATE
                        : TableStringEnum.ACTIVATE,
                    svg: true,
                }
            ); */
