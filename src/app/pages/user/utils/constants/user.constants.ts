// enums
import { TableStringEnum } from '@shared/enums/table-string.enum';

// models
import { CompanyUserResponse } from 'appcoretruckassist';
import { UserTableDropdown } from '@pages/user/models/user-table-dropdown.model';

export class UserConstants {
    static getUserTableDropdown(
        data: CompanyUserResponse,
        selectedTab: string
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
                mutedStyle: selectedTab === TableStringEnum.INACTIVE,
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
                mutedStyle:
                    data.userStatus === TableStringEnum.EXPIRED ||
                    data.userStatus === TableStringEnum.INVITED ||
                    selectedTab === TableStringEnum.INACTIVE,
            },
            {
                title: 'Resend Invitation',
                name: TableStringEnum.RESEND_INVITATION,
                svgUrl:
                    data.userStatus === TableStringEnum.EXPIRED ||
                    data.userStatus === TableStringEnum.INVITED
                        ? 'assets/svg/truckassist-table/new-list-dropdown/Email - Invitation.svg'
                        : 'assets/svg/truckassist-table/new-list-dropdown/Check.svg',
                svgStyle: {
                    width:
                        data.userStatus === TableStringEnum.EXPIRED ||
                        data.userStatus === TableStringEnum.INVITED
                            ? 18
                            : 14,
                    height:
                        data.userStatus === TableStringEnum.EXPIRED ||
                        data.userStatus === TableStringEnum.INVITED
                            ? 18
                            : 14,
                },
                svgClass:
                    data.userStatus !== TableStringEnum.EXPIRED &&
                    data.userStatus !== TableStringEnum.INVITED
                        ? TableStringEnum.CHECK
                        : TableStringEnum.REGULAR,
                hasBorder: true,
                mutedStyle:
                    data.userStatus !== TableStringEnum.EXPIRED &&
                    data.userStatus !== TableStringEnum.INVITED,
            },
            {
                title:
                    selectedTab === TableStringEnum.ACTIVE
                        ? TableStringEnum.DEACTIVATE_2
                        : TableStringEnum.ACTIVATE_2,
                name:
                    selectedTab === TableStringEnum.ACTIVE
                        ? TableStringEnum.DEACTIVATE
                        : TableStringEnum.ACTIVATE,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Deactivate.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass:
                    data.userStatus === TableStringEnum.EXPIRED ||
                    data.userStatus === TableStringEnum.INVITED
                        ? TableStringEnum.REGULAR
                        : selectedTab === TableStringEnum.ACTIVE
                        ? TableStringEnum.DEACTIVATE
                        : TableStringEnum.ACTIVATE,
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
                mutedStyle:
                    data.userStatus === TableStringEnum.EXPIRED ||
                    data.userStatus === TableStringEnum.INVITED,
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
                mutedStyle:
                    data.userStatus === TableStringEnum.EXPIRED ||
                    data.userStatus === TableStringEnum.INVITED,
            },
            {
                title: 'Resend Invitation',
                name: TableStringEnum.RESEND_INVITATION,
                svgUrl:
                    data.userStatus === TableStringEnum.EXPIRED ||
                    data.userStatus === TableStringEnum.INVITED
                        ? 'assets/svg/truckassist-table/new-list-dropdown/Email - Invitation.svg'
                        : 'assets/svg/truckassist-table/new-list-dropdown/Check.svg',
                svgStyle: {
                    width:
                        data.userStatus === TableStringEnum.EXPIRED ||
                        data.userStatus === TableStringEnum.INVITED
                            ? 18
                            : 14,
                    height:
                        data.userStatus === TableStringEnum.EXPIRED ||
                        data.userStatus === TableStringEnum.INVITED
                            ? 18
                            : 14,
                },
                svgClass:
                    data.userStatus !== TableStringEnum.EXPIRED &&
                    data.userStatus !== TableStringEnum.INVITED
                        ? TableStringEnum.CHECK
                        : TableStringEnum.REGULAR,
                mutedStyle:
                    data.userStatus !== TableStringEnum.EXPIRED &&
                    data.userStatus !== TableStringEnum.INVITED,
            },
        ];
    }
}
