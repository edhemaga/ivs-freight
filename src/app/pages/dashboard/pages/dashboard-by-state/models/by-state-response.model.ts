import {
    AccidentByStateListResponse,
    FuelByStateListResponse,
    PickupDeliveryByStateListResponse,
    RepairByStateListResponse,
    RoadsideByStateListResponse,
    ViolationByStateListResponse,
} from 'appcoretruckassist';

export type ByStateResponse =
    | PickupDeliveryByStateListResponse
    | RoadsideByStateListResponse
    | ViolationByStateListResponse
    | AccidentByStateListResponse
    | RepairByStateListResponse
    | FuelByStateListResponse;
