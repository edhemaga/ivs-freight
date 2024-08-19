import { UploadFile } from "@shared/components/ta-upload-files/models/upload-file.model";

export interface ExtendedUploadFile extends UploadFile {
    fileId?: number;
    fileName?: string | null;
    fileSize?: number | null;
    tags?: Array<string> | null;
    tagGeneratedByUser?: boolean;
    updatedAt?: string | null; F
}