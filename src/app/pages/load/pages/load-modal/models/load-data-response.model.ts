import { LoadBillingAdditionalResponse, LoadPaymentPayResponse, LoadResponse, LoadStopResponse } from "appcoretruckassist";
import { LoadStop } from "./index";

export interface LoadDataResponse extends Omit<LoadResponse, 'stops'> {
    stops: LoadStop[] | LoadStopResponse[];
    loadTemplateId: number;
    brokerContactId: string;
    additionalBillingTypes: LoadPaymentPayResponse;
    totalHours: number;
    totalMinutes: number;
    deliveryStopOrder: number;
}