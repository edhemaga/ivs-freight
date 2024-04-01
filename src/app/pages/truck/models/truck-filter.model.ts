import { TruckResponse } from 'appcoretruckassist';
import { ConstantStringTableComponentsEnum } from 'src/app/core/utils/enums/table-components.enum';

export interface BodyResponseTruck {
    data?: TruckResponse;
    id?: number;
    type?: ConstantStringTableComponentsEnum;
}

export interface FilterOptions {
    active: number;
    pageIndex: number;
    pageSize: number;
    companyId: number;
    sort: string;
    searchOne: string;
    searchTwo: string;
    searchThree: string;
}
