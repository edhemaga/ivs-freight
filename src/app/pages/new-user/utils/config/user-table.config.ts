// Interface
import { ITableColumn } from '@shared/components/new-table/interface';

// Models
import { CompanyUserSortBy } from 'appcoretruckassist/model/companyUserSortBy';

export class UserTableColumnsConfig {
    static getTableColumns(): ITableColumn[] {
        return [
            UserTableColumnsConfig.selectColumn,
            UserTableColumnsConfig.userNameColumn,
            UserTableColumnsConfig.departmentColumn,
            UserTableColumnsConfig.employeeDetailGroup,
            UserTableColumnsConfig.personalDetailGroup,
            UserTableColumnsConfig.statusColumn,
            UserTableColumnsConfig.activityColumn,
        ];
    }

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
        isDisabled: true,
        hasSort: true,
        sortName: CompanyUserSortBy.Name,
    };

    static departmentColumn: ITableColumn = {
        key: 'department',
        label: 'Department',
        labelToolbar: 'Department',
        width: 138,
        minWidth: 138,
        maxWidth: 138,
        isResizable: true,
        isChecked: true,
        hasSort: true,
        sortName: CompanyUserSortBy.Department,
    };

    static employeeDetailGroup: ITableColumn = {
        key: 'employeeDetailGroup',
        label: 'Employee',
        labelToolbar: 'Employee Detail',
        columns: [
            {
                key: 'employeeOffice',
                label: 'Office',
                labelToolbar: 'Office',
                width: 208,
                minWidth: 208,
                maxWidth: 208,
                isResizable: true,
                isChecked: true,
                hasSort: true,
                sortName: CompanyUserSortBy.EmployeeOffice,
            },
            {
                key: 'employeePhone',
                label: 'Phone',
                labelToolbar: 'Phone',
                width: 188,
                minWidth: 188,
                maxWidth: 188,
                isResizable: true,
                isChecked: true,
                hasSort: true,
                sortName: CompanyUserSortBy.Phone,
            },
            {
                key: 'employeeEmail',
                label: 'Email',
                labelToolbar: 'Email',
                width: 228,
                minWidth: 228,
                maxWidth: 228,
                isResizable: true,
                isChecked: true,
                hasSort: true,
                sortName: CompanyUserSortBy.Email,
            },
        ],
    };

    static personalDetailGroup: ITableColumn = {
        key: 'personalDetailGroup',
        label: 'Personal',
        labelToolbar: 'Personal Detail',
        columns: [
            {
                key: 'personalPhone',
                label: 'Phone',
                labelToolbar: 'Phone',
                width: 128,
                minWidth: 128,
                maxWidth: 128,
                isResizable: true,
                isChecked: false,
                hasSort: true,
                sortName: CompanyUserSortBy.PersonalPhone,
            },
            {
                key: 'personalEmail',
                label: 'Email',
                labelToolbar: 'Email',
                width: 228,
                minWidth: 228,
                maxWidth: 228,
                isResizable: true,
                isChecked: false,
                hasSort: true,
                sortName: CompanyUserSortBy.PersonalEmail,
            },
            {
                key: 'personalAddress',
                label: 'Address',
                labelToolbar: 'Address',
                width: 320,
                minWidth: 320,
                maxWidth: 320,
                isResizable: true,
                isChecked: false,
                hasSort: true,
                sortName: CompanyUserSortBy.Address,
            },
        ],
    };

    static statusColumn: ITableColumn = {
        key: 'statusColumnGroup',
        label: '',
        labelToolbar: '',
        columns: [
            {
                key: 'status',
                label: 'Status',
                labelToolbar: 'Status',
                width: 98,
                minWidth: 98,
                maxWidth: 98,
                isResizable: true,
                isChecked: true,
                hasSort: true,
                sortName: CompanyUserSortBy.Status,
            },
        ],
    };

    static activityColumn: ITableColumn = {
        key: 'activityColumnGroup',
        label: '',
        labelToolbar: '',
        columns: [
            {
                key: 'activity',
                label: 'Activity',
                labelToolbar: 'Activity',
                width: 118,
                minWidth: 118,
                maxWidth: 118,
                isResizable: true,
                isChecked: true,
                hasSort: true,
                sortName: CompanyUserSortBy.Activity,
            },
        ],
    };
}
