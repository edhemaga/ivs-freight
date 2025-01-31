import {
    AccidentIntervalResponse,
    FuelIntervalResponse,
    PickupDeliveryIntervalResponse,
    RepairIntervalResponse,
    RoadsideIntervalResponse,
    ViolationIntervalResponse,
} from 'appcoretruckassist';

export type ByStateIntervalResponse =
    | PickupDeliveryIntervalResponse
    | RoadsideIntervalResponse
    | ViolationIntervalResponse
    | AccidentIntervalResponse
    | RepairIntervalResponse
    | FuelIntervalResponse;
