import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

// model
import { CardRows } from '@shared/models/card-models/card-rows.model';
import { CardsModalData } from '@shared/components/ta-shared-modals/cards-modal/models/cards-modal-data.model';
import { AccountCardsModalConfig } from '@pages/account/pages/account-card-modal/constants/account-cards-modal.config';

export interface AccountCardDataState extends EntityState<CardRows> {}

export const initialState = (): AccountCardDataState => {
    const active: CardsModalData = {
        numberOfRows: 4,
        checked: true,
        front_side: AccountCardsModalConfig.displayRowsFront,
        back_side: AccountCardsModalConfig.displayRowsBack,
    };
    return {
        active: active,
    };
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'AccountCardData' })
export class AccountCardDataStore extends EntityStore<AccountCardDataState, any> {
    constructor() {
        super(initialState());
    }
}
