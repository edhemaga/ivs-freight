import { BrokerLoadsResponse, BrokerResponse } from "appcoretruckassist";

export interface BrokerResponseData extends BrokerResponse {
    loadStops?: BrokerLoadsResponse;
}
