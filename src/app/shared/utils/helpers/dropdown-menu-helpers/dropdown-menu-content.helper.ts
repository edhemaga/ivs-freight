// enums
import { DropdownMenuStringEnum, TableStringEnum } from '@shared/enums';

// helpers
import { DropdownMenuContentConditionalItemsHelper } from '@shared/utils/helpers/dropdown-menu-helpers';

// models
import { DropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/models';
import { OptionsPopupContent } from '@shared/components/ta-table/ta-table-toolbar/models/options-popup-content.model';

export class DropdownMenuContentHelper {
    // contact
    static getContactDropdownContent(): DropdownMenuItem[] {
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
    static getAccountDropdownContent(url: string): DropdownMenuItem[] {
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
    static getOwnerDropdownContent(selectedTab: string): DropdownMenuItem[] {
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
    ): DropdownMenuItem[] {
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
    ): DropdownMenuItem[] {
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
    static getPMDropdownContent(): DropdownMenuItem[] {
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
    ): DropdownMenuItem[] {
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
    ): DropdownMenuItem[] {
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

    // truck
    static getTruckDropdownContent(selectedTab: string): DropdownMenuItem[] {
        const isActiveTruck = selectedTab === DropdownMenuStringEnum.ACTIVE;

        // modifier items
        const modifierItems =
            DropdownMenuContentConditionalItemsHelper.getTruckTrailerModifierItems(
                isActiveTruck
            );

        // requested items
        const requestedConditionalItems = [
            DropdownMenuStringEnum.ADD_NEW_TRUCK_TRAILER,
        ];

        const requestedSharedItems = [
            DropdownMenuStringEnum.EDIT,
            DropdownMenuStringEnum.VIEW_DETAILS,
            isActiveTruck
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

    // trailer
    static getTrailerDropdownContent(selectedTab: string): DropdownMenuItem[] {
        const isActiveTrailer = selectedTab === DropdownMenuStringEnum.ACTIVE;

        // modifier items
        const modifierItems =
            DropdownMenuContentConditionalItemsHelper.getTruckTrailerModifierItems(
                isActiveTrailer
            );

        // requested items
        const requestedConditionalItems = [
            DropdownMenuStringEnum.ADD_NEW_TRUCK_TRAILER,
        ];

        const requestedSharedItems = [
            DropdownMenuStringEnum.EDIT,
            DropdownMenuStringEnum.VIEW_DETAILS,
            isActiveTrailer
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
    static getDriverDropdownContent(selectedTab: string): DropdownMenuItem[] {
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
    static getLoadTemplateDropdownContent(): any[] {
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
    static getLoadDropdownContent(selectedTab: string): any[] {
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

    /////////////////////////////////////////////////////////////////////////////////

    // driver applicant
    static getApplicantDropdownContent(
        archivedDate: string,
        applicationStatus: string,
        review: string
    ): any[] {
        return [
            {
                title: 'Edit',
                name: 'edit',
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

    // broker
    static getBrokerDropdownContent(
        status: number,
        ban?: boolean,
        dnu?: boolean
    ): any[] {
        return [
            {
                title: TableStringEnum.EDIT_2,
                name: TableStringEnum.EDIT_CUSTOMER_OR_SHIPPER,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Edit.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                hasBorder: true,
                svgClass: TableStringEnum.REGULAR,
                isDisabled: !status,
            },

            {
                title: TableStringEnum.VIEW_DETAILS_2,
                name: TableStringEnum.VIEW_DETAILS,
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
                title: TableStringEnum.CREATE_LOAD_2,
                name: TableStringEnum.CREATE_LOAD,
                svgUrl: 'assets/svg/common/ic_plus.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
                svgClass: TableStringEnum.ACTIVATE,
                isDisabled: ban || dnu || !status,
            },
            {
                title: TableStringEnum.ADD_CONTRACT_2,
                name: TableStringEnum.ADD_CONTRACT,
                svgUrl: 'assets/svg/truckassist-table/customer/contact-column-avatar.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
                svgClass: TableStringEnum.REGULAR,
                isDisabled: !status,
            },
            {
                title: TableStringEnum.WRITE_REVIEW_2,
                name: TableStringEnum.WRITE_REVIEW,
                svgUrl: 'assets/svg/common/review-pen.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
                svgClass: TableStringEnum.REGULAR,
                isDisabled: !status,
            },
            {
                title: !ban
                    ? TableStringEnum.MOVE_TO_BAN_LIST_2
                    : TableStringEnum.REMOVE_FROM_BAN_LIST,
                name: TableStringEnum.MOVE_TO_BAN_LIST,
                svgUrl: 'assets/svg/common/ic_banned_broker.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
                svgClass: TableStringEnum.REGULAR,
                isDisabled: !status,
            },
            {
                title: !dnu
                    ? TableStringEnum.MOVE_TO_DNU_LIST_2
                    : TableStringEnum.REMOVE_FROM_DNU_LIST,
                name: TableStringEnum.MOVE_TO_DNU_LIST,
                svgUrl: 'assets/svg/common/ic_dnu_broker.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                hasBorder: true,
                svgClass: TableStringEnum.DELETE,
            },
            {
                title: TableStringEnum.SHARE_2,
                name: TableStringEnum.SHARE,
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
                title: TableStringEnum.PRINT_2,
                name: TableStringEnum.PRINT,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Print.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.REGULAR,
                hasBorder: true,
            },
            {
                title: status
                    ? TableStringEnum.CLOSE_BUSINESS_2
                    : TableStringEnum.OPEN_BUSINESS,
                name: TableStringEnum.CLOSE_BUSINESS,
                svgUrl: status
                    ? 'assets/svg/common/ic_closed_broker.svg'
                    : 'assets/svg/common/ic_open_bussiness.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
                svgClass: status
                    ? TableStringEnum.DELETE
                    : TableStringEnum.OPEN_BUSINESS_2,
            },
            {
                title: TableStringEnum.DELETE_2,
                name: TableStringEnum.DELETE,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Delete.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
                svgClass: TableStringEnum.DELETE,
            },
        ];
    }

    // shipper
    static getShipperDropdownContent(status: number): any[] {
        return [
            {
                title: TableStringEnum.EDIT_2,
                name: 'edit-cutomer-or-shipper',
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Edit.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                hasBorder: true,
                svgClass: TableStringEnum.REGULAR,
                isDisabled: !status,
            },
            {
                title: TableStringEnum.VIEW_DETAILS_2,
                name: TableStringEnum.VIEW_DETAILS,
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
                title: TableStringEnum.ADD_CONTRACT_2,
                name: TableStringEnum.ADD_CONTRACT,
                svgUrl: 'assets/svg/common/ic_broker-user.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
                svgClass: TableStringEnum.REGULAR,
                isDisabled: !status,
            },
            {
                title: TableStringEnum.WRITE_REVIEW_2,
                name: TableStringEnum.WRITE_REVIEW,
                svgUrl: '/assets/svg/common/review-pen.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.REGULAR,
                isDisabled: !status,
                hasBorder: true,
            },
            {
                title: status
                    ? TableStringEnum.CLOSE_BUSINESS_2
                    : TableStringEnum.OPEN_BUSINESS,
                name: TableStringEnum.CLOSE_BUSINESS,
                svgUrl: status
                    ? 'assets/svg/common/ic_closed_broker.svg'
                    : 'assets/svg/common/ic_verify-check.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
                svgClass: status
                    ? TableStringEnum.DELETE
                    : TableStringEnum.OPEN_BUSINESS_2,
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

    // user
    static getUserDropdownContent(
        selectedTab: string,
        userStatus: string,
        isInvitationSent: boolean
    ): DropdownMenuItem[] {
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
    ): DropdownMenuItem[] {
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
        loadList: { id: number; title: string }[]
    ): DropdownMenuItem[] {
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
