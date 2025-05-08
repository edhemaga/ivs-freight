import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

// Models
import {
    CompanyUserListResponse,
    CompanyUserModalResponse,
    CompanyUserResponse,
    CreateCompanyUserCommand,
    CreateResponse,
    DepartmentFilterResponse,
    StatusSetMultipleCompanyUserCommand,
} from 'appcoretruckassist';
// rxjs
import { Observable } from 'rxjs';
// Environment
import { environment } from 'src/environments/environment';

import { ITableConfig } from '@shared/components/new-table/interfaces';

import { IStateFilters } from '@shared/interfaces';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    constructor(public http: HttpClient) {}

    // Any is used from CompanyUserService
    public changeUserStatus(
        companyUserList: StatusSetMultipleCompanyUserCommand
    ): Observable<any> {
        return this.http.put<CompanyUserListResponse>(
            `${environment.API_ENDPOINT}/api/companyuser/status/list`,
            companyUserList
        );
    }

    public createNewUser(
        user: CreateCompanyUserCommand
    ): Observable<CreateResponse> {
        return this.http.post<CreateResponse>(
            `${environment.API_ENDPOINT}/api/companyuser`,
            user
        );
    }

    // Any is used from CompanyUserService
    public deleteUsers(ids: number[]): Observable<any> {
        const params = ids.reduce(
            (param, id) => param.append('Ids', id.toString()),
            new HttpParams()
        );

        return this.http.delete<CompanyUserListResponse>(
            `${environment.API_ENDPOINT}/api/companyuser/list`,
            { params }
        );
    }

    public editUser(
        user: CreateCompanyUserCommand
    ): Observable<CreateResponse> {
        return this.http.put<CreateResponse>(
            `${environment.API_ENDPOINT}/api/companyuser`,
            user
        );
    }

    public editUserModal(userId: number): Observable<CompanyUserResponse> {
        return this.http.get<CompanyUserResponse>(
            `${environment.API_ENDPOINT}/api/companyuser/${userId}`
        );
    }

    public getDepartmentFilter(): Observable<DepartmentFilterResponse[]> {
        const params = new HttpParams().set('IsCompanyUser', true.toString());

        return this.http.get<DepartmentFilterResponse[]>(
            `${environment.API_ENDPOINT}/api/department/filter`,
            { params }
        );
    }

    public getModalDropdowns(): Observable<CompanyUserModalResponse> {
        return this.http.get<CompanyUserModalResponse>(
            `${environment.API_ENDPOINT}/api/companyuser/modal`
        );
    }

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
    public getUserList(
        active: number,
        page: number,
        filters: IStateFilters,
        tableSorting: ITableConfig
    ): Observable<CompanyUserListResponse> {
        let params = new HttpParams().set('Active', active.toString());

        if (page) {
            params = params.append('PageIndex', page);
        }

        if (tableSorting.sortKey)
            params = params.append('SortBy', tableSorting.sortKey);
        if (tableSorting.sortDirection)
            params = params.append('SortOrder', tableSorting.sortDirection);

        if (filters.departmentIds?.length) {
            filters.departmentIds.forEach((id) => {
                params = params.append('DepartmentId', id.toString());
            });
        }

        if (filters.searchQuery?.length) {
            const { searchQuery } = filters;
            if (searchQuery[0])
                params = params.append('search', filters.searchQuery[0]);

            if (searchQuery[1])
                params = params.append('search1', filters.searchQuery[1]);

            if (searchQuery[2])
                params = params.append('search2', filters.searchQuery[2]);
        }

        return this.http.get<CompanyUserListResponse>(
            `${environment.API_ENDPOINT}/api/companyuser/list`,
            { params }
        );
    }

    public resetPassword(email: string): Observable<any> {
        return this.http.put(
            `${environment.API_ENDPOINT}/api/account/forgotpassword`,
            { email }
        );
    }

    // Any is used from CompanyUserService
    public resendInvitation(id: number): Observable<any> {
        return this.http.patch(
            `${environment.API_ENDPOINT}/api/companyUser/${id}/resend-invitation`,
            {},
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                }),
            }
        );
    }
}
