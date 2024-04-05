export interface UploadFile {
    fileId?: number;
    name?: any;
    fileName?: string;
    url: string | any;
    extension?: string;
    guid?: string;
    size?: number;
    fileSize?: number;
    tags?: any;
    realFile?: File;
    tagId?: any;
    incorrect?: boolean;
    tagChanged?: boolean;
    savedTag?: any;
    tagGeneratedByUser?: boolean;
    lastHovered?: boolean;
}
