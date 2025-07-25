// models
import { Options } from '@angular-slider/ngx-slider';
import { Tabs } from '@shared/models/tabs.model';
import { DropZoneConfig } from '@shared/components/ta-upload-files/models/dropzone-config.model';
import { AnimationOptions } from '@shared/models/animation-options.model';

// enums
import { eDropZoneFileType } from 'ca-components';

export class SettingsModalConstants {
    static TABS: Tabs[] = [
        {
            id: 1,
            name: 'Basic',
            checked: true,
        },
        {
            id: 2,
            name: 'Additional',
            checked: false,
        },
        {
            id: 3,
            name: 'Payroll',
            checked: false,
        },
    ];

    static TABS_DIVISION: Tabs[] = [
        {
            id: 1,
            name: 'Basic',
            checked: true,
        },
        {
            id: 2,
            name: 'Additional',
            checked: false,
        },
    ];

    static PREFERED_LOAD_BTNS: Tabs[] = [
        {
            id: 1,
            name: 'FTL',
            checked: true,
        },
        {
            id: 2,
            name: 'LTL',
            checked: false,
        },
    ];

    static FLEET_TYPE_BTNS: Tabs[] = [
        {
            id: 1,
            name: 'Solo',
            checked: true,
        },
        {
            id: 2,
            name: 'Team',
            checked: false,
        },
        {
            id: 3,
            name: 'Combined',
            checked: false,
        },
    ];

    static DRIVER_COMMISSION_OPTIONS: Options = {
        floor: 5,
        ceil: 50,
        step: 1,
        showSelectionBar: true,
        hideLimitLabels: true,
    };

    static OWNER_COMMISSION_OPTIONS: Options = {
        floor: 2,
        ceil: 30,
        step: 0.5,
        showSelectionBar: true,
        hideLimitLabels: true,
    };

    static COMMON_OPTIONS: Options = {
        floor: 2,
        ceil: 30,
        step: 0.5,
        showSelectionBar: true,
        hideLimitLabels: true,
    };

    static DISPATCHER_OPTIONS: Options = {
        floor: 0.1,
        ceil: 10,
        step: 0.1,
        showSelectionBar: true,
        hideLimitLabels: true,
    };

    static MANAGER_OPTIONS: Options = {
        floor: 0.1,
        ceil: 5,
        step: 0.05,
        showSelectionBar: true,
        hideLimitLabels: true,
    };

    static DROPZONE_CONFIG: DropZoneConfig = {
        dropZoneType: eDropZoneFileType.IMAGE,
        dropZoneAvailableFiles: 'image/gif, image/jpeg, image/jpg, image/png',
        dropZoneSvg: 'assets/svg/common/ic_image_dropzone.svg',
        multiple: false,
        globalDropZone: true,
    };

    static ANIMATION_OPTIONS: AnimationOptions = {
        value: 1,
        params: { height: '0px' },
    };
}
