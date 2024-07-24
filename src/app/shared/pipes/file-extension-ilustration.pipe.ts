import { Pipe, PipeTransform } from '@angular/core';

// Assets
import { ChatPngRoutes } from '@pages/chat/util/constants/chat-png-routes.constants';

@Pipe({
    name: 'fileExtensionIllustration',
    standalone: true
})
export class FileExtensionIllustrationPipe implements PipeTransform {
    transform(filName: string): string {
        if (!filName) {
            return null;
        }

        const ext: string[] = filName.split('.');

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
