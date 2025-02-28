import {
    eDropZoneFileType,
    eFileSize,
    eReviewState,
    eTemplateType,
    IUploadFilesConfig,
} from 'ca-components';

export class SettingsBasicModalUploadFileConfig {
    static SETTINGS_BASIC_MODAL_UPLOAD_FILES_CONFIG: IUploadFilesConfig = {
        //Files
        files: [],

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
        dropZoneConfig: {
            template: eTemplateType.IMAGE_CROP,
            config: {
                dropzone: {
                    dropZoneType: eDropZoneFileType.IMAGE,
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
            reviewMode: eReviewState.REVIEW_MODE,
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

        size: eFileSize.MEDIUM,
        slideWidth: 180,
    };
}
