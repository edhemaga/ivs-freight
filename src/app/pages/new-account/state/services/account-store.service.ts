import { Injectable } from '@angular/core';

// Selectors
import * as AccountSelector from '@pages/new-account/state/selectors/account.selector';

// Constants
import { AccountStoreConstants } from '@pages/new-account/utils/constants';

// RxJS
import { BehaviorSubject, Observable, switchMap } from 'rxjs';

// Enums
import { eCommonElement } from '@shared/enums';

// Models
import { IDropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/interfaces';
import {
    ITableColumn,
    ITableConfig,
} from '@shared/components/new-table/interfaces';

// Interfaces
import { IMappedAccount } from '@pages/new-account/interfaces';

// NgRx
import { select, Store } from '@ngrx/store';

// Modal
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
    providedIn: 'root',
})
export class AccountStoreService {
    private selectedAccountId$ = new BehaviorSubject<number | null>(null);

    public accountListSelector$: Observable<IMappedAccount[]> = this.store.pipe(
        select(AccountSelector.accountsListSelector)
    );

    public accountSelector$: Observable<IMappedAccount> =
        this.selectedAccountId$.pipe(
            switchMap(
                (id) =>
                    id &&
                    this.store.pipe(select(AccountSelector.accountSelector(id)))
            )
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

    constructor(private store: Store) {}

    public dispatchOpenCompanyAccountModal(isEdit: boolean, id: number): void {
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

    public dispatchToggleColumnsVisibility(
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

    public dispatchOnAddAccount(account: IMappedAccount): void {
        this.store.dispatch({
            type: AccountStoreConstants.ACTION_ON_ADD_ACCOUNT,
            account,
        });
    }

    public dispatchOnEditAccount(account: IMappedAccount): void {
        this.store.dispatch({
            type: AccountStoreConstants.ACTION_ON_EDIT_ACCOUNT,
            account,
        });
    }

    public dispatchOnDeleteAccount(
        account: IMappedAccount,
        activeModal: NgbActiveModal
    ): void {
        this.store.dispatch({
            type: AccountStoreConstants.ACTION_ON_DELETE_ACCOUNT,
            account,
            activeModal,
        });
    }

    public selectAccountById(id: number): void {
        this.selectedAccountId$.next(id);
    }
}
