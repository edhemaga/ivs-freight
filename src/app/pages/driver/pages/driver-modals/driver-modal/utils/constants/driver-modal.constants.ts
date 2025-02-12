// enums
import { DriverModalStringEnum } from '@pages/driver/pages/driver-modals/driver-modal/enums/driver-modal-string.enum';

// models

import { Options } from '@angular-slider/ngx-slider';

import { Tabs } from '@shared/models/tabs.model';
import { AnimationObject } from '@pages/driver/pages/driver-modals/driver-modal/models/animation-object.model';
import { DropZoneConfig } from '@shared/components/ta-upload-files/models/dropzone-config.model';

export class DriverModalConstants {
    static MAIN_TABS: Tabs[] = [
        {
            id: 1,
            name: DriverModalStringEnum.BASIC,
            checked: true,
        },
        {
            id: 2,
            name: DriverModalStringEnum.ADDITIONAL,
        },
    ];

    static OWNER_TABS: Tabs[] = [
        {
            id: 1,
            name: DriverModalStringEnum.SOLE_PROPRIETOR,
            checked: true,
        },
        {
            id: 2,
            name: DriverModalStringEnum.COMPANY,
            checked: false,
        },
    ];

    static PAYROLL_TABS: Tabs[] = [
        {
            id: 1,
            name: DriverModalStringEnum.COMPANY_DRIVER,
            checked: true,
        },
        {
            id: 2,
            name: DriverModalStringEnum.THIRD_PARTY_DRIVER,
            checked: false,
        },
    ];

    static ANIMATION_OBJECT: AnimationObject = {
        value: 1,
        params: { height: DriverModalStringEnum.ZERO_PX },
    };

    static DROPZONE_CONFIG_BASIC_TAB: DropZoneConfig = {
        dropZoneType: DriverModalStringEnum.FILES,
        dropZoneSvg: DriverModalStringEnum.DROPZONE_FILES_URL,
        dropZoneAvailableFiles: DriverModalStringEnum.DROPZONE_FILES_EXTENSION,
        multiple: true,
        globalDropZone: false,
    };

    static DROPZONE_CONFIG_ADDITIONAL_TAB: DropZoneConfig = {
        dropZoneType: DriverModalStringEnum.IMAGE,
        dropZoneSvg: DriverModalStringEnum.DROPZONE_IMGAGE_URL,
        dropZoneAvailableFiles: DriverModalStringEnum.DROPZONE_IMAGE_EXTENSION,
        multiple: false,
        globalDropZone: true,
    };

    static SLIDER_OPTIONS: Options = {
        floor: 5,
        ceil: 50,
        step: 1,
        showSelectionBar: true,
        hideLimitLabels: true,
    };
}
