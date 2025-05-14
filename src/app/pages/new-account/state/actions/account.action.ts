// ngrx
import { createAction, props } from '@ngrx/store';

// Constants
import { AccountStoreConstants } from '@pages/new-account/utils/constants';

// Models
import { GetCompanyAccountListResponse } from 'appcoretruckassist';
import { IMappedAccount } from '@pages/new-account/interfaces';

// Enums
import { IFilterAction } from 'ca-components';
import { eCommonElement } from '@shared/enums';

// Interface
import { ITableColumn } from '@shared/components/new-table/interfaces';
import { ICardValueData } from '@shared/interfaces';

// Modal
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

//#region List
export const loadAccounts = createAction(AccountStoreConstants.LOAD_ACCOUNTS);

export const loadAccountsSuccess = createAction(
    AccountStoreConstants.LOAD_ACCOUNTS_SUCCESS,
    props<{ data: GetCompanyAccountListResponse }>()
);

export const loadAccountsOnPageChangeSuccess = createAction(
    AccountStoreConstants.ACTION_NEW_PAGE_LIST_SUCCESS,
    props<{
        payload: GetCompanyAccountListResponse;
    }>()
);

export const loadAccountsFailure = createAction(
    AccountStoreConstants.LOAD_ACCOUNTS_FAILURE
);

export const getAccountsOnPageChange = createAction(
    AccountStoreConstants.ACTION_GET_NEW_PAGE_RESULTS
);
//#endregion

//#region Selection
export const onAccountSelection = createAction(
    AccountStoreConstants.ACTION_DISPATCH_ON_ACCOUNT_SELECTION,
    props<{
        id: number;
    }>()
);

export const onSelectAll = createAction(
    AccountStoreConstants.ACTION_ON_SELECT_ALL,
    props<{ action: string }>()
);
//#endregion

//#region Toolbar Hamburger Menu
export const setToolbarDropdownMenuColumnsActive = createAction(
    AccountStoreConstants.ACTION_SET_TOOLBAR_DROPDOWN_MENU_COLUMNS_ACTIVE,
    props<{ isActive: boolean }>()
);

export const toggleColumnVisibility = createAction(
    AccountStoreConstants.ACTION_TOGGLE_COLUMN_VISIBILITY,
    props<{ columnKey: string; isActive: boolean }>()
);

export const toggleCardFlipViewMode = createAction(
    AccountStoreConstants.ACTION_TOGGLE_CARD_FLIP_VIEW_MODE
);

export const openColumnsModal = createAction(
    AccountStoreConstants.ACTION_OPEN_COLUMNS_MODAL
);
//#endregion

export const onViewModeChange = createAction(
    AccountStoreConstants.ACTION_DISPATCH_VIEW_MODE_CHANGE,
    props<{
        viewMode: eCommonElement;
    }>()
);

// #region Filters
export const onSearchFilterChange = createAction(
    AccountStoreConstants.ACTION_SEARCH_FILTER_CHANGED,
    props<{
        query: string[];
    }>()
);

export const onFiltersChange = createAction(
    AccountStoreConstants.ACTION_FILTER_CHANGED,
    props<{
        filters: IFilterAction;
    }>()
);

export const tableSortingChange = createAction(
    AccountStoreConstants.ACTION_SORTING_CHANGE,
    props<{ column: ITableColumn }>()
);
//#endregion
export const onOpenModal = createAction(
    AccountStoreConstants.ACTION_OPEN_ACCOUNT_MODAL,
    props<{
        data;
        isEdit: boolean;
        id: number;
    }>()
);

export const onAddAndSaveAccount = createAction(
    AccountStoreConstants.ACTION_ON_ADD_AND_SAVE_ACCOUNT,
    props<{
        account: IMappedAccount;
        isAddNew: boolean;
    }>()
);

export const onAddAccount = createAction(
    AccountStoreConstants.ACTION_ON_ADD_ACCOUNT,
    props<{
        account: IMappedAccount;
        isAddNew: boolean;
    }>()
);

export const onAddAccountSuccess = createAction(
    AccountStoreConstants.ACTION_ON_ADD_ACCOUNT_SUCCESS,
    props<{ account: IMappedAccount }>()
);

export const onAddAccountError = createAction(
    AccountStoreConstants.ACTION_ON_ADD_ACCOUNT_ERROR,
    props<{ error: Error }>()
);

export const onEditAccount = createAction(
    AccountStoreConstants.ACTION_ON_EDIT_ACCOUNT,
    props<{ account: IMappedAccount }>()
);

export const onEditAccountSuccess = createAction(
    AccountStoreConstants.ACTION_ON_EDIT_ACCOUNT_SUCCESS,
    props<{ account: IMappedAccount }>()
);

export const onEditAccountError = createAction(
    AccountStoreConstants.ACTION_ON_EDIT_ACCOUNT_ERROR,
    props<{ error: Error }>()
);

export const onDeleteAccount = createAction(
    AccountStoreConstants.ACTION_ON_DELETE_ACCOUNT,
    props<{ account: IMappedAccount; activeModal: NgbActiveModal }>()
);

export const onDeleteAccountSuccess = createAction(
    AccountStoreConstants.ACTION_ON_DELETE_ACCOUNT_SUCCESS,
    props<{ id: number; activeModal: NgbActiveModal }>()
);

export const onDeleteAccountError = createAction(
    AccountStoreConstants.ACTION_ON_DELETE_ACCOUNT_ERROR,
    props<{ error: Error }>()
);

export const setColumnsModalResult = createAction(
    AccountStoreConstants.ACTION_SET_COLUMNS_MODAL_RESULT,
    props<{
        frontSideData: ICardValueData[];
        backSideData: ICardValueData[];
    }>()
);
