import { UploadFile } from '@shared/components/ta-upload-files/models/upload-file.model';

export interface FileEvent {
    files: UploadFile[] | UploadFile | any;
    action: string;
    deleteId?: number;
    index?: number;
}
