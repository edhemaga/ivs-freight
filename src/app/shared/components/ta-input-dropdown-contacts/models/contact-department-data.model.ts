import { ContactData } from "@shared/components/ta-input-dropdown-contacts/models/contact-data.model";

export interface ContactDepartmentData {
    id?: number;
    name?: string;
    count?: number;
    contacts: ContactData[];
    isOpen?: boolean;
}