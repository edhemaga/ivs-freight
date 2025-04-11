import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

// Models
import { LoadResponse } from 'appcoretruckassist';

// Service
import { LoadStoreService } from '@pages/load/pages/load-table/services/load-store.service';

@Injectable({
    providedIn: 'root',
})
export class loadDetailsResolver {
    constructor(private loadStoreService: LoadStoreService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<LoadResponse> {
        // TODO: Teo
        this.loadStoreService.dispatchLoadDetails(
            parseInt(route.paramMap.get('id'))
        );

        return this.loadStoreService.resolveLoadDetails$;
    }
}
