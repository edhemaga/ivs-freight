import { BrokerResponse, ShipperResponse } from 'appcoretruckassist';

// Enum
import { TableStringEnum } from 'src/app/shared/enums/table-string.enum';

export interface CustomerBodyResponse {
    data?: ShipperResponse | BrokerResponse;
    subType?: string;
    open?: TableStringEnum;
    id?: number;
    event?: string;
    businessName?: string;
}
