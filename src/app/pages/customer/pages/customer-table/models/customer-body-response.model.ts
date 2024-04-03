import { BrokerResponse, ShipperResponse } from 'appcoretruckassist';

// Enum
import { ConstantStringTableComponentsEnum } from 'src/app/core/utils/enums/table-components.enum';

export interface CustomerBodyResponse {
    data?: ShipperResponse | BrokerResponse;
    subType?: string;
    open?: ConstantStringTableComponentsEnum;
    id?: number;
    event?: string;
    businessName?: string;
}
