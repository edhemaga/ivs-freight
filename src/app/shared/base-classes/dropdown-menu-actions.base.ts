// components
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';
import { RepairOrderModalComponent } from '@pages/repair/pages/repair-modals/repair-order-modal/repair-order-modal.component';

// enums
import { DropdownMenuStringEnum, TableStringEnum } from '@shared/enums';

// helpers
import { DropdownMenuActionsHelper } from '@shared/utils/helpers/dropdown-menu-helpers';

// services
import { ModalService } from '@shared/services/modal.service';

// models
import { TableCardBodyActions } from '@shared/models';
import { PMTrailerUnitResponse, PMTruckUnitResponse } from 'appcoretruckassist';

export abstract class DropdownMenuActionsBase {
    constructor(protected modalService: ModalService) {}

    protected handleDropdownMenuActions<T>(
        event: TableCardBodyActions<T>,
        tableType: string
    ): void {
        console.log('event', event);
        console.log('tableType', tableType);

        const { data, type } = event;

        switch (type) {
            case DropdownMenuStringEnum.EDIT_TYPE:
                this.handleEditAction(event, tableType);

                break;
            case DropdownMenuStringEnum.DELETE_TYPE:
                this.handleDeleteAction(event, tableType);

                break;
            case DropdownMenuStringEnum.SHOW_MORE:
                this.handleShowMoreAction();

                break;
            case DropdownMenuStringEnum.SHARE_TYPE:
                this.handleShareAction();

                break;
            case DropdownMenuStringEnum.PRINT_TYPE:
                this.handlePrintAction();

                break;
            case DropdownMenuStringEnum.ADD_REPAIR_BILL_TYPE:
                this.handleAddRepairBillAction(data);

                break;
            default:
                break;
        }
    }

    private handleEditAction<T>(
        event: TableCardBodyActions<T>,
        tableType: string
    ): void {
        const editActionModalComponent =
            DropdownMenuActionsHelper.getEditActionModalComponent(tableType);

        this.modalService.openModal(
            editActionModalComponent,
            { size: TableStringEnum.SMALL },
            {
                ...event,
            }
        );
    }

    private handleDeleteAction<T>(
        event: TableCardBodyActions<T>,
        tableType: string
    ): void {
        this.modalService.openModal(
            ConfirmationModalComponent,
            { size: TableStringEnum.SMALL },
            {
                ...event,
                template: tableType,
            }
        );
    }

    private handleShareAction(): void {}

    private handlePrintAction(): void {}

    private handleAddRepairBillAction(
        data: PMTruckUnitResponse | PMTrailerUnitResponse
    ): void {
        const { id, isTruckUnit } =
            DropdownMenuActionsHelper.getPmRepairUnitId(data);

        const type = isTruckUnit
            ? DropdownMenuStringEnum.ADD_REPAIR_BILL_TRUCK
            : DropdownMenuStringEnum.ADD_REPAIR_BILL_TRAILER;

        this.modalService.openModal(
            RepairOrderModalComponent,
            {
                size: TableStringEnum.LARGE,
            },
            {
                type,
                preSelectedUnit: id,
            }
        );
    }

    // protected abstract - dependency
    protected abstract handleShowMoreAction(): void;
}
