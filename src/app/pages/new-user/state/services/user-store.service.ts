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
import { ITableColumn } from '@shared/components/new-table/interface';

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

    public tableColumnsSelector$: Observable<ITableColumn[]> = this.store.pipe(
        select(UserSelector.tableColumnsSelector)
    );

    public selectedCountSelector$: Observable<number> = this.store.pipe(
        select(UserSelector.selectedCountSelector)
    );
    public selectedTabCountSelector$: Observable<number> = this.store.pipe(
        select(UserSelector.selectedTabCountSelector)
    );

    public searchStringsSelector$: Observable<string[]> = this.store.pipe(
        select(UserSelector.searchStringsSelector)
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

    public dispatchSelectUser(id: number): void {
        this.store.dispatch({
            type: UserStoreConstants.ACTION_DISPATCH_ON_USER_SELECTION,
            id,
        });
    }

    public dispatchSelectAll(action: string): void {
        this.store.dispatch({
            type: UserStoreConstants.ACTION_ON_SELECT_ALL,
            action,
        });
    }

    public getNewPage(): void {
        this.store.dispatch({
            type: UserStoreConstants.ACTION_GET_NEW_PAGE_RESULTS,
        });
    }

    public dispatchSearchChange(query: string[]): void {
        this.store.dispatch({
            type: UserStoreConstants.ACTION_SEARCH_FILTER_CHANGED,
            query,
        });
    }
}
