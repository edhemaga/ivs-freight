import { Injectable } from '@angular/core';

import { QueryEntity } from '@datorama/akita';
import { LoadDataState, LoadDataStore } from './load-modal.store';

@Injectable({ providedIn: 'root' })
export class LoadQuery extends QueryEntity<LoadDataState> {
    public template$ = this.select('template');

    public pending$ = this.select('pending');

    public active$ = this.select('active');

    public closed$ = this.select('closed');

    constructor(protected loadStore: LoadDataStore) {
        super(loadStore);
    }
}
