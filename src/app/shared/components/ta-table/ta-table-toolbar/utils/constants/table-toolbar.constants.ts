import { TableStringEnum } from '@shared/enums/table-string.enum';

// models
import { OptionsPopupContent } from '@shared/components/ta-table/ta-table-toolbar/models/options-popup-content.model';

export class TableToolbarConstants {
    static optionsPopupContent: OptionsPopupContent[] = [
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
