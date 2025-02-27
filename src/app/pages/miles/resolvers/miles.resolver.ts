import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { MilesByUnitListResponse, MilesService } from 'appcoretruckassist';
import { loadMilesSuccess } from '../state/actions/miles.actions';
import { MilesStoreService } from '../state/services/miles-store.service';

@Injectable({
    providedIn: 'root',
})
export class MilesResolver {
    constructor(
        private milesStoreService: MilesService,
        private milesService: MilesStoreService
    ) {}

    resolve(): Observable<MilesByUnitListResponse> {
      // SHOULD WE READ THIS 1 FROM STORE?
        const activeList = this.milesStoreService.apiMilesListGet(null, 1);

        return activeList.pipe(
            map((response: MilesByUnitListResponse) => {
                this.milesService.getList(response);
                return response;
            })
        );
    }
}
