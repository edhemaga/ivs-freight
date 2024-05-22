import { ContactDepartmentData } from "@shared/components/ta-input-dropdown-contacts/models/contact-department-data.model";

export interface ContactData {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    phoneExt?: string;
    department?: ContactDepartmentData;
}