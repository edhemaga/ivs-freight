import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { UploadFile } from './ta-upload-file/ta-upload-file.component';

@Injectable({
    providedIn: 'root',
})
export class TaUploadFileService {
    private uploadDocumentsSubject: Subject<{
        files: UploadFile[];
        action: string;
    }> = new Subject<{ files: UploadFile[]; action: string }>();

    private visibilityDropZoneSubject: Subject<boolean> =
        new Subject<boolean>();

    get visibilityDropZone$() {
        return this.visibilityDropZoneSubject.asObservable();
    }

    public visibilityDropZone(action: boolean) {
        this.visibilityDropZoneSubject.next(action);
    }

    get uploadedFiles$() {
        return this.uploadDocumentsSubject.asObservable();
    }

    public uploadFiles(data: { files: UploadFile[]; action: string }) {
        this.uploadDocumentsSubject.next(data);
    }
}
