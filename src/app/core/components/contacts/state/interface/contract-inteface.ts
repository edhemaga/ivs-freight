export interface ContactPhone {
    id?: number;
    phone?: string;
    phoneExt?: string;
    contactPhoneType?: contactPhoneType;
    primary?: boolean;
}

export interface ContactEmail {
    id?: number;
    email?: string;
    contactEmailType?: ContractEmailType;
    primary?: boolean;
}

export interface contactPhoneType {
    id?: number;
    name?: string;
}

export interface ContractEmailType {
    id?: number;
    name?: string;
}
