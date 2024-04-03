import { Resolve } from '@angular/router';
import { Injectable } from '@angular/core';

import { catchError, Observable, of, tap } from 'rxjs';

// core
import { CompanyResponse } from 'appcoretruckassist';

// service
import { SettingsCompanyService } from '../services/settings-company.service';

// store
import { CompanyQuery } from '../state/company-state/company-settings.query';
import { CompanyStore } from '../state/company-state/company-settings.store';

@Injectable({ providedIn: 'root' })
export class CompanySettingsResolver implements Resolve<CompanyResponse[]> {
    public showNoDataComponent: boolean;
    constructor(
        private settingsCompanyService: SettingsCompanyService,
        private settingsQuery: CompanyQuery,
        private companyStore: CompanyStore
    ) {}
    resolve(): Observable<CompanyResponse[]> | Observable<any> {
        return this.settingsCompanyService.getCompany().pipe(
            catchError(() => {
                return of('error');
            }),
            tap((companyResponse: CompanyResponse) => {
                localStorage.setItem(
                    'companiesCount',
                    JSON.stringify({
                        numberOfCompany: companyResponse.divisions.length,
                    })
                );

                this.companyStore.set([companyResponse]);
            })
        );
    }
}
