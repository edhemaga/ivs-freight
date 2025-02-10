import { Injectable } from '@angular/core';

import { Observable, of, tap } from 'rxjs';

// services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';

// store
import { UserActiveStore } from '@pages/user/state/user-active-state/user-active.store';
import { UserActiveQuery } from '@pages/user/state/user-active-state/user-active.query';
import { UserInactiveStore } from '@pages/user/state/user-inactive-state/user-inactive.store';
import { UserInactiveQuery } from '@pages/user/state/user-inactive-state/user-inactive.query';

// models
import {
    AccountService,
    CompanyUserListResponse,
    CompanyUserModalResponse,
    CompanyUserResponse,
    CompanyUserService,
    CreateCompanyUserCommand,
    CreateResponse,
    ForgotPasswordCommand,
    UpdateCompanyUserCommand,
    UserResponse,
} from 'appcoretruckassist';

// enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { EGeneralActions } from '@shared/enums';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    constructor(
        // services
        private userService: CompanyUserService,
        private accountUserService: AccountService,
        private tableService: TruckassistTableService,

        // store
        private userActiveStore: UserActiveStore,
        private userActiveQuery: UserActiveQuery,
        private userInactiveStore: UserInactiveStore,
        private userInactiveQuery: UserInactiveQuery
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
    ): Observable<CompanyUserListResponse> {
        return this.userService.apiCompanyuserListGet(
            active,
            null,
            pageIndex,
            pageSize,
            companyId,
            sort,
            'Descending',
            null,
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
                            localStorage.getItem(
                                TableStringEnum.USER_TABLE_COUNT
                            )
                        );

                        userCount.active++;

                        localStorage.setItem(
                            TableStringEnum.USER_TABLE_COUNT,
                            JSON.stringify({
                                active: userCount.active,
                                inactive: userCount.inactive,
                            })
                        );

                        this.tableService.sendActionAnimation({
                            animation: EGeneralActions.ADD,
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
                        this.userActiveStore.remove(({ id }) => id === data.id);

                        user = {
                            ...user,
                            userAvatar: {
                                name: user.firstName + ' ' + user.lastName,
                            },
                        };

                        this.userActiveStore.add(user);

                        this.tableService.sendActionAnimation({
                            animation: EGeneralActions.UPDATE,
                            data: user,
                            id: user.id,
                        });

                        subUser.unsubscribe();
                    },
                });
            })
        );
    }

    public deleteUserById(
        userId: number,
        tabSelected: string
    ): Observable<any> {
        // leave this any for now
        return this.userService.apiCompanyuserIdDelete(userId).pipe(
            tap(() => {
                const userCount = JSON.parse(
                    localStorage.getItem(TableStringEnum.USER_TABLE_COUNT)
                );

                if (tabSelected === TableStringEnum.ACTIVE) {
                    this.userActiveStore.remove(({ id }) => id === userId);
                    userCount.active--;
                } else {
                    this.userInactiveStore.remove(({ id }) => id === userId);
                    userCount.inactive--;
                }

                localStorage.setItem(
                    TableStringEnum.USER_TABLE_COUNT,
                    JSON.stringify({
                        active: userCount.active,
                        inactive: userCount.inactive,
                    })
                );
            })
        );
    }

    public deleteUserList(
        usersToDelete: number[],
        tabSelected: string
    ): Observable<any> {
        //leave this any for now
        return this.userService.apiCompanyuserListDelete(usersToDelete).pipe(
            tap(() => {
                const userCount = JSON.parse(
                    localStorage.getItem(TableStringEnum.USER_TABLE_COUNT)
                );

                usersToDelete.forEach((userId) => {
                    tabSelected === TableStringEnum.ACTIVE
                        ? this.userActiveStore.remove(({ id }) => id === userId)
                        : this.userInactiveStore.remove(
                              ({ id }) => id === userId
                          );

                    if (tabSelected === TableStringEnum.ACTIVE)
                        userCount.active--;
                    else if (tabSelected === TableStringEnum.INACTIVE)
                        userCount.inactive--;
                });

                localStorage.setItem(
                    TableStringEnum.USER_TABLE_COUNT,
                    JSON.stringify({
                        active: userCount.active,
                        inactive: userCount.inactive,
                    })
                );
            })
        );
    }

    public changeUserListStatus(
        userIds: number[],
        tabSelected: string
    ): Observable<any> {
        // leave this any for now
        return this.userService
            .apiCompanyuserStatusListPut({
                ids: userIds,
                activate:
                    tabSelected === TableStringEnum.INACTIVE ? true : false,
            })
            .pipe(
                tap(() => {
                    const userCount = JSON.parse(
                        localStorage.getItem(TableStringEnum.USER_TABLE_COUNT)
                    );

                    userIds.forEach((userId) => {
                        let userToUpdate =
                            tabSelected === TableStringEnum.ACTIVE
                                ? this.userActiveQuery.getAll({
                                      filterBy: ({ id }) => id === userId,
                                  })
                                : this.userInactiveQuery.getAll({
                                      filterBy: ({ id }) => id === userId,
                                  });

                        tabSelected === TableStringEnum.ACTIVE
                            ? this.userActiveStore.remove(
                                  ({ id }) => id === userId
                              )
                            : this.userInactiveStore.remove(
                                  ({ id }) => id === userId
                              );

                        tabSelected === TableStringEnum.ACTIVE
                            ? this.userInactiveStore.add({
                                  ...userToUpdate[0],
                                  status: 0,
                              })
                            : this.userActiveStore.add({
                                  ...userToUpdate[0],
                                  status: 1,
                              });

                        if (tabSelected === TableStringEnum.ACTIVE) {
                            userCount.active--;
                            userCount.inactive++;
                        } else if (tabSelected === TableStringEnum.INACTIVE) {
                            userCount.active++;
                            userCount.inactive--;
                        }
                    });

                    localStorage.setItem(
                        TableStringEnum.USER_TABLE_COUNT,
                        JSON.stringify({
                            active: userCount.active,
                            inactive: userCount.inactive,
                        })
                    );

                    this.getUsers(
                        tabSelected === TableStringEnum.ACTIVE ? 0 : 1,
                        1,
                        25
                    ).subscribe({
                        next: (usersList) => {
                            let updatedUsers = usersList.pagination.data.filter(
                                (user) => userIds.includes(user.id)
                            );

                            updatedUsers.map((user: any) => {
                                //leave this any for now
                                user = {
                                    ...user,
                                    fullName:
                                        user.firstName + ' ' + user.lastName,
                                };
                            });

                            this.tableService.sendActionAnimation({
                                animation: TableStringEnum.UPDATE_MULTIPLE,
                                data: updatedUsers,
                            });
                        },
                    });
                })
            );
    }

    public getUserByid(id: number): Observable<CompanyUserResponse> {
        return this.userService.apiCompanyuserIdGet(id);
    }

    public updateUserStatus(
        userId: number,
        activate: boolean,
        tabSelected?: string
    ): Observable<any> {
        //leave this any for now
        return this.userService
            .apiCompanyuserStatusPut({ id: userId, activate: activate })
            .pipe(
                tap(() => {
                    const userCount = JSON.parse(
                        localStorage.getItem(TableStringEnum.USER_TABLE_COUNT)
                    );

                    const userToUpdate =
                        tabSelected === TableStringEnum.ACTIVE
                            ? this.userActiveQuery.getAll({
                                  filterBy: ({ id }) => id === userId,
                              })
                            : this.userInactiveQuery.getAll({
                                  filterBy: ({ id }) => id === userId,
                              });

                    tabSelected === TableStringEnum.ACTIVE
                        ? this.userActiveStore.remove(({ id }) => id === userId)
                        : this.userInactiveStore.remove(
                              ({ id }) => id === userId
                          );

                    tabSelected === TableStringEnum.ACTIVE
                        ? this.userInactiveStore.add({
                              ...userToUpdate[0],
                              status: 0,
                          })
                        : this.userActiveStore.add({
                              ...userToUpdate[0],
                              status: 1,
                          });

                    if (tabSelected === TableStringEnum.ACTIVE) {
                        userCount.active--;
                        userCount.inactive++;
                    } else if (tabSelected === TableStringEnum.INACTIVE) {
                        userCount.active++;
                        userCount.inactive--;
                    }

                    localStorage.setItem(
                        TableStringEnum.USER_TABLE_COUNT,
                        JSON.stringify({
                            active: userCount.active,
                            inactive: userCount.inactive,
                        })
                    );

                    this.getUserByid(userId).subscribe({
                        next: (user: UserResponse) => {
                            const userData = {
                                ...user,
                                fullName: user.firstName + ' ' + user.lastName,
                            };
                            this.tableService.sendActionAnimation({
                                animation: TableStringEnum.UPDATE_STATUS,
                                data: userData,
                                id: userData.id,
                            });
                        },
                    });
                })
            );
    }

    public userResendIvitation(id: number): Observable<any> {
        return this.userService.apiCompanyuserIdResendInvitationPatch(id);
    }

    public userResetPassword(email: ForgotPasswordCommand): Observable<any> {
        return this.accountUserService.apiAccountForgotpasswordPut(email);
    }

    public getModalDropdowns(): Observable<CompanyUserModalResponse> {
        return this.userService.apiCompanyuserModalGet();
    }
}
