import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

// Store
import { PMCardDataStore, PMCardDataState } from './pm-card-modal.store';

// Enum
import { CardsModalEnum } from 'src/app/shared/components/ta-shared-modals/cards-modal/enums/cards-modal.enum';

@Injectable({ providedIn: 'root' })

export class PMCardModalQuery extends QueryEntity<PMCardDataState> {
    public truck$ = this.select(CardsModalEnum.TRUCK);
    public trailer$ = this.select(CardsModalEnum.TRAILER);

    constructor(protected pmCardDataStore: PMCardDataStore) {
        super(pmCardDataStore);
    }
}
