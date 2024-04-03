import { Injectable } from '@angular/core';

// Core
import { MilesService } from 'appcoretruckassist';

// store
import { MilesTableStore } from '../state/miles.store';

@Injectable({ providedIn: 'root' })
export class MilesStoreService {
    constructor(
        private milesStore: MilesTableStore,
        private milesService: MilesService
    ) {}

    getMiles(truckId?: number, activeTruck?: number) {
        return this.milesService.apiMilesListGet(truckId, activeTruck);
    }
}
