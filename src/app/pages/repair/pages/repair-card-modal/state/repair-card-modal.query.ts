import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

// Store
import {
    RepairCardDataStore,
    RepairCardDataState,
} from './repair-card-modal.store';

// Enum
import { CardsModalEnum } from '@shared/components/ta-shared-modals/cards-modal/enums/cards-modal.enum';

@Injectable({ providedIn: 'root' })
export class RepairCardModalQuery extends QueryEntity<RepairCardDataState> {
    public truck$ = this.select(CardsModalEnum.ACTIVE);
    public trailer$ = this.select(CardsModalEnum.INACTIVE);
    public repairShop$ = this.select(CardsModalEnum.REPAIR_SHOP);

    constructor(protected repairCardDataStore: RepairCardDataStore) {
        super(repairCardDataStore);
    }
}
