import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

// Interfaces
import { ILoadModel, ILoadPageFilters } from '@pages/new-load/interfaces';
import { ILoadModal } from '@pages/new-load/pages/new-load-modal/interfaces';
import { ITableColumn } from '@shared/components/new-table/interface';

// Selectors
import * as LoadSelectors from '@pages/new-load/state/selectors/load.selectors';

// Services
import { ModalService } from '@shared/services';

// Const
import { LoadStoreConstants } from '@pages/new-load/utils/constants/load-store.constants';

// Models
import { ITableData } from '@shared/models';

// Components
import { NewLoadModalComponent } from '@pages/new-load/pages/new-load-modal/new-load-modal.component';

// Enums
import { eLoadRouting, eLoadStatusStringType } from '@pages/new-load/enums';
import { eLoadStatusType } from '@pages/load/pages/load-table/enums';
import { eCommonElement } from '@shared/enums';

@Injectable({
    providedIn: 'root',
})
export class LoadStoreService {
    constructor(
        private store: Store,
        private modalService: ModalService,
        private router: Router
    ) {}

    public loadsSelector$: Observable<ILoadModel[]> = this.store.pipe(
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
        this.modalService.openModal(NewLoadModalComponent, {}, modal);
    }

    public navigateToLoadDetails(id: number): void {
        this.router.navigate([
            `/${eLoadRouting.LIST}/${id}/${eLoadRouting.DETAILS}`,
        ]);
    }
}
