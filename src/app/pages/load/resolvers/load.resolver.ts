import { Injectable } from '@angular/core';

// services
import { LoadStoreService } from '@pages/load/pages/load-table/services/load-store.service';
import { eLoadStatusType } from '../pages/load-table/enums';
import { Observable } from 'rxjs';
import { LoadListResponse, LoadTemplateListResponse } from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class LoadResolver {
    constructor(
        // services
        private loadStoreService: LoadStoreService
    ) {}
    
    resolve(): Observable<LoadListResponse | LoadTemplateListResponse> {
        this.loadStoreService.dispatchLoadList({
            statusType: eLoadStatusType.Active,
        });

        return this.loadStoreService.resolveInitialData$;
    }
}
