// Modules
import { Injectable } from '@angular/core';

// rxjs
import { switchMap, map, catchError, of, withLatestFrom } from 'rxjs';

// ngrx
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';

// Service
import { UserService } from '@pages/new-user/services/user.service';

// Actions
import * as UserActions from '@pages/new-user/state/actions/user.action';

// Selectors
import * as UserSelector from '@pages/new-user/state/selectors/user.selector';

// Enums
import { eStatusTab } from '@shared/enums';

@Injectable()
export class UserEffects {
    constructor(
        // Store
        private actions$: Actions,
        private store: Store,

        private userService: UserService
    ) {}

    public getUserList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UserActions.onGetInitalList, UserActions.onTabTypeChange),
            withLatestFrom(this.store.select(UserSelector.selectedTabSelector)),
            switchMap(([_, selectedTab]) => {
                let active = selectedTab === eStatusTab.ACTIVE ? 1 : 0;

                return this.userService.getUserList(active).pipe(
                    map((response) =>
                        UserActions.onGetListSuccess({
                            payload: response,
                        })
                    ),
                    catchError(() => of(UserActions.onGetListError()))
                );
            })
        )
    );
}
