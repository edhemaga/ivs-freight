import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ITableConfig } from '@shared/components/new-table/interfaces';
import { IStateFilters } from '@shared/interfaces';

// Models
import {
    CompanyUserListResponse,
    CompanyUserModalResponse,
    DepartmentFilterResponse,
    StatusSetMultipleCompanyUserCommand,
} from 'appcoretruckassist';

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

    // Any is used from CompanyUserService
    public changeUserStatus(
        companyUserList: StatusSetMultipleCompanyUserCommand
    ): Observable<any> {
        return this.http.put<CompanyUserListResponse>(
            `${environment.API_ENDPOINT}/api/companyuser/status/list`,
            companyUserList
        );
    }

    public getDepartmentFilter(): Observable<DepartmentFilterResponse[]> {
        let params = new HttpParams().set('IsCompanyUser', true.toString());

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
}
