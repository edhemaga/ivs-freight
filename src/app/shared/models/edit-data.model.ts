import { SelectedStatus } from '@pages/load/pages/load-modal/models';
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
    type?: string;
    company?: CompanyResponse;
    id: number;
    shopId?: number;
    isFinishOrder?: number;
    file_id?: number;
    renewData?: any;
    selectedTab: string;
    isEditMode?: boolean;
    previousStatus?: SelectedStatus;
}
