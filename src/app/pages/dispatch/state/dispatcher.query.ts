import { Injectable } from '@angular/core';

// Akita
import { QueryEntity } from '@datorama/akita';

// Store
import {
    DispatcherState,
    DispatcherStore,
} from '@pages/dispatch/state/dispatcher.store';

@Injectable({
    providedIn: 'root',
})
export class DispatcherQuery extends QueryEntity<DispatcherState> {
    modalList$ = this.select('modal');

    dispatchBoardListData$ = this.select(
        (state) => state.dispatchList.dispatchBoards
    );

    modalBoardListData$ = this.select((state) => state.modal);

    dispatchboardShortList$ = this.select((state) => ({
        drivers: state.modal.drivers,
        trucks: state.modal.trucks,
        trailers: state.modal.trailers,
        statuses: state.modal.dispatchStatuses,
        parkings: state.modal.parkings,
    }));

    get modalList() {
        return this.getValue().modal;
    }

    constructor(protected store: DispatcherStore) {
        super(store);
    }
}
