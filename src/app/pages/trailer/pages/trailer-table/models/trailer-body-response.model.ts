import { TrailerResponse } from 'appcoretruckassist';

//Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';

export interface TrailerBodyResponse {
    data?: TrailerResponse;
    id?: number;
    type?: TableStringEnum;
}
