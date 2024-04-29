import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

// Store
import {
    OwnerCardDataStore,
    OwnerCardDataState,
} from '@pages/owner/pages/owner-card-modal/state/owner-card-modal.store';

// Enum
import { CardsModalStringEnum } from '@shared/components/ta-shared-modals/cards-modal/enums/cards-modal-string.enum';

@Injectable({ providedIn: 'root' })
export class OwnerCardModalQuery extends QueryEntity<OwnerCardDataState> {
    public active$ = this.select(CardsModalStringEnum.ACTIVE);
    public inactive$ = this.select(CardsModalStringEnum.INACTIVE);

    constructor(protected ownerCardDataStore: OwnerCardDataStore) {
        super(ownerCardDataStore);
    }
}
