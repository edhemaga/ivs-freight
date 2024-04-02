import { TruckResponse } from 'appcoretruckassist';
import { ConstantStringTableComponentsEnum } from 'src/app/core/utils/enums/table-components.enum';

export interface TruckBodyResponse {
    data?: TruckResponse;
    id?: number;
    type?: ConstantStringTableComponentsEnum;
}
