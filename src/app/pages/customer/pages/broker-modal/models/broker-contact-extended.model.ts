import { BrokerContactResponse, DepartmentResponse } from 'appcoretruckassist';

export interface BrokerContactExtended
    extends Omit<BrokerContactResponse, 'department'> {
    fullName?: string;
    phoneExt?: string;
    department?: string | DepartmentResponse;
}
