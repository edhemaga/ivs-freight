// Models
import { DropZoneConfig } from '@shared/components/ta-upload-files/models/dropzone-config.model';

// Assets
import { ChatSvgRoutes } from '@pages/chat/utils/routes';
// Enums
import { eDropZoneFileType } from 'ca-components';

export class ChatDropzone {
    static inputDropzone: DropZoneConfig = {
        dropZoneType: eDropZoneFileType.IMAGE,
        dropZoneSvg: ChatSvgRoutes.dropZoneIcon,
        dropZoneAvailableFiles:
            'application/pdf, application/zip, application/docx, image/png, image/jpeg, image/jpg',
        multiple: true,
        globalDropZone: false,
    };
}
