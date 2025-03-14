import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { LoadStoreService } from '@pages/load/pages/load-table/services/load-store.service';
import { LoadResponse } from 'appcoretruckassist';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class NewLoadDetailsResolver {
    constructor(private loadStoreService: LoadStoreService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<LoadResponse> {
        this.loadStoreService.dispatchLoadDetails(
            parseInt(route.paramMap.get('id'))
        );

        return this.loadStoreService.resolveLoadDetails$;
    }
}
