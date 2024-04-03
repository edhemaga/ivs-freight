import { TrailerResponse } from 'appcoretruckassist';

//Enums
import { ConstantStringTableComponentsEnum } from 'src/app/core/utils/enums/table-components.enum';

export interface TrailerBodyResponse {
    data?: TrailerResponse;
    id?: number;
    type?: ConstantStringTableComponentsEnum;
}
