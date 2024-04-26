import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

// Store
import {
    TruckCardDataStore,
    TruckCardDataState,
} from './truck-card-modal.store';

// Enum
import { CardsModalStringEnum } from '@shared/components/ta-shared-modals/cards-modal/enums/cards-modal-string.enum';

@Injectable({ providedIn: 'root' })
export class truckCardModalQuery extends QueryEntity<TruckCardDataState> {
    public active$ = this.select(CardsModalStringEnum.ACTIVE);
    public inactive$ = this.select(CardsModalStringEnum.INACTIVE);

    constructor(protected truckCardDataStore: TruckCardDataStore) {
        super(truckCardDataStore);
    }
}
