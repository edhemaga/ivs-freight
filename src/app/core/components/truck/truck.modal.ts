import { TruckResponse } from 'appcoretruckassist';
import { ConstantStringTableComponentsEnum } from '../../utils/enums/table-components.enums';

export interface BodyResponseTruck {
    data?: TruckResponse;
    id?: number;
    type?: ConstantStringTableComponentsEnum;
}
