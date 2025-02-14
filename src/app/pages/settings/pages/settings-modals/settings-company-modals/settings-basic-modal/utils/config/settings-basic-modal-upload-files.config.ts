//enums
import { eFilesSize } from 'ca-components';

//models
import { IUploadFilesConfig } from '@ca-shared/components/ca-upload-files/models';

export class SettingsBasicModalUploadFileConfig {
    static SETTINGS_BASIC_MODAL_UPLOAD_FILES_CONFIG: IUploadFilesConfig = {

        //Files
        files:[],
        
        // Carousel
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
        hasBlobUrl: false,

        // Tags
        onlyOneTagFile: false,

        // Dropzone
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
        dropzoneCustomWidth: '603px',
        isVisibleCropAndDrop: true,

        // Cropper
        initialCropperPosition: {
            x1: 0,
            y1: 0,
            x2: 608,
            y2: 198,
        },
        containWithinAspectRatio: true,
        aspectRatio: [33, 10],

        // Review
        review: {
            isReview: true,
            reviewMode: 'REVIEW_MODE',
            feedbackText: 'Sample feedback text',
            categoryTag: 'General',
        },

        fileOptionsConfig: {
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
            type: 'modal',
            hasLandscapeOption: false,
            tags: ['Example'],
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

        size: eFilesSize.MEDIUM,
        slideWidth: 180,
    };
}
