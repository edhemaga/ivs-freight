import { TruckResponse } from 'appcoretruckassist';

import { TableStringEnum } from '@shared/enums/table-string.enum';

export interface TruckBodyResponse {
    data?: TruckResponse;
    id?: number;
    type?: TableStringEnum;
}
