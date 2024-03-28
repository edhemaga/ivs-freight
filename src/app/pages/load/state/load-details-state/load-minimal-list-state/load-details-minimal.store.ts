import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { LoadResponse } from 'appcoretruckassist';

export interface LoadMinimalListState
    extends EntityState<LoadResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'loadMinimalList' })
export class LoadMinimalListStore extends EntityStore<LoadMinimalListState> {
    constructor() {
        super();
    }
}
