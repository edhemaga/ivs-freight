import { Injectable } from '@angular/core';

// Akita
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

// Models
import { PMTrailerResponse } from 'appcoretruckassist';

export interface PmListTrailerState
    extends EntityState<PMTrailerResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'pmListTrailer' })
export class PmListTrailerStore extends EntityStore<PmListTrailerState> {
    constructor() {
        super();
    }
}
