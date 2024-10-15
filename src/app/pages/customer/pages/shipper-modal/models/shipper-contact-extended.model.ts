import { DepartmentResponse, ShipperContactResponse } from 'appcoretruckassist';

export interface ShipperContactExtended
    extends Omit<ShipperContactResponse, 'department'> {
    fullName?: string;
    phoneExt?: string;
    department?: string | DepartmentResponse;
}
