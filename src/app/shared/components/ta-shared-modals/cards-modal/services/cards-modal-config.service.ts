import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

// models
import { CardsModalData } from '@shared/components/ta-shared-modals/cards-modal/models/cards-modal-data.model';
import { CompareObjectsModal } from '@shared/components/ta-shared-modals/cards-modal/utils/helpers/cards-modal.helper';

// store
import { LoadDataStore } from '@shared/components/ta-shared-modals/cards-modal/state/load-modal.store';

@Injectable({
    providedIn: 'root',
})
export class CardsModalConfigService {
    constructor(private loadStore: LoadDataStore) {}

    private tabSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
        'pending'
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
            case 'pending':
                this.loadStore.update((store) => {
                    return {
                        ...store,
                        pending: {
                            ...store.pending,
                            ...sendToStore,
                        },
                    };
                });
                break;

            case 'template':
                this.loadStore.update((store) => {
                    return {
                        ...store,
                        template: {
                            ...store.template,
                            ...sendToStore,
                        },
                    };
                });
                break;
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
            case 'closed':
                this.loadStore.update((store) => {
                    return {
                        ...store,
                        closed: {
                            ...store.closed,
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
