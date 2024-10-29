import {
    CompanyOfficeDepartmentContactResponse,
    DepartmentResponse,
} from 'appcoretruckassist';

export interface OfficeContactExtended
    extends Omit<CompanyOfficeDepartmentContactResponse, 'department'> {
    fullName?: string;
    phoneExt?: string;
    department?: string | DepartmentResponse;
}
