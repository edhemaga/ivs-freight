import { ContactDepartmentData } from "@shared/components/ta-contacts/models/contact-department-data.model";

export interface ContactData {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    phoneExt?: string;
    department?: ContactDepartmentData;
}