import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { IntegrationService } from 'appcoretruckassist';
import { Observable, tap } from 'rxjs';
import { IntegrationActiveStore } from './integrationActiveStore';
@Injectable({
    providedIn: 'root',
})
export class integrationResolver implements Resolve<any> {
    constructor(
        private integrationService: IntegrationService,
        private integrationStore: IntegrationActiveStore
    ) {}

    resolve(): Observable<any> {
        console.log('hi');
        return this.integrationService.apiIntegrationListGet(1, 1, 25).pipe(
            tap((integrationPagination) => {
                console.log(integrationPagination.pagination);
                localStorage.setItem(
                    'integrationTableCount',
                    JSON.stringify({
                        active: integrationPagination.pagination.count,
                    })
                );
                this.integrationStore.set(
                    integrationPagination.pagination?.data
                );
            })
        );
    }
}
