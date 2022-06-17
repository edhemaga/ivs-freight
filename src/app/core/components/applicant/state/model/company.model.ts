export interface ICompany {
    name: string;
    usdot: number;
    phoneContact: string;
    location: {
        street: string;
        city: string;
        postalCode: string;
        country: string;
    };
}
