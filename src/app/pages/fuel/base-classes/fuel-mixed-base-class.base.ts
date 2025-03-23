import { Subject } from 'rxjs';

// base classes
import { FuelDropdownMenuActionsBase } from '@pages/fuel/base-classes/fuel-dropdown-menu-actions.base';

// mixins
import { FuelMapMixin } from '@pages/fuel/pages/fuel-table/mixins';

// services
import { FuelService, ModalService } from '@shared/services';

class ConcreteFuelDropdownMenuActionsBase<
    T,
> extends FuelDropdownMenuActionsBase {
    destroy$: Subject<void>;
    viewData: T[] = [];
    fuelService: FuelService;
    modalService: ModalService;

    handleShowMoreAction(): void {}
}

export const FuelMixedBase = FuelMapMixin(ConcreteFuelDropdownMenuActionsBase);
