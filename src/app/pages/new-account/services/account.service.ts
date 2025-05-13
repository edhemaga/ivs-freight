import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Models
import {
    AccountColorResponse,
    CompanyAccountModalResponse,
    GetCompanyAccountListResponse,
} from 'appcoretruckassist';

// Environment
import { environment } from 'src/environments/environment';

// interfaces
import { ITableConfig } from '@shared/components/new-table/interfaces';
import { IStateFilters } from '@shared/interfaces';
import { IMappedAccount } from '../interfaces/mapped-account.interface';

@Injectable({
    providedIn: 'root',
})
export class AccountService {
    private API_COMPANY_ACCOUNT: string = `${environment.API_ENDPOINT}/api/companyaccount`;

    constructor(private http: HttpClient) {}

    public getAccountList(
        page: number,
        filters: IStateFilters,
        tableSorting: ITableConfig
    ): Observable<GetCompanyAccountListResponse> {
        let params = new HttpParams();

        if (page) {
            params = params.append('pageIndex', page);
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
            `${environment.API_ENDPOINT}/api/companyaccount/list`,
            { params }
        );
    }

    public getCompanyAccountLabelsColorList(): Observable<
        AccountColorResponse[]
    > {
        return this.http.get<AccountColorResponse[]>(
            `${this.API_COMPANY_ACCOUNT}label/color/list`
        );
    }

    public getCompanyAccountModal(): Observable<CompanyAccountModalResponse> {
        return this.http.get(`${this.API_COMPANY_ACCOUNT}/modal`);
    }

    public addCompanyAccount(
        newCompanyAccount: IMappedAccount
    ): Observable<{ id: number }> {
        return this.http.post<{ id: number }>(
            this.API_COMPANY_ACCOUNT,
            newCompanyAccount
        );
    }

    public editCompanyAccount(
        companyAccount: IMappedAccount
    ): Observable<void> {
        return this.http.put<void>(this.API_COMPANY_ACCOUNT, companyAccount);
    }

    public getCompanyAccountById(id: number): Observable<IMappedAccount> {
        return this.http.get<IMappedAccount>(
            `${this.API_COMPANY_ACCOUNT}/${id}`
        );
    }

    public deleteCompanyAccount(id: number): Observable<void> {
        return this.http.delete<void>(`${this.API_COMPANY_ACCOUNT}/${id}`);
    }
}
