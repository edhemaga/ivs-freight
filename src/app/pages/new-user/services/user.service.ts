import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

// Models
import { CompanyUserListResponse } from 'appcoretruckassist';

// rxjs
import { Observable } from 'rxjs';

// Environment
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    constructor(public http: HttpClient) {}

    /**
     * @param active
     * @param departmentId
     * @param pageIndex
     * @param pageSize
     * @param companyId
     * @param sort
     * @param sortOrder
     * @param sortBy
     * @param search
     * @param search1
     * @param search2
     */
    public getUserList(active: number): Observable<CompanyUserListResponse> {
        let params = new HttpParams().set('Active', active.toString());

        return this.http.get<CompanyUserListResponse>(
            `${environment.API_ENDPOINT}/api/companyuser/list`,
            { params }
        );
    }
}
