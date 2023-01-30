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

        const companyData$ = this.settingsCompanyService.getCompany();
        const copmanyInsurance$ = this.settingsCompanyService.getCompanyInsurance();
        const copmanyPayroll$ = this.settingsCompanyService.getCompanyPayroll();

        return forkJoin({
            companyData: companyData$,
            copmanyInsurance: copmanyInsurance$,
            copmanyPayroll: copmanyPayroll$,
        }).pipe(
            tap((data) => {

                let companyResponse = data.companyData;
                localStorage.setItem(
                    'companiesCount',
                    JSON.stringify({
                        numberOfCompany: companyResponse.divisions.length,
                    })
                );
                let insArray = [];
                insArray.push(data.copmanyInsurance);
                companyResponse.insurancePoliciesNewData = insArray;
                companyResponse.companyPayrollsNewData = data.copmanyPayroll;
                this.companyStore.set([companyResponse]);
                //console.log('--data---', data);
                //console.log('--companyResponse---', companyResponse);
            })
        );
        /*
        return this.settingsCompanyService.getCompany().pipe(
            catchError((error) => {
                return of('error');
            }),
            tap((companyResponse: CompanyResponse) => {

                localStorage.setItem(
                    'companiesCount',
                    JSON.stringify({
                        numberOfCompany: companyResponse.divisions.length,
                    })
                );
                
                console.log("WHAT IS COMPANY RESPONSE");
                console.log(companyResponse);
                this.companyStore.set([companyResponse]);
            })
        ); */
    }
}
