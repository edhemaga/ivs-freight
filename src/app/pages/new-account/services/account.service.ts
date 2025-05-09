import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Models
import { GetCompanyAccountListResponse } from 'appcoretruckassist';

// Environment
import { environment } from 'src/environments/environment';
import { ITableConfig } from '@shared/components/new-table/interfaces';
import { IStateFilters } from '@shared/interfaces';

@Injectable({
    providedIn: 'root',
})
export class AccountService {
    constructor(public http: HttpClient) {}

    public getAccountList(
        page: number,
        filters: IStateFilters,
        tableSorting: ITableConfig
    ): Observable<GetCompanyAccountListResponse> {
        let params = new HttpParams();

        if (page) {
            params = params.append('PageIndex', page);
        }

        if (tableSorting.sortKey)
            params = params.append('SortBy', tableSorting.sortKey);
        if (tableSorting.sortDirection)
            params = params.append('SortOrder', tableSorting.sortDirection);

        if (filters.searchQuery?.length) {
            const { searchQuery } = filters;
            if (searchQuery[0])
                params = params.append('search', filters.searchQuery[0]);

            if (searchQuery[1])
                params = params.append('search1', filters.searchQuery[1]);

            if (searchQuery[2])
                params = params.append('search2', filters.searchQuery[2]);
        }

        return this.http.get<GetCompanyAccountListResponse>(
            `${environment.API_ENDPOINT}/api/companyaccount/list`
        );
    }
}
