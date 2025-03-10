import { DropdownMenuContentConstants } from '@shared/utils/constants';

// enums
import { eDropdownMenu } from '@shared/enums/dropdown-menu-content-string.enum';

// models
import { IDropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/interfaces';

export class DropdownMenuContentConditionalItemsHelper {
    // conditional items
    static getConditionalItems(
        requestedItemTitles: string[],
        isSharedConditionalItems: boolean,
        modifiers?: Partial<IDropdownMenuItem>[]
    ): IDropdownMenuItem[] {
        const dropdownMenuItems = isSharedConditionalItems
            ? DropdownMenuContentConstants.DROPDOWN_MENU_SHARED_ITEMS
            : DropdownMenuContentConstants.DROPDOWN_MENU_CONDITIONAL_ITEMS;

        // if no specific items are requested, return all items
        const requestedItems =
            Array.isArray(requestedItemTitles) && !requestedItemTitles.length
                ? Object.values(dropdownMenuItems)
                : requestedItemTitles.map((title) => dropdownMenuItems[title]);

        // map requested items - optional modifiers
        const mapDropdownMenuItems = () => {
            return requestedItems.map((item) => {
                const modifier = modifiers?.find(
                    (modifier) => modifier.title === item?.title
                );

                return modifier ? { ...item, ...modifier } : item;
            });
        };

        return mapDropdownMenuItems();
    }

    // modifier items

    // owner
    static getOwnerModifierItems(
        isActiveOwner: boolean
    ): Partial<IDropdownMenuItem>[] {
        return [
            {
                title: eDropdownMenu.EDIT,
                isDisabled: !isActiveOwner,
            },
        ];
    }

    // fuel transaction
    static getFuelTransactionModifierItems(
        isAutomaticTransaction: boolean
    ): Partial<IDropdownMenuItem>[] {
        return [
            {
                title: eDropdownMenu.DELETE,
                isDisabled: isAutomaticTransaction,
            },
        ];
    }

    // fuel stop
    static getFuelStopModifierItems(
        isOpenBusiness: boolean
    ): Partial<IDropdownMenuItem>[] {
        return [
            {
                title: eDropdownMenu.EDIT,
                isDisabled: !isOpenBusiness,
            },
            {
                title: eDropdownMenu.SUGGEST_EDIT,
                isDisabled: !isOpenBusiness,
            },
            {
                title: eDropdownMenu.ADD_TRANSACTION,
                isDisabled: !isOpenBusiness,
            },
            {
                title: eDropdownMenu.MARK_AS_FAVORITE,
                isDisabled: !isOpenBusiness,
            },
            {
                title: eDropdownMenu.UNMARK_FAVORITE,
                isDisabled: !isOpenBusiness,
            },
        ];
    }

    // repair
    static getRepairModifierItems(
        isTruckRepair: boolean
    ): Partial<IDropdownMenuItem>[] {
        const svgUrl = isTruckRepair
            ? 'assets/svg/common/ic_truck.svg'
            : 'assets/svg/common/ic_trailer.svg';

        return [
            {
                title: eDropdownMenu.ALL_ORDERS,
                svgUrl,
            },
            {
                title: eDropdownMenu.ALL_BILLS,
                svgUrl,
            },
        ];
    }

    // repair shop
    static getRepairShopModifierItems(
        isOpenBusiness: boolean,
        isCompanyOwned: boolean
    ): Partial<IDropdownMenuItem>[] {
        return [
            {
                title: eDropdownMenu.EDIT,
                isDisabled: !isOpenBusiness,
            },
            {
                title: eDropdownMenu.ADD_REPAIR_BILL,
                isDisabled: !isOpenBusiness,
                hasBorder: false,
            },
            {
                title: eDropdownMenu.MARK_AS_FAVORITE,
                isDisabled: !isOpenBusiness || isCompanyOwned,
            },
            {
                title: eDropdownMenu.UNMARK_FAVORITE,
                isDisabled: !isOpenBusiness || isCompanyOwned,
            },
            {
                title: eDropdownMenu.WRITE_REVIEW,
                isDisabled: !isOpenBusiness,
            },
        ];
    }

    // truck - trailer
    static getTruckTrailerModifierItems(
        isActiveVehicle: boolean
    ): Partial<IDropdownMenuItem>[] {
        return [
            {
                title: eDropdownMenu.EDIT,
                isDisabled: !isActiveVehicle,
            },
            {
                title: eDropdownMenu.ADD_NEW,
                isDisabled: !isActiveVehicle,
            },
        ];
    }

    // user
    static getUserModifierItems(
        isActiveUser: boolean,
        isOwnerUser: boolean,
        isUserStatusInvited: boolean,
        isUserStatusExpired: boolean,
        isInvitationSent: boolean
    ): Partial<IDropdownMenuItem>[] {
        return [
            {
                title: eDropdownMenu.EDIT,
                isDisabled: !isActiveUser,
            },
            {
                title: eDropdownMenu.SEND_MESSAGE,
                isDisabled:
                    isUserStatusInvited ||
                    isUserStatusExpired ||
                    isInvitationSent ||
                    !isActiveUser,
            },
            {
                title: eDropdownMenu.RESET_PASSWORD,
                isDisabled:
                    isUserStatusInvited ||
                    isUserStatusExpired ||
                    isInvitationSent ||
                    !isActiveUser,
            },
            {
                title: eDropdownMenu.RESEND_INVITATION,
                isDisabled:
                    !isUserStatusExpired || !isActiveUser || isOwnerUser,
            },
            {
                title: eDropdownMenu.INVITATION_SENT,
                isDisabled: isInvitationSent,
            },
            {
                title: eDropdownMenu.DEACTIVATE,
                isDisabled:
                    isUserStatusInvited ||
                    isUserStatusExpired ||
                    isInvitationSent ||
                    isOwnerUser,
            },
            {
                title: eDropdownMenu.DELETE,
                isDisabled: isOwnerUser,
            },
        ];
    }

    // driver
    static getDriverModifierItems(
        isActiveDriver: boolean
    ): Partial<IDropdownMenuItem>[] {
        return [
            {
                title: eDropdownMenu.EDIT,
                isDisabled: !isActiveDriver,
            },
            {
                title: eDropdownMenu.SEND_MESSAGE,
                isDisabled: !isActiveDriver,
            },
            {
                title: eDropdownMenu.ADD_NEW,
                isDisabled: !isActiveDriver,
            },
            {
                title: eDropdownMenu.REQUEST,
                isDisabled: !isActiveDriver,
            },
        ];
    }

    // load
    static getLoadModifierItems(
        isPendingLoad: boolean
    ): Partial<IDropdownMenuItem>[] {
        return [
            {
                title: eDropdownMenu.DELETE,
                isDisabled: !isPendingLoad,
            },
        ];
    }

    // shipper
    static getShipperModifierItems(
        isOpenBusiness: boolean
    ): Partial<IDropdownMenuItem>[] {
        return [
            {
                title: eDropdownMenu.EDIT,
                isDisabled: !isOpenBusiness,
            },
            {
                title: eDropdownMenu.ADD_CONTACT,
                isDisabled: !isOpenBusiness,
            },
            {
                title: eDropdownMenu.WRITE_REVIEW,
                isDisabled: !isOpenBusiness,
            },
            {
                title: eDropdownMenu.REQUEST,
                isDisabled: !isOpenBusiness,
            },
        ];
    }

    // broker
    static getBrokerModifiedItems(
        isOpenBusiness: boolean,
        isMovedToBanOrDnu: boolean
    ): Partial<IDropdownMenuItem>[] {
        return [
            {
                title: eDropdownMenu.EDIT,
                isDisabled: !isOpenBusiness,
            },
            {
                title: eDropdownMenu.CREATE_LOAD,
                isDisabled: isMovedToBanOrDnu,
                hasBorder: false,
            },
            {
                title: eDropdownMenu.ADD_CONTACT,
                isDisabled: !isOpenBusiness,
            },
            {
                title: eDropdownMenu.WRITE_REVIEW,
                isDisabled: !isOpenBusiness,
                hasBorder: false,
            },
            {
                title: eDropdownMenu.MOVE_TO_BAN_LIST,
                isDisabled: !isOpenBusiness,
            },
        ];
    }
}
