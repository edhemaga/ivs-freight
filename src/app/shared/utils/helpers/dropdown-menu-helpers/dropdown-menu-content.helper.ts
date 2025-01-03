// enums
import { DropdownMenuStringEnum, TableStringEnum } from '@shared/enums';

// helpers
import { DropdownMenuContentConditionalItemsHelper } from '@shared/utils/helpers/dropdown-menu-helpers';

// models
import { DropdownItem } from '@shared/models/card-models/card-table-data.model';
import { RepairDropdownTableModel } from '@pages/repair/pages/repair-table/models';
import { DropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/models';
import { OptionsPopupContent } from '@shared/components/ta-table/ta-table-toolbar/models/options-popup-content.model';

export class DropdownMenuContentHelper {
    // account
    static getAccountDropdownContent(url: string): DropdownItem[] {
        return [
            {
                title: TableStringEnum.EDIT_2,
                name: TableStringEnum.EDIT_ACCOUNT,
                svgUrl: TableStringEnum.EDIT_IMAGE,
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                hasBorder: true,
                svgClass: TableStringEnum.REGULAR,
            },
            {
                title: url
                    ? TableStringEnum.GO_TO_LINK
                    : TableStringEnum.NO_LINK,
                name: url
                    ? TableStringEnum.GO_TO_LINK_2
                    : TableStringEnum.NO_LINK_2,
                svgUrl: TableStringEnum.WEB_IMAGE,
                isDisabled: url ? false : true,
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.REGULAR,
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
            },
            {
                title: TableStringEnum.COPY_USERNAME,
                name: TableStringEnum.COPY_USERNAME_2,
                svgUrl: TableStringEnum.USER_IMAGE,
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.REGULAR,
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
            },
            {
                title: TableStringEnum.COPY_PASSWORD,
                name: TableStringEnum.COPY_PASSWORD_2,
                svgUrl: TableStringEnum.PASSWORD_IMAGE,
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.REGULAR,
                hasBorder: true,
            },
            // {
            //     title: 'Share',
            //     name: 'share',
            //     svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Share.svg',
            //     svgStyle: {
            //         width: 18,
            //         height: 18,
            //     },
            //     svgClass: TableStringEnum.REGULAR,
            //     tableListDropdownContentStyle: {
            //         'margin-bottom.px': 4,
            //     },
            // },
            // {
            //     title: 'Print',
            //     name: 'print',
            //     svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Print.svg',
            //     svgStyle: {
            //         width: 18,
            //         height: 18,
            //     },

            //     svgClass: TableStringEnum.REGULAR,
            //     hasBorder: true,
            // }, leave this commented for now
            {
                title: TableStringEnum.DELETE_2,
                name: TableStringEnum.DELETE_ACCOUNT,
                svgUrl: TableStringEnum.DELETE_IMAGE,
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.DELETE,
            },
        ];
    }

    // driver
    static getDriverDropdownContent(selectedTab: string): DropdownItem[] {
        return [
            {
                title: TableStringEnum.EDIT_2,
                name: TableStringEnum.EDIT,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Edit.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                hasBorder: true,
                svgClass: TableStringEnum.REGULAR,
                isDisabled: selectedTab === TableStringEnum.INACTIVE,
            },
            {
                title: TableStringEnum.VIEW_DETAILS_2,
                name: TableStringEnum.VIEW_DETAILS,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Information.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.REGULAR,
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
            },
            {
                title: TableStringEnum.SEND_MESSAGE_2,
                name: TableStringEnum.SEND_MESSAGE,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Send Message.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
                svgClass: TableStringEnum.REGULAR,
                isDisabled: selectedTab === TableStringEnum.INACTIVE,
            },
            {
                title: TableStringEnum.ADD_NEW_2,
                name: TableStringEnum.ADD_NEW,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Show More.svg',
                svgStyle: {
                    width: 15,
                    height: 15,
                },
                svgClass: TableStringEnum.REGULAR,
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
                isDropdown: true,
                insideDropdownContent: [
                    {
                        title: TableStringEnum.CDL,
                        name: TableStringEnum.NEW_LICENCE,
                    },
                    {
                        title: TableStringEnum.TEST_DRUG_ALCOHOL,
                        name: TableStringEnum.NEW_DRUG,
                    },
                    {
                        title: TableStringEnum.MEDICAL_EXAM_3,
                        name: TableStringEnum.NEW_MEDICAL,
                    },
                    {
                        title: TableStringEnum.MVR,
                        name: TableStringEnum.NEW_MVR,
                    },
                ],
                isDisabled: selectedTab === TableStringEnum.INACTIVE,
            },
            {
                title: TableStringEnum.REQUEST,
                name: TableStringEnum.ADD_TO_FAVORITES,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Show More.svg',
                svgStyle: {
                    width: 15,
                    height: 15,
                },
                svgClass: TableStringEnum.REGULAR,
                isDropdown: true,
                insideDropdownContent: [
                    {
                        title: TableStringEnum.BACKGROUND_CHECK_2,
                        name: TableStringEnum.BACKGROUND_CHECK,
                    },
                    {
                        title: TableStringEnum.TEST_DRUG_ALCOHOL,
                        name: TableStringEnum.TEST_DRUG,
                    },
                    {
                        title: TableStringEnum.MEDICAL_EXAM_2,
                        name: TableStringEnum.MEDICAL_EXAM,
                    },
                    {
                        title: TableStringEnum.MVR,
                        name: TableStringEnum.TEST_MVR,
                    },
                ],
                hasBorder: true,
                isDisabled: selectedTab === TableStringEnum.INACTIVE,
            },
            {
                title: TableStringEnum.SHARE_2,
                name: TableStringEnum.SHARE,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Share.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.REGULAR,
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
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
                title:
                    selectedTab === TableStringEnum.ACTIVE
                        ? TableStringEnum.DEACTIVATE_2
                        : TableStringEnum.ACTIVATE_2,
                name: TableStringEnum.ACTIVATE_ITEM,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Deactivate.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass:
                    selectedTab === TableStringEnum.ACTIVE
                        ? TableStringEnum.REGULAR
                        : TableStringEnum.ACTIVATE,
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
            },
            {
                title: TableStringEnum.DELETE_2,
                name: TableStringEnum.DELETE_ITEM,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Delete.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.DELETE,
            },
        ];
    }

    // driver applicant
    static getApplicantDropdownContent(
        archivedDate: string,
        applicationStatus: string,
        review: string
    ): DropdownItem[] {
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

    // repair
    static getRepairDropdownContent(
        tabSelected: string,
        repairType: string
    ): RepairDropdownTableModel[] {
        const commonDropdownContent: RepairDropdownTableModel[] = [
            {
                title: TableStringEnum.EDIT_2,
                name: TableStringEnum.EDIT,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Edit.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                hasBorder: true,
                svgClass: TableStringEnum.REGULAR,
            },
            {
                title:
                    repairType === TableStringEnum.ORDER
                        ? TableStringEnum.ALL_ORDERS
                        : TableStringEnum.ALL_BILS,
                name:
                    repairType === TableStringEnum.ORDER
                        ? TableStringEnum.ALL_ORDERS_2
                        : TableStringEnum.ALL_BILS_2,
                svgUrl:
                    tabSelected === TableStringEnum.ACTIVE
                        ? 'assets/svg/common/ic_truck.svg'
                        : 'assets/svg/common/ic_trailer.svg',

                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.REGULAR,
                hasBorder: true,
            },
            {
                title: TableStringEnum.SHARE_2,
                name: TableStringEnum.SHARE,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Share.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.REGULAR,
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
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

        const orderDropdownContent: RepairDropdownTableModel = {
            title: TableStringEnum.FINISH_ORDER_3,
            name: TableStringEnum.FINISH_ORDER,
            svgUrl: 'assets/svg/common/ic_note_order.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
            svgClass: TableStringEnum.ACTIVATE,
        };

        if (repairType === TableStringEnum.ORDER)
            commonDropdownContent.splice(1, 0, orderDropdownContent);

        return commonDropdownContent;
    }

    // repair shop
    static getRepairShopDropdownContent(
        status: number,
        isPinned: boolean,
        isCompanyOwned: boolean
    ): RepairDropdownTableModel[] {
        return [
            {
                title: 'Edit',
                name: 'edit',
                svgUrl: '/assets/svg/common/load/ic_load-pen.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.REGULAR,
                hasBorder: true,
                isDisabled: !status,
            },
            {
                title: 'View Details',
                name: 'view-details',
                svgUrl: '/assets/svg/common/confirmation/ic_confirmation_info.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.REGULAR,
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
            },
            {
                title: 'Add Bill',
                name: 'add-bill',
                svgUrl: '/assets/svg/common/ic_plus.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.ACTIVATE,
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
                isDisabled: !status,
            },
            {
                title: isPinned ? 'Unmark Favorite' : 'Mark as Favorite',
                name: 'favorite',
                svgUrl: '/assets/svg/common/ic_star.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: isPinned ? 'regular' : TableStringEnum.ACTIVATE,
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
                isDisabled: !status || isCompanyOwned,
            },
            {
                title: 'Write Review',
                name: 'write-review',
                svgUrl: '/assets/svg/common/review-pen.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.REGULAR,
                hasBorder: true,
                isDisabled: !status,
            },
            // not in this version
            /*  {
                title: 'Share',
                name: 'share',
                svgUrl: '/assets/svg/common/share-icon.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.REGULAR,
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
            },
            {
                title: 'Print',
                name: 'print',
                svgUrl: '/assets/svg/common/ic_print.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.REGULAR,
                hasBorder: true,
            }, */
            {
                title: !status ? 'Open Business' : 'Close Business',
                name: 'close-business',
                svgUrl: !status
                    ? '/assets/svg/common/confirm-circle_white.svg'
                    : '/assets/svg/common/load/ic_load-broker-closed-business.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: !status
                    ? TableStringEnum.OPEN_BUSINESS_2
                    : TableStringEnum.DELETE,
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
            },
            {
                title: 'Delete',
                name: TableStringEnum.DELETE,
                svgUrl: '/assets/svg/common/ic_trash_updated.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.DELETE,
            },
        ];
    }

    // trailer
    static getTrailerDropdownContent(
        status: number,
        selectedTab: string
    ): DropdownItem[] {
        return [
            {
                title: TableStringEnum.EDIT_2,
                name: TableStringEnum.EDIT_TRAILER,
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
                svgClass: TableStringEnum.REGULAR,
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
            },
            {
                title: TableStringEnum.ADD_NEW_2,
                name: TableStringEnum.ADD_NEW,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Show More.svg',
                svgStyle: {
                    width: 15,
                    height: 15,
                },
                svgClass: TableStringEnum.REGULAR,
                isDropdown: true,
                insideDropdownContent: [
                    {
                        title: TableStringEnum.ADD_REGISTRATION_2,
                        name: TableStringEnum.ADD_REGISTRATION,
                    },

                    {
                        title: TableStringEnum.ADD_INSPECTION_2,
                        name: TableStringEnum.ADD_INSPECTION,
                    },

                    {
                        title: TableStringEnum.TITLE,
                        name: TableStringEnum.ADD_TITLE,
                    },
                ],
                hasBorder: true,
                isDisabled: !status,
            },
            {
                title:
                    selectedTab === TableStringEnum.ACTIVE
                        ? TableStringEnum.DEACTIVATE_2
                        : TableStringEnum.ACTIVATE_2,
                name: TableStringEnum.ACTIVATE_ITEM,
                svgUrl:
                    selectedTab === TableStringEnum.ACTIVE
                        ? 'assets/svg/truckassist-table/new-list-dropdown/Deactivate.svg'
                        : '/assets/svg/common/confirm-circle_white.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass:
                    selectedTab === TableStringEnum.ACTIVE
                        ? TableStringEnum.REGULAR
                        : TableStringEnum.OPEN_BUSINESS_2,
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
            },
            {
                title: TableStringEnum.DELETE_2,
                name: TableStringEnum.DELETE_ITEM,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Delete.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.DELETE,
            },
        ];
    }

    // truck
    static getTruckDropdownContent(
        status: number,
        selectedTab: string
    ): DropdownItem[] {
        return [
            {
                title: TableStringEnum.EDIT_2,
                name: TableStringEnum.EDIT_TRUCK,
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
                svgClass: TableStringEnum.REGULAR,
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
            },
            {
                title: TableStringEnum.ADD_NEW_2,
                name: TableStringEnum.ADD_NEW,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Show More.svg',
                svgStyle: {
                    width: 15,
                    height: 15,
                },
                svgClass: TableStringEnum.REGULAR,
                isDropdown: true,
                insideDropdownContent: [
                    {
                        title: TableStringEnum.REGISTRATION,
                        name: TableStringEnum.ADD_REGISTRATION,
                    },
                    {
                        title: TableStringEnum.INSPECTION,
                        name: TableStringEnum.ADD_INSPECTION,
                    },
                    {
                        title: TableStringEnum.TITLE,
                        name: TableStringEnum.ADD_REPAIR,
                    },
                ],
                hasBorder: true,
                isDisabled: !status,
            },
            {
                title:
                    selectedTab === TableStringEnum.ACTIVE
                        ? TableStringEnum.DEACTIVATE_2
                        : TableStringEnum.ACTIVATE_2,
                name: TableStringEnum.ACTIVATE_ITEM,
                svgUrl:
                    selectedTab === TableStringEnum.ACTIVE
                        ? 'assets/svg/truckassist-table/new-list-dropdown/Deactivate.svg'
                        : '/assets/svg/common/confirm-circle_white.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass:
                    selectedTab === TableStringEnum.ACTIVE
                        ? TableStringEnum.REGULAR
                        : TableStringEnum.OPEN_BUSINESS_2,
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
            },
            {
                title: TableStringEnum.DELETE_2,
                name: TableStringEnum.DELETE_ITEM,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Delete.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.DELETE,
            },
        ];
    }

    // fuel transaction
    static getFuelTransactionDropdownContent(
        isAutomaticTransaction: boolean
    ): DropdownItem[] {
        return [
            {
                title: TableStringEnum.EDIT_2,
                name: TableStringEnum.EDIT,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Edit.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                hasBorder: true,
                svgClass: TableStringEnum.REGULAR,
            },
            {
                title: TableStringEnum.VIEW_DETAILS_2,
                name: TableStringEnum.VIEW_DETAILS,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Information.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.REGULAR,
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
            },
            {
                title: 'All Transactions',
                name: 'all-transactions',
                svgUrl: 'assets/svg/common/ic_truck.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.REGULAR,
                hasBorder: true,
            },
            // {
            //     title: TableStringEnum.SHARE_2,
            //     name: TableStringEnum.SHARE,
            //     svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Share.svg',
            //     svgStyle: {
            //         width: 18,
            //         height: 18,
            //     },
            //     svgClass: TableStringEnum.REGULAR,
            //     tableListDropdownContentStyle: {
            //         'margin-bottom.px': 4,
            //     },
            // },
            // {
            //     title: TableStringEnum.PRINT_2,
            //     name: TableStringEnum.PRINT,
            //     svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Print.svg',
            //     svgStyle: {
            //         width: 18,
            //         height: 18,
            //     },
            //     svgClass: TableStringEnum.REGULAR,
            //     hasBorder: true,
            // },
            {
                title: TableStringEnum.DELETE_2,
                name: TableStringEnum.DELETE_ITEM,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Delete.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.DELETE,
                isDisabled: isAutomaticTransaction,
            },
        ];
    }

    // fuel stop
    static getFuelStopDropdownContent(): DropdownItem[] {
        return [];
    }

    // contacts
    static getContactDropdownContent(): DropdownItem[] {
        return [
            {
                title: 'Edit',
                name: 'edit-contact',
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Edit.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                hasBorder: true,
                svgClass: TableStringEnum.REGULAR,
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
                title: 'Send SMS',
                name: 'send-sms',
                svgUrl: '',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.REGULAR,
                hasBorder: true,
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
                svgClass: TableStringEnum.REGULAR,
                hasBorder: true,
            },
            {
                title: 'Delete',
                name: 'delete-contact',
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Delete.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.DELETE,
            },
        ];
    }

    // pm
    static getPMDropdownContent(): DropdownItem[] {
        return [
            {
                title: 'Configure',
                name: 'configure',
                svgUrl: 'assets/svg/common/ic_settings.svg',
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
                title: 'Add Repair Bill',
                name: 'add-repair-bill',
                svgUrl: 'assets/svg/truckassist-table/dropdown/content/add.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
                svgClass: TableStringEnum.ACTIVATE,
            },
            // {
            //     title: 'Share',
            //     name: 'share',
            //     svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Share.svg',
            //     svgStyle: {
            //         width: 18,
            //         height: 18,
            //     },
            //     tableListDropdownContentStyle: {
            //         'margin-bottom.px': 4,
            //     },
            //     svgClass: TableStringEnum.REGULAR,
            // },

            // {
            //     title: 'Print',
            //     name: 'print',
            //     svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Print.svg',
            //     svgStyle: {
            //         width: 18,
            //         height: 18,
            //     },
            //     svgClass: TableStringEnum.REGULAR,
            // },
        ];
    }

    // owner
    static getOwnerDropdownContent(selectedTab: string): DropdownItem[] {
        return [
            {
                title: TableStringEnum.EDIT_2,
                name: TableStringEnum.EDIT,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Edit.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                hasBorder: true,
                svgClass: TableStringEnum.REGULAR,
                isDisabled: selectedTab === TableStringEnum.INACTIVE,
            },
            {
                title: 'Add Truck',
                name: 'add-truck',
                svgUrl: '/assets/svg/common/ic_plus.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
                svgClass: TableStringEnum.ACTIVATE,
            },
            {
                title: 'Add Trailer',
                name: 'add-trailer',
                svgUrl: '/assets/svg/common/ic_plus.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.ACTIVATE,
                hasBorder: true,
            },
            {
                title: TableStringEnum.DELETE_2,
                name: TableStringEnum.DELETE_ITEM,
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
    ): DropdownItem[] {
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
    static getShipperDropdownContent(status: number): DropdownItem[] {
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

    // load
    static getLoadDropdownContent(selectedTab: string): DropdownItem[] {
        return [
            {
                title: 'Edit',
                name: 'edit',
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Edit.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.REGULAR,
                hasBorder: true,
            },

            {
                title: 'View Details',
                name: 'view-details',
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Information.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.REGULAR,
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
            },
            {
                title:
                    selectedTab === TableStringEnum.TEMPLATE
                        ? 'Create Load'
                        : 'Create Template',
                name:
                    selectedTab === TableStringEnum.TEMPLATE
                        ? TableStringEnum.CONVERT_TO_LOAD
                        : TableStringEnum.CONVERT_TO_TEMPLATE,
                svgUrl: `assets/svg/truckassist-table/new-list-dropdown/${
                    selectedTab === TableStringEnum.TEMPLATE ? 'plus' : 'slider'
                }.svg`,
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
                svgClass: TableStringEnum.ACTIVATE,
                hasBorder: true,
            },
            {
                title: 'Share',
                name: 'share',
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Share.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.REGULAR,
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
            },
            {
                title: 'Print',
                name: 'print',
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Print.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.REGULAR,
                hasBorder: true,
            },
            {
                title: 'Delete',
                name: TableStringEnum.DELETE,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Delete.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.DELETE,
                isDisabled:
                    selectedTab === TableStringEnum.ACTIVE ||
                    selectedTab === TableStringEnum.CLOSED,
            },
        ];
    }

    // user
    static getUserDropdownContent(
        selectedTab: string,
        userStatus: string,
        isInvitationSent: boolean
    ): DropdownItem[] {
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
                isDisabled: selectedTab === TableStringEnum.INACTIVE,
            },
            {
                title: 'Reset Password',
                name: TableStringEnum.RESET_PASSWORD,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Password.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
                svgClass: TableStringEnum.REGULAR,
                isDisabled:
                    userStatus === TableStringEnum.EXPIRED ||
                    userStatus === TableStringEnum.INVITED ||
                    selectedTab === TableStringEnum.INACTIVE,
            },
            {
                title: isInvitationSent
                    ? 'Invitation Sent'
                    : 'Resend Invitation',
                name: TableStringEnum.RESEND_INVITATION,
                svgUrl: isInvitationSent
                    ? 'assets/svg/applicant/confirm-circle.svg'
                    : 'assets/svg/truckassist-table/new-list-dropdown/Email - Invitation.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: isInvitationSent
                    ? TableStringEnum.OPEN_BUSINESS_2
                    : TableStringEnum.REGULAR,
                isDisabled:
                    (userStatus !== TableStringEnum.EXPIRED &&
                        userStatus !== TableStringEnum.INVITED) ||
                    isInvitationSent,
                hasBorder: true,
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
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
                svgClass:
                    selectedTab === TableStringEnum.INACTIVE
                        ? TableStringEnum.ACTIVATE
                        : TableStringEnum.REGULAR,
                isDisabled:
                    userStatus === TableStringEnum.EXPIRED ||
                    userStatus === TableStringEnum.INVITED ||
                    userStatus === TableStringEnum.OWNER,
            },
            {
                title: TableStringEnum.DELETE_2,
                name: TableStringEnum.DELETE,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Delete.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                isDisabled: userStatus === TableStringEnum.OWNER,
                svgClass: TableStringEnum.DELETE,
            },
        ];
    }

    // payroll
    static getPayrollDropdownContent(
        isOpenPayroll: boolean = false
    ): DropdownMenuItem[] {
        const conditionalItems = isOpenPayroll
            ? [
                  DropdownMenuStringEnum.EDIT_LOAD,
                  DropdownMenuStringEnum.EDIT_PAYROLL,
              ]
            : [DropdownMenuStringEnum.RESEND_REPORT];

        const sharedItems = [
            DropdownMenuStringEnum.SHARE,
            DropdownMenuStringEnum.PRINT,
        ];

        const additionalItems = !isOpenPayroll
            ? [
                  DropdownMenuStringEnum.PREVIEW_REPORT,
                  DropdownMenuStringEnum.DOWNLOAD,
              ]
            : [];

        return [
            ...DropdownMenuContentConditionalItemsHelper.getConditionalItems(
                conditionalItems,
                false
            ),
            ...DropdownMenuContentConditionalItemsHelper.getConditionalItems(
                sharedItems,
                true
            ),
            ...DropdownMenuContentConditionalItemsHelper.getConditionalItems(
                additionalItems,
                false
            ),
        ];
    }

    // payroll select load
    static getPayrollSelectLoadDropdownContent(
        loadList: { id: number; title: string }[]
    ): DropdownMenuItem[] {
        return [
            {
                title: DropdownMenuStringEnum.EDIT_LOAD,
                type: DropdownMenuStringEnum.EDIT_LOAD_TYPE,
                titleOptionalClass: 'ca-font-extra-bold',
                svgUrl: 'assets/ca-components/svg/applicant/close-x.svg',
                svgClass: DropdownMenuStringEnum.REGULAR,
                hasBorder: true,
                isSelectMenuTypeActionItem: true,
            },
            ...loadList,
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
