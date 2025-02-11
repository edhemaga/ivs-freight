//enums
import { FilesSizeEnum } from 'ca-components';

//models
import { IUploadFilesConfig } from '@ca-shared/components/ca-upload-files/models';

export class NavigationDataUploadFilesConfig {
    static NAVIGATION_PROFIL_UPLOAD_FILES_CONFIG: IUploadFilesConfig = {
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
        isRoundCrop: true,
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
        size: FilesSizeEnum.MEDIUM,
        slideWidth: 180,
    };
}
