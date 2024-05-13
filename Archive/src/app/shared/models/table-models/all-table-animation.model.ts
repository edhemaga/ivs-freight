import {
    ApplicantResponse,
    BrokerResponse,
    DriverResponse,
    PMTrailerUnitResponse,
    PMTruckUnitResponse,
    ShipperResponse,
} from 'appcoretruckassist';

export interface AllTableAnimationModel {
    animation: string;
    data: CombinedResponses;
    id: number;
    tab: string;
}

type CombinedResponses =
    | ShipperResponse
    | BrokerResponse
    | DriverResponse
    | ApplicantResponse
    | PMTruckUnitResponse
    | PMTrailerUnitResponse;
