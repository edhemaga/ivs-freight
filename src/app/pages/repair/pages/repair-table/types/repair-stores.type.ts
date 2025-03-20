import { RepairMinimalListStore } from '@pages/repair/state/repair-details-minimal-list-state/repair-minimal-list.store';
import { RepairItemStore } from '@pages/repair/state/repair-details-item-state/repair-details-item.store';
import { RepairDetailsStore } from '@pages/repair/state/repair-details-state/repair-details.store';
import { RepairShopStore } from '@pages/repair/state/repair-shop-state/repair-shop.store';

export type RepairStoresType =
    | RepairDetailsStore
    | RepairItemStore
    | RepairShopStore
    | RepairMinimalListStore;
