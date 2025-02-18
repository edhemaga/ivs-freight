import { Subject, takeUntil } from 'rxjs';

// base classes
import { DropdownMenuActionsBase } from '@shared/base-classes';

// components
import { FuelPurchaseModalComponent } from '@pages/fuel/pages/fuel-modals/fuel-purchase-modal/fuel-purchase-modal.component';

// services
import { FuelService } from '@shared/services/fuel.service';

// enums
import {
    DropActionsStringEnum,
    DropdownMenuStringEnum,
    TableStringEnum,
} from '@shared/enums';
import { ConfirmationModalStringEnum } from '@shared/components/ta-shared-modals/confirmation-modal/enums/confirmation-modal-string.enum';
import { ConfirmationActivationStringEnum } from '@shared/components/ta-shared-modals/confirmation-activation-modal/enums/confirmation-activation-string.enum';

// models
import { TableCardBodyActions } from '@shared/models';
import { FuelStopResponse, FuelTransactionResponse } from 'appcoretruckassist';

export abstract class FuelDropdownMenuActionsBase extends DropdownMenuActionsBase {
    protected abstract destroy$: Subject<void>;
    protected abstract viewData: FuelStopResponse[];

    // services
    protected abstract fuelService: FuelService;

    constructor() {
        super();
    }

    protected handleDropdownMenuActions<
        T extends FuelTransactionResponse | FuelStopResponse,
    >(action: TableCardBodyActions<T>, tableType: string): void {
        const { id, data, type } = action;

        switch (type) {
            case DropdownMenuStringEnum.ALL_TRANSACTIONS_TYPE:
                this.handleAllTransactionsAction();

                break;
            case DropdownMenuStringEnum.ADD_TRANSACTION_TYPE:
                this.handleAddTransactionAction(id, type);

                break;
            case DropdownMenuStringEnum.MARK_AS_FAVORITE_TYPE:
            case DropdownMenuStringEnum.UNMARK_FAVORITE_TYPE:
                const { favourite } = data as FuelStopResponse;

                this.handleFavoriteAction(id, !favourite);

                break;
            case DropdownMenuStringEnum.OPEN_BUSINESS_TYPE:
            case DropdownMenuStringEnum.CLOSE_BUSINESS_TYPE:
                this.handleFuelStopOpenCloseBusinessAction(action, tableType);

                break;
            case DropdownMenuStringEnum.DELETE_TYPE:
                this.handleFuelDeleteAction(action, tableType);

                break;
            default:
                // call the parent class method to handle shared cases
                super.handleSharedDropdownMenuActions(action, tableType);

                break;
        }
    }

    private handleAllTransactionsAction(): void {}

    private handleAddTransactionAction(id: number, type: string): void {
        const modalData = {
            type,
            data: { id },
        };

        this.modalService.openModal(
            FuelPurchaseModalComponent,
            { size: TableStringEnum.SMALL },
            {
                ...modalData,
            }
        );
    }

    private handleFavoriteAction(id: number, isPinned: boolean): void {
        this.fuelService
            .updateFuelStopFavorite(id, isPinned)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.viewData.sort(
                    (a, b) => Number(b.favourite) - Number(a.favourite)
                );
            });
    }

    private handleFuelStopOpenCloseBusinessAction<T extends FuelStopResponse>(
        action: TableCardBodyActions<T>,
        tableType: string
    ): void {
        const {
            data: { businessName, address, isClosed },
        } = action;

        const data = {
            status: +!isClosed,
        };

        const adjustedAction = {
            ...action,
            data,
            template: tableType,
            subType: tableType,
            subTypeStatus: TableStringEnum.BUSINESS,
            tableType: ConfirmationActivationStringEnum.FUEL_STOP_TEXT,
            modalTitle: businessName,
            modalSecondTitle: `${address.city}, ${address.stateShortName}`,
        };

        super.handleSharedDropdownMenuActions(adjustedAction, tableType);
    }

    private handleFuelDeleteAction<
        T extends FuelTransactionResponse | FuelStopResponse,
    >(action: TableCardBodyActions<T>, tableType: string): void {
        const isFuelTransaction =
            tableType === DropdownMenuStringEnum.FUEL_TRANSACTION;

        const adjustedAction = {
            ...action,
            subType: isFuelTransaction
                ? DropActionsStringEnum.DELETE_FUEL_TRANSACTION
                : DropActionsStringEnum.DELETE_FUEL_STOP,
            modalHeaderTitle: isFuelTransaction
                ? ConfirmationModalStringEnum.DELETE_FUEL_TRANSACTION
                : ConfirmationModalStringEnum.DELETE_FUEL_STOP,
        };

        super.handleSharedDropdownMenuActions(adjustedAction, tableType);
    }
}
