import {
    DepartmentResponse,
    RepairShopContactResponse,
} from 'appcoretruckassist';

export interface RepairShopContactExtended
    extends Omit<RepairShopContactResponse, 'department'> {
    fullName?: string;
    phoneExt?: string;
    department?: string | DepartmentResponse;
}
