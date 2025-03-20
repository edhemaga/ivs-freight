import { DropdownMenuContentConstants } from '@shared/utils/constants';

// enums
import { DropdownMenuStringEnum } from '@shared/enums/dropdown-menu-content-string.enum';

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
                title: DropdownMenuStringEnum.EDIT,
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
                title: DropdownMenuStringEnum.DELETE,
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
                title: DropdownMenuStringEnum.EDIT,
                isDisabled: !isOpenBusiness,
            },
            {
                title: DropdownMenuStringEnum.SUGGEST_EDIT,
                isDisabled: !isOpenBusiness,
            },
            {
                title: DropdownMenuStringEnum.ADD_TRANSACTION,
                isDisabled: !isOpenBusiness,
            },
            {
                title: DropdownMenuStringEnum.MARK_AS_FAVORITE,
                isDisabled: !isOpenBusiness,
            },
            {
                title: DropdownMenuStringEnum.UNMARK_FAVORITE,
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
                title: DropdownMenuStringEnum.ALL_ORDERS,
                svgUrl,
            },
            {
                title: DropdownMenuStringEnum.ALL_BILLS,
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
                title: DropdownMenuStringEnum.EDIT,
                isDisabled: !isOpenBusiness,
            },
            {
                title: DropdownMenuStringEnum.ADD_REPAIR_BILL,
                isDisabled: !isOpenBusiness,
                hasBorder: false,
            },
            {
                title: DropdownMenuStringEnum.MARK_AS_FAVORITE,
                isDisabled: !isOpenBusiness || isCompanyOwned,
            },
            {
                title: DropdownMenuStringEnum.UNMARK_FAVORITE,
                isDisabled: !isOpenBusiness || isCompanyOwned,
            },
            {
                title: DropdownMenuStringEnum.WRITE_REVIEW,
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
                title: DropdownMenuStringEnum.EDIT,
                isDisabled: !isActiveVehicle,
            },
            {
                title: DropdownMenuStringEnum.ADD_NEW,
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
                title: DropdownMenuStringEnum.EDIT,
                isDisabled: !isActiveUser,
            },
            {
                title: DropdownMenuStringEnum.SEND_MESSAGE,
                isDisabled:
                    isUserStatusInvited ||
                    isUserStatusExpired ||
                    isInvitationSent ||
                    !isActiveUser,
            },
            {
                title: DropdownMenuStringEnum.RESET_PASSWORD,
                isDisabled:
                    isUserStatusInvited ||
                    isUserStatusExpired ||
                    isInvitationSent ||
                    !isActiveUser,
            },
            {
                title: DropdownMenuStringEnum.RESEND_INVITATION,
                isDisabled:
                    !isUserStatusExpired || !isActiveUser || isOwnerUser,
            },
            {
                title: DropdownMenuStringEnum.INVITATION_SENT,
                isDisabled: isInvitationSent,
            },
            {
                title: DropdownMenuStringEnum.DEACTIVATE,
                isDisabled:
                    isUserStatusInvited ||
                    isUserStatusExpired ||
                    isInvitationSent ||
                    isOwnerUser,
            },
            {
                title: DropdownMenuStringEnum.DELETE,
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
                title: DropdownMenuStringEnum.EDIT,
                isDisabled: !isActiveDriver,
            },
            {
                title: DropdownMenuStringEnum.SEND_MESSAGE,
                isDisabled: !isActiveDriver,
            },
            {
                title: DropdownMenuStringEnum.ADD_NEW,
                isDisabled: !isActiveDriver,
            },
            {
                title: DropdownMenuStringEnum.REQUEST,
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
                title: DropdownMenuStringEnum.DELETE,
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
                title: DropdownMenuStringEnum.EDIT,
                isDisabled: !isOpenBusiness,
            },
            {
                title: DropdownMenuStringEnum.ADD_CONTACT,
                isDisabled: !isOpenBusiness,
            },
            {
                title: DropdownMenuStringEnum.WRITE_REVIEW,
                isDisabled: !isOpenBusiness,
            },
            {
                title: DropdownMenuStringEnum.REQUEST,
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
                title: DropdownMenuStringEnum.EDIT,
                isDisabled: !isOpenBusiness,
            },
            {
                title: DropdownMenuStringEnum.CREATE_LOAD,
                isDisabled: isMovedToBanOrDnu,
                hasBorder: false,
            },
            {
                title: DropdownMenuStringEnum.ADD_CONTACT,
                isDisabled: !isOpenBusiness,
            },
            {
                title: DropdownMenuStringEnum.WRITE_REVIEW,
                isDisabled: !isOpenBusiness,
                hasBorder: false,
            },
            {
                title: DropdownMenuStringEnum.MOVE_TO_BAN_LIST,
                isDisabled: !isOpenBusiness,
            },
        ];
    }

    // toolbar
    static getToolbarColumnsModifierItems(
        hasConfig: boolean
    ): Partial<IDropdownMenuItem>[] {
        return [
            {
                title: DropdownMenuStringEnum.RESET_TABLE,
                isDisabled: !hasConfig,
            },
        ];
    }
}
