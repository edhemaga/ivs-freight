export interface ContactEmail {
    id?: number;
    email?: string;
    contactEmailType?: ContractEmailType;
    primary?: boolean;
}

export interface ContractEmailType {
    id?: number;
    name?: string;
}
