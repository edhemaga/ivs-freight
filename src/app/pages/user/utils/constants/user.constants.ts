// enums
import { TableStringEnum } from '@shared/enums/table-string.enum';

// models
import { CompanyUserResponse } from 'appcoretruckassist';
import { UserTableDropdown } from '@pages/user/models/user-table-dropdown.model';

export class UserConstants {
    static getUserTableDropdown(
        data: CompanyUserResponse
    ): UserTableDropdown[] {
        return [
            {
                title: TableStringEnum.EDIT_2,
                name: TableStringEnum.EDIT,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Edit.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.REGULAR,
                hasBorder: true,
            },
            {
                title: 'Reset Password',
                name: TableStringEnum.RESET_PASSWORD,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Password.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.REGULAR,
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
                mutedStyle: !data.verified,
            },
            {
                title: 'Resend Invitation',
                name: TableStringEnum.RESEND_INVITATION,
                svgUrl: !data.verified
                    ? 'assets/svg/truckassist-table/new-list-dropdown/Email - Invitation.svg'
                    : 'assets/svg/truckassist-table/new-list-dropdown/Check.svg',
                svgStyle: {
                    width: !data.verified ? 18 : 14,
                    height: !data.verified ? 18 : 14,
                },
                svgClass: data.verified
                    ? TableStringEnum.CHECK
                    : TableStringEnum.REGULAR,
                hasBorder: true,
                mutedStyle: data.verified,
            },
            {
                title: data.status
                    ? TableStringEnum.DEACTIVATE_2
                    : TableStringEnum.ACTIVATE_2,
                name: data.status
                    ? TableStringEnum.DEACTIVATE
                    : TableStringEnum.ACTIVATE,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Deactivate.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: !data.verified
                    ? TableStringEnum.REGULAR
                    : data.status
                    ? TableStringEnum.DEACTIVATE
                    : TableStringEnum.ACTIVATE,
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
                mutedStyle: !data.verified,
            },
            {
                title: TableStringEnum.DELETE_2,
                name: TableStringEnum.DELETE,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Delete.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.DELETE,
            },
        ];
    }

    static getUserTableOwnerDropdown(
        data: CompanyUserResponse
    ): UserTableDropdown[] {
        return [
            {
                title: TableStringEnum.EDIT_2,
                name: TableStringEnum.EDIT,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Edit.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.REGULAR,
                hasBorder: true,
            },
            {
                title: 'Reset Password',
                name: TableStringEnum.RESET_PASSWORD,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Password.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.REGULAR,
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
                mutedStyle: !data.verified,
            },
            {
                title: 'Resend Invitation',
                name: TableStringEnum.RESEND_INVITATION,
                svgUrl: !data.verified
                    ? 'assets/svg/truckassist-table/new-list-dropdown/Email - Invitation.svg'
                    : 'assets/svg/truckassist-table/new-list-dropdown/Check.svg',
                svgStyle: {
                    width: !data.verified ? 18 : 14,
                    height: !data.verified ? 18 : 14,
                },
                svgClass: data.verified
                    ? TableStringEnum.CHECK
                    : TableStringEnum.REGULAR,
                mutedStyle: data.verified,
            },
        ];
    }
}
