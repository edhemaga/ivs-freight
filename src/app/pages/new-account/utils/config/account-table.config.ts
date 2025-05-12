// Interfaces
import { ITableColumn } from '@shared/components/new-table/interfaces';

export class AccountTableColumnsConfig {
    static selectColumn: ITableColumn = {
        id: 1,
        key: 'select',
        label: '',
        pinned: 'left',
        width: 32,
        minWidth: 32,
        maxWidth: 200,
        isResizable: true,
        isDisabled: true,
        isChecked: true,
        hasSort: false,
    };
    static userNameColumn: ITableColumn = {
        id: 2,
        key: 'name',
        label: 'Name',
        labelToolbar: 'Name',
        pinned: 'left',
        width: 234,
        minWidth: 234,
        maxWidth: 234,
        isResizable: true,
        isChecked: true,
        isDisabled: true,
        // hasSort: true,
        // sortName: CompanyUserSortBy.Name,
    };
    static urlColumn: ITableColumn = {
        id: 3,
        key: 'url',
        label: 'Url',
        labelToolbar: 'url',
        pinned: 'left',
        width: 234,
        minWidth: 234,
        maxWidth: 234,
        isResizable: true,
        isChecked: true,
        isDisabled: true,
    };
    static userUsernameColumn: ITableColumn = {
        id: 4,
        key: 'username',
        label: 'Username',
        labelToolbar: 'Username',
        pinned: 'left',
        width: 234,
        minWidth: 234,
        maxWidth: 234,
        isResizable: true,
        isChecked: true,
        isDisabled: true,
    };

    static getTableColumns(): ITableColumn[] {
        return [
            AccountTableColumnsConfig.selectColumn,
            AccountTableColumnsConfig.userNameColumn,
            AccountTableColumnsConfig.urlColumn,
            AccountTableColumnsConfig.userUsernameColumn,
        ];
    }
}
