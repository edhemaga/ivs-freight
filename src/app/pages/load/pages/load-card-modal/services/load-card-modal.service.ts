import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

// Models
import { CardsModalData } from '@shared/components/ta-shared-modals/cards-modal/models/cards-modal-data.model';

//Store
import { Store } from '@ngrx/store';
import {
    setActiveTabCards,
    setClosedTabCards,
    setPendingTabCards,
    setTemplateTabCards,
} from '@pages/load/pages/load-card-modal/state/load-card-modal.actions';

//Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { CardsModalStringEnum } from '@shared/components/ta-shared-modals/cards-modal/enums/cards-modal-string.enum';

@Injectable({
    providedIn: 'root',
})
export class LoadCardModalService {
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
            case TableStringEnum.PENDING:
                this.store.dispatch(setPendingTabCards(sendToStore));
                break;
            case TableStringEnum.TEMPLATE:
                this.store.dispatch(setTemplateTabCards(sendToStore));
                break;
            case TableStringEnum.CLOSED:
                this.store.dispatch(setClosedTabCards(sendToStore));
                break;
            default:
                break;
        }
    }
}
