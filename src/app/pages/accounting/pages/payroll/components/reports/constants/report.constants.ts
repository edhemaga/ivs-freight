// Models
import { OptionsPopupContent } from 'ca-components/lib/components/ca-burger-menu/models/burger-menu.model';

// Enums
import { ReportMenuStringEnum } from '../enums/report.enums';

export class TableToolbarConstants {
    static closedReportPayroll: OptionsPopupContent[] = [
        {
            text: ReportMenuStringEnum.RESEND_REPORT,
            svgPath: 'assets/svg/common/ic_resend-invitation.svg',
            isInactive: false,
            active: false,
            hide: false,
            type: 'edit-load',
        },
        {
            text: ReportMenuStringEnum.SHARE,
            svgPath: 'assets/svg/common/share-icon.svg',
            isInactive: false,
            active: false,
            hide: false,
            type: 'share',
            hasTopBorder: true,
        },
        {
            text: ReportMenuStringEnum.PRINT,
            svgPath: 'assets/svg/truckassist-table/print-icon.svg',
            isInactive: false,
            active: false,
            hide: false,
            type: 'print',
        },
        {
            text: ReportMenuStringEnum.PREVIEW_REPORT,
            svgPath: 'assets/ca-components/svg/note/note-empty.svg',
            isInactive: false,
            active: false,
            hide: false,
            type: 'report',
            hasTopBorder: true,
        },
        {
            text: ReportMenuStringEnum.DOWNLOAD,
            svgPath: 'assets/svg/common/ic_download.svg',
            isInactive: false,
            active: false,
            hide: false,
            type: 'download',
            hasTopBorder: false,
        },
    ];

    static openReportPayroll: OptionsPopupContent[] = [
        {
            text: ReportMenuStringEnum.EDIT_LOAD,
            svgPath: 'assets/svg/common/load/ic_load-.svg',
            isInactive: false,
            active: false,
            hide: false,
            type: 'edit-load',
        },
        {
            text: ReportMenuStringEnum.EDIT_PAYROLL,
            svgPath: 'assets/svg/truckassist-table/driver-violation.svg',
            isInactive: false,
            active: false,
            hide: false,
            type: 'edit-payroll',
        },
        {
            text: ReportMenuStringEnum.SHARE,
            svgPath: 'assets/svg/common/share-icon.svg',
            isInactive: false,
            active: false,
            hide: false,
            type: 'share'
        },
        {
            text: ReportMenuStringEnum.PRINT,
            svgPath: 'assets/svg/truckassist-table/print-icon.svg',
            isInactive: false,
            active: false,
            hide: false,
            type: 'print',
            hasTopBorder: true
        }
    ];
}
