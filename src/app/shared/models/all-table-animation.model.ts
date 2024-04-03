import { ApplicantResponse, BrokerResponse, DriverResponse, ShipperResponse } from "appcoretruckassist";

type CombinedResponses =
    | ShipperResponse
    | BrokerResponse
    | DriverResponse
    | ApplicantResponse;
export interface AllTableAnimationModel {
    animation: string;
    data: CombinedResponses;
    id: number;
    tab: string;
}