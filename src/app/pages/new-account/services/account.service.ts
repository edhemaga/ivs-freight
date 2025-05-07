import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Models
import { GetCompanyAccountListResponse } from 'appcoretruckassist';

// Environment
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AccountService {
    constructor(public http: HttpClient) {}

    public getAccountList(): Observable<GetCompanyAccountListResponse> {
        return this.http.get<GetCompanyAccountListResponse>(
            `${environment.API_ENDPOINT}/api/companyaccount/list`
        );
    }
}
