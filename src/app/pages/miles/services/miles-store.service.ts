import { Injectable } from '@angular/core';

// Core
import { MilesService } from 'appcoretruckassist';

@Injectable({ providedIn: 'root' })
export class MilesStoreService {
    constructor(private milesService: MilesService) {}

    getMiles(truckId?: number, activeTruck?: number) {
        return this.milesService.apiMilesListGet(truckId, activeTruck);
    }
}
