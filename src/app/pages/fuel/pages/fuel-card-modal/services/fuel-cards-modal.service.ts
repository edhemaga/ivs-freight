import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

// Models
import { CardsModalData } from '@shared/components/ta-shared-modals/cards-modal/models/cards-modal-data.model';

//Store
import { Store } from '@ngrx/store';
import {
    setActiveTabCards,
    setInactiveTabCards,
} from '@pages/fuel/pages/fuel-card-modal/state';

//Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { CardsModalStringEnum } from '@shared/components/ta-shared-modals/cards-modal/enums/cards-modal-string.enum';

@Injectable({
    providedIn: 'root',
})
export class FuelCardsModalService {
    constructor(private store: Store) {}

    private tabSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
        TableStringEnum.FUEL_TRANSACTION
    );

    public tabObservable$: Observable<string> = this.tabSubject.asObservable();

    public updateTab(tab: string): void {
        const currentTab =
            tab === TableStringEnum.FUEL_TRANSACTION
                ? TableStringEnum.ACTIVE
                : TableStringEnum.INACTIVE;

        this.tabSubject.next(currentTab);
    }
    public updateStore(data: CardsModalData, tab: string): void {
        const sendToStore = {
            checked: data.checked,
            numberOfRows: data.numberOfRows,
            front_side: data.front_side.map((item, index) => {
                return item.inputItem.title && data.numberOfRows >= index + 1
                    ? item.inputItem
                    : !item.inputItem.title && data.numberOfRows >= index + 1
                    ? { title: CardsModalStringEnum.EMPTY, key: '' }
                    : null;
            }),
            back_side: data.back_side.map((item, index) => {
                return item.inputItem.title && data.numberOfRows >= index + 1
                    ? item.inputItem
                    : !item.inputItem.title && data.numberOfRows >= index + 1
                    ? { title: CardsModalStringEnum.EMPTY, key: '' }
                    : null;
            }),
        };

        console.log(tab, 'set for tab');

        switch (tab) {
            case TableStringEnum.ACTIVE:
                this.store.dispatch(setActiveTabCards(sendToStore));
                break;

            case TableStringEnum.INACTIVE:
                this.store.dispatch(setInactiveTabCards(sendToStore));
                break;
            default:
                break;
        }
    }
}
