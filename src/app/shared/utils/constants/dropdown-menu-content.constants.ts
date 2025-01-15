import { DropdownMenuStringEnum } from '@shared/enums';

// models
import { DropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/models';

export class DropdownMenuContentConstants {
    // inner dropdown items
    static DROPDOWN_MENU_INNER_DROPDOWN_ITEMS: Record<
        string,
        { title: string; type: string }[]
    > = {
        // driver
        [DropdownMenuStringEnum.ADD_NEW_DRIVER]: [
            {
                title: DropdownMenuStringEnum.CDL,
                type: DropdownMenuStringEnum.CDL_TYPE,
            },
            {
                title: DropdownMenuStringEnum.TEST,
                type: DropdownMenuStringEnum.TEST_TYPE,
            },
            {
                title: DropdownMenuStringEnum.MEDICAL_EXAM,
                type: DropdownMenuStringEnum.MEDICAL_EXAM_TYPE,
            },
            {
                title: DropdownMenuStringEnum.MVR,
                type: DropdownMenuStringEnum.MVR_TYPE,
            },
        ],
        [DropdownMenuStringEnum.REQUEST]: [
            {
                title: DropdownMenuStringEnum.BACKGROUND_CHECK,
                type: DropdownMenuStringEnum.BACKGROUND_CHECK_TYPE,
            },
            {
                title: DropdownMenuStringEnum.TEST,
                type: DropdownMenuStringEnum.TEST_TYPE,
            },
            {
                title: DropdownMenuStringEnum.MEDICAL_EXAM,
                type: DropdownMenuStringEnum.MEDICAL_EXAM_TYPE,
            },
            {
                title: DropdownMenuStringEnum.MVR,
                type: DropdownMenuStringEnum.MVR_TYPE,
            },
        ],

        // truck - trailer
        [DropdownMenuStringEnum.ADD_NEW_TRUCK_TRAILER]: [
            {
                title: DropdownMenuStringEnum.REGISTRATION,
                type: DropdownMenuStringEnum.REGISTRATION_TYPE,
            },
            {
                title: DropdownMenuStringEnum.FHWA_INSPECTION,
                type: DropdownMenuStringEnum.FHWA_INSPECTION_TYPE,
            },
            {
                title: DropdownMenuStringEnum.TITLE,
                type: DropdownMenuStringEnum.TITLE_TYPE,
            },
            {
                title: DropdownMenuStringEnum.LEASE_RENT,
                type: DropdownMenuStringEnum.LEASE_RENT_TYPE,
            },
        ],
    };

    // shared items
    static DROPDOWN_MENU_SHARED_ITEMS: Record<string, DropdownMenuItem> = {
        [DropdownMenuStringEnum.EDIT]: {
            title: DropdownMenuStringEnum.EDIT,
            type: DropdownMenuStringEnum.EDIT_TYPE,
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Edit.svg',
            svgClass: DropdownMenuStringEnum.REGULAR,
            hasBorder: true,
        },
        [DropdownMenuStringEnum.VIEW_DETAILS]: {
            title: DropdownMenuStringEnum.VIEW_DETAILS,
            type: DropdownMenuStringEnum.VIEW_DETAILS_TYPE,
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Information.svg',
            svgClass: DropdownMenuStringEnum.REGULAR,
        },
        [DropdownMenuStringEnum.SHARE]: {
            title: DropdownMenuStringEnum.SHARE,
            type: DropdownMenuStringEnum.SHARE_TYPE,
            svgUrl: 'assets/svg/common/share-icon.svg',
            svgClass: DropdownMenuStringEnum.REGULAR,
        },
        [DropdownMenuStringEnum.PRINT]: {
            title: DropdownMenuStringEnum.PRINT,
            type: DropdownMenuStringEnum.PRINT_TYPE,
            svgUrl: 'assets/svg/truckassist-table/print-icon.svg',
            svgClass: DropdownMenuStringEnum.REGULAR,
            hasBorder: true,
        },
        [DropdownMenuStringEnum.DEACTIVATE]: {
            title: DropdownMenuStringEnum.DEACTIVATE,
            type: DropdownMenuStringEnum.DEACTIVATE_TYPE,
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Deactivate.svg',
            svgClass: DropdownMenuStringEnum.REGULAR,
        },
        [DropdownMenuStringEnum.ACTIVATE]: {
            title: DropdownMenuStringEnum.ACTIVATE,
            type: DropdownMenuStringEnum.ACTIVATE_TYPE,
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Deactivate.svg',
            svgClass: DropdownMenuStringEnum.ACTIVATE_TYPE,
        },
        [DropdownMenuStringEnum.DELETE]: {
            title: DropdownMenuStringEnum.DELETE,
            type: DropdownMenuStringEnum.DELETE_TYPE,
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Delete.svg',
            svgClass: DropdownMenuStringEnum.DELETE_TYPE,
        },
    };

    // conditional items
    static DROPDOWN_MENU_CONDITIONAL_ITEMS: Record<string, DropdownMenuItem> = {
        // account
        [DropdownMenuStringEnum.GO_TO_LINK]: {
            title: DropdownMenuStringEnum.GO_TO_LINK,
            type: DropdownMenuStringEnum.GO_TO_LINK_TYPE,
            svgUrl: 'assets/svg/common/ic_web.svg',
            svgClass: DropdownMenuStringEnum.REGULAR,
        },
        [DropdownMenuStringEnum.NO_LINK]: {
            title: DropdownMenuStringEnum.NO_LINK,
            type: DropdownMenuStringEnum.NO_LINK_TYPE,
            svgUrl: 'assets/svg/common/ic_web.svg',
            svgClass: DropdownMenuStringEnum.REGULAR,
            isDisabled: true,
        },
        [DropdownMenuStringEnum.COPY_USERNAME]: {
            title: DropdownMenuStringEnum.COPY_USERNAME,
            type: DropdownMenuStringEnum.COPY_USERNAME_TYPE,
            svgUrl: 'assets/svg/applicant/user.svg',
            svgClass: DropdownMenuStringEnum.REGULAR,
        },
        [DropdownMenuStringEnum.COPY_PASSWORD]: {
            title: DropdownMenuStringEnum.COPY_PASSWORD,
            type: DropdownMenuStringEnum.COPY_PASSWORD_TYPE,
            svgUrl: 'assets/svg/common/ic_password.svg',
            svgClass: DropdownMenuStringEnum.REGULAR,
            hasBorder: true,
        },

        // contact
        [DropdownMenuStringEnum.SEND_SMS]: {
            title: DropdownMenuStringEnum.SEND_SMS,
            type: DropdownMenuStringEnum.SEND_SMS_TYPE,
            svgUrl: 'assets/svg/chat/direct-message-icon.svg',
            svgClass: DropdownMenuStringEnum.REGULAR,
            hasBorder: true,
        },

        // owner
        [DropdownMenuStringEnum.ADD_TRUCK]: {
            title: DropdownMenuStringEnum.ADD_TRUCK,
            type: DropdownMenuStringEnum.ADD_TRUCK_TYPE,
            svgUrl: 'assets/svg/common/ic_plus.svg',
            svgClass: DropdownMenuStringEnum.ACTIVATE_TYPE,
        },
        [DropdownMenuStringEnum.ADD_TRAILER]: {
            title: DropdownMenuStringEnum.ADD_TRAILER,
            type: DropdownMenuStringEnum.ADD_TRAILER_TYPE,
            svgUrl: 'assets/svg/common/ic_plus.svg',
            svgClass: DropdownMenuStringEnum.ACTIVATE_TYPE,
            hasBorder: true,
        },

        // driver
        [DropdownMenuStringEnum.SEND_MESSAGE]: {
            title: DropdownMenuStringEnum.SEND_MESSAGE,
            type: DropdownMenuStringEnum.SEND_MESSAGE_TYPE,
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Send Message.svg',
            svgClass: DropdownMenuStringEnum.REGULAR,
        },
        [DropdownMenuStringEnum.ADD_NEW_DRIVER]: {
            title: DropdownMenuStringEnum.ADD_NEW,
            type: DropdownMenuStringEnum.ADD_NEW_TYPE,
            svgClass: DropdownMenuStringEnum.REGULAR,
            innerDropdownContent:
                this.DROPDOWN_MENU_INNER_DROPDOWN_ITEMS[
                    DropdownMenuStringEnum.ADD_NEW_DRIVER
                ],
        },
        [DropdownMenuStringEnum.REQUEST]: {
            title: DropdownMenuStringEnum.REQUEST,
            type: DropdownMenuStringEnum.REQUEST_TYPE,
            svgClass: DropdownMenuStringEnum.REGULAR,
            innerDropdownContent:
                this.DROPDOWN_MENU_INNER_DROPDOWN_ITEMS[
                    DropdownMenuStringEnum.REQUEST
                ],
            hasBorder: true,
        },

        // truck - trailer
        [DropdownMenuStringEnum.ADD_NEW_TRUCK_TRAILER]: {
            title: DropdownMenuStringEnum.ADD_NEW,
            type: DropdownMenuStringEnum.ADD_NEW_TYPE,
            svgClass: DropdownMenuStringEnum.REGULAR,
            innerDropdownContent:
                this.DROPDOWN_MENU_INNER_DROPDOWN_ITEMS[
                    DropdownMenuStringEnum.ADD_NEW_TRUCK_TRAILER
                ],
            hasBorder: true,
        },

        // payroll
        [DropdownMenuStringEnum.EDIT_LOAD]: {
            title: DropdownMenuStringEnum.EDIT_LOAD,
            type: DropdownMenuStringEnum.EDIT_LOAD_TYPE,
            svgUrl: 'assets/svg/common/load/ic_load-.svg',
            svgClass: DropdownMenuStringEnum.REGULAR,
            isSelectMenuTypeActionItem: true,
        },
        [DropdownMenuStringEnum.EDIT_PAYROLL]: {
            title: DropdownMenuStringEnum.EDIT_PAYROLL,
            type: DropdownMenuStringEnum.EDIT_PAYROLL_TYPE,
            svgUrl: 'assets/svg/truckassist-table/driver-violation.svg',
            svgClass: DropdownMenuStringEnum.REGULAR,
            hasBorder: true,
        },
        [DropdownMenuStringEnum.RESEND_REPORT]: {
            title: DropdownMenuStringEnum.RESEND_REPORT,
            type: DropdownMenuStringEnum.RESEND_REPORT_TYPE,
            svgUrl: 'assets/svg/common/ic_resend-invitation.svg',
            svgClass: DropdownMenuStringEnum.REGULAR,
            hasBorder: true,
        },
        [DropdownMenuStringEnum.PREVIEW_REPORT]: {
            title: DropdownMenuStringEnum.PREVIEW_REPORT,
            type: DropdownMenuStringEnum.PREVIEW_REPORT_TYPE,
            svgUrl: 'assets/ca-components/svg/note/note-empty.svg',
            svgClass: DropdownMenuStringEnum.REGULAR,
        },
        [DropdownMenuStringEnum.DOWNLOAD]: {
            title: DropdownMenuStringEnum.DOWNLOAD,
            type: DropdownMenuStringEnum.DOWNLOAD_TYPE,
            svgUrl: 'assets/svg/common/ic_download.svg',
            svgClass: DropdownMenuStringEnum.REGULAR,
        },
    };
}
