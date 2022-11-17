export interface Address {
    address: string | null;
    addressUnit?: number | string;
    city: string;
    country: string;
    state: string;
    stateShortName: string;
    streetName?: string;
    streetNumber?: string;
    zipCode: number | string;
}
