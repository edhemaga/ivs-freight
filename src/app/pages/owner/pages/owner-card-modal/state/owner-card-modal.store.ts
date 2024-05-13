import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

// model
import { CardRows } from '@shared/models/card-models/card-rows.model';
import { CardsModalData } from '@shared/components/ta-shared-modals/cards-modal/models/cards-modal-data.model';
import { OwnerCardsModalConfig } from '@pages/owner/pages/owner-card-modal/constants/owner-cards-modal.config';

export interface OwnerCardDataState extends EntityState<CardRows> {}

export const initialState = (): OwnerCardDataState => {
    const active: CardsModalData = {
        numberOfRows: 4,
        checked: true,
        front_side: OwnerCardsModalConfig.displayRowsFrontActive,
        back_side: OwnerCardsModalConfig.displayRowsBackActive,
    };
    const inactive: CardsModalData = {
        numberOfRows: 4,
        checked: true,
        front_side: OwnerCardsModalConfig.displayRowsFrontInactive,
        back_side: OwnerCardsModalConfig.displayRowsBackInactive,
    };
    return {
        active: active,
        inactive: inactive,
    };
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'OwnerCardData' })
export class OwnerCardDataStore extends EntityStore<OwnerCardDataState, any> {
    constructor() {
        super(initialState());
    }
}
