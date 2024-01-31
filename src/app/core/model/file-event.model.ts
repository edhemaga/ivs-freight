import { UploadFile } from '../components/shared/ta-upload-files/ta-upload-file/ta-upload-file.component';

export interface FileEvent {
    files: UploadFile[] | UploadFile | any;
    action: string;
    deleteId?: number;
    index?: number;
}
