import { TruckResponse } from 'appcoretruckassist';

import { TableStringEnum } from 'src/app/shared/enums/table-string.enum';

export interface TruckBodyResponse {
    data?: TruckResponse;
    id?: number;
    type?: TableStringEnum;
}
