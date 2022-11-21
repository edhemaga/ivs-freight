import { DispatcherState, DispatcherStore } from './dispatcher.store';
import { Injectable } from '@angular/core';

import { QueryEntity } from '@datorama/akita';

@Injectable({
  providedIn: 'root',
})
export class DispatcherQuery extends QueryEntity<DispatcherState> {
  modalList$ = this.select('modal');
  dispatchboardList$ = this.select('dispatchList');

  dispatchBoardListData$ = this.select(
    (state) => state.dispatchList.pagination.data
  );

  modalBoardListData$ = this.select((state) => state.modal);

  dispatchboardShortList$ = this.select((state) => ({
    drivers: state.modal.drivers,
    trucks: state.modal.trucks,
    trailers: state.modal.trailers,
    statuses: state.modal.dispatchStatuses,
  }));

  get modalList() {
    return this.getValue().modal;
  }

  constructor(protected store: DispatcherStore) {
    super(store);
  }
}
