import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

// Store
import { RepairCardDataStore } from '@pages/repair/pages/repair-card-modal/state/repair-card-modal.store';

// Models
import { CardsModalData } from '@shared/components/ta-shared-modals/cards-modal/models/cards-modal-data.model';

// Helpers
import { CompareObjectsModal } from '@shared/components/ta-shared-modals/cards-modal/utils/helpers/cards-modal.helper';

@Injectable({
    providedIn: 'root',
})
export class RepairCardsModalService {
    constructor(private loadStore: RepairCardDataStore) {}

    private tabSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
        'active'
    );

    public tabObservable$: Observable<string> = this.tabSubject.asObservable();

    public updateTab(tab: string): void {
        this.tabSubject.next(tab);
    }
    public updateStore(data: CardsModalData, tab: string): void {
        const front_side = CompareObjectsModal.filterOutOBjects(
            data,
            'frontSelectedTitle_'
        );
        const back_side = CompareObjectsModal.filterOutOBjects(
            data,
            'backSelectedTitle_'
        );

        const sendToStore = {
            checked: data.checked,
            numberOfRows: data.numberOfRows,
            front_side: front_side,
            back_side: back_side,
        };

        switch (tab) {
            case 'active':
                this.loadStore.update((store) => {
                    return {
                        ...store,
                        active: {
                            ...store.active,
                            ...sendToStore,
                        },
                    };
                });
                break;

            case 'inactive':
                this.loadStore.update((store) => {
                    return {
                        ...store,
                        inactive: {
                            ...store.inactive,
                            ...sendToStore,
                        },
                    };
                });
                break;

            default:
                break;
        }
    }
}
