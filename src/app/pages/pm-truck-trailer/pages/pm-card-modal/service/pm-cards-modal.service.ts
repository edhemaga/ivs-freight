import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

// Store
import { PMCardDataStore } from '@pages/pm-truck-trailer/pages/pm-card-modal/state/pm-card-modal.store';

// Models
import { CardsModalData } from '@shared/components/ta-shared-modals/cards-modal/models/cards-modal-data.model';

// Helpers
import { CompareObjectsModal } from '@shared/components/ta-shared-modals/cards-modal/utils/helpers/cards-modal.helper';

// Enums
import { CardsModalStringEnum } from '@shared/components/ta-shared-modals/cards-modal/enums/cards-modal-string.enum';

@Injectable({
    providedIn: 'root',
})
export class PMCardsModalService {
    constructor(private pmStore: PMCardDataStore) {}

    private tabSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
        CardsModalStringEnum.ACTIVE
    );

    public tabObservable$: Observable<string> = this.tabSubject.asObservable();

    public updateTab(tab: string): void {
        this.tabSubject.next(tab);
    }
    public updateStore(data: CardsModalData, tab: string): void {
        const front_side = CompareObjectsModal.filterOutOBjects(
            data,
            CardsModalStringEnum.FRONT_SELECTED
        );
        const back_side = CompareObjectsModal.filterOutOBjects(
            data,
            CardsModalStringEnum.BACK_SELECTED
        );

        const sendToStore = {
            checked: data.checked,
            numberOfRows: data.numberOfRows,
            front_side: front_side,
            back_side: back_side,
        };

        switch (tab) {
            case CardsModalStringEnum.ACTIVE:
                this.pmStore.update((store) => {
                    return {
                        ...store,
                        truck: {
                            ...store.truck,
                            ...sendToStore,
                        },
                    };
                });
                break;

            case CardsModalStringEnum.INACTIVE:
                this.pmStore.update((store) => {
                    return {
                        ...store,
                        trailer: {
                            ...store.trailer,
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
