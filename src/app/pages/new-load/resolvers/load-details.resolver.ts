import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

// Service
import { LoadStoreService } from '@pages/new-load/state/services/load-store.service';

@Injectable({
    providedIn: 'root',
})
export class loadDetailsResolver {
    constructor(private loadStoreService: LoadStoreService) {}

    resolve(route: ActivatedRouteSnapshot): void {
        const id = route.paramMap.get('id');
        return this.loadStoreService.dispatchGetLoadDetails(parseInt(id));
    }
}
