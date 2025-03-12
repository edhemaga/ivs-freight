// enums
import {
    DropdownMenuStringEnum,
    eGeneralActions,
    TableStringEnum,
} from '@shared/enums';

// helpers
import { DropdownMenuContentConditionalItemsHelper } from '@shared/utils/helpers/dropdown-menu-helpers';

// models
import { IDropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/interfaces';
import { OptionsPopupContent } from '@shared/components/ta-table/ta-table-toolbar/models/options-popup-content.model';
import { IDropdownMenuLoadItem } from '@pages/accounting/pages/payroll/state/models';

export class DropdownMenuContentHelper {
    // contact
    static getContactDropdownContent(): IDropdownMenuItem[] {
        // requested items
        const requestedConditionalItems = [DropdownMenuStringEnum.SEND_SMS];

        const requestedSharedItems = [
            DropdownMenuStringEnum.EDIT,
            DropdownMenuStringEnum.SHARE,
            DropdownMenuStringEnum.PRINT,
            DropdownMenuStringEnum.DELETE,
        ];

        // items
        const conditionalItems =
            DropdownMenuContentConditionalItemsHelper.getConditionalItems(
                requestedConditionalItems,
                false
            );

        const sharedItems =
            DropdownMenuContentConditionalItemsHelper.getConditionalItems(
                requestedSharedItems,
                true
            );

        return [sharedItems[0], ...conditionalItems, ...sharedItems.slice(1)];
    }

    // account
    static getAccountDropdownContent(url: string): IDropdownMenuItem[] {
        // requested items
        const requestedConditionalItems = [
            url
                ? DropdownMenuStringEnum.GO_TO_LINK
                : DropdownMenuStringEnum.NO_LINK,
            DropdownMenuStringEnum.COPY_USERNAME,
            DropdownMenuStringEnum.COPY_PASSWORD,
        ];

        const requestedSharedItems = [
            DropdownMenuStringEnum.EDIT,
            DropdownMenuStringEnum.DELETE,
        ];

        // items
        const conditionalItems =
            DropdownMenuContentConditionalItemsHelper.getConditionalItems(
                requestedConditionalItems,
                false
            );

        const sharedItems =
            DropdownMenuContentConditionalItemsHelper.getConditionalItems(
                requestedSharedItems,
                true
            );

        return [sharedItems[0], ...conditionalItems, sharedItems[1]];
    }

    // owner
    static getOwnerDropdownContent(selectedTab: string): IDropdownMenuItem[] {
        const isActiveOwner = selectedTab === DropdownMenuStringEnum.ACTIVE;

        // modifier items
        const modifierItems =
            DropdownMenuContentConditionalItemsHelper.getOwnerModifierItems(
                isActiveOwner
            );

        // requested items
        const requestedConditionalItems = [
            DropdownMenuStringEnum.ADD_TRUCK,
            DropdownMenuStringEnum.ADD_TRAILER,
        ];

        const requestedSharedItems = [
            DropdownMenuStringEnum.EDIT,
            DropdownMenuStringEnum.DELETE,
        ];

        // items
        const conditionalItems =
            DropdownMenuContentConditionalItemsHelper.getConditionalItems(
                requestedConditionalItems,
                false,
                modifierItems
            );

        const sharedItems =
            DropdownMenuContentConditionalItemsHelper.getConditionalItems(
                requestedSharedItems,
                true,
                modifierItems
            );

        return [sharedItems[0], ...conditionalItems, sharedItems[1]];
    }

    // fuel transaction
    static getFuelTransactionDropdownContent(
        isAutomaticTransaction: boolean
    ): IDropdownMenuItem[] {
        // modifier items
        const modifierItems =
            DropdownMenuContentConditionalItemsHelper.getFuelTransactionModifierItems(
                isAutomaticTransaction
            );

        // requested items
        const requestedConditionalItems = [
            DropdownMenuStringEnum.ALL_TRANSACTIONS,
        ];

        const requestedSharedItems = [
            DropdownMenuStringEnum.EDIT,
            DropdownMenuStringEnum.SHARE,
            DropdownMenuStringEnum.PRINT,
            DropdownMenuStringEnum.DELETE,
        ];

        // items
        const conditionalItems =
            DropdownMenuContentConditionalItemsHelper.getConditionalItems(
                requestedConditionalItems,
                false
            );

        const sharedItems =
            DropdownMenuContentConditionalItemsHelper.getConditionalItems(
                requestedSharedItems,
                true,
                modifierItems
            );

        return [sharedItems[0], ...conditionalItems, ...sharedItems.slice(1)];
    }

    // fuel stop
    static getFuelStopDropdownContent(
        isCentralised: boolean,
        isPinned: boolean,
        isOpenBusiness: boolean
    ): IDropdownMenuItem[] {
        // modifier items
        const modifierItems =
            DropdownMenuContentConditionalItemsHelper.getFuelStopModifierItems(
                isOpenBusiness
            );

        // requested items
        const requestedConditionalItems = [
            DropdownMenuStringEnum.ADD_TRANSACTION,
        ];

        const requestedSharedItems = [
            isCentralised
                ? DropdownMenuStringEnum.EDIT /* DropdownMenuStringEnum.SUGGEST_EDIT */
                : DropdownMenuStringEnum.EDIT,
            DropdownMenuStringEnum.VIEW_DETAILS,
            isPinned
                ? DropdownMenuStringEnum.UNMARK_FAVORITE
                : DropdownMenuStringEnum.MARK_AS_FAVORITE,
            DropdownMenuStringEnum.SHARE,
            DropdownMenuStringEnum.PRINT,
            isOpenBusiness
                ? DropdownMenuStringEnum.CLOSE_BUSINESS
                : DropdownMenuStringEnum.OPEN_BUSINESS,
            DropdownMenuStringEnum.DELETE,
        ];

        // items
        const conditionalItems =
            DropdownMenuContentConditionalItemsHelper.getConditionalItems(
                requestedConditionalItems,
                false,
                modifierItems
            );

        const sharedItems =
            DropdownMenuContentConditionalItemsHelper.getConditionalItems(
                requestedSharedItems,
                true,
                modifierItems
            );

        return [
            ...sharedItems.slice(0, 2),
            ...conditionalItems,
            ...sharedItems.slice(2),
        ];
    }

    // pm
    static getPMDropdownContent(): IDropdownMenuItem[] {
        // requested items
        const requestedConditionalItems = [DropdownMenuStringEnum.CONFIGURE];

        const requestedSharedItems = [
            DropdownMenuStringEnum.ADD_REPAIR_BILL,
            DropdownMenuStringEnum.SHARE,
            DropdownMenuStringEnum.PRINT,
        ];

        // items
        const conditionalItems =
            DropdownMenuContentConditionalItemsHelper.getConditionalItems(
                requestedConditionalItems,
                false
            );

        const sharedItems =
            DropdownMenuContentConditionalItemsHelper.getConditionalItems(
                requestedSharedItems,
                true
            );

        return [...conditionalItems, ...sharedItems];
    }

    // repair
    static getRepairDropdownContent(
        selectedTab: string,
        repairType: string
    ): IDropdownMenuItem[] {
        const isTruckRepair = selectedTab === DropdownMenuStringEnum.ACTIVE;

        // modifier items
        const modifierItems =
            DropdownMenuContentConditionalItemsHelper.getRepairModifierItems(
                isTruckRepair
            );

        // requested items
        const requestedConditionalItems = [
            ...(repairType === DropdownMenuStringEnum.ORDER
                ? [
                      DropdownMenuStringEnum.FINISH_ORDER,
                      DropdownMenuStringEnum.ALL_ORDERS,
                  ]
                : [DropdownMenuStringEnum.ALL_BILLS]),
        ];

        const requestedSharedItems = [
            DropdownMenuStringEnum.EDIT,
            DropdownMenuStringEnum.SHARE,
            DropdownMenuStringEnum.PRINT,
            DropdownMenuStringEnum.DELETE,
        ];

        // items
        const conditionalItems =
            DropdownMenuContentConditionalItemsHelper.getConditionalItems(
                requestedConditionalItems,
                false,
                modifierItems
            );

        const sharedItems =
            DropdownMenuContentConditionalItemsHelper.getConditionalItems(
                requestedSharedItems,
                true,
                modifierItems
            );

        return [sharedItems[0], ...conditionalItems, ...sharedItems.slice(1)];
    }

    // repair shop
    static getRepairShopDropdownContent(
        isOpenBusiness: boolean,
        isPinned: boolean,
        isCompanyOwned: boolean
    ): IDropdownMenuItem[] {
        // modifier items
        const modifierItems =
            DropdownMenuContentConditionalItemsHelper.getRepairShopModifierItems(
                isOpenBusiness,
                isCompanyOwned
            );

        // requested items
        const requestedSharedItems = [
            DropdownMenuStringEnum.EDIT,
            DropdownMenuStringEnum.VIEW_DETAILS,
            DropdownMenuStringEnum.ADD_REPAIR_BILL,
            isPinned
                ? DropdownMenuStringEnum.UNMARK_FAVORITE
                : DropdownMenuStringEnum.MARK_AS_FAVORITE,
            DropdownMenuStringEnum.WRITE_REVIEW,
            DropdownMenuStringEnum.SHARE,
            DropdownMenuStringEnum.PRINT,
            isOpenBusiness
                ? DropdownMenuStringEnum.CLOSE_BUSINESS
                : DropdownMenuStringEnum.OPEN_BUSINESS,
            DropdownMenuStringEnum.DELETE,
        ];

        // items
        const sharedItems =
            DropdownMenuContentConditionalItemsHelper.getConditionalItems(
                requestedSharedItems,
                true,
                modifierItems
            );

        return [...sharedItems];
    }

    // truck and trailer
    static getTruckTrailerDropdownContent(
        selectedTab: string
    ): IDropdownMenuItem[] {
        const isActiveTruckTrailer =
            selectedTab === DropdownMenuStringEnum.ACTIVE;

        // modifier items
        const modifierItems =
            DropdownMenuContentConditionalItemsHelper.getTruckTrailerModifierItems(
                isActiveTruckTrailer
            );

        // requested items
        const requestedConditionalItems = [
            DropdownMenuStringEnum.ADD_NEW_TRUCK_TRAILER,
        ];

        const requestedSharedItems = [
            DropdownMenuStringEnum.EDIT,
            DropdownMenuStringEnum.VIEW_DETAILS,
            isActiveTruckTrailer
                ? DropdownMenuStringEnum.DEACTIVATE
                : DropdownMenuStringEnum.ACTIVATE,
            DropdownMenuStringEnum.DELETE,
        ];

        // items
        const conditionalItems =
            DropdownMenuContentConditionalItemsHelper.getConditionalItems(
                requestedConditionalItems,
                false,
                modifierItems
            );

        const sharedItems =
            DropdownMenuContentConditionalItemsHelper.getConditionalItems(
                requestedSharedItems,
                true,
                modifierItems
            );

        return [
            ...sharedItems.slice(0, 2),
            ...conditionalItems,
            ...sharedItems.slice(2),
        ];
    }

    // driver
    static getDriverDropdownContent(selectedTab: string): IDropdownMenuItem[] {
        const isActiveDriver = selectedTab === DropdownMenuStringEnum.ACTIVE;

        // modifier items
        const modifierItems =
            DropdownMenuContentConditionalItemsHelper.getDriverModifierItems(
                isActiveDriver
            );

        // requested items
        const requestedConditionalItems = [
            DropdownMenuStringEnum.ADD_NEW_DRIVER,
            DropdownMenuStringEnum.REQUEST,
        ];

        const requestedSharedItems = [
            DropdownMenuStringEnum.EDIT,
            DropdownMenuStringEnum.VIEW_DETAILS,
            DropdownMenuStringEnum.SEND_MESSAGE,
            DropdownMenuStringEnum.SHARE,
            DropdownMenuStringEnum.PRINT,
            isActiveDriver
                ? DropdownMenuStringEnum.DEACTIVATE
                : DropdownMenuStringEnum.ACTIVATE,
            DropdownMenuStringEnum.DELETE,
        ];

        // items
        const conditionalItems =
            DropdownMenuContentConditionalItemsHelper.getConditionalItems(
                requestedConditionalItems,
                false,
                modifierItems
            );

        const sharedItems =
            DropdownMenuContentConditionalItemsHelper.getConditionalItems(
                requestedSharedItems,
                true,
                modifierItems
            );

        return [
            ...sharedItems.slice(0, 3),
            ...conditionalItems,
            ...sharedItems.slice(3),
        ];
    }

    // load template
    static getLoadTemplateDropdownContent(): IDropdownMenuItem[] {
        // requested items
        const requestedConditionalItems = [DropdownMenuStringEnum.CREATE_LOAD];

        const requestedSharedItems = [
            DropdownMenuStringEnum.EDIT,
            DropdownMenuStringEnum.SHARE,
            DropdownMenuStringEnum.PRINT,
            DropdownMenuStringEnum.DELETE,
        ];

        // items
        const conditionalItems =
            DropdownMenuContentConditionalItemsHelper.getConditionalItems(
                requestedConditionalItems,
                false
            );

        const sharedItems =
            DropdownMenuContentConditionalItemsHelper.getConditionalItems(
                requestedSharedItems,
                true
            );

        return [
            ...sharedItems.slice(0, 1),
            ...conditionalItems,
            ...sharedItems.slice(1),
        ];
    }

    // load
    static getLoadDropdownContent(selectedTab: string): IDropdownMenuItem[] {
        const isPendingLoad = selectedTab === DropdownMenuStringEnum.PENDING;
        const isClosedLoad = selectedTab === DropdownMenuStringEnum.CLOSED;

        const modifierItems =
            DropdownMenuContentConditionalItemsHelper.getLoadModifierItems(
                isPendingLoad
            );

        // requested items
        const requestedConditionalItems = [
            DropdownMenuStringEnum.CREATE_TEMPLATE,
        ];

        const requestedSharedItems = [
            DropdownMenuStringEnum.EDIT,
            DropdownMenuStringEnum.VIEW_DETAILS,
            isClosedLoad && DropdownMenuStringEnum.EXPORT_BATCH,
            DropdownMenuStringEnum.SHARE,
            DropdownMenuStringEnum.PRINT,
            DropdownMenuStringEnum.DELETE,
        ];

        // items
        const conditionalItems =
            DropdownMenuContentConditionalItemsHelper.getConditionalItems(
                requestedConditionalItems,
                false
            );

        const sharedItems =
            DropdownMenuContentConditionalItemsHelper.getConditionalItems(
                requestedSharedItems,
                true,
                modifierItems
            );

        return [
            ...sharedItems.slice(0, isClosedLoad ? 3 : 2),
            ...conditionalItems,
            ...sharedItems.slice(isClosedLoad ? 3 : 2),
        ];
    }

    // shipper
    static getShipperDropdownContent(status: number): IDropdownMenuItem[] {
        const isOpenBusiness = !!status;

        const modifierItems =
            DropdownMenuContentConditionalItemsHelper.getShipperModifierItems(
                isOpenBusiness
            );

        // requested items
        const requestedConditionalItems = [DropdownMenuStringEnum.ADD_CONTACT];

        const requestedSharedItems = [
            DropdownMenuStringEnum.EDIT,
            DropdownMenuStringEnum.VIEW_DETAILS,
            DropdownMenuStringEnum.WRITE_REVIEW,
            DropdownMenuStringEnum.SHARE,
            DropdownMenuStringEnum.PRINT,
            isOpenBusiness
                ? DropdownMenuStringEnum.CLOSE_BUSINESS
                : DropdownMenuStringEnum.OPEN_BUSINESS,
            DropdownMenuStringEnum.DELETE,
        ];

        // items
        const conditionalItems =
            DropdownMenuContentConditionalItemsHelper.getConditionalItems(
                requestedConditionalItems,
                false,
                modifierItems
            );

        const sharedItems =
            DropdownMenuContentConditionalItemsHelper.getConditionalItems(
                requestedSharedItems,
                true,
                modifierItems
            );

        return [
            ...sharedItems.slice(0, 2),
            ...conditionalItems,
            ...sharedItems.slice(2),
        ];
    }

    // broker
    static getBrokerDropdownContent(
        status: number,
        isBrokerBanned?: boolean,
        isBrokerDnu?: boolean
    ): IDropdownMenuItem[] {
        const isOpenBusiness = !!status;
        const isMovedToBanOrDnu = isBrokerBanned || isBrokerDnu;

        const modifierItems =
            DropdownMenuContentConditionalItemsHelper.getBrokerModifiedItems(
                isOpenBusiness,
                isMovedToBanOrDnu
            );

        // requested items
        const requestedConditionalItems = [
            DropdownMenuStringEnum.CREATE_LOAD,
            DropdownMenuStringEnum.ADD_CONTACT,
            isBrokerBanned
                ? DropdownMenuStringEnum.REMOVE_FROM_BAN_LIST
                : DropdownMenuStringEnum.MOVE_TO_BAN_LIST,
            isBrokerDnu
                ? DropdownMenuStringEnum.REMOVE_FROM_DNU_LIST
                : DropdownMenuStringEnum.MOVE_TO_DNU_LIST,
        ];

        const requestedSharedItems = [
            DropdownMenuStringEnum.EDIT,
            DropdownMenuStringEnum.VIEW_DETAILS,
            DropdownMenuStringEnum.WRITE_REVIEW,
            DropdownMenuStringEnum.SHARE,
            DropdownMenuStringEnum.PRINT,
            isOpenBusiness
                ? DropdownMenuStringEnum.CLOSE_BUSINESS
                : DropdownMenuStringEnum.OPEN_BUSINESS,
            DropdownMenuStringEnum.DELETE,
        ];

        // items
        const conditionalItems =
            DropdownMenuContentConditionalItemsHelper.getConditionalItems(
                requestedConditionalItems,
                false,
                modifierItems
            );

        const sharedItems =
            DropdownMenuContentConditionalItemsHelper.getConditionalItems(
                requestedSharedItems,
                true,
                modifierItems
            );

        return [
            ...sharedItems.slice(0, 2),
            ...conditionalItems.slice(0, 2),
            ...sharedItems.slice(2, 3),
            ...conditionalItems.slice(2),
            ...sharedItems.slice(3),
        ];
    }

    // user
    static getUserDropdownContent(
        selectedTab: string,
        userStatus: string,
        isInvitationSent: boolean
    ): IDropdownMenuItem[] {
        const isActiveUser = selectedTab === DropdownMenuStringEnum.ACTIVE;
        const isOwnerUser = userStatus === TableStringEnum.OWNER;

        const isUserStatusInvited =
            userStatus === DropdownMenuStringEnum.INVITED;
        const isUserStatusExpired =
            userStatus === DropdownMenuStringEnum.EXPIRED;

        // modifier items
        const modifierItems =
            DropdownMenuContentConditionalItemsHelper.getUserModifierItems(
                isActiveUser,
                isOwnerUser,
                isUserStatusInvited,
                isUserStatusExpired,
                isInvitationSent
            );

        // requested items
        const requestedConditionalItems = [
            DropdownMenuStringEnum.RESET_PASSWORD,
        ];

        const requestedSharedItems = [
            DropdownMenuStringEnum.EDIT,
            DropdownMenuStringEnum.SEND_MESSAGE,
            isInvitationSent
                ? DropdownMenuStringEnum.INVITATION_SENT
                : DropdownMenuStringEnum.RESEND_INVITATION,
            DropdownMenuStringEnum.SHARE,
            DropdownMenuStringEnum.PRINT,
            isActiveUser
                ? DropdownMenuStringEnum.DEACTIVATE
                : DropdownMenuStringEnum.ACTIVATE,
            DropdownMenuStringEnum.DELETE,
        ];

        // items
        const conditionalItems =
            DropdownMenuContentConditionalItemsHelper.getConditionalItems(
                requestedConditionalItems,
                false,
                modifierItems
            );

        const sharedItems =
            DropdownMenuContentConditionalItemsHelper.getConditionalItems(
                requestedSharedItems,
                true,
                modifierItems
            );

        return [
            ...sharedItems.slice(0, 2),
            ...conditionalItems,
            ...sharedItems.slice(2),
        ];
    }

    // payroll
    static getPayrollDropdownContent(
        isOpenPayroll: boolean = false
    ): IDropdownMenuItem[] {
        // requested items
        const requestedConditionalItems = isOpenPayroll
            ? [
                  DropdownMenuStringEnum.EDIT_LOAD,
                  DropdownMenuStringEnum.EDIT_PAYROLL,
                  DropdownMenuStringEnum.PREVIEW_REPORT,
                  DropdownMenuStringEnum.DOWNLOAD,
              ]
            : [
                  DropdownMenuStringEnum.RESEND_REPORT,
                  DropdownMenuStringEnum.PREVIEW_REPORT,
                  DropdownMenuStringEnum.DOWNLOAD,
              ];

        const requestedSharedItems = [
            DropdownMenuStringEnum.SHARE,
            DropdownMenuStringEnum.PRINT,
        ];

        // items
        const conditionalItems =
            DropdownMenuContentConditionalItemsHelper.getConditionalItems(
                requestedConditionalItems,
                false
            );

        const sharedItems =
            DropdownMenuContentConditionalItemsHelper.getConditionalItems(
                requestedSharedItems,
                true
            );

        return [
            ...conditionalItems.slice(0, isOpenPayroll ? 2 : 1),
            ...sharedItems,
            ...conditionalItems.slice(-2),
        ];
    }

    // payroll select load
    static getPayrollSelectLoadDropdownContent(
        loadList: IDropdownMenuLoadItem[]
    ): IDropdownMenuItem[] {
        // requested items
        const requestedConditionalItems = [
            DropdownMenuStringEnum.EDIT_LOAD_SELECT,
        ];

        // items
        const conditionalItems =
            DropdownMenuContentConditionalItemsHelper.getConditionalItems(
                requestedConditionalItems,
                false
            );

        return [...conditionalItems, ...loadList];
    }

    /////////////////////////////////////////////////////////////////////////////////

    // driver applicant
    static getApplicantDropdownContent(
        archivedDate: string,
        applicationStatus: string,
        review: string
    ): any[] /* IDropdownMenuItem[] */ {
        return [
            {
                title: 'Edit',
                name: eGeneralActions.EDIT,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Edit.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                hasBorder: true,
                svgClass: TableStringEnum.REGULAR,
                isDisabled: !!archivedDate,
            },
            {
                title: 'View Details',
                name: 'view-details',
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Information.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
                svgClass: TableStringEnum.REGULAR,
            },
            {
                title: 'Hire Applicant',
                name: 'hire-applicant',
                svgUrl: 'assets/svg/common/ic_hire-applicant.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
                svgClass: TableStringEnum.OPEN_BUSINESS_2,
                isDisabled: applicationStatus !== 'GoodReview',
            },
            {
                title: !!review ? 'Reviewed' : 'Review',
                name: 'review',
                svgUrl: !!review
                    ? 'assets/svg/common/ic_verify-check.svg'
                    : 'assets/svg/common/ic_pen.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
                svgClass: review
                    ? TableStringEnum.OPEN_BUSINESS_2
                    : TableStringEnum.REGULAR,
                isDisabled: applicationStatus !== 'Ready',
            },
            {
                title: 'Mark as Favourite',
                name: 'add-to-favourites',
                svgUrl: 'assets/svg/common/ic_star.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
                svgClass: TableStringEnum.ACTIVATE,
                isDisabled: !!archivedDate,
            },
            {
                title: 'Resend Invitation',
                name: 'resend-invitation',
                svgUrl: 'assets/svg/common/ic_resend-invitation.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
                hasBorder: true,
                svgClass: TableStringEnum.REGULAR,
                isDisabled: !!archivedDate,
            },
            {
                title: 'Share',
                name: 'share',
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Share.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },

                svgClass: TableStringEnum.REGULAR,
            },
            {
                title: 'Print',
                name: 'print',
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Print.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                hasBorder: true,
                svgClass: TableStringEnum.REGULAR,
            },
            {
                title: 'Move to Archive',
                name: 'move-to-archive',
                svgUrl: 'assets/svg/common/ic_driver_arhive.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
                svgClass: TableStringEnum.REGULAR,
            },
            {
                title: 'Delete',
                name: 'delete-applicant',
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Delete.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.DELETE,
            },
        ];
    }

    // table toolbar - hamburger - table options
    static getTableToolbarDropdownContent(): OptionsPopupContent[] {
        return [
            {
                text: TableStringEnum.COLUMNS,
                svgPath: 'assets/svg/truckassist-table/columns-new.svg',
                active: false,
                hide: false,
                showBackToList: false,
                hasOwnSubOpions: true,
                backToListIcon:
                    'assets/svg/truckassist-table/arrow-back-to-list.svg',
            },
            {
                text: TableStringEnum.UNLOCK_TABLE,
                svgPath: 'assets/svg/truckassist-table/lock-new.svg',
                active: false,
                hide: false,
            },
            {
                text: TableStringEnum.RESET_TABLE,
                svgPath: 'assets/svg/truckassist-table/reset-icon.svg',
                isInactive: true,
                active: false,
                hide: false,
            } /* ,
            {
                text: TableStringEnum.IMPORT,
                svgPath: 'assets/svg/truckassist-table/import-new.svg',
                active: false,
                hide: false,
                hasTopBorder: true,
            },
            {
                text: TableStringEnum.EXPORT,
                svgPath: 'assets/svg/truckassist-table/export-new.svg',
                active: false,
                hide: false,
            }, */,
        ];
    }
}
