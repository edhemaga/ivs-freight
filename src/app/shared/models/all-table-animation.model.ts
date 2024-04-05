import {
    ApplicantResponse,
    BrokerResponse,
    DriverResponse,
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
    | ApplicantResponse;
