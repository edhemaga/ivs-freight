import { CompanyAccountSortBy } from 'appcoretruckassist/model/models';

// Interfaces
import { ITableColumn } from '@shared/components/new-table/interfaces';

/* eslint perfectionist/sort-classes: 0 */
export class AccountTableColumnsConfig {
    static getTableColumns(): ITableColumn[] {
        return [
            AccountTableColumnsConfig.selectColumn,
            AccountTableColumnsConfig.accountNameColumn,
            AccountTableColumnsConfig.accountUrlColumn,
            AccountTableColumnsConfig.accountUsernameColumn,
            AccountTableColumnsConfig.accountPassowordColumn,
            AccountTableColumnsConfig.labelColumn,
            AccountTableColumnsConfig.dateAddedColumn,
            AccountTableColumnsConfig.dateEditedColumn,
        ];
    }

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

    static accountNameColumn: ITableColumn = {
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
        hasSort: true,
        sortName: CompanyAccountSortBy.Name,
    };

    static accountUrlColumn: ITableColumn = {
        id: 3,
        key: 'url',
        label: 'Url',
        labelToolbar: 'URL',
        pinned: null,
        width: 308,
        minWidth: 50,
        maxWidth: 1020,
        isResizable: true,
        isChecked: true,
        isDisabled: false,
        hasSort: true,
        sortName: CompanyAccountSortBy.Url,
    };

    static accountUsernameColumn: ITableColumn = {
        id: 4,
        key: 'username',
        label: 'Username',
        labelToolbar: 'Username',
        pinned: null,
        width: 208,
        minWidth: 90,
        maxWidth: 308,
        isResizable: true,
        isChecked: true,
        isDisabled: false,
        hasSort: true,
        sortName: CompanyAccountSortBy.UserName,
    };

    static accountPassowordColumn: ITableColumn = {
        id: 5,
        key: 'password',
        label: 'Password',
        labelToolbar: 'Password',
        pinned: null,
        width: 208,
        minWidth: 90,
        maxWidth: 308,
        isResizable: true,
        isChecked: true,
        isDisabled: false,
        hasSort: false,
    };

    static labelColumn: ITableColumn = {
        id: 6,
        key: 'label',
        label: 'Label',
        labelToolbar: 'Label',
        pinned: null,
        width: 180,
        minWidth: 50,
        maxWidth: 550,
        isResizable: true,
        isChecked: true,
        isDisabled: false,
        hasSort: true,
        sortName: CompanyAccountSortBy.Label,
    };

    static dateAddedColumn: ITableColumn = {
        id: 7,
        key: 'dateAdded',
        label: 'Added',
        labelToolbar: 'Date Added',
        pinned: null,
        width: 88,
        minWidth: 72,
        maxWidth: 88,
        isResizable: true,
        isChecked: false,
        isDisabled: false,
        hasSort: true,
        sortName: CompanyAccountSortBy.AddedDate,
    };

    static dateEditedColumn: ITableColumn = {
        id: 8,
        key: 'dateEdited',
        label: 'Edited',
        labelToolbar: 'Date Edited',
        pinned: null,
        width: 88,
        minWidth: 72,
        maxWidth: 88,
        isResizable: true,
        isChecked: false,
        isDisabled: false,
        hasSort: true,
        sortName: CompanyAccountSortBy.EditedDate,
    };
}
