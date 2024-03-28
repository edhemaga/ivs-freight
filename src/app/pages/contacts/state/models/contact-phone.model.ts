export interface ContactPhone {
    id?: number;
    phone?: string;
    phoneExt?: string;
    contactPhoneType?: ContactPhoneType;
    primary?: boolean;
}

export interface ContactPhoneType {
    id?: number;
    name?: string;
}
