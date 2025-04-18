import { Injectable } from '@angular/core';

// Store
import { select, Store } from '@ngrx/store';

// rxjs
import { Observable } from 'rxjs';

// Selectors
import * as UserSelector from '@pages/new-user/state/selectors/user.selector';

// Models
import { ITableData } from '@shared/models';

// Const
import { UserStoreConstants } from '@pages/new-user/utils/constants';

// Enums
import { eCommonElement, eStatusTab } from '@shared/enums';

// Interface
import { IMappedUser } from '@pages/new-user/interfaces';

@Injectable({
    providedIn: 'root',
})
export class UserStoreService {
    constructor(private store: Store) {}

    public userListSelector$: Observable<IMappedUser[]> = this.store.pipe(
        select(UserSelector.userListSelector)
    );

    public toolbarTabsSelector$: Observable<ITableData[]> = this.store.pipe(
        select(UserSelector.toolbarTabsSelector)
    );

    public selectedTabSelector$: Observable<eStatusTab> = this.store.pipe(
        select(UserSelector.selectedTabSelector)
    );

    public activeViewModeSelector$: Observable<string> = this.store.pipe(
        select(UserSelector.activeViewModeSelector)
    );

    public dispatchLoadInitialList(): void {
        this.store.dispatch({
            type: UserStoreConstants.ACTION_DISPATCH_LOAD_USER_LIST,
        });
    }

    public dispatchTypeChange(mode: eStatusTab): void {
        this.store.dispatch({
            type: UserStoreConstants.ACTION_DISPATCH_USER_TYPE_CHANGE,
            mode,
        });
    }

    public dispatchViewModeChange(viewMode: eCommonElement): void {
        this.store.dispatch({
            type: UserStoreConstants.ACTION_DISPATCH_VIEW_MODE_CHANGE,
            viewMode,
        });
    }
}
