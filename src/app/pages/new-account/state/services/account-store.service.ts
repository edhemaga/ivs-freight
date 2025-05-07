import { Injectable } from '@angular/core';

// Selectors
import * as AccountSelector from '@pages/new-account/state/selectors/account.selector';
// Constants
import { AccountStoreConstants } from '@pages/new-account/utils/constants';
// RxJS
import { Observable } from 'rxjs';

import { eCommonElement } from '@shared/enums';

import { ModalService } from '@shared/services';

import { IDropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/interfaces';
import {
    ITableColumn,
    ITableConfig,
} from '@shared/components/new-table/interfaces';

// Interfaces
import { IMappedAccount } from '@pages/new-account/interfaces';

// NgRx
import { select, Store } from '@ngrx/store';

@Injectable({
    providedIn: 'root',
})
export class AccountStoreService {
    public accountListSelector$: Observable<IMappedAccount[]> = this.store.pipe(
        select(AccountSelector.accountsListSelector)
    );
    public activeViewModeSelector$: Observable<string> = this.store.pipe(
        select(AccountSelector.activeViewModeSelector)
    );
    public selectedCountSelector$: Observable<number> = this.store.pipe(
        select(AccountSelector.selectedCountSelector)
    );
    public selectedTabCountSelector$: Observable<number> = this.store.pipe(
        select(AccountSelector.selectedTabCountSelector)
    );
    public tableColumnsSelector$: Observable<ITableColumn[]> = this.store.pipe(
        select(AccountSelector.tableColumnsSelector)
    );
    public tableSettingsSelector$: Observable<ITableConfig> = this.store.pipe(
        select(AccountSelector.tableSettingsSelector)
    );
    public toolbarDropdownMenuOptionsSelector$: Observable<
        IDropdownMenuItem[]
    > = this.store.pipe(
        select(AccountSelector.toolbarDropdownMenuOptionsSelector)
    );

    constructor(
        private store: Store,
        private modalService: ModalService
    ) {}

    public dispatchOpenUserModal(isEdit: boolean, id: number): void {
        this.store.dispatch({
            type: AccountStoreConstants.ACTION_OPEN_ACCOUNT_MODAL,
            isEdit,
            id,
        });
    }

    // public dispatchDeleteAccounts(
    //     modalData: IAccountDeleteModal,
    //     ngbActiveModal: NgbActiveModal
    // ): void {
    //     this.modalService
    //         .openModalNew(DeleteUserComponent, modalData)
    //         .closed.subscribe((value) => {
    //             if (value) {
    //                 this.store.dispatch({
    //                     type: AccountStoreConstants.ACTION_DISPATCH_DELETE_ACCOUNTS,
    //                     accounts: modalData.accounts,
    //                 });
    //                 ngbActiveModal.close();
    //             }
    //         });
    // }
    public dispatchSearchChange(query: string[]): void {
        this.store.dispatch({
            type: AccountStoreConstants.ACTION_SEARCH_FILTER_CHANGED,
            query,
        });
    }

    public dispatchSelectAccount(id: number): void {
        this.store.dispatch({
            type: AccountStoreConstants.ACTION_DISPATCH_ON_ACCOUNT_SELECTION,
            id,
        });
    }

    public dispatchSelectAll(action: string): void {
        this.store.dispatch({
            type: AccountStoreConstants.ACTION_ON_SELECT_ALL,
            action,
        });
    }

    public dispatchSetToolbarDropdownMenuColumnsActive(
        isActive: boolean
    ): void {
        this.store.dispatch({
            type: AccountStoreConstants.ACTION_SET_TOOLBAR_DROPDOWN_MENU_COLUMNS_ACTIVE,
            isActive,
        });
    }

    public dispatchToggleColumnsVisiblity(
        columnKey: string,
        isActive: boolean
    ) {
        this.store.dispatch({
            type: AccountStoreConstants.ACTION_TOGGLE_COLUMN_VISIBILITY,
            columnKey,
            isActive,
        });
    }

    public dispatchViewModeChange(viewMode: eCommonElement): void {
        this.store.dispatch({
            type: AccountStoreConstants.ACTION_DISPATCH_VIEW_MODE_CHANGE,
            viewMode,
        });
    }

    public getNewPage(): void {
        this.store.dispatch({
            type: AccountStoreConstants.ACTION_GET_NEW_PAGE_RESULTS,
        });
    }

    public loadAccounts(): void {
        this.store.dispatch({
            type: AccountStoreConstants.LOAD_ACCOUNTS,
        });
    }
}
