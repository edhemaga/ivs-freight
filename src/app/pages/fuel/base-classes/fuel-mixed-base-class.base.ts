import { Subject } from 'rxjs';

// base classes
import { FuelDropdownMenuActionsBase } from '@pages/fuel/base-classes/fuel-dropdown-menu-actions.base';

// mixins
import { FuelMapMixin } from '@pages/fuel/pages/fuel-table/mixins';

// services
import { FuelService, ModalService } from '@shared/services';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { ConfirmationResetService } from '@shared/components/ta-shared-modals/confirmation-reset-modal/services/confirmation-reset.service';

class ConcreteFuelDropdownMenuActionsBase<
    T,
> extends FuelDropdownMenuActionsBase {
    destroy$: Subject<void>;
    
    viewData: T[] = [];

    fuelService: FuelService;
    modalService: ModalService;
    tableService: TruckassistTableService;
    confirmationResetService: ConfirmationResetService;

    updateToolbarDropdownMenuContent(action?: string): void {}
    handleShowMoreAction(): void {}
}

export const FuelMixedBase = FuelMapMixin(ConcreteFuelDropdownMenuActionsBase);
