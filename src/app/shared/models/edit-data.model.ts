import { TableStringEnum } from '@shared/enums/table-string.enum';
import {
    LoadDataResponse,
    SelectedStatus,
} from '@pages/load/pages/load-modal/models';
import {
    CompanyContactResponse,
    CompanyResponse,
    DriverResponse,
    LoadModalResponse,
    LoadPossibleStatusesResponse,
    LoadResponse,
    RepairResponse,
} from 'appcoretruckassist';

export interface EditData<T = undefined> {
    data:
        | LoadResponse
        | CompanyContactResponse
        | RepairResponse
        | DriverResponse
        | LoadDataResponse
        | T;
    type?: string;
    company?: CompanyResponse;
    id: number;
    shopId?: number;
    isFinishOrder?: number;
    file_id?: number;
    renewData?: any;
    selectedTab: string;
    loadAction?:
        | TableStringEnum.CONVERT_TO_TEMPLATE
        | TableStringEnum.CONVERT_TO_LOAD;
    isEditMode?: boolean;
    previousStatus?: SelectedStatus;
    preSelectedUnit?: number;
    statusDropdownData?: LoadPossibleStatusesResponse;
    loadModalData?: LoadModalResponse;
    title?: string;
}
