import { FuelItemStore } from '@pages/fuel/state/fuel-details-item-state/fuel-details-item.store';
import { FuelMinimalListStore } from '@pages/fuel/state/fuel-details-minimal-list-state/fuel-minimal-list.store';
import { FuelDetailsStore } from '@pages/fuel/state/fuel-details-state/fuel-details.store';
import { FuelStore } from '@pages/fuel/state/fuel-state/fuel-state.store';

export type FuelStoresType =
    | FuelDetailsStore
    | FuelItemStore
    | FuelStore
    | FuelMinimalListStore;
