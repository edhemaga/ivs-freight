import { Address } from "../../shared/ta-input-address/ta-input-address.component";

export interface CreateCompanyContactCommand { 
    name?: string | null;
    phone?: string | null;
    email?: string | null;
    address?: Address;
    note?: string | null;
    shared?: boolean;
    companyContactLabelId?: number | null;
}