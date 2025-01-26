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

// models
import { TableCardBodyActions } from '@shared/models';
import { FuelStopResponse, FuelTransactionResponse } from 'appcoretruckassist';

export abstract class FuelDropdownMenuActionsBase extends DropdownMenuActionsBase {
    protected abstract destroy$: Subject<void>;

    // services
    protected abstract fuelService: FuelService;

    constructor() {
        super();
    }

    protected handleDropdownMenuActions<
        T extends FuelTransactionResponse | FuelStopResponse,
    >(event: TableCardBodyActions<T>, tableType: string): void {
        console.log('event', event);
        console.log('tableType', tableType);
        const { id, data, type } = event;

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
            case DropdownMenuStringEnum.DELETE_TYPE:
                this.handleFuelDeleteAction(event, tableType);

                break;
            default:
                // call the parent class method to handle shared cases
                super.handleSharedDropdownMenuActions(event, tableType);

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
                /*   this.viewData.sort(
                        (a, b) => Number(b.isFavorite) - Number(a.isFavorite)
                    );
    
                    const favoritedRepairShop = this.viewData.find(
                        (item) => item.id === repairShopId
                    );
    
                    this.updateMapItem(favoritedRepairShop);
     */
            });
    }

    private handleFuelDeleteAction<
        T extends FuelTransactionResponse | FuelStopResponse,
    >(event: TableCardBodyActions<T>, tableType: string): void {
        const isFuelTransaction =
            tableType === DropdownMenuStringEnum.FUEL_TRANSACTION;

        const adjustedEvent = {
            ...event,
            subType: isFuelTransaction
                ? DropActionsStringEnum.DELETE_FUEL_TRANSACTION
                : DropActionsStringEnum.DELETE_FUEL_STOP,
            modalHeaderTitle: isFuelTransaction
                ? ConfirmationModalStringEnum.DELETE_FUEL_TRANSACTION
                : ConfirmationModalStringEnum.DELETE_FUEL_STOP,
        };

        super.handleSharedDropdownMenuActions(adjustedEvent, tableType);
    }
}
