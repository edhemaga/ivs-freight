// models
import { BrokerContactResponse, BrokerShortResponse, CompanyUserShortResponse, DispatchShortResponse, EnumValue } from "appcoretruckassist";

// enums
import { Load } from "@pages/load/models";

export interface IActiveLoadModalData extends Load {
    dispatcher?: CompanyUserShortResponse,
    company?: CompanyUserShortResponse,
    dispatch?: DispatchShortResponse,
    broker?: BrokerShortResponse,
    brokerContact?: BrokerContactResponse,
    statusType?: EnumValue;
}