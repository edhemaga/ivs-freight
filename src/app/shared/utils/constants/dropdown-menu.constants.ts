import { DropdownMenuStringEnum } from '@shared/enums';

// models
import { DropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/models';

export class DropdownMenuConstants {
    // shared items
    static DROPDOWN_MENU_SHARED_ITEMS: Record<string, DropdownMenuItem> = {
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
    };

    // conditional items
    static DROPDOWN_MENU_CONDITIONAL_ITEMS: Record<string, DropdownMenuItem> = {
        // payroll conditional items

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
