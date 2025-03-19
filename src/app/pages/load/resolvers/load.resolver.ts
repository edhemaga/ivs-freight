import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// enums
import { eLoadStatusType } from '@pages/load/pages/load-table/enums';
import { eLoadStatusStringType } from '@pages/new-load/enums';

// services
import { LoadStoreService } from '@pages/load/pages/load-table/services/load-store.service';

// models
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

        this.loadStoreService.loadDispatchFilters({
            loadStatusType: eLoadStatusStringType.ACTIVE,
        });

        return this.loadStoreService.resolveInitialData$;
    }
}
