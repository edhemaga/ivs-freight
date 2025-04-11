import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

// Interfaces
import { ILoadModel } from '@pages/new-load/interfaces';

// Selectors
import {
    activeViewModeSelector,
    selectedTabSelector,
    selectLoads,
    toolbarTabsSelector,
} from '@pages/new-load/state/selectors/load.selectors';

// Const
import { LoadStoreConstants } from '@pages/new-load/utils/constants/load-store.constants';

// Models
import { ITableData } from '@shared/models';

// Enums
import { eLoadStatusStringType } from '@pages/new-load/enums';
import { eActiveViewMode } from '@shared/enums';

@Injectable({
    providedIn: 'root',
})
export class LoadStoreService {
    constructor(private store: Store) {}

    public loadsSelector$: Observable<ILoadModel[]> = this.store.pipe(
        select(selectLoads)
    );

    public toolbarTabsSelector$: Observable<ITableData[]> = this.store.pipe(
        select(toolbarTabsSelector)
    );

    public selectedTabSelector$: Observable<eLoadStatusStringType> =
        this.store.pipe(select(selectedTabSelector));

    public activeViewModeSelector$: Observable<string> = this.store.pipe(
        select(activeViewModeSelector)
    );

    public dispatchLoadList(): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_DISPATCH_LOAD_LIST,
        });
    }
}
