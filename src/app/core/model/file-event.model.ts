import { UploadFile } from '../../shared/components/ta-upload-files/components/ta-upload-file/ta-upload-file.component';

export interface FileEvent {
    files: UploadFile[] | UploadFile | any;
    action: string;
    deleteId?: number;
    index?: number;
}
