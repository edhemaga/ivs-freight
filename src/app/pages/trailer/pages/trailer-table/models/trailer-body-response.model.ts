import { TrailerResponse } from 'appcoretruckassist';

//Enums
import { TableStringEnum } from 'src/app/shared/enums/table-string.enum';

export interface TrailerBodyResponse {
    data?: TrailerResponse;
    id?: number;
    type?: TableStringEnum;
}
