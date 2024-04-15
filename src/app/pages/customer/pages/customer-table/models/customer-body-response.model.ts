import { BrokerResponse, ShipperResponse } from 'appcoretruckassist';

// Enum
import { TableStringEnum } from '@shared/enums/table-string.enum';

export interface CustomerBodyResponse {
    data?: ShipperResponse | BrokerResponse;
    subType?: string;
    open?: TableStringEnum;
    id?: number;
    event?: string;
    businessName?: string;
}
