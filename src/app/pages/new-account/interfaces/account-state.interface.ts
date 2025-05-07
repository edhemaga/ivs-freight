// Interfaces
import { IMappedAccount } from '@pages/new-account/interfaces';
import { ITableColumn } from '@shared/components/new-table/interfaces';

export interface IAccountState {
    accountList: IMappedAccount[];
    isLoading: boolean;

    // Table
    tableColumns: ITableColumn[];
}
