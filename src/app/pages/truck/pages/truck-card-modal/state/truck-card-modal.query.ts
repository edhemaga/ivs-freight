import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

// Store
import {
    TruckCardDataStore,
    TruckCardDataState,
} from './truck-card-modal.store';

// Enum
import { CardsModalEnum } from 'src/app/shared/components/ta-shared-modals/cards-modal/enums/cards-modal.enum';

@Injectable({ providedIn: 'root' })
export class truckCardModalQuery extends QueryEntity<TruckCardDataState> {
    public active$ = this.select(CardsModalEnum.ACTIVE);
    public inactive$ = this.select(CardsModalEnum.INACTIVE);

    constructor(protected truckCardDataStore: TruckCardDataStore) {
        super(truckCardDataStore);
    }
}
