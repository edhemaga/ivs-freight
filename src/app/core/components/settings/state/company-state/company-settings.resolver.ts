import { Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { CompanyResponse } from 'appcoretruckassist';
import { SettingsCompanyService } from './settings-company.service';
import { catchError, Observable, of, tap, forkJoin } from 'rxjs';
import { CompanyQuery } from './company-settings.query';
import { CompanyStore } from './company-settings.store';

@Injectable({ providedIn: 'root' })
export class companySettingsResolver implements Resolve<CompanyResponse[]> {
    public showNoDataComponent: boolean;
    constructor(
        private settingsCompanyService: SettingsCompanyService,
        private settingsQuery: CompanyQuery,
        private companyStore: CompanyStore
    ) {}
    resolve(): Observable<CompanyResponse[]> | Observable<any> {




        return this.settingsCompanyService.getCompany().pipe(
            catchError((error) => {
                return of('error');
            }),
            tap((companyResponse: CompanyResponse) => {

                let companyId = companyResponse.id;
                /*
                const insuranceData$ = this.settingsCompanyService.getCompanyInsurance(
                    companyId,
                );

                const payrollData$ = this.settingsCompanyService.getCompanyPayroll(
                    companyId,
                );


                forkJoin({
                    shipperData: insuranceData$,
                    shipperLoads: payrollData$,
                }).pipe(
                    tap((data) => {
                        console.log('--data--', data);
                    })
                );   
                    */
                localStorage.setItem(
                    'companiesCount',
                    JSON.stringify({
                        numberOfCompany: companyResponse.divisions.length,
                    })
                );
                
                console.log("WHAT IS COMPANY RESPONSE");
                console.log(companyResponse);
                console.log(companyId);
                this.companyStore.set([companyResponse]);
            })
        );
    }
}
