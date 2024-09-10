import { TableStringEnum } from '@shared/enums/table-string.enum';
import {
    CompanyContactResponse,
    CompanyResponse,
    DriverResponse,
    LoadResponse,
    RepairResponse,
} from 'appcoretruckassist';

export interface EditData {
    data:
        | LoadResponse
        | CompanyContactResponse
        | RepairResponse
        | DriverResponse;
    type: string;
    company: CompanyResponse;
    id: number;
    shopId?: number;
    isFinishOrder?: number;
    file_id?: number;
    renewData?: any;
    selectedTab: string;
    loadAction?:
        | TableStringEnum.CONVERT_TO_TEMPLATE
        | TableStringEnum.CONVERT_TO_LOAD;
}
