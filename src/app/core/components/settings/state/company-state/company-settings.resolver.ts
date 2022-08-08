import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { CompanyResponse } from 'appcoretruckassist';
import { SettingsCompanyService } from './settings-company.service';
import { BehaviorSubject, catchError, Observable, of, take, tap } from 'rxjs';
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
        this.companyStore.set({ ids: companyResponse });
      })
    );
  }
}
