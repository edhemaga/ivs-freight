import { Observable } from "rxjs";

// Models
import { ChatAttachmentForThumbnail } from "@pages/chat/models";

export const convertFileToUrl = (file: File): Observable<string | ArrayBuffer> => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    return new Observable((observer) => {

        reader.onload = () => {
            observer.next(reader.result);
        };

        reader.onerror = () => {
            observer.error(reader.error);
        };
    });
}

export const checkIfAttachmentExistsAndHandlePreview = (files: FileList, attachments: ChatAttachmentForThumbnail[]): ChatAttachmentForThumbnail[] => {
    if (!attachments) return [];

    for (let i = 0; i < files.length; i++) {
        const fileExists: boolean = attachments
            .some(
                attachment => attachment.name === files[i].name
            )
        if (fileExists) continue;

        let newFile: ChatAttachmentForThumbnail = files[i];
        convertFileToUrl(files[i]).subscribe(arg => {
            newFile.stringifiedData = arg;
        });

        attachments = [...attachments, newFile];
    }
    return attachments;
}