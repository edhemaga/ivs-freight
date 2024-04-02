// enums
import { ConstantStringTableComponentsEnum } from 'src/app/core/utils/enums/table-components.enum';

// models
import { CompanyUserResponse } from 'appcoretruckassist';
import { UserTableDropdown } from '../../models/user-table-dropdown.model';

export class UserConstants {
    static getUserTableDropdown(
        data: CompanyUserResponse
    ): UserTableDropdown[] {
        return [
            {
                title: ConstantStringTableComponentsEnum.EDIT_2,
                name: ConstantStringTableComponentsEnum.EDIT,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Edit.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: ConstantStringTableComponentsEnum.REGULAR,
                hasBorder: true,
            },
            {
                title: 'Reset Password',
                name: ConstantStringTableComponentsEnum.RESET_PASSWORD,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Password.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: ConstantStringTableComponentsEnum.REGULAR,
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
                mutedStyle: !data.verified,
            },
            {
                title: 'Resend Invitation',
                name: ConstantStringTableComponentsEnum.RESEND_INVITATION,
                svgUrl: !data.verified
                    ? 'assets/svg/truckassist-table/new-list-dropdown/Email - Invitation.svg'
                    : 'assets/svg/truckassist-table/new-list-dropdown/Check.svg',
                svgStyle: {
                    width: !data.verified ? 18 : 14,
                    height: !data.verified ? 18 : 14,
                },
                svgClass: data.verified
                    ? ConstantStringTableComponentsEnum.CHECK
                    : ConstantStringTableComponentsEnum.REGULAR,
                hasBorder: true,
                mutedStyle: data.verified,
            },
            {
                title: data.status
                    ? ConstantStringTableComponentsEnum.DEACTIVATE_2
                    : ConstantStringTableComponentsEnum.ACTIVATE_2,
                name: data.status
                    ? ConstantStringTableComponentsEnum.DEACTIVATE
                    : ConstantStringTableComponentsEnum.ACTIVATE,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Deactivate.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: !data.verified
                    ? ConstantStringTableComponentsEnum.REGULAR
                    : data.status
                    ? ConstantStringTableComponentsEnum.DEACTIVATE
                    : ConstantStringTableComponentsEnum.ACTIVATE,
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
                mutedStyle: !data.verified,
            },
            {
                title: ConstantStringTableComponentsEnum.DELETE_2,
                name: ConstantStringTableComponentsEnum.DELETE,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Delete.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: ConstantStringTableComponentsEnum.DELETE,
            },
        ];
    }

    static getUserTableOwnerDropdown(
        data: CompanyUserResponse
    ): UserTableDropdown[] {
        return [
            {
                title: ConstantStringTableComponentsEnum.EDIT_2,
                name: ConstantStringTableComponentsEnum.EDIT,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Edit.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: ConstantStringTableComponentsEnum.REGULAR,
                hasBorder: true,
            },
            {
                title: 'Reset Password',
                name: ConstantStringTableComponentsEnum.RESET_PASSWORD,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Password.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: ConstantStringTableComponentsEnum.REGULAR,
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
                mutedStyle: !data.verified,
            },
            {
                title: 'Resend Invitation',
                name: ConstantStringTableComponentsEnum.RESEND_INVITATION,
                svgUrl: !data.verified
                    ? 'assets/svg/truckassist-table/new-list-dropdown/Email - Invitation.svg'
                    : 'assets/svg/truckassist-table/new-list-dropdown/Check.svg',
                svgStyle: {
                    width: !data.verified ? 18 : 14,
                    height: !data.verified ? 18 : 14,
                },
                svgClass: data.verified
                    ? ConstantStringTableComponentsEnum.CHECK
                    : ConstantStringTableComponentsEnum.REGULAR,
                mutedStyle: data.verified,
            },
        ];
    }
}
