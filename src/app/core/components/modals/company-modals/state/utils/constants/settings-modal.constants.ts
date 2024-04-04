// models
import { Options } from '@angular-slider/ngx-slider';
import { CroppieOptions } from 'croppie';
import { Tabs } from 'src/app/core/components/shared/model/modal-tabs';
import { DropZoneConfig } from 'src/app/shared/components/ta-upload-files/ta-upload-dropzone/ta-upload-dropzone.component';
import { AnimationObject } from 'src/app/core/model/animation-object.model';

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
        dropZoneType: 'image',
        dropZoneAvailableFiles: 'image/gif, image/jpeg, image/jpg, image/png',
        dropZoneSvg: 'assets/svg/common/ic_image_dropzone.svg',
        multiple: false,
        globalDropZone: true,
    };

    static CROPPIE_OPTIONS: CroppieOptions = {
        enableExif: true,
        viewport: {
            width: 616,
            height: 194,
            type: 'square',
        },
        boundary: {
            width: 616,
            height: 194,
        },
        enforceBoundary: false,
    };

    static ANIMATION_OPTIONS: AnimationObject = {
        value: 1,
        params: { height: '0px' },
    };
}
