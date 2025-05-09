import { HttpClient } from '@angular/common/http';
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
import { IMappedAccount } from '../interfaces/mapped-account.interface';

@Injectable({
    providedIn: 'root',
})
export class AccountService {
    private API_COMPANY_ACCOUNT: string = `${environment.API_ENDPOINT}/api/companyaccount`;

    constructor(private http: HttpClient) {}

    public getAccountList(): Observable<GetCompanyAccountListResponse> {
        return this.http.get<GetCompanyAccountListResponse>(
            `${this.API_COMPANY_ACCOUNT}/list`
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
}
