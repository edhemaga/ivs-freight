import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

// model
import { CardRows } from '@shared/models/card-models/card-rows.model';
import { CardsModalData } from '@shared/components/ta-shared-modals/cards-modal/models/cards-modal-data.model';

// constants
import { RepairCardsModalConfig } from '../constants/repair-cards-modal.config';

export interface RepairCardDataState extends EntityState<CardRows> {}

export const initialState = (): RepairCardDataState => {
    const active: CardsModalData = {
        numberOfRows: 4,
        checked: true,
        front_side: RepairCardsModalConfig.displayRowsFrontActive,
        back_side: RepairCardsModalConfig.displayRowsBackActive,
    };
    const inactive: CardsModalData = {
        numberOfRows: 4,
        checked: true,
        front_side: RepairCardsModalConfig.displayRowsFrontInactive,
        back_side: RepairCardsModalConfig.displayRowsBackInactive,
    };
    const repairShop: CardsModalData = {
        numberOfRows: 4,
        checked: true,
        front_side: RepairCardsModalConfig.displayRowsFrontShop,
        back_side: RepairCardsModalConfig.displayRowsBackShop,
    };
    return {
        active: active,
        inactive: inactive,
        repairShop: repairShop
    };
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'RepairCardData' })
export class RepairCardDataStore extends EntityStore<RepairCardDataState, any> {
    constructor() {
        super(initialState());
    }
}
