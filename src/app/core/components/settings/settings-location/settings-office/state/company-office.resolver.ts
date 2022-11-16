import { CompanyOfficeListResponse } from './../../../../../../../../appcoretruckassist/model/companyOfficeListResponse';
import { CompanyTOfficeService } from './company-office.service';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { OfficeState, OfficeStore } from './company-office.store';

@Injectable({
    providedIn: 'root',
})
export class cOfficeResolver implements Resolve<OfficeState> {
    pageIndex: number = 1;
    pageSize: number = 25;
    count: number;
    constructor(
        private officeService: CompanyTOfficeService,
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
