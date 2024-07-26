import { Pipe, PipeTransform } from '@angular/core';

// Assets
import { ChatPngRoutes } from '@pages/chat/util/constants/chat-png-routes.constants';

@Pipe({
    name: 'fileExtensionIllustration',
    standalone: true
})
export class FileExtensionIllustrationPipe implements PipeTransform {
    transform(fileName: string): string {
        if (!fileName) {
            return null;
        }

        const ext: string[] = fileName.split('.');

        // TODO maybe add handling for images, convert to string?

        switch (ext[ext.length - 1]) {

            case 'zip': {
                return ChatPngRoutes.zipFileType;
            }

            case 'xls': {
                return ChatPngRoutes.xlsFileType
            }

            case 'pdf': {
                return ChatPngRoutes.pdfFileType;
            }

            case 'docx': {
                return ChatPngRoutes.docxFileType
            }

            default: {
                return "";
            }

        }
    }
}
