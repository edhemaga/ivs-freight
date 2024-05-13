import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

// Store
import {
    OwnerCardDataStore,
    OwnerCardDataState,
} from '@pages/owner/pages/owner-card-modal/state/owner-card-modal.store';

// Enum
import { CardsModalEnum } from '@shared/components/ta-shared-modals/cards-modal/enums/cards-modal.enum';

@Injectable({ providedIn: 'root' })
export class OwnerCardModalQuery extends QueryEntity<OwnerCardDataState> {
    public active$ = this.select(CardsModalEnum.ACTIVE);
    public inactive$ = this.select(CardsModalEnum.INACTIVE);

    constructor(protected ownerCardDataStore: OwnerCardDataStore) {
        super(ownerCardDataStore);
    }
}
