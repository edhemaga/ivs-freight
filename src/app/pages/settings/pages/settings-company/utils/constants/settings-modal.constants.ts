// models
import { Options } from '@angular-slider/ngx-slider';
import { Tabs } from '@shared/models/tabs.model';
import { DropZoneConfig } from '@shared/components/ta-upload-files/models/dropzone-config.model';
import { AnimationOptions } from '@shared/models/animation-options.model';

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

    static UPLOAD_OPTIONS = {
        isVisibleCropAndDrop: true,
        files: [],
        slider: {
            dontUseSlider: false,
            hasCarouselBottomTabs: false,
        },
        carouselConfig: {
            files: [],
            customClass: 'medium',
            customDetailsPageClass: 'modals',
            hasCarouselBottomTabs: true,
        },
        hasCrop: true,
        isRoundCrop: false,
        containWithinAspectRatio: true,
        aspectRatio: [3, 1],
        initialCropperPosition: {
            x1: 0,
            y1: 0,
            x2: 552,
            y2: 184,
        },
        dropzoneCustomWidth: '603px',
        dropzoneConf: [
            {
                template: 'imageCropTemplate',
                config: {
                    dropzone: {
                        dropZoneType: 'image',
                        multiple: true,
                        globalDropZone: false,
                        dropZonePages: 'cdl',
                    },
                    dropzoneOption: {
                        customClassName: 'documents-dropzone',
                        size: 'medium',
                        modalSize: 'lg',
                        showDropzone: true,
                        dropzoneClose: false,
                    },
                },
            },
        ],
        review: {
            isReview: true,
            reviewMode: 'REVIEW_MODE',
            feedbackText: 'Sample feedback text',
            categoryTag: 'General',
        },
        configFile: {
            id: 111,
            customClassName: 'modals',
            file: {
                url: '',
                incorrect: false,
                lastHovered: false,
                fileSize: 1200,
                fileName: '',
            },
            hasTagsDropdown: false,
            hasNumberOfPages: true,
            activePage: 1,
            tags: ['Example'],
            type: 'modal',
            hasLandscapeOption: false,
            tagsOptions: [
                {
                    tagName: 'HOS Agreement',
                    checked: false,
                },
                {
                    tagName: 'Unsafe Driving AGT',
                    checked: false,
                },
            ],
        },
        size: 'medium',
        slideWidth: 180,
    };

    static ANIMATION_OPTIONS: AnimationOptions = {
        value: 1,
        params: { height: '0px' },
    };
}
