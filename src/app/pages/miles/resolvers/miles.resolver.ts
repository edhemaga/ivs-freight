// External Libraries
import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

// Feature Services
import { MilesStoreService } from '@pages/miles/state/services/miles-store.service';
import { MilesByUnitListResponse, MilesService } from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class MilesResolver {
    constructor(
        private milesStoreService: MilesService,
        private milesService: MilesStoreService
    ) {}

    resolve(): Observable<MilesByUnitListResponse> {
        const activeList = this.milesStoreService.apiMilesListGet(null, 1);
        const states = this.milesStoreService.apiMilesStateFilterGet();

        return forkJoin([activeList, states]).pipe(
            map(([response, _states]) => {
                // TODO: 
                this.milesService.getList(response);
                this.milesService.setStates(_states);
                return response;
            })
        );
    }
}
