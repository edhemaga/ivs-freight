import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

// Models
import { CardRows } from 'src/app/shared/models/card-models/card-rows.model';
import { CardsModalData } from 'src/app/shared/components/ta-shared-modals/cards-modal/models/cards-modal-data.model';
import { PMCardsModalConfig } from '../utils/constants/pm-cards-modal.config';

export interface PMCardDataState extends EntityState<CardRows> {}

export const initialState = (): PMCardDataState => {
    const truck: CardsModalData = {
        numberOfRows: 4,
        checked: true,
        front_side: PMCardsModalConfig.displayRowsFrontTruck,
        back_side: PMCardsModalConfig.displayRowsBackTruck,
    };
    const trailer: CardsModalData = {
        numberOfRows: 4,
        checked: true,
        front_side: PMCardsModalConfig.displayRowsFrontTrailer,
        back_side: PMCardsModalConfig.displayRowsBackTrailer,
    };
    return {
        truck: truck,
        trailer: trailer,
    };
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'PMCardData' })
export class PMCardDataStore extends EntityStore<PMCardDataState, any> {
    constructor() {
        super(initialState());
    }
}
