import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

// model
import { CardRows } from '@shared/models/card-models/card-rows.model';
import { CardsModalData } from '@shared/components/ta-shared-modals/cards-modal/models/cards-modal-data.model';
import { TruckCardsModalConfig } from '../constants/truck-cards-modal.config';

export interface TruckCardDataState extends EntityState<CardRows> {}

export const initialState = (): TruckCardDataState => {
    const active: CardsModalData = {
        numberOfRows: 4,
        checked: true,
        front_side: TruckCardsModalConfig.displayRowsFrontActive,
        back_side: TruckCardsModalConfig.displayRowsBackActive,
    };
    const inactive: CardsModalData = {
        numberOfRows: 4,
        checked: true,
        front_side: TruckCardsModalConfig.displayRowsFrontInactive,
        back_side: TruckCardsModalConfig.displayRowsBackInactive,
    };
    return {
        active: active,
        inactive: inactive,
    };
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'TruckCardData' })
export class TruckCardDataStore extends EntityStore<TruckCardDataState, any> {
    constructor() {
        super(initialState());
    }
}
