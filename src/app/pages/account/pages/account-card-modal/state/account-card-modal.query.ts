import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

// Store
import {
    AccountCardDataStore,
    AccountCardDataState,
} from '@pages/account/pages/account-card-modal/state/account-card-modal.store';

// Enum
import { CardsModalStringEnum } from '@shared/components/ta-shared-modals/cards-modal/enums/cards-modal-string.enum';

@Injectable({ providedIn: 'root' })
export class accountCardModalQuery extends QueryEntity<AccountCardDataState> {
    public active$ = this.select(CardsModalStringEnum.ACTIVE);
    public inactive$ = this.select(CardsModalStringEnum.INACTIVE);

    constructor(protected accountCardDataStore: AccountCardDataStore) {
        super(accountCardDataStore);
    }
}
