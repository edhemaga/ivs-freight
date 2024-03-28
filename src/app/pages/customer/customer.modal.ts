import {
    ApplicantResponse,
    BrokerResponse,
    DriverResponse,
    ShipperResponse,
    TimeOnly,
} from 'appcoretruckassist';

// Enum
import { ConstantStringTableComponentsEnum } from 'src/app/core/utils/enums/table-components.enum';

// Model
import { DropdownItem } from '../dashboard/state/models/dropdown-item.model';

export interface ViewDataResponse {
    data: BrokerResponse | ShipperResponse;
    actionAnimation: string;
    id: number;
    isSelected: boolean;
}
type CombinedResponses =
    | ShipperResponse
    | BrokerResponse
    | DriverResponse
    | ApplicantResponse;
export interface AllTableModal {
    animation: string;
    data: CombinedResponses;
    id: number;
    tab: string;
}

export interface UpdateRating {
    actionAnimation: ConstantStringTableComponentsEnum;
    tableRaiting: {
        hasLiked: boolean;
        hasDislike: boolean;
        likeCount: number | ConstantStringTableComponentsEnum;
        dislikeCount: number | ConstantStringTableComponentsEnum;
    };
    id: number;
}
// Tried for mapShipperData(data: ShipperResponse): return type but always error
export interface MappedShipperData {
    isSelected: boolean;
    tableAddress: string | ConstantStringTableComponentsEnum;
    tableLoads: ConstantStringTableComponentsEnum;
    tableAverageWatingTimePickup: ConstantStringTableComponentsEnum | TimeOnly;
    tableAverageWatingTimeDelivery:
        | ConstantStringTableComponentsEnum
        | TimeOnly;
    tableAvailableHoursShipping: string;
    tableAvailableHoursReceiving: string;
    tableContact: number;
    tableRaiting: {
        hasLiked: boolean;
        hasDislike: boolean;
        likeCount: number | ConstantStringTableComponentsEnum;
        dislikeCount: number | ConstantStringTableComponentsEnum;
    };
    tableAdded: string;
    tableEdited: string;
    tableDropdownContent: {
        hasContent: boolean;
        content: DropdownItem[];
    };
}
export interface BodyResponse {
    data?: ShipperResponse | BrokerResponse;
    subType?: string;
    open?: ConstantStringTableComponentsEnum;
    id?: number;
    event?: string;
    businessName?: string;
}
