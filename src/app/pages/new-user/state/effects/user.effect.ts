// Modules
import { Injectable } from '@angular/core';

// rxjs
import { switchMap, map, catchError, of, withLatestFrom, forkJoin } from 'rxjs';

// ngrx
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';

// Service
import { UserService } from '@pages/new-user/services/user.service';
import { ModalService } from '@shared/services';

// Actions
import * as UserActions from '@pages/new-user/state/actions/user.action';

// Selectors
import * as UserSelector from '@pages/new-user/state/selectors/user.selector';

// Enums
import { eStatusTab } from '@shared/enums';

// Models
import { StatusSetMultipleCompanyUserCommand } from 'appcoretruckassist';

// Components
import { UserModalComponent } from '@pages/new-user/modals/user-modal/user-modal.component';

@Injectable()
export class UserEffects {
    constructor(
        // Store
        private actions$: Actions,
        private store: Store,
        private modalService: ModalService,

        private userService: UserService
    ) {}

    public getUserListOnFilterChange$ = createEffect(() =>
        this.actions$.pipe(
            ofType(
                UserActions.onFiltersChange,
                UserActions.onSeachFilterChange,
                UserActions.tableSortingChange
            ),
            withLatestFrom(
                this.store.select(UserSelector.selectedTabSelector),
                this.store.select(UserSelector.tableSettingsSelector),
                this.store.select(UserSelector.departmentListSelector),
                this.store.select(UserSelector.filterSelector)
            ),
            switchMap(
                ([_, selectedTab, tableSettings, departmentList, filters]) => {
                    let active = selectedTab === eStatusTab.ACTIVE ? 1 : 0;

                    return this.userService
                        .getUserList(active, 1, filters, tableSettings)
                        .pipe(
                            map((payload) =>
                                UserActions.onGetListSuccess({
                                    payload,
                                    departmentList,
                                })
                            ),
                            catchError(() => of(UserActions.onGetListError()))
                        );
                }
            )
        )
    );

    public getUserList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UserActions.onGetInitalList, UserActions.onTabTypeChange),
            withLatestFrom(
                this.store.select(UserSelector.selectedTabSelector),
                this.store.select(UserSelector.filterSelector),
                this.store.select(UserSelector.tableSettingsSelector)
            ),
            switchMap(([_, selectedTab, filters, tableSettings]) => {
                let active = selectedTab === eStatusTab.ACTIVE ? 1 : 0;

                return forkJoin([
                    this.userService.getUserList(
                        active,
                        1,
                        filters,
                        tableSettings
                    ),
                    this.userService.getDepartmentFilter(),
                ]).pipe(
                    map(([payload, departmentList]) =>
                        UserActions.onGetListSuccess({
                            payload,
                            departmentList,
                        })
                    ),
                    catchError(() => of(UserActions.onGetListError()))
                );
            })
        )
    );

    public getUserListOnPageChange$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UserActions.getLoadsOnPageChange),
            withLatestFrom(
                this.store.select(UserSelector.selectedTabSelector),
                this.store.select(UserSelector.pageSelector),
                this.store.select(UserSelector.filterSelector),
                this.store.select(UserSelector.tableSettingsSelector)
            ),
            switchMap(([_, selectedTab, page, filters, tableSettings]) => {
                let active = selectedTab === eStatusTab.ACTIVE ? 1 : 0;

                return this.userService
                    .getUserList(active, page + 1, filters, tableSettings)
                    .pipe(
                        map((response) =>
                            UserActions.onGetListOnPageChangeSuccess({
                                payload: response,
                            })
                        ),
                        catchError(() => of(UserActions.onGetListError()))
                    );
            })
        )
    );

    public onDeleteUsers$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UserActions.onDeleteUsers),
            switchMap(({ users }) => {
                const userIds = users.map((user) => user.id);
                return this.userService.deleteUsers(userIds).pipe(
                    map(() => {
                        return UserActions.onDeleteUsersSuccess({
                            users,
                            isIncreaseInOtherTab: false,
                        });
                    }),
                    catchError(() => of(UserActions.onDeleteUsersError()))
                );
            })
        )
    );

    public onUserStatusChange$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UserActions.onUserStatusChange),
            withLatestFrom(this.store.select(UserSelector.selectedTabSelector)),
            switchMap(([{ users }, selectedTab]) => {
                const request: StatusSetMultipleCompanyUserCommand = {
                    ids: users.map((user) => user.id),
                    activate: selectedTab !== eStatusTab.ACTIVE,
                };

                return this.userService.changeUserStatus(request).pipe(
                    map(() =>
                        UserActions.onDeleteUsersSuccess({
                            users,
                            isIncreaseInOtherTab: true,
                        })
                    ),
                    catchError(() => of(UserActions.onDeleteUsersError()))
                );
            })
        )
    );

    public onModalOpen$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(UserActions.onOpenUserModal),
                map(() => this.modalService.openModal(UserModalComponent, {}))
            ),
        { dispatch: false }
    );
}
