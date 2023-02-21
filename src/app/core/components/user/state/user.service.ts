import { Injectable } from '@angular/core';
import {
    AccountService,
    CompanyUserService,
    ForgotPasswordCommand,
    GetCompanyUserListResponse,
    ResendSignUpCompanyOrUserCommand,
} from 'appcoretruckassist';
import { Observable, tap } from 'rxjs';
import { CompanyUserModalResponse } from '../../../../../../appcoretruckassist/model/companyUserModalResponse';
import { CreateCompanyUserCommand } from '../../../../../../appcoretruckassist/model/createCompanyUserCommand';
import { CreateResponse } from '../../../../../../appcoretruckassist/model/createResponse';
import { UpdateCompanyUserCommand } from '../../../../../../appcoretruckassist/model/updateCompanyUserCommand';
import { CompanyUserResponse } from '../../../../../../appcoretruckassist/model/companyUserResponse';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { UserStore } from './user-state/user.store';
import { UserQuery } from './user-state/user.query';

@Injectable({
    providedIn: 'root',
})
export class UserTService {
    constructor(
        private userService: CompanyUserService,
        private accountUserService: AccountService,
        private tableService: TruckassistTableService,
        private userStore: UserStore,
        private userQuery: UserQuery
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
        return this.userService.apiCompanyuserPost(data).pipe(
            tap((res: any) => {
                const subUser = this.getUserByid(res.id).subscribe({
                    next: (user: any) => {
                        user = {
                            ...user,
                            userAvatar: {
                                name: user.firstName + ' ' + user.lastName,
                            },
                        };

                        const userCount = JSON.parse(
                            localStorage.getItem('userTableCount')
                        );

                        userCount.users++;

                        localStorage.setItem(
                            'userTableCount',
                            JSON.stringify({
                                users: userCount.users,
                            })
                        );

                        this.tableService.sendActionAnimation({
                            animation: 'add',
                            data: user,
                            id: user.id,
                        });

                        subUser.unsubscribe();
                    },
                });
            })
        );
    }

    public updateUser(data: UpdateCompanyUserCommand): Observable<any> {
        return this.userService.apiCompanyuserPut(data).pipe(
            tap(() => {
                const subUser = this.getUserByid(data.id).subscribe({
                    next: (user: any) => {
                        this.userStore.remove(
                            ({ id }) => id === data.id
                        );

                        user = {
                            ...user,
                            userAvatar: {
                                name: user.firstName + ' ' + user.lastName,
                            },
                        };

                        this.userStore.add(user);

                        this.tableService.sendActionAnimation({
                            animation: 'update',
                            data: user,
                            id: user.id,
                        });

                        subUser.unsubscribe();
                    },
                });
            })
        );
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
            })
        );
    }

    public deleteUserList(usersToDelete: any[]): Observable<any> {
        return this.userService.apiCompanyuserListDelete(usersToDelete).pipe(
            tap(() => {
                let storeUsers = this.userQuery.getAll();

                storeUsers.map((user: any) => {
                    usersToDelete.map((d) => {
                        if (d === user.id) {
                            this.userStore.remove(({ id }) => id === user.id);
                        }
                    });
                });

                localStorage.setItem(
                    'userTableCount',
                    JSON.stringify({
                        users: storeUsers.length,
                    })
                );
            })
        );
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

    public userResendIvitation(email: ResendSignUpCompanyOrUserCommand): Observable<any> {
        return this.accountUserService.apiAccountResendsignupcompanyoruserPut(email);
    }

    public userResetPassword(email: ForgotPasswordCommand): Observable<any> {
        return this.accountUserService.apiAccountForgotpasswordPut(email);
    }

    public getModalDropdowns(): Observable<CompanyUserModalResponse> {
        return this.userService.apiCompanyuserModalGet();
    }
}
