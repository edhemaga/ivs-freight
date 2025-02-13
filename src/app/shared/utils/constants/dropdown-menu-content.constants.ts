import { DropdownMenuStringEnum } from '@shared/enums';

// models
import { DropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/models';

export class DropdownMenuContentConstants {
    // inner dropdown items
    static DROPDOWN_MENU_INNER_DROPDOWN_ITEMS: Record<
        string,
        { title: string; type: string }[]
    > = {
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
    };

    // shared items
    static DROPDOWN_MENU_SHARED_ITEMS: Record<string, DropdownMenuItem> = {
        [DropdownMenuStringEnum.EDIT]: {
            title: DropdownMenuStringEnum.EDIT,
            type: DropdownMenuStringEnum.EDIT_TYPE,
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Edit.svg',
            svgClass: DropdownMenuStringEnum.REGULAR_SVG_CLASS,
            hasBorder: true,
        },
        [DropdownMenuStringEnum.SUGGEST_EDIT]: {
            title: DropdownMenuStringEnum.SUGGEST_EDIT,
            type: DropdownMenuStringEnum.SUGGEST_EDIT_TYPE,
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Edit.svg',
            svgClass: DropdownMenuStringEnum.REGULAR_SVG_CLASS,
            hasBorder: true,
        },
        [DropdownMenuStringEnum.VIEW_DETAILS]: {
            title: DropdownMenuStringEnum.VIEW_DETAILS,
            type: DropdownMenuStringEnum.VIEW_DETAILS_TYPE,
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Information.svg',
            svgClass: DropdownMenuStringEnum.REGULAR_SVG_CLASS,
        },
        [DropdownMenuStringEnum.SHARE]: {
            title: DropdownMenuStringEnum.SHARE,
            type: DropdownMenuStringEnum.SHARE_TYPE,
            svgUrl: 'assets/svg/common/share-icon.svg',
            svgClass: DropdownMenuStringEnum.REGULAR_SVG_CLASS,
        },
        [DropdownMenuStringEnum.PRINT]: {
            title: DropdownMenuStringEnum.PRINT,
            type: DropdownMenuStringEnum.PRINT_TYPE,
            svgUrl: 'assets/svg/truckassist-table/print-icon.svg',
            svgClass: DropdownMenuStringEnum.REGULAR_SVG_CLASS,
            hasBorder: true,
        },
        [DropdownMenuStringEnum.DEACTIVATE]: {
            title: DropdownMenuStringEnum.DEACTIVATE,
            type: DropdownMenuStringEnum.DEACTIVATE_TYPE,
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Deactivate.svg',
            svgClass: DropdownMenuStringEnum.REGULAR_SVG_CLASS,
        },
        [DropdownMenuStringEnum.ACTIVATE]: {
            title: DropdownMenuStringEnum.ACTIVATE,
            type: DropdownMenuStringEnum.ACTIVATE_TYPE,
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Deactivate.svg',
            svgClass: DropdownMenuStringEnum.ACTIVATE_SVG_CLASS,
        },
        [DropdownMenuStringEnum.DELETE]: {
            title: DropdownMenuStringEnum.DELETE,
            type: DropdownMenuStringEnum.DELETE_TYPE,
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Delete.svg',
            svgClass: DropdownMenuStringEnum.DELETE_SVG_CLASS,
        },
        [DropdownMenuStringEnum.ADD_REPAIR_BILL]: {
            title: DropdownMenuStringEnum.ADD_REPAIR_BILL,
            type: DropdownMenuStringEnum.ADD_REPAIR_BILL_TYPE,
            svgUrl: 'assets/svg/common/ic_plus.svg',
            svgClass: DropdownMenuStringEnum.ACTIVATE_SVG_CLASS,
            hasBorder: true,
        },
        [DropdownMenuStringEnum.MARK_AS_FAVORITE]: {
            title: DropdownMenuStringEnum.MARK_AS_FAVORITE,
            type: DropdownMenuStringEnum.MARK_AS_FAVORITE_TYPE,
            svgUrl: '/assets/svg/common/ic_star.svg',
            svgClass: DropdownMenuStringEnum.ACTIVATE_SVG_CLASS,
        },
        [DropdownMenuStringEnum.UNMARK_FAVORITE]: {
            title: DropdownMenuStringEnum.UNMARK_FAVORITE,
            type: DropdownMenuStringEnum.UNMARK_FAVORITE_TYPE,
            svgUrl: '/assets/svg/common/ic_star.svg',
            svgClass: DropdownMenuStringEnum.REGULAR_SVG_CLASS,
        },
        [DropdownMenuStringEnum.WRITE_REVIEW]: {
            title: DropdownMenuStringEnum.WRITE_REVIEW,
            type: DropdownMenuStringEnum.WRITE_REVIEW_TYPE,
            svgUrl: '/assets/svg/common/review-pen.svg',
            svgClass: DropdownMenuStringEnum.REGULAR_SVG_CLASS,
            hasBorder: true,
        },
        [DropdownMenuStringEnum.CLOSE_BUSINESS]: {
            title: DropdownMenuStringEnum.CLOSE_BUSINESS,
            type: DropdownMenuStringEnum.CLOSE_BUSINESS_TYPE,
            svgUrl: '/assets/svg/common/load/ic_load-broker-closed-business.svg',
            svgClass: DropdownMenuStringEnum.DELETE_SVG_CLASS,
        },
        [DropdownMenuStringEnum.OPEN_BUSINESS]: {
            title: DropdownMenuStringEnum.OPEN_BUSINESS,
            type: DropdownMenuStringEnum.OPEN_BUSINESS_TYPE,
            svgUrl: '/assets/svg/common/confirm-circle_white.svg',
            svgClass: DropdownMenuStringEnum.OPEN_BUSINESS_SVG_CLASS,
        },
        [DropdownMenuStringEnum.SEND_MESSAGE]: {
            title: DropdownMenuStringEnum.SEND_MESSAGE,
            type: DropdownMenuStringEnum.SEND_MESSAGE_TYPE,
            svgUrl: 'assets/svg/chat/direct-message-icon.svg',
            svgClass: DropdownMenuStringEnum.REGULAR_SVG_CLASS,
        },
        [DropdownMenuStringEnum.RESEND_INVITATION]: {
            title: DropdownMenuStringEnum.RESEND_INVITATION,
            type: DropdownMenuStringEnum.RESEND_INVITATION_TYPE,
            svgUrl: 'assets/svg/common/ic_resend-invitation.svg',
            svgClass: DropdownMenuStringEnum.REGULAR_SVG_CLASS,
            hasBorder: true,
        },
        [DropdownMenuStringEnum.INVITATION_SENT]: {
            title: DropdownMenuStringEnum.INVITATION_SENT,
            type: DropdownMenuStringEnum.INVITATION_SENT_TYPE,
            svgUrl: 'assets/svg/applicant/confirm-circle.svg',
            svgClass: DropdownMenuStringEnum.OPEN_BUSINESS_SVG_CLASS,
            hasBorder: true,
        },
        [DropdownMenuStringEnum.EXPORT_BATCH]: {
            title: DropdownMenuStringEnum.EXPORT_BATCH,
            type: DropdownMenuStringEnum.EXPORT_BATH_TYPE,
            svgUrl: 'assets/svg/common/ic_document.svg',
            svgClass: DropdownMenuStringEnum.ACTIVATE_SVG_CLASS,
        },
    };

    // conditional items
    static DROPDOWN_MENU_CONDITIONAL_ITEMS: Record<string, DropdownMenuItem> = {
        // contact
        [DropdownMenuStringEnum.SEND_SMS]: {
            title: DropdownMenuStringEnum.SEND_SMS,
            type: DropdownMenuStringEnum.SEND_SMS_TYPE,
            svgUrl: 'assets/svg/chat/direct-message-icon.svg',
            svgClass: DropdownMenuStringEnum.REGULAR_SVG_CLASS,
            hasBorder: true,
        },

        // account
        [DropdownMenuStringEnum.GO_TO_LINK]: {
            title: DropdownMenuStringEnum.GO_TO_LINK,
            type: DropdownMenuStringEnum.GO_TO_LINK_TYPE,
            svgUrl: 'assets/svg/common/ic_web.svg',
            svgClass: DropdownMenuStringEnum.REGULAR_SVG_CLASS,
        },
        [DropdownMenuStringEnum.NO_LINK]: {
            title: DropdownMenuStringEnum.NO_LINK,
            type: DropdownMenuStringEnum.NO_LINK_TYPE,
            svgUrl: 'assets/svg/common/ic_web.svg',
            svgClass: DropdownMenuStringEnum.REGULAR_SVG_CLASS,
            isDisabled: true,
        },
        [DropdownMenuStringEnum.COPY_USERNAME]: {
            title: DropdownMenuStringEnum.COPY_USERNAME,
            type: DropdownMenuStringEnum.COPY_USERNAME_TYPE,
            svgUrl: 'assets/svg/applicant/user.svg',
            svgClass: DropdownMenuStringEnum.REGULAR_SVG_CLASS,
        },
        [DropdownMenuStringEnum.COPY_PASSWORD]: {
            title: DropdownMenuStringEnum.COPY_PASSWORD,
            type: DropdownMenuStringEnum.COPY_PASSWORD_TYPE,
            svgUrl: 'assets/svg/common/ic_password.svg',
            svgClass: DropdownMenuStringEnum.REGULAR_SVG_CLASS,
            hasBorder: true,
        },

        // owner
        [DropdownMenuStringEnum.ADD_TRUCK]: {
            title: DropdownMenuStringEnum.ADD_TRUCK,
            type: DropdownMenuStringEnum.ADD_TRUCK_TYPE,
            svgUrl: 'assets/svg/common/ic_plus.svg',
            svgClass: DropdownMenuStringEnum.ACTIVATE_SVG_CLASS,
        },
        [DropdownMenuStringEnum.ADD_TRAILER]: {
            title: DropdownMenuStringEnum.ADD_TRAILER,
            type: DropdownMenuStringEnum.ADD_TRAILER_TYPE,
            svgUrl: 'assets/svg/common/ic_plus.svg',
            svgClass: DropdownMenuStringEnum.ACTIVATE_SVG_CLASS,
            hasBorder: true,
        },

        // fuel
        [DropdownMenuStringEnum.ALL_TRANSACTIONS]: {
            title: DropdownMenuStringEnum.ALL_TRANSACTIONS,
            type: DropdownMenuStringEnum.ALL_TRANSACTIONS_TYPE,
            svgUrl: 'assets/svg/common/ic_truck.svg',
            svgClass: DropdownMenuStringEnum.REGULAR_SVG_CLASS,
            hasBorder: true,
        },
        [DropdownMenuStringEnum.ADD_TRANSACTION]: {
            title: DropdownMenuStringEnum.ADD_TRANSACTION,
            type: DropdownMenuStringEnum.ADD_TRANSACTION_TYPE,
            svgUrl: 'assets/svg/common/ic_plus.svg',
            svgClass: DropdownMenuStringEnum.ACTIVATE_SVG_CLASS,
        },

        // pm
        [DropdownMenuStringEnum.CONFIGURE]: {
            title: DropdownMenuStringEnum.CONFIGURE,
            type: DropdownMenuStringEnum.CONFIGURE_TYPE,
            svgUrl: 'assets/svg/common/ic_settings.svg',
            svgClass: DropdownMenuStringEnum.REGULAR_SVG_CLASS,
        },

        // repair
        [DropdownMenuStringEnum.ALL_BILLS]: {
            title: DropdownMenuStringEnum.ALL_BILLS,
            type: DropdownMenuStringEnum.ALL_BILLS_TYPE,
            svgClass: DropdownMenuStringEnum.REGULAR_SVG_CLASS,
            hasBorder: true,
        },
        [DropdownMenuStringEnum.ALL_ORDERS]: {
            title: DropdownMenuStringEnum.ALL_ORDERS,
            type: DropdownMenuStringEnum.ALL_ORDERS_TYPE,
            svgClass: DropdownMenuStringEnum.REGULAR_SVG_CLASS,
            hasBorder: true,
        },
        [DropdownMenuStringEnum.FINISH_ORDER]: {
            title: DropdownMenuStringEnum.FINISH_ORDER,
            type: DropdownMenuStringEnum.FINISH_ORDER_TYPE,
            svgUrl: 'assets/svg/common/ic_note_order.svg',
            svgClass: DropdownMenuStringEnum.ACTIVATE_SVG_CLASS,
        },

        // truck - trailer
        [DropdownMenuStringEnum.ADD_NEW_TRUCK_TRAILER]: {
            title: DropdownMenuStringEnum.ADD_NEW,
            type: DropdownMenuStringEnum.ADD_NEW_TYPE,
            svgClass: DropdownMenuStringEnum.REGULAR_SVG_CLASS,
            innerDropdownContent:
                this.DROPDOWN_MENU_INNER_DROPDOWN_ITEMS[
                    DropdownMenuStringEnum.ADD_NEW_TRUCK_TRAILER
                ],
            hasBorder: true,
        },

        // driver
        [DropdownMenuStringEnum.ADD_NEW_DRIVER]: {
            title: DropdownMenuStringEnum.ADD_NEW,
            type: DropdownMenuStringEnum.ADD_NEW_TYPE,
            svgClass: DropdownMenuStringEnum.REGULAR_SVG_CLASS,
            innerDropdownContent:
                this.DROPDOWN_MENU_INNER_DROPDOWN_ITEMS[
                    DropdownMenuStringEnum.ADD_NEW_DRIVER
                ],
        },
        [DropdownMenuStringEnum.REQUEST]: {
            title: DropdownMenuStringEnum.REQUEST,
            type: DropdownMenuStringEnum.REQUEST_TYPE,
            svgClass: DropdownMenuStringEnum.REGULAR_SVG_CLASS,
            innerDropdownContent:
                this.DROPDOWN_MENU_INNER_DROPDOWN_ITEMS[
                    DropdownMenuStringEnum.REQUEST
                ],
            hasBorder: true,
        },

        // user
        [DropdownMenuStringEnum.RESET_PASSWORD]: {
            title: DropdownMenuStringEnum.RESET_PASSWORD,
            type: DropdownMenuStringEnum.RESET_PASSWORD_TYPE,
            svgUrl: 'assets/svg/common/ic_password.svg',
            svgClass: DropdownMenuStringEnum.REGULAR_SVG_CLASS,
        },

        // payroll
        [DropdownMenuStringEnum.EDIT_LOAD]: {
            title: DropdownMenuStringEnum.EDIT_LOAD,
            type: DropdownMenuStringEnum.EDIT_LOAD_TYPE,
            svgUrl: 'assets/svg/common/load/ic_load-.svg',
            svgClass: DropdownMenuStringEnum.REGULAR_SVG_CLASS,
            isSelectMenuTypeActionItem: true,
        },
        [DropdownMenuStringEnum.EDIT_PAYROLL]: {
            title: DropdownMenuStringEnum.EDIT_PAYROLL,
            type: DropdownMenuStringEnum.EDIT_PAYROLL_TYPE,
            svgUrl: 'assets/svg/truckassist-table/driver-violation.svg',
            svgClass: DropdownMenuStringEnum.REGULAR_SVG_CLASS,
            hasBorder: true,
        },
        [DropdownMenuStringEnum.RESEND_REPORT]: {
            title: DropdownMenuStringEnum.RESEND_REPORT,
            type: DropdownMenuStringEnum.RESEND_REPORT_TYPE,
            svgUrl: 'assets/svg/common/ic_resend-invitation.svg',
            svgClass: DropdownMenuStringEnum.REGULAR_SVG_CLASS,
            hasBorder: true,
        },
        [DropdownMenuStringEnum.PREVIEW_REPORT]: {
            title: DropdownMenuStringEnum.PREVIEW_REPORT,
            type: DropdownMenuStringEnum.PREVIEW_REPORT_TYPE,
            svgUrl: 'assets/ca-components/svg/note/note-empty.svg',
            svgClass: DropdownMenuStringEnum.REGULAR_SVG_CLASS,
        },
        [DropdownMenuStringEnum.DOWNLOAD]: {
            title: DropdownMenuStringEnum.DOWNLOAD,
            type: DropdownMenuStringEnum.DOWNLOAD_TYPE,
            svgUrl: 'assets/svg/common/ic_download.svg',
            svgClass: DropdownMenuStringEnum.REGULAR_SVG_CLASS,
        },
        [DropdownMenuStringEnum.EDIT_LOAD_SELECT]: {
            title: DropdownMenuStringEnum.EDIT_LOAD,
            type: DropdownMenuStringEnum.EDIT_LOAD_TYPE,
            titleOptionalClass: 'ca-font-extra-bold',
            svgUrl: 'assets/ca-components/svg/applicant/close-x.svg',
            svgClass: DropdownMenuStringEnum.REGULAR_SVG_CLASS,
            hasBorder: true,
            isSelectMenuTypeActionItem: true,
        },

        // load
        [DropdownMenuStringEnum.CREATE_LOAD]: {
            title: DropdownMenuStringEnum.CREATE_LOAD,
            type: DropdownMenuStringEnum.CREATE_LOAD_TYPE,
            svgUrl: 'assets/svg/common/ic_plus.svg',
            svgClass: DropdownMenuStringEnum.ACTIVATE_SVG_CLASS,
            hasBorder: true,
        },

        [DropdownMenuStringEnum.CREATE_TEMPLATE]: {
            title: DropdownMenuStringEnum.CREATE_TEMPLATE,
            type: DropdownMenuStringEnum.CREATE_TEMPLATE_TYPE,
            svgUrl: 'assets/svg/common/load/ic_load_template_btn.svg',
            svgClass: DropdownMenuStringEnum.ACTIVATE_SVG_CLASS,
            hasBorder: true,
        },

        // customer
        [DropdownMenuStringEnum.ADD_CONTACT]: {
            title: DropdownMenuStringEnum.ADD_CONTACT,
            type: DropdownMenuStringEnum.ADD_CONTACT_TYPE,
            svgUrl: 'assets/svg/common/load/ic_load_shipper_contact_avatar.svg',
            svgClass: DropdownMenuStringEnum.REGULAR_SVG_CLASS,
        },
        [DropdownMenuStringEnum.MOVE_TO_BAN_LIST]: {
            title: DropdownMenuStringEnum.MOVE_TO_BAN_LIST,
            type: DropdownMenuStringEnum.MOVE_TO_BAN_LIST_TYPE,
            svgUrl: 'assets/svg/truckassist-table/ban-icon.svg',
            svgClass: DropdownMenuStringEnum.REGULAR_SVG_CLASS,
        },
        [DropdownMenuStringEnum.REMOVE_FROM_BAN_LIST]: {
            title: DropdownMenuStringEnum.REMOVE_FROM_BAN_LIST,
            type: DropdownMenuStringEnum.REMOVE_FROM_BAN_LIST_TYPE,
            svgUrl: 'assets/svg/truckassist-table/ban-icon.svg',
            svgClass: DropdownMenuStringEnum.REGULAR_SVG_CLASS,
        },
        [DropdownMenuStringEnum.MOVE_TO_DNU_LIST]: {
            title: DropdownMenuStringEnum.MOVE_TO_DNU_LIST,
            type: DropdownMenuStringEnum.MOVE_TO_DNU_LIST_TYPE,
            svgUrl: 'assets/svg/truckassist-table/ban-icon.svg',
            svgClass: DropdownMenuStringEnum.DELETE_SVG_CLASS,
            hasBorder: true,
        },
        [DropdownMenuStringEnum.REMOVE_FROM_DNU_LIST]: {
            title: DropdownMenuStringEnum.REMOVE_FROM_DNU_LIST,
            type: DropdownMenuStringEnum.REMOVE_FROM_DNU_LIST_TYPE,
            svgUrl: 'assets/svg/truckassist-table/ban-icon.svg',
            svgClass: DropdownMenuStringEnum.DELETE_SVG_CLASS,
            hasBorder: true,
        },
    };
}
