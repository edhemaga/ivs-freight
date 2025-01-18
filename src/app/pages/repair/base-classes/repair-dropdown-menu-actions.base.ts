import { Router } from '@angular/router';

// base classes
import { DropdownMenuActionsBase } from '@shared/base-classes';

// services
import { ModalService } from '@shared/services/modal.service';

// enums
import { DropdownMenuStringEnum } from '@shared/enums';

// models
import { TableCardBodyActions } from '@shared/models';
import { RepairResponse } from 'appcoretruckassist';

export abstract class RepairDropdownMenuActionsBase extends DropdownMenuActionsBase {
    constructor(
        // services
        protected modalService: ModalService,
        protected router: Router
    ) {
        super(modalService, router);
    }

    protected handleDropdownMenuActions<T extends RepairResponse>(
        event: TableCardBodyActions<T>,
        tableType: string
    ): void {
        const { type } = event;

        switch (type) {
            case DropdownMenuStringEnum.ALL_BILLS_TYPE:
                this.handleAllBillsAction();

                break;
            case DropdownMenuStringEnum.FINISH_ORDER_TYPE:
                this.handleFinishOrderAction(event, tableType);

                break;
            case DropdownMenuStringEnum.ALL_ORDERS_TYPE:
                this.handleAllOrdersAction();

                break;
            default:
                // call the parent class method to handle shared cases
                super.handleDropdownMenuActions(event, tableType);

                break;
        }
    }

    private handleAllBillsAction(): void {}

    private handleFinishOrderAction<T>(
        event: TableCardBodyActions<T>,
        tableType: string
    ): void {
        const adjustedEvent = {
            ...event,
            type: DropdownMenuStringEnum.EDIT_TYPE,
            isFinishOrder: true,
        };

        super.handleDropdownMenuActions(adjustedEvent, tableType);
    }

    private handleAllOrdersAction(): void {}
}
