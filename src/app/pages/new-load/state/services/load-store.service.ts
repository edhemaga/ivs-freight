import { Injectable, TemplateRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

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
import {
    ITableColumn,
    ITableConfig,
} from '@shared/components/new-table/interface';
import { IDropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/interfaces';

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
import { CaDeleteModalComponent, IFilterAction } from 'ca-components';

// Services

import { ModalService } from '@shared/services';

@Injectable({
    providedIn: 'root',
})
export class LoadStoreService {
    constructor(
        private store: Store,
        private modalService: ModalService
    ) {}

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

    public selectedCountSelector$: Observable<number> = this.store.pipe(
        select(LoadSelectors.selectedCountSelector)
    );

    public totalSumSelector$: Observable<number> = this.store.pipe(
        select(LoadSelectors.totalSumSelector)
    );

    // TODO: WAIT FOR BACKEND TO CREATE THIS, THIS WE BE REMOVED THEN!!!
    public closedLoadStatusSelector$: Observable<any> = this.store.pipe(
        select(LoadSelectors.closedLoadStatusSelector)
    );

    public toolbarDropdownMenuOptionsSelector$: Observable<
        IDropdownMenuItem[]
    > = this.store.pipe(
        select(LoadSelectors.toolbarDropdownMenuOptionsSelector)
    );

    public tableSettingsSelector$: Observable<ITableConfig> = this.store.pipe(
        select(LoadSelectors.tableSettingsSelector)
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

    public onSelectLoad(id: number): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_ON_ONE_LOAD_SELECT,
            id,
        });
    }

    public onSelectAll(action: string): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_ON_SELECT_LOAD_ALL,
            action,
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

    public onShowDeleteLoadModal(
        templateRef: TemplateRef<any>,
        isTemplate: boolean,
        count: number,
        ngbActiveModal?: NgbActiveModal,
        templateId?: number
    ): void {
        this.modalService
            .openModalNew(
                CaDeleteModalComponent,
                {},
                {
                    // Don't show count for 1 load
                    count: count === 1 ? 0 : count,
                    title: isTemplate
                        ? 'Delete Template'
                        : 'Delete Pending Load',
                },
                templateRef
            )
            .closed.subscribe((value) => {
                if (value) {
                    if (templateId) {
                        this.store.dispatch({
                            type: LoadStoreConstants.ACTION_ON_DELETE_LOAD_TEMPLATE,
                            templateId,
                        });
                    } else {
                        this.store.dispatch({
                            type: LoadStoreConstants.ACTION_ON_DELETE_LOAD_LIST,
                            count,
                            isTemplate,
                        });
                    }

                    if (ngbActiveModal) ngbActiveModal.close();
                }
            });
    }

    public dispatchSetToolbarDropdownMenuColumnsActive(
        isActive: boolean
    ): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_SET_TOOLBAR_DROPDOWN_MENU_COLUMNS_ACTIVE,
            isActive,
        });
    }

    public dispatchToggleColumnsVisiblity(
        columnKey: string,
        isActive: boolean
    ) {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_TOGGLE_COLUMN_VISIBILITY,
            columnKey,
            isActive,
        });
    }

    public dispatchTableUnlockToggle(): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_TABLE_UNLOCK_TOGGLE,
        });
    }

    public dispatchTableColumnReset(): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_RESET_COLUMNS,
        });
    }

    public dispatchToggleCardFlipViewMode(): void {
        this.store.dispatch({
            type: LoadStoreConstants.ACTION_TOGGLE_CARD_FLIP_VIEW_MODE,
        });
    }
}
