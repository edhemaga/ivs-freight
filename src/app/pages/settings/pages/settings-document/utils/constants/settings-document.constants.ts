// Enums
import { eFileFormControls } from '@shared/enums';

export class SettingsDocumentsConstants {
    public static INITIAL_TABLE_DATA = [
        {
            title: 'Document',
            field: 'active',
            length: 0,
            data: [],
            gridNameTitle: 'Document',
            tableConfiguration: null,
            isActive: true,
            gridColumns: [],
        },
    ];
    public static SELECTED_TAB = 'active';
    public static INITIAL_TABLE_OPTIONS = {
        toolbarActions: {
            showArhiveFilter: false,
            viewModeOptions: [],
            hideListColumn: true,
        },
        actions: [],
    };

    public static DROPZONE_CONFIG = {
        dropZoneType: eFileFormControls.FILES,
        dropZoneSvg: 'assets/svg/common/drag-image-dropzone-files.svg',
        dropZoneAvailableFiles:
            'application/pdf, image/png, image/jpeg, image/jpg',
        multiple: true,
        globalDropZone: true,
    };
}
