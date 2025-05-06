import { createFeatureSelector, createSelector } from '@ngrx/store';

// Interfaces
import { IAccountState } from '@pages/new-account/interfaces';

export const accountFeatureKey: string = 'account';

//#region List
export const selectAccountState =
    createFeatureSelector<IAccountState>(accountFeatureKey);

export const selectAccountData = createSelector(
    selectAccountState,
    (state) => state.accountList
);

export const tableColumnsSelector = createSelector(
    selectAccountState,
    (state) => {
        const { tableColumns } = state;
        return tableColumns;
    }
);
