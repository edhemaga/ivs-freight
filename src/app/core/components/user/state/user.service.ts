import { Injectable } from '@angular/core';
import {
    CompanyUserService,
    GetCompanyUserListResponse,
} from 'appcoretruckassist';
import { Observable, tap } from 'rxjs';
import { CompanyUserModalResponse } from '../../../../../../appcoretruckassist/model/companyUserModalResponse';
import { CreateCompanyUserCommand } from '../../../../../../appcoretruckassist/model/createCompanyUserCommand';
import { CreateResponse } from '../../../../../../appcoretruckassist/model/createResponse';
import { UpdateCompanyUserCommand } from '../../../../../../appcoretruckassist/model/updateCompanyUserCommand';
import { CompanyUserResponse } from '../../../../../../appcoretruckassist/model/companyUserResponse';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { UserStore } from './user-state/user.store';

@Injectable({
    providedIn: 'root',
})
export class UserTService {
    constructor(
        private userService: CompanyUserService,
        private tableService: TruckassistTableService,
        private userStore: UserStore
    ) {}

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

    public deleteUserById(userId: number): Observable<any> {
        return this.userService.apiCompanyuserIdDelete(userId).pipe(
            tap(() => {
                const userCount = JSON.parse(
                    localStorage.getItem('userTableCount')
                );
                
                this.userStore.remove(({ id }) => id === userId);

                userCount.users--;

                localStorage.setItem(
                    'userTableCount',
                    JSON.stringify({
                        users: userCount.users,
                    })
                );

                this.tableService.sendActionAnimation({
                    animation: 'delete',
                    id: userId,
                });
            })
        );;
    }

    public getUserByid(id: number): Observable<CompanyUserResponse> {
        return this.userService.apiCompanyuserIdGet(id);
    }

    public updateUserStatus(id: number): Observable<any> {
        return this.userService.apiCompanyuserStatusIdPut(id).pipe(
            tap(() => {
                const subUser = this.getUserByid(id).subscribe({
                    next: (user: any) => {
                        this.tableService.sendActionAnimation({
                            animation: 'update-status',
                            data: user,
                            id: user.id,
                        });

                        subUser.unsubscribe();
                    },
                });
            })
        );
    }

    public getModalDropdowns(): Observable<CompanyUserModalResponse> {
        return this.userService.apiCompanyuserModalGet();
    }
}
