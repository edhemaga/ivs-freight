import { UploadFile } from '@shared/components/ta-upload-files/models/upload-file.model';

export interface ChatExtendedUploadFile extends UploadFile {
    fileSize?: number | null;
    tags?: Array<string> | null;
    tagGeneratedByUser?: boolean;
    updatedAt?: string | null;
}
