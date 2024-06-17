import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

// Models
import { CardsModalData } from '@shared/components/ta-shared-modals/cards-modal/models/cards-modal-data.model';

//Store
import { Store } from '@ngrx/store';
import {
    setActiveTabCards,
    setInactiveTabCards,
    setDriverApplicantTabCards,
} from '@pages/driver/pages/driver-card-modal/state/driver-card-modal.actions';

//Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { CardsModalStringEnum } from '@shared/components/ta-shared-modals/cards-modal/enums/cards-modal-string.enum';

@Injectable({
    providedIn: 'root',
})
export class DriverCardsModalService {
    constructor(private store: Store) {}

    private tabSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
        TableStringEnum.ACTIVE
    );

    public tabObservable$: Observable<string> = this.tabSubject.asObservable();

    public updateTab(tab: string): void {
        this.tabSubject.next(tab);
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

        switch (tab) {
            case TableStringEnum.ACTIVE:
                this.store.dispatch(setActiveTabCards(sendToStore));
                break;

            case TableStringEnum.INACTIVE:
                this.store.dispatch(setInactiveTabCards(sendToStore));
                break;
            case TableStringEnum.APPLICANTS:
                this.store.dispatch(setDriverApplicantTabCards(sendToStore));
                break;
            default:
                break;
        }
    }
}
