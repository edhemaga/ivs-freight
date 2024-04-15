import { Injectable } from '@angular/core';

// store
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

// models
import { LoadCardConfiguration } from '@pages/load/utils/constants/load-card-configuration.constants';
import { CardRows } from '@shared/models/card-models/card-rows.model';
import { CardsModalData } from '@shared/components/ta-shared-modals/cards-modal/models/cards-modal-data.model';

export interface LoadDataState extends EntityState<CardRows> {}

export const initialState = (): LoadDataState => {
    const template: CardsModalData = {
        numberOfRows: 4,
        checked: true,
        front_side: LoadCardConfiguration.displayRowsFrontTemplate,
        back_side: LoadCardConfiguration.displayRowsBackTemplate,
    };

    const pending: CardsModalData = {
        numberOfRows: 4,
        checked: true,
        front_side: LoadCardConfiguration.displayRowsFrontPending,
        back_side: LoadCardConfiguration.displayRowsBackPending,
    };

    const active: CardsModalData = {
        numberOfRows: 4,
        checked: true,
        front_side: LoadCardConfiguration.displayRowsFrontPending,
        back_side: LoadCardConfiguration.displayRowsBackActive,
    };

    const closed: CardsModalData = {
        numberOfRows: 4,
        checked: true,
        front_side: LoadCardConfiguration.displayRowsFrontClosed,
        back_side: LoadCardConfiguration.displayRowsBackClosed,
    };

    return {
        template: template,
        pending: pending,
        active: active,
        closed: closed,
    };
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'LoadData' })
export class LoadDataStore extends EntityStore<LoadDataState, any> {
    constructor() {
        super(initialState());
    }
}
