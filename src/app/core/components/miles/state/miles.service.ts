import { Injectable } from '@angular/core';
import { MilesService } from 'appcoretruckassist';
import { MilesTableStore } from './miles.store';

@Injectable({ providedIn: 'root' })
export class MilesStoreService {
    constructor(
        private milesStore: MilesTableStore,
        private milesService: MilesService
    ) {}

    getMiles() {
        return this.milesService.apiMilesListGet();
    }
}
