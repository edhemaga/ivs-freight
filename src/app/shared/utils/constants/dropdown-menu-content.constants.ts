// enums
import { eDropdownMenu } from '@shared/enums';

// models
import { IDropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/interfaces';

export class DropdownMenuContentConstants {
    // inner dropdown items
    static DROPDOWN_MENU_INNER_DROPDOWN_ITEMS: Record<
        string,
        { title: string; type: string }[]
    > = {
        // truck - trailer
        [eDropdownMenu.ADD_NEW_TRUCK_TRAILER]: [
            {
                title: eDropdownMenu.REGISTRATION,
                type: eDropdownMenu.REGISTRATION_TYPE,
            },
            {
                title: eDropdownMenu.FHWA_INSPECTION,
                type: eDropdownMenu.FHWA_INSPECTION_TYPE,
            },
            {
                title: eDropdownMenu.TITLE,
                type: eDropdownMenu.TITLE_TYPE,
            },
            {
                title: eDropdownMenu.LEASE_RENT,
                type: eDropdownMenu.LEASE_RENT_TYPE,
            },
        ],

        // driver
        [eDropdownMenu.ADD_NEW_DRIVER]: [
            {
                title: eDropdownMenu.CDL,
                type: eDropdownMenu.CDL_TYPE,
            },
            {
                title: eDropdownMenu.TEST,
                type: eDropdownMenu.TEST_TYPE,
            },
            {
                title: eDropdownMenu.MEDICAL_EXAM,
                type: eDropdownMenu.MEDICAL_EXAM_TYPE,
            },
            {
                title: eDropdownMenu.MVR,
                type: eDropdownMenu.MVR_TYPE,
            },
        ],
        [eDropdownMenu.REQUEST]: [
            {
                title: eDropdownMenu.BACKGROUND_CHECK,
                type: eDropdownMenu.BACKGROUND_CHECK_TYPE,
            },
            {
                title: eDropdownMenu.TEST,
                type: eDropdownMenu.TEST_TYPE,
            },
            {
                title: eDropdownMenu.MEDICAL_EXAM,
                type: eDropdownMenu.MEDICAL_EXAM_TYPE,
            },
            {
                title: eDropdownMenu.MVR,
                type: eDropdownMenu.MVR_TYPE,
            },
        ],
    };

    // shared items
    static DROPDOWN_MENU_SHARED_ITEMS: Record<string, IDropdownMenuItem> = {
        [eDropdownMenu.EDIT]: {
            title: eDropdownMenu.EDIT,
            type: eDropdownMenu.EDIT_TYPE,
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Edit.svg',
            svgClass: eDropdownMenu.REGULAR_SVG_CLASS,
            hasBorder: true,
        },
        [eDropdownMenu.SUGGEST_EDIT]: {
            title: eDropdownMenu.SUGGEST_EDIT,
            type: eDropdownMenu.SUGGEST_EDIT_TYPE,
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Edit.svg',
            svgClass: eDropdownMenu.REGULAR_SVG_CLASS,
            hasBorder: true,
        },
        [eDropdownMenu.VIEW_DETAILS]: {
            title: eDropdownMenu.VIEW_DETAILS,
            type: eDropdownMenu.VIEW_DETAILS_TYPE,
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Information.svg',
            svgClass: eDropdownMenu.REGULAR_SVG_CLASS,
        },
        [eDropdownMenu.SHARE]: {
            title: eDropdownMenu.SHARE,
            type: eDropdownMenu.SHARE_TYPE,
            svgUrl: 'assets/svg/common/share-icon.svg',
            svgClass: eDropdownMenu.REGULAR_SVG_CLASS,
        },
        [eDropdownMenu.PRINT]: {
            title: eDropdownMenu.PRINT,
            type: eDropdownMenu.PRINT_TYPE,
            svgUrl: 'assets/svg/truckassist-table/print-icon.svg',
            svgClass: eDropdownMenu.REGULAR_SVG_CLASS,
            hasBorder: true,
        },
        [eDropdownMenu.DEACTIVATE]: {
            title: eDropdownMenu.DEACTIVATE,
            type: eDropdownMenu.DEACTIVATE_TYPE,
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Deactivate.svg',
            svgClass: eDropdownMenu.REGULAR_SVG_CLASS,
        },
        [eDropdownMenu.ACTIVATE]: {
            title: eDropdownMenu.ACTIVATE,
            type: eDropdownMenu.ACTIVATE_TYPE,
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Deactivate.svg',
            svgClass: eDropdownMenu.ACTIVATE_SVG_CLASS,
        },
        [eDropdownMenu.DELETE]: {
            title: eDropdownMenu.DELETE,
            type: eDropdownMenu.DELETE_TYPE,
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Delete.svg',
            svgClass: eDropdownMenu.DELETE_SVG_CLASS,
        },
        [eDropdownMenu.ADD_REPAIR_BILL]: {
            title: eDropdownMenu.ADD_REPAIR_BILL,
            type: eDropdownMenu.ADD_REPAIR_BILL_TYPE,
            svgUrl: 'assets/svg/common/ic_plus.svg',
            svgClass: eDropdownMenu.ACTIVATE_SVG_CLASS,
            hasBorder: true,
        },
        [eDropdownMenu.MARK_AS_FAVORITE]: {
            title: eDropdownMenu.MARK_AS_FAVORITE,
            type: eDropdownMenu.MARK_AS_FAVORITE_TYPE,
            svgUrl: '/assets/svg/common/ic_star.svg',
            svgClass: eDropdownMenu.ACTIVATE_SVG_CLASS,
        },
        [eDropdownMenu.UNMARK_FAVORITE]: {
            title: eDropdownMenu.UNMARK_FAVORITE,
            type: eDropdownMenu.UNMARK_FAVORITE_TYPE,
            svgUrl: '/assets/svg/common/ic_star.svg',
            svgClass: eDropdownMenu.REGULAR_SVG_CLASS,
        },
        [eDropdownMenu.WRITE_REVIEW]: {
            title: eDropdownMenu.WRITE_REVIEW,
            type: eDropdownMenu.WRITE_REVIEW_TYPE,
            svgUrl: '/assets/svg/common/review-pen.svg',
            svgClass: eDropdownMenu.REGULAR_SVG_CLASS,
            hasBorder: true,
        },
        [eDropdownMenu.CLOSE_BUSINESS]: {
            title: eDropdownMenu.CLOSE_BUSINESS,
            type: eDropdownMenu.CLOSE_BUSINESS_TYPE,
            svgUrl: '/assets/svg/common/load/ic_load-broker-closed-business.svg',
            svgClass: eDropdownMenu.DELETE_SVG_CLASS,
        },
        [eDropdownMenu.OPEN_BUSINESS]: {
            title: eDropdownMenu.OPEN_BUSINESS,
            type: eDropdownMenu.OPEN_BUSINESS_TYPE,
            svgUrl: '/assets/svg/common/confirm-circle_white.svg',
            svgClass: eDropdownMenu.OPEN_BUSINESS_SVG_CLASS,
        },
        [eDropdownMenu.SEND_MESSAGE]: {
            title: eDropdownMenu.SEND_MESSAGE,
            type: eDropdownMenu.SEND_MESSAGE_TYPE,
            svgUrl: 'assets/svg/chat/direct-message-icon.svg',
            svgClass: eDropdownMenu.REGULAR_SVG_CLASS,
        },
        [eDropdownMenu.RESEND_INVITATION]: {
            title: eDropdownMenu.RESEND_INVITATION,
            type: eDropdownMenu.RESEND_INVITATION_TYPE,
            svgUrl: 'assets/svg/common/ic_resend-invitation.svg',
            svgClass: eDropdownMenu.REGULAR_SVG_CLASS,
            hasBorder: true,
        },
        [eDropdownMenu.INVITATION_SENT]: {
            title: eDropdownMenu.INVITATION_SENT,
            type: eDropdownMenu.INVITATION_SENT_TYPE,
            svgUrl: 'assets/svg/applicant/confirm-circle.svg',
            svgClass: eDropdownMenu.OPEN_BUSINESS_SVG_CLASS,
            hasBorder: true,
        },
        [eDropdownMenu.EXPORT_BATCH]: {
            title: eDropdownMenu.EXPORT_BATCH,
            type: eDropdownMenu.EXPORT_BATH_TYPE,
            svgUrl: 'assets/svg/common/ic_document.svg',
            svgClass: eDropdownMenu.ACTIVATE_SVG_CLASS,
        },

        // toolbar
        [eDropdownMenu.COLUMNS]: {
            title: eDropdownMenu.COLUMNS,
            type: eDropdownMenu.COLUMNS_TYPE,
            svgUrl: 'assets/svg/truckassist-table/columns-new.svg',
            svgClass: eDropdownMenu.REGULAR_SVG_CLASS,
            isSelectMenuTypeActionItem: true,
        },

        [eDropdownMenu.COLUMNS_BACK]: {
            title: eDropdownMenu.COLUMNS,
            type: eDropdownMenu.COLUMNS_TYPE,
            titleOptionalClass: 'ca-font-extra-bold',
            svgUrl: 'assets/svg/truckassist-table/reset-icon.svg',
            svgClass: eDropdownMenu.REGULAR_SVG_CLASS,
            hasBorder: true,
            isSelectMenuTypeActionItem: true,
            isColumnDropdown: true,
        },

        [eDropdownMenu.UNLOCK_TABLE]: {
            title: eDropdownMenu.UNLOCK_TABLE,
            type: eDropdownMenu.UNLOCK_TABLE_TYPE,
            svgUrl: 'assets/svg/common/ic_lock.svg',
            svgClass: eDropdownMenu.REGULAR_SVG_CLASS,
        },

        [eDropdownMenu.LOCK_TABLE]: {
            title: eDropdownMenu.LOCK_TABLE,
            type: eDropdownMenu.LOCK_TABLE_TYPE,
            svgUrl: 'assets/svg/truckassist-table/new-unlocked-table.svg',
            svgClass: eDropdownMenu.ACTIVATE_SVG_CLASS,
        },

        [eDropdownMenu.RESET_TABLE]: {
            title: eDropdownMenu.RESET_TABLE,
            type: eDropdownMenu.RESET_TABLE_TYPE,
            svgUrl: 'assets/svg/truckassist-table/reset-icon.svg',
            svgClass: eDropdownMenu.REGULAR_SVG_CLASS,
        },
    };

    // conditional items
    static DROPDOWN_MENU_CONDITIONAL_ITEMS: Record<string, IDropdownMenuItem> =
        {
            // contact
            [eDropdownMenu.SEND_SMS]: {
                title: eDropdownMenu.SEND_SMS,
                type: eDropdownMenu.SEND_SMS_TYPE,
                svgUrl: 'assets/svg/chat/direct-message-icon.svg',
                svgClass: eDropdownMenu.REGULAR_SVG_CLASS,
                hasBorder: true,
            },

            // account
            [eDropdownMenu.GO_TO_LINK]: {
                title: eDropdownMenu.GO_TO_LINK,
                type: eDropdownMenu.GO_TO_LINK_TYPE,
                svgUrl: 'assets/svg/common/ic_web.svg',
                svgClass: eDropdownMenu.REGULAR_SVG_CLASS,
            },
            [eDropdownMenu.NO_LINK]: {
                title: eDropdownMenu.NO_LINK,
                type: eDropdownMenu.NO_LINK_TYPE,
                svgUrl: 'assets/svg/common/ic_web.svg',
                svgClass: eDropdownMenu.REGULAR_SVG_CLASS,
                isDisabled: true,
            },
            [eDropdownMenu.COPY_USERNAME]: {
                title: eDropdownMenu.COPY_USERNAME,
                type: eDropdownMenu.COPY_USERNAME_TYPE,
                svgUrl: 'assets/svg/applicant/user.svg',
                svgClass: eDropdownMenu.REGULAR_SVG_CLASS,
            },
            [eDropdownMenu.COPY_PASSWORD]: {
                title: eDropdownMenu.COPY_PASSWORD,
                type: eDropdownMenu.COPY_PASSWORD_TYPE,
                svgUrl: 'assets/svg/common/ic_password.svg',
                svgClass: eDropdownMenu.REGULAR_SVG_CLASS,
                hasBorder: true,
            },

            // owner
            [eDropdownMenu.ADD_TRUCK]: {
                title: eDropdownMenu.ADD_TRUCK,
                type: eDropdownMenu.ADD_TRUCK_TYPE,
                svgUrl: 'assets/svg/common/ic_plus.svg',
                svgClass: eDropdownMenu.ACTIVATE_SVG_CLASS,
            },
            [eDropdownMenu.ADD_TRAILER]: {
                title: eDropdownMenu.ADD_TRAILER,
                type: eDropdownMenu.ADD_TRAILER_TYPE,
                svgUrl: 'assets/svg/common/ic_plus.svg',
                svgClass: eDropdownMenu.ACTIVATE_SVG_CLASS,
                hasBorder: true,
            },

            // fuel
            [eDropdownMenu.ALL_TRANSACTIONS]: {
                title: eDropdownMenu.ALL_TRANSACTIONS,
                type: eDropdownMenu.ALL_TRANSACTIONS_TYPE,
                svgUrl: 'assets/svg/common/ic_truck.svg',
                svgClass: eDropdownMenu.REGULAR_SVG_CLASS,
                hasBorder: true,
            },
            [eDropdownMenu.ADD_TRANSACTION]: {
                title: eDropdownMenu.ADD_TRANSACTION,
                type: eDropdownMenu.ADD_TRANSACTION_TYPE,
                svgUrl: 'assets/svg/common/ic_plus.svg',
                svgClass: eDropdownMenu.ACTIVATE_SVG_CLASS,
            },

            // pm
            [eDropdownMenu.CONFIGURE]: {
                title: eDropdownMenu.CONFIGURE,
                type: eDropdownMenu.CONFIGURE_TYPE,
                svgUrl: 'assets/svg/common/ic_settings.svg',
                svgClass: eDropdownMenu.REGULAR_SVG_CLASS,
            },

            // repair
            [eDropdownMenu.ALL_BILLS]: {
                title: eDropdownMenu.ALL_BILLS,
                type: eDropdownMenu.ALL_BILLS_TYPE,
                svgClass: eDropdownMenu.REGULAR_SVG_CLASS,
                hasBorder: true,
            },
            [eDropdownMenu.ALL_ORDERS]: {
                title: eDropdownMenu.ALL_ORDERS,
                type: eDropdownMenu.ALL_ORDERS_TYPE,
                svgClass: eDropdownMenu.REGULAR_SVG_CLASS,
                hasBorder: true,
            },
            [eDropdownMenu.FINISH_ORDER]: {
                title: eDropdownMenu.FINISH_ORDER,
                type: eDropdownMenu.FINISH_ORDER_TYPE,
                svgUrl: 'assets/svg/common/ic_note_order.svg',
                svgClass: eDropdownMenu.ACTIVATE_SVG_CLASS,
            },

            // truck - trailer
            [eDropdownMenu.ADD_NEW_TRUCK_TRAILER]: {
                title: eDropdownMenu.ADD_NEW,
                type: eDropdownMenu.ADD_NEW_TYPE,
                svgClass: eDropdownMenu.REGULAR_SVG_CLASS,
                innerDropdownContent:
                    this.DROPDOWN_MENU_INNER_DROPDOWN_ITEMS[
                        eDropdownMenu.ADD_NEW_TRUCK_TRAILER
                    ],
                hasBorder: true,
            },

            // driver
            [eDropdownMenu.ADD_NEW_DRIVER]: {
                title: eDropdownMenu.ADD_NEW,
                type: eDropdownMenu.ADD_NEW_TYPE,
                svgClass: eDropdownMenu.REGULAR_SVG_CLASS,
                innerDropdownContent:
                    this.DROPDOWN_MENU_INNER_DROPDOWN_ITEMS[
                        eDropdownMenu.ADD_NEW_DRIVER
                    ],
            },
            [eDropdownMenu.REQUEST]: {
                title: eDropdownMenu.REQUEST,
                type: eDropdownMenu.REQUEST_TYPE,
                svgClass: eDropdownMenu.REGULAR_SVG_CLASS,
                innerDropdownContent:
                    this.DROPDOWN_MENU_INNER_DROPDOWN_ITEMS[
                        eDropdownMenu.REQUEST
                    ],
                hasBorder: true,
            },

            // user
            [eDropdownMenu.RESET_PASSWORD]: {
                title: eDropdownMenu.RESET_PASSWORD,
                type: eDropdownMenu.RESET_PASSWORD_TYPE,
                svgUrl: 'assets/svg/common/ic_password.svg',
                svgClass: eDropdownMenu.REGULAR_SVG_CLASS,
            },

            // payroll
            [eDropdownMenu.EDIT_LOAD]: {
                title: eDropdownMenu.EDIT_LOAD,
                type: eDropdownMenu.EDIT_LOAD_TYPE,
                svgUrl: 'assets/svg/common/load/ic_load-.svg',
                svgClass: eDropdownMenu.REGULAR_SVG_CLASS,
                isSelectMenuTypeActionItem: true,
            },
            [eDropdownMenu.EDIT_PAYROLL]: {
                title: eDropdownMenu.EDIT_PAYROLL,
                type: eDropdownMenu.EDIT_PAYROLL_TYPE,
                svgUrl: 'assets/svg/truckassist-table/driver-violation.svg',
                svgClass: eDropdownMenu.REGULAR_SVG_CLASS,
                hasBorder: true,
            },
            [eDropdownMenu.RESEND_REPORT]: {
                title: eDropdownMenu.RESEND_REPORT,
                type: eDropdownMenu.RESEND_REPORT_TYPE,
                svgUrl: 'assets/svg/common/ic_resend-invitation.svg',
                svgClass: eDropdownMenu.REGULAR_SVG_CLASS,
                hasBorder: true,
            },
            [eDropdownMenu.PREVIEW_REPORT]: {
                title: eDropdownMenu.PREVIEW_REPORT,
                type: eDropdownMenu.PREVIEW_REPORT_TYPE,
                svgUrl: 'assets/ca-components/svg/note/note-empty.svg',
                svgClass: eDropdownMenu.REGULAR_SVG_CLASS,
            },
            [eDropdownMenu.DOWNLOAD]: {
                title: eDropdownMenu.DOWNLOAD,
                type: eDropdownMenu.DOWNLOAD_TYPE,
                svgUrl: 'assets/svg/common/ic_download.svg',
                svgClass: eDropdownMenu.REGULAR_SVG_CLASS,
            },
            [eDropdownMenu.EDIT_LOAD_SELECT]: {
                title: eDropdownMenu.EDIT_LOAD,
                type: eDropdownMenu.EDIT_LOAD_TYPE,
                titleOptionalClass: 'ca-font-extra-bold',
                svgUrl: 'assets/ca-components/svg/applicant/close-x.svg',
                svgClass: eDropdownMenu.REGULAR_SVG_CLASS,
                hasBorder: true,
                isSelectMenuTypeActionItem: true,
            },

            // load
            [eDropdownMenu.CREATE_LOAD]: {
                title: eDropdownMenu.CREATE_LOAD,
                type: eDropdownMenu.CREATE_LOAD_TYPE,
                svgUrl: 'assets/svg/common/ic_plus.svg',
                svgClass: eDropdownMenu.ACTIVATE_SVG_CLASS,
                hasBorder: true,
            },

            [eDropdownMenu.CREATE_TEMPLATE]: {
                title: eDropdownMenu.CREATE_TEMPLATE,
                type: eDropdownMenu.CREATE_TEMPLATE_TYPE,
                svgUrl: 'assets/svg/common/load/ic_load_template_btn.svg',
                svgClass: eDropdownMenu.ACTIVATE_SVG_CLASS,
                hasBorder: true,
            },

            // customer
            [eDropdownMenu.ADD_CONTACT]: {
                title: eDropdownMenu.ADD_CONTACT,
                type: eDropdownMenu.ADD_CONTACT_TYPE,
                svgUrl: 'assets/svg/common/load/ic_load_shipper_contact_avatar.svg',
                svgClass: eDropdownMenu.REGULAR_SVG_CLASS,
            },
            [eDropdownMenu.MOVE_TO_BAN_LIST]: {
                title: eDropdownMenu.MOVE_TO_BAN_LIST,
                type: eDropdownMenu.MOVE_TO_BAN_LIST_TYPE,
                svgUrl: 'assets/svg/truckassist-table/ban-icon.svg',
                svgClass: eDropdownMenu.REGULAR_SVG_CLASS,
            },
            [eDropdownMenu.REMOVE_FROM_BAN_LIST]: {
                title: eDropdownMenu.REMOVE_FROM_BAN_LIST,
                type: eDropdownMenu.REMOVE_FROM_BAN_LIST_TYPE,
                svgUrl: 'assets/svg/truckassist-table/ban-icon.svg',
                svgClass: eDropdownMenu.REGULAR_SVG_CLASS,
            },
            [eDropdownMenu.MOVE_TO_DNU_LIST]: {
                title: eDropdownMenu.MOVE_TO_DNU_LIST,
                type: eDropdownMenu.MOVE_TO_DNU_LIST_TYPE,
                svgUrl: 'assets/svg/truckassist-table/ban-icon.svg',
                svgClass: eDropdownMenu.DELETE_SVG_CLASS,
                hasBorder: true,
            },
            [eDropdownMenu.REMOVE_FROM_DNU_LIST]: {
                title: eDropdownMenu.REMOVE_FROM_DNU_LIST,
                type: eDropdownMenu.REMOVE_FROM_DNU_LIST_TYPE,
                svgUrl: 'assets/svg/truckassist-table/ban-icon.svg',
                svgClass: eDropdownMenu.DELETE_SVG_CLASS,
                hasBorder: true,
            },
        };
}
