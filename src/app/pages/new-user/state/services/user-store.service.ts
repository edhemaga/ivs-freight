import { Injectable } from '@angular/core';

// Store
import { select, Store } from '@ngrx/store';

// rxjs
import { Observable } from 'rxjs';

// Selectors
import * as UserSelector from '@pages/new-user/state/selectors/user.selector';

// Models
import { ITableData } from '@shared/models';

// Enums
import { eStatusTab } from '@shared/enums';

@Injectable({
    providedIn: 'root',
})
export class UserStoreService {
    constructor(private store: Store) {}

    public toolbarTabsSelector$: Observable<ITableData[]> = this.store.pipe(
        select(UserSelector.toolbarTabsSelector)
    );

    public selectedTabSelector$: Observable<eStatusTab> = this.store.pipe(
        select(UserSelector.selectedTabSelector)
    );

    public activeViewModeSelector$: Observable<string> = this.store.pipe(
        select(UserSelector.activeViewModeSelector)
    );
}
