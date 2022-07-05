import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { CompanyResponse } from 'appcoretruckassist';
import { SettingsStoreService } from '../settings.service';
import { catchError, Observable, of, take, tap } from 'rxjs';
import { CompanyQuery } from './company-settings.query';
import { CompanyStore } from './company-settings.store';

@Injectable({ providedIn: 'root' })
export class companySettingsResolver implements Resolve<CompanyResponse[]> {
  constructor(
    private settingsService: SettingsStoreService,
    private settingsQuery: CompanyQuery,
    private companyStore: CompanyStore
  ) {}
  resolve(
  ): Observable<CompanyResponse[]> | Observable<any> {
  
      return this.settingsService.getCompany().pipe(
        catchError((error) => {
          return of('error');
        }),
        tap((companyResponse: CompanyResponse) => {
    
          this.companyStore.set({0:companyResponse});    
        })
      );
    }
  
}
