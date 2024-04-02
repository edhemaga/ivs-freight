import { Injectable } from '@angular/core';
import { MilesService } from 'appcoretruckassist';
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
