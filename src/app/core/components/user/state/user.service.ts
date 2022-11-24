import { Injectable } from '@angular/core';
import {
    CompanyUserService,
    GetCompanyUserListResponse,
} from 'appcoretruckassist';
import { Observable } from 'rxjs';
import { CompanyUserModalResponse } from '../../../../../../appcoretruckassist/model/companyUserModalResponse';
import { CreateCompanyUserCommand } from '../../../../../../appcoretruckassist/model/createCompanyUserCommand';
import { CreateResponse } from '../../../../../../appcoretruckassist/model/createResponse';
import { UpdateCompanyUserCommand } from '../../../../../../appcoretruckassist/model/updateCompanyUserCommand';
import { CompanyUserResponse } from '../../../../../../appcoretruckassist/model/companyUserResponse';

@Injectable({
    providedIn: 'root',
})
export class UserTService {
    constructor(private userService: CompanyUserService) {}

    // Get User List
    public getUsers(
        active?: number,
        pageIndex?: number,
        pageSize?: number,
        companyId?: number,
        sort?: string,
        search?: string,
        search1?: string,
        search2?: string
    ): Observable<GetCompanyUserListResponse> {
        return this.userService.apiCompanyuserListGet(
            active,
            pageIndex,
            pageSize,
            companyId,
            sort,
            search,
            search1,
            search2
        );
    }

    public addUser(data: CreateCompanyUserCommand): Observable<CreateResponse> {
        return this.userService.apiCompanyuserPost(data);
    }

    public updateUser(data: UpdateCompanyUserCommand): Observable<any> {
        return this.userService.apiCompanyuserPut(data);
    }

    public deleteUserById(id: number): Observable<any> {
        return this.userService.apiCompanyuserIdDelete(id);
    }

    public getUserByid(id: number): Observable<CompanyUserResponse> {
        return this.userService.apiCompanyuserIdGet(id);
    }

    public updateUserStatus(id: number): Observable<any> {
        return this.userService.apiCompanyuserStatusIdPut(id);
    }

    public getModalDropdowns(): Observable<CompanyUserModalResponse> {
        return this.userService.apiCompanyuserModalGet();
    }
}
