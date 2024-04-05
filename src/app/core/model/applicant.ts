export interface IApplicant {
    id?: string;
    firstName: string;
    lastName: string;
    fullName: string;
    dob?: Date;
    code: string;
    phone: string;
    email: string;
    address: string;
    addressUnit: string;
}
