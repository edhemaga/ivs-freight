import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { LoadResponse } from 'appcoretruckassist';

export interface LoadItemState extends EntityState<LoadResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'loadItem' })
export class LoadItemStore extends EntityStore<LoadItemState> {
    constructor() {
        super();
    }
}
