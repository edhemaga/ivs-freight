// Interface
import { ITableColumn } from '@shared/components/new-table/interface';

// Models
import { CompanyUserSortBy } from 'appcoretruckassist/model/companyUserSortBy';

export class UserTableColumnsConfig {
    static selectColumn: ITableColumn = {
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
        key: 'name',
        label: 'Name',
        labelToolbar: 'Name',
        width: 234,
        minWidth: 234,
        maxWidth: 234,
        isResizable: true,
        isChecked: true,
        hasSort: true,
        sortName: CompanyUserSortBy.Name,
    };

    static getTableColumns(): ITableColumn[] {
        return [
            UserTableColumnsConfig.selectColumn,
            UserTableColumnsConfig.userNameColumn,
        ];
    }
}
