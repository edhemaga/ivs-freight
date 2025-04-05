// External Libraries
import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

// Feature Services
import { MilesStoreService } from '@pages/miles/state/services/miles-store.service';
import { MilesByUnitListResponse, MilesService } from 'appcoretruckassist';
import { ActivatedRouteSnapshot } from '@angular/router';
import { eActiveViewMode } from '@shared/enums';

@Injectable({
    providedIn: 'root',
})
export class MilesDetailsResolver {
    constructor(
        private milesStoreService: MilesService,
        private milesService: MilesStoreService
    ) {}
    resolve(route: ActivatedRouteSnapshot): any {
        const id = route.paramMap.get('id');

        const states = this.milesStoreService.apiMilesStateFilterGet();

        this.milesService.dispatchSetActiveViewMode(eActiveViewMode.Map);

        return forkJoin([states]).pipe(
            map(([_states]) => {
                this.milesService.dispatchStates(_states);
                this.milesService.loadUnitsOnPageChange(id);
            })
        );
    }
}
