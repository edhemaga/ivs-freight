import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { LoadMinimalResponse } from 'appcoretruckassist';

export interface LoadMinimalListState
    extends EntityState<LoadMinimalResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'loadMinimalList' })
export class LoadMinimalListStore extends EntityStore<LoadMinimalListState> {
    constructor() {
        super();
    }
}
