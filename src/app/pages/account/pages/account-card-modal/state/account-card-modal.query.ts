import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

// Store
import {
    AccountCardDataStore,
    AccountCardDataState,
} from './account-card-modal.store';

// Enum
import { CardsModalEnum } from 'src/app/shared/components/ta-shared-modals/cards-modal/enums/cards-modal.enum';

@Injectable({ providedIn: 'root' })
export class accountCardModalQuery extends QueryEntity<AccountCardDataState> {
    public active$ = this.select(CardsModalEnum.ACTIVE);
    public inactive$ = this.select(CardsModalEnum.INACTIVE);

    constructor(protected accountCardDataStore: AccountCardDataStore) {
        super(accountCardDataStore);
    }
}
