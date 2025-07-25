// enums
import {
    eCardFlipViewMode,
    eDropdownMenu,
    eDropdownMenuColumns,
    eGeneralActions,
    TableStringEnum,
} from '@shared/enums';

// helpers
import {
    DropdownMenuColumnsActionsHelper,
    DropdownMenuContentConditionalItemsHelper,
} from '@shared/utils/helpers/dropdown-menu-helpers';

// interfaces
import { IDropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/interfaces';

// models
import { OptionsPopupContent } from '@shared/components/ta-table/ta-table-toolbar/models/options-popup-content.model';
import { IDropdownMenuLoadItem } from '@pages/accounting/pages/payroll/state/models';

export class DropdownMenuContentHelper {
    // contact
    static getContactDropdownContent(): IDropdownMenuItem[] {
        // requested items
        const requestedConditionalItems = [eDropdownMenu.SEND_SMS];

        const requestedSharedItems = [
            eDropdownMenu.EDIT,
            eDropdownMenu.SHARE,
            eDropdownMenu.PRINT,
            eDropdownMenu.DELETE,
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
            url ? eDropdownMenu.GO_TO_LINK : eDropdownMenu.NO_LINK,
            eDropdownMenu.COPY_USERNAME,
            eDropdownMenu.COPY_PASSWORD,
        ];

        const requestedSharedItems = [eDropdownMenu.EDIT, eDropdownMenu.DELETE];

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
        const isActiveOwner = selectedTab === eDropdownMenu.ACTIVE;

        // modifier items
        const modifierItems =
            DropdownMenuContentConditionalItemsHelper.getOwnerModifierItems(
                isActiveOwner
            );

        // requested items
        const requestedConditionalItems = [
            eDropdownMenu.ADD_TRUCK,
            eDropdownMenu.ADD_TRAILER,
        ];

        const requestedSharedItems = [eDropdownMenu.EDIT, eDropdownMenu.DELETE];

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
        const requestedConditionalItems = [eDropdownMenu.ALL_TRANSACTIONS];

        const requestedSharedItems = [
            eDropdownMenu.EDIT,
            eDropdownMenu.SHARE,
            eDropdownMenu.PRINT,
            eDropdownMenu.DELETE,
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
        isOpenBusiness: boolean,
        isDetailsPageDropdown: boolean = false
    ): IDropdownMenuItem[] {
        // modifier items
        const modifierItems =
            DropdownMenuContentConditionalItemsHelper.getFuelStopModifierItems(
                isOpenBusiness
            );

        // requested items
        const requestedConditionalItems = [eDropdownMenu.ADD_TRANSACTION];

        const requestedSharedItems = [
            isCentralised
                ? eDropdownMenu.EDIT /* eDropdownMenu.SUGGEST_EDIT w8 for back */
                : eDropdownMenu.EDIT,
            !isDetailsPageDropdown && eDropdownMenu.VIEW_DETAILS,
            isPinned
                ? eDropdownMenu.UNMARK_FAVORITE
                : eDropdownMenu.MARK_AS_FAVORITE,
            eDropdownMenu.SHARE,
            eDropdownMenu.PRINT,
            isOpenBusiness
                ? eDropdownMenu.CLOSE_BUSINESS
                : eDropdownMenu.OPEN_BUSINESS,
            eDropdownMenu.DELETE,
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
        const requestedConditionalItems = [eDropdownMenu.CONFIGURE];

        const requestedSharedItems = [
            eDropdownMenu.ADD_REPAIR_BILL,
            eDropdownMenu.SHARE,
            eDropdownMenu.PRINT,
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
        const isTruckRepair = selectedTab === eDropdownMenu.ACTIVE;

        // modifier items
        const modifierItems =
            DropdownMenuContentConditionalItemsHelper.getRepairModifierItems(
                isTruckRepair
            );

        // requested items
        const requestedConditionalItems = [
            ...(repairType === eDropdownMenu.ORDER
                ? [eDropdownMenu.FINISH_ORDER, eDropdownMenu.ALL_ORDERS]
                : [eDropdownMenu.ALL_BILLS]),
        ];

        const requestedSharedItems = [
            eDropdownMenu.EDIT,
            eDropdownMenu.SHARE,
            eDropdownMenu.PRINT,
            eDropdownMenu.DELETE,
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
        isCompanyOwned: boolean,
        isDetailsPageDropdown: boolean = false
    ): IDropdownMenuItem[] {
        // modifier items
        const modifierItems =
            DropdownMenuContentConditionalItemsHelper.getRepairShopModifierItems(
                isOpenBusiness,
                isCompanyOwned
            );

        // requested items
        const requestedSharedItems = [
            eDropdownMenu.EDIT,
            !isDetailsPageDropdown && eDropdownMenu.VIEW_DETAILS,
            eDropdownMenu.ADD_REPAIR_BILL,
            isPinned
                ? eDropdownMenu.UNMARK_FAVORITE
                : eDropdownMenu.MARK_AS_FAVORITE,
            eDropdownMenu.WRITE_REVIEW,
            eDropdownMenu.SHARE,
            eDropdownMenu.PRINT,
            isOpenBusiness
                ? eDropdownMenu.CLOSE_BUSINESS
                : eDropdownMenu.OPEN_BUSINESS,
            eDropdownMenu.DELETE,
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
        const isActiveTruckTrailer = selectedTab === eDropdownMenu.ACTIVE;

        // modifier items
        const modifierItems =
            DropdownMenuContentConditionalItemsHelper.getTruckTrailerModifierItems(
                isActiveTruckTrailer
            );

        // requested items
        const requestedConditionalItems = [eDropdownMenu.ADD_NEW_TRUCK_TRAILER];

        const requestedSharedItems = [
            eDropdownMenu.EDIT,
            eDropdownMenu.VIEW_DETAILS,
            isActiveTruckTrailer
                ? eDropdownMenu.DEACTIVATE
                : eDropdownMenu.ACTIVATE,
            eDropdownMenu.DELETE,
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
        const isActiveDriver = selectedTab === eDropdownMenu.ACTIVE;

        // modifier items
        const modifierItems =
            DropdownMenuContentConditionalItemsHelper.getDriverModifierItems(
                isActiveDriver
            );

        // requested items
        const requestedConditionalItems = [
            eDropdownMenu.ADD_NEW_DRIVER,
            eDropdownMenu.REQUEST,
        ];

        const requestedSharedItems = [
            eDropdownMenu.EDIT,
            eDropdownMenu.VIEW_DETAILS,
            eDropdownMenu.SEND_MESSAGE,
            eDropdownMenu.SHARE,
            eDropdownMenu.PRINT,
            isActiveDriver ? eDropdownMenu.DEACTIVATE : eDropdownMenu.ACTIVATE,
            eDropdownMenu.DELETE,
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
        const requestedConditionalItems = [eDropdownMenu.CREATE_LOAD];

        const requestedSharedItems = [
            eDropdownMenu.EDIT,
            eDropdownMenu.SHARE,
            eDropdownMenu.PRINT,
            eDropdownMenu.DELETE,
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
    static getLoadDropdownContent(
        selectedTab: string,
        isDetailsPageDropdown: boolean = false
    ): IDropdownMenuItem[] {
        const isTemplateLoad = selectedTab === eDropdownMenu.TEMPLATE;
        const isPendingLoad = selectedTab === eDropdownMenu.PENDING;
        const isClosedLoad = selectedTab === eDropdownMenu.CLOSED;
        const isTemplateOrPendingLoad = isTemplateLoad || isPendingLoad;

        const modifierItems =
            DropdownMenuContentConditionalItemsHelper.getLoadModifierItems(
                isTemplateOrPendingLoad
            );

        // requested items
        const requestedConditionalItems = isTemplateLoad
            ? [eDropdownMenu.CREATE_LOAD]
            : [eDropdownMenu.CREATE_TEMPLATE];

        const requestedSharedItems = [
            eDropdownMenu.EDIT,
            !isTemplateLoad &&
                !isDetailsPageDropdown &&
                eDropdownMenu.VIEW_DETAILS,
            !isTemplateLoad && isClosedLoad && eDropdownMenu.EXPORT_BATCH,
            eDropdownMenu.SHARE,
            eDropdownMenu.PRINT,
            eDropdownMenu.DELETE,
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

        const sharedItemsStartIndex = isTemplateLoad ? 1 : isClosedLoad ? 3 : 2;

        return [
            ...sharedItems.slice(0, sharedItemsStartIndex),
            ...conditionalItems,
            ...sharedItems.slice(sharedItemsStartIndex),
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
        const requestedConditionalItems = [eDropdownMenu.ADD_CONTACT];

        const requestedSharedItems = [
            eDropdownMenu.EDIT,
            eDropdownMenu.VIEW_DETAILS,
            eDropdownMenu.WRITE_REVIEW,
            eDropdownMenu.SHARE,
            eDropdownMenu.PRINT,
            isOpenBusiness
                ? eDropdownMenu.CLOSE_BUSINESS
                : eDropdownMenu.OPEN_BUSINESS,
            eDropdownMenu.DELETE,
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
            eDropdownMenu.CREATE_LOAD,
            eDropdownMenu.ADD_CONTACT,
            isBrokerBanned
                ? eDropdownMenu.REMOVE_FROM_BAN_LIST
                : eDropdownMenu.MOVE_TO_BAN_LIST,
            isBrokerDnu
                ? eDropdownMenu.REMOVE_FROM_DNU_LIST
                : eDropdownMenu.MOVE_TO_DNU_LIST,
        ];

        const requestedSharedItems = [
            eDropdownMenu.EDIT,
            eDropdownMenu.VIEW_DETAILS,
            eDropdownMenu.WRITE_REVIEW,
            eDropdownMenu.SHARE,
            eDropdownMenu.PRINT,
            isOpenBusiness
                ? eDropdownMenu.CLOSE_BUSINESS
                : eDropdownMenu.OPEN_BUSINESS,
            eDropdownMenu.DELETE,
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
        const isActiveUser = selectedTab === eDropdownMenu.ACTIVE;
        const isOwnerUser = userStatus === TableStringEnum.OWNER;

        const isUserStatusInvited = userStatus === eDropdownMenu.INVITED;
        const isUserStatusExpired = userStatus === eDropdownMenu.EXPIRED;

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
        const requestedConditionalItems = [eDropdownMenu.RESET_PASSWORD];

        const requestedSharedItems = [
            eDropdownMenu.EDIT,
            eDropdownMenu.SEND_MESSAGE,
            isInvitationSent
                ? eDropdownMenu.INVITATION_SENT
                : eDropdownMenu.RESEND_INVITATION,
            eDropdownMenu.SHARE,
            eDropdownMenu.PRINT,
            isActiveUser ? eDropdownMenu.DEACTIVATE : eDropdownMenu.ACTIVATE,
            eDropdownMenu.DELETE,
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
            ? [eDropdownMenu.EDIT_LOAD, eDropdownMenu.EDIT_PAYROLL]
            : [
                  eDropdownMenu.RESEND_REPORT,
                  eDropdownMenu.PREVIEW_REPORT,
                  eDropdownMenu.DOWNLOAD,
              ];

        const requestedSharedItems = [eDropdownMenu.SHARE, eDropdownMenu.PRINT];

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

        return isOpenPayroll
            ? [...conditionalItems, ...sharedItems]
            : [
                  conditionalItems[0],
                  ...sharedItems,
                  ...conditionalItems.slice(1),
              ];
    }

    // payroll select load
    static getPayrollSelectLoadDropdownContent(
        loadList: IDropdownMenuLoadItem[]
    ): IDropdownMenuItem[] {
        // requested items
        const requestedConditionalItems = [eDropdownMenu.EDIT_LOAD_SELECT];

        // items
        const conditionalItems =
            DropdownMenuContentConditionalItemsHelper.getConditionalItems(
                requestedConditionalItems,
                false
            );

        return [...conditionalItems, ...loadList];
    }

    // load toolbar
    static getLoadToolbarDropdownContent(
        tableType: string,
        isTableLocked: boolean
    ): IDropdownMenuItem[] {
        const tableColumnsConfig = JSON.parse(
            DropdownMenuColumnsActionsHelper.getTableConfig(tableType)
        );

        const modifierItems =
            DropdownMenuContentConditionalItemsHelper.getToolbarColumnsModifierItems(
                !!tableColumnsConfig
            );

        const requestedSharedItems = [
            eDropdownMenuColumns.COLUMNS,
            isTableLocked
                ? eDropdownMenuColumns.UNLOCK_TABLE
                : eDropdownMenuColumns.LOCK_TABLE,
            eDropdownMenuColumns.RESET_TABLE,
        ];

        const sharedItems =
            DropdownMenuContentConditionalItemsHelper.getConditionalItems(
                requestedSharedItems,
                true,
                modifierItems
            );

        return [...sharedItems];
    }

    // toolbar
    static getToolbarDropdownContent(
        isTableLocked: boolean
    ): IDropdownMenuItem[] {
        const requestedSharedItems = [
            eDropdownMenuColumns.COLUMNS,
            isTableLocked
                ? eDropdownMenuColumns.UNLOCK_TABLE
                : eDropdownMenuColumns.LOCK_TABLE,
            eDropdownMenuColumns.RESET_TABLE,
        ];

        const sharedItems =
            DropdownMenuContentConditionalItemsHelper.getConditionalItems(
                requestedSharedItems,
                true
            );

        return [...sharedItems];
    }

    // cards
    static getCardToolbarDropdownContent(
        cardFlipViewMode: eCardFlipViewMode
    ): IDropdownMenuItem[] {
        const requestedSharedItems = [
            eDropdownMenuColumns.COLUMNS_CARD,
            cardFlipViewMode === eCardFlipViewMode.FRONT
                ? eDropdownMenuColumns.FLIP_ALL_CARDS
                : eDropdownMenuColumns.FLIP_ALL_CARDS_BACK,
        ];

        const sharedItems =
            DropdownMenuContentConditionalItemsHelper.getConditionalItems(
                requestedSharedItems,
                true
            );

        return [...sharedItems];
    }

    // columns
    static getToolbarColumnsDropdownContent(
        columnsList: IDropdownMenuItem[]
    ): IDropdownMenuItem[] {
        const requestedSharedItems = [eDropdownMenuColumns.COLUMNS_BACK];

        const conditionalItems =
            DropdownMenuContentConditionalItemsHelper.getConditionalItems(
                requestedSharedItems,
                true
            );

        return [...conditionalItems, ...columnsList];
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
                name: eGeneralActions.EDIT_LOWERCASE,
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
                text: eDropdownMenuColumns.COLUMNS,
                svgPath: 'assets/svg/truckassist-table/columns-new.svg',
                active: false,
                hide: false,
                showBackToList: false,
                hasOwnSubOpions: true,
                backToListIcon:
                    'assets/svg/truckassist-table/arrow-back-to-list.svg',
            },
            {
                text: eDropdownMenuColumns.UNLOCK_TABLE,
                svgPath: 'assets/svg/truckassist-table/lock-new.svg',
                active: false,
                hide: false,
            },
            {
                text: eDropdownMenuColumns.RESET_TABLE,
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
