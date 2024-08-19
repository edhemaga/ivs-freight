import { Injectable } from '@angular/core';


import { Observable, of, catchError, tap } from 'rxjs';

// models
import { CompanyOfficeListResponse } from 'appcoretruckassist';

// service
import { CompanyOfficeService } from '@shared/services/company-office.service';

// store
import {
    OfficeState,
    OfficeStore,
} from '@pages/settings/state/setting-ofice-state/company-office.store';

@Injectable({
    providedIn: 'root',
})
export class CompanyOfficeResolver  {
    pageIndex: number = 1;
    pageSize: number = 25;
    count: number;
    constructor(
        private officeService: CompanyOfficeService,
        private officeStore: OfficeStore
    ) {}
    resolve(): Observable<OfficeState | boolean> {
        return this.officeService
            .getOfficeList(this.pageIndex, this.pageSize, this.count)
            .pipe(
                catchError(() => {
                    return of('No Office data...');
                }),
                tap((officePagination: CompanyOfficeListResponse) => {
                    this.officeStore.set(officePagination.pagination.data);
                })
            );
    }
}
