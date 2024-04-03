import { BrokerResponse, ShipperResponse } from "appcoretruckassist";

export interface CustomerViewDataResponse {
    data: BrokerResponse | ShipperResponse;
    actionAnimation: string;
    id: number;
    isSelected: boolean;
}