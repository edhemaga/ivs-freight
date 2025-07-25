
import { Injectable } from '@angular/core';

import { catchError, Observable, of, tap } from 'rxjs';

// mopdels
import { CompanyResponse } from 'appcoretruckassist';

// service
import { SettingsCompanyService } from '@pages/settings/services/settings-company.service';

// store
import { CompanyQuery } from '@pages/settings/state/company-state/company-settings.query';
import { CompanyStore } from '@pages/settings/state/company-state/company-settings.store';

@Injectable({ providedIn: 'root' })
export class CompanySettingsResolver  {
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
