import {
    CompanyContactResponse,
    CompanyResponse,
    LoadResponse,
    RepairResponse,
} from 'appcoretruckassist';

export interface EditData {
    data: LoadResponse | CompanyContactResponse | RepairResponse;
    type: string;
    company: CompanyResponse;
    id: number;
    shopId?: number;
    isFinishOrder?: number;
}
