import { EFileFormControls } from '@shared/enums';

export const dropzoneDefaultConfig = {
    dropZoneType: EFileFormControls.FILES, // files | image | media
    dropZoneSvg: 'assets/svg/common/drag-image-dropzone-files.svg',
    dropZoneAvailableFiles: 'application/pdf, image/png, image/jpeg, image/jpg',
    multiple: true,
    globalDropZone: false,
};
