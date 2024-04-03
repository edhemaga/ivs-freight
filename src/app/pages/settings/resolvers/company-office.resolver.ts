import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

//core
import { CompanyOfficeListResponse } from 'appcoretruckassist';

//Service
import { CompanyOfficeService } from '../../../shared/services/company-office.service';

//Store
import {
    OfficeState,
    OfficeStore,
} from '../state/setting-ofice-state/company-office.store';

@Injectable({
    providedIn: 'root',
})
export class CompanyOfficeResolver implements Resolve<OfficeState> {
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
