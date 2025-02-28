// External Libraries
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
