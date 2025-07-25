import {
    eDropZoneFileType,
    eFileSize,
    eReviewState,
    eTemplateType,
    IUploadFilesConfig,
} from 'ca-components';

export class RepairShopModalUploadFilesConfig {
    static REPAIR_SHOP_MODAL_DOCUMENT_UPLOAD_FILES_CONFIG: IUploadFilesConfig =
        {
            //Files
            files: [],

            // Carousel
            slider: {
                dontUseSlider: false,
                hasCarouselBottomTabs: true,
            },
            carouselConfig: {
                files: [],
                customClass: 'medium',
                customDetailsPageClass: 'modals',
                hasCarouselBottomTabs: true,
            },
            hasCrop: false,
            isRoundCrop: false,
            hasBlobUrl: false,

            // Tags
            onlyOneTagFile: false,

            // Dropzone
            dropZoneConfig: {
                template: eTemplateType.DOCUMENTS,
                config: {
                    dropzone: {
                        dropZoneType: eDropZoneFileType.FILES,
                        multiple: true,
                        globalDropZone: false,
                        dropZonePages: 'tools_todo',
                    },
                    dropzoneOption: {
                        customClassName: 'documents-dropzone',
                        size: 'medium',
                        modalSize: 'lg',
                        showDropzone: true,
                        filesLength: 2,
                        isRequired: true,
                        dropzoneClose: false,
                    },
                },
            },
            dropzoneCustomWidth: '',
            isVisibleCropAndDrop: true,

            // Cropper
            initialCropperPosition: {
                x1: 0,
                y1: 0,
                x2: 184,
                y2: 184,
            },
            containWithinAspectRatio: false,
            aspectRatio: [1, 1],

            // Review
            review: {
                isReview: false,
                reviewMode: eReviewState.FEEDBACK_MODE,
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
                hasTagsDropdown: true,
                hasNumberOfPages: true,
                activePage: 1,
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

            size: eFileSize.MEDIUM,
            slideWidth: 180,
        };

    static REPAIR_SHOP_MODAL_COVER_PHOTO_UPLOAD_FILES_CONFIG: IUploadFilesConfig =
        {
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
            hasBlobUrl: true,

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
            dropzoneCustomWidth: '',
            isVisibleCropAndDrop: true,

            // Cropper
            initialCropperPosition: {
                x1: 0,
                y1: 0,
                x2: 184,
                y2: 184,
            },
            containWithinAspectRatio: false,
            aspectRatio: [1, 1],

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
