import { Injectable } from '@angular/core';

// Store
import { select, Store } from '@ngrx/store';

// rxjs
import { Observable } from 'rxjs';

// Interfaces
import {
    ILoadDetails,
    ILoadDetailsLoadMinimalList,
    IMappedLoad,
    ILoadPageFilters,
} from '@pages/new-load/interfaces';
import { ILoadModal } from '@pages/new-load/pages/new-load-modal/interfaces';
import { ITableColumn } from '@shared/components/new-table/interface';

// Selectors
import * as LoadSelectors from '@pages/new-load/state/selectors/load.selectors';

// Const
import { LoadStoreConstants } from '@pages/new-load/utils/constants';

// Models
import { ITableData } from '@shared/models';
// Enums
import { eLoadStatusStringType } from '@pages/new-load/enums';
import { eLoadStatusType } from '@pages/load/pages/load-table/enums';
import { eCommonElement } from '@shared/enums';

// Ca components
import { IFilterAction } from 'ca-components';

@Injectable({
    providedIn: 'root',
})
export class LoadStoreService {
    constructor(private store: Store) {}

    public loadsSelector$: Observable<IMappedLoad[]> = this.store.pipe(
        select(LoadSelectors.selectLoads)
    );

    public toolbarTabsSelector$: Observable<ITableData[]> = this.store.pipe(
        select(LoadSelectors.toolbarTabsSelector)
    );

    public selectedTabSelector$: Observable<eLoadStatusStringType> =
        this.store.pipe(select(LoadSelectors.selectedTabSelector));

    public activeViewModeSelector$: Observable<string> = this.store.pipe(
        select(LoadSelectors.activeViewModeSelector)
    );

    public filtersDropdownListSelector$: Observable<ILoadPageFilters> =
        this.store.pipe(select(LoadSelectors.filtersDropdownListSelector));

    public tableColumnsSelector$: Observable<ITableColumn[]> = this.store.pipe(
        select(LoadSelectors.tableColumnsSelector)
    );

    public loadDetailsSelector$: Observable<ILoadDetails> = this.store.pipe(
        select(LoadSelectors.loadDetailsSelector)
    );

    public minimalListSelector$: Observable<ILoadDetailsLoadMinimalList> =
        this.store.pipe(select(LoadSelectors.minimalListSelector));

    // TODO: WAIT FOR BACKEND TO CREATE THIS, THIS WE BE REMOVED THEN!!!
    public closedLoadStatusSelector$: Observable<any> = this.store.pipe(
        select(LoadSelectors.closedLoadStatusSelector)
    );

    public dispatchLoadList(): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_DISPATCH_LOAD_LIST,
        });
    }

    public dispatchLoadTypeChange(mode: eLoadStatusType): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_DISPATCH_LOAD_TYPE_CHANGE,
            mode,
        });
    }

    public dispatchViewModeChange(viewMode: eCommonElement): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_DISPATCH_VIEW_MODE_CHANGE,
            viewMode,
        });
    }

    public onOpenModal(modal: ILoadModal): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_OPEN_LOAD_MODAL,
            modal,
        });
    }

    public navigateToLoadDetails(id: number): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_GO_TO_LOAD_DETAILS,
            id,
        });
    }

    public dispatchFiltersChange(filters: IFilterAction): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_FILTER_CHANGED,
            filters,
        });
    }

    public dispatchSearchChange(query: string[]): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_SEARCH_FILTER_CHANGED,
            query,
        });
    }

    public dispatchGetLoadDetails(id: number): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_GET_LOAD_BY_ID,
            id,
        });
    }

    public toggleMap(): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_TOGGLE_MAP,
        });
    }
}
