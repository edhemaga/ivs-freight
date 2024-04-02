import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { IntegrationService } from 'appcoretruckassist';
import { Observable, tap } from 'rxjs';
import { IntegrationStore } from '../state/settings-integration-state/integrationActiveStore';
@Injectable({
    providedIn: 'root',
})
export class CompanyIntegrationsResolver implements Resolve<any> {
    constructor(
        private integrationService: IntegrationService,
        private integrationStore: IntegrationStore
    ) {}

    resolve(): Observable<any> {
        return this.integrationService.apiIntegrationListGet(1, 1, 25).pipe(
            tap((integrationPagination) => {
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
