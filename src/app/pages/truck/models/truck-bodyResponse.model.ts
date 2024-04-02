import { TruckResponse } from 'appcoretruckassist';
import { ConstantStringTableComponentsEnum } from 'src/app/core/utils/enums/table-components.enum';

export interface BodyResponseTruck {
    data?: TruckResponse;
    id?: number;
    type?: ConstantStringTableComponentsEnum;
}
