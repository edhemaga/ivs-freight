/**
 * Truckassist API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: v1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { PayrollLoadStopMinimalResponse } from './payrollLoadStopMinimalResponse';


export interface PayrollLoadMinimalResponse { 
    id?: number;
    loadNumber?: string | null;
    brokerName?: string | null;
    isTonu?: boolean;
    pickups?: Array<PayrollLoadStopMinimalResponse> | null;
    pickupCount?: number;
    deliveries?: Array<PayrollLoadStopMinimalResponse> | null;
    deliveryCount?: number;
    emptyMiles?: number | null;
    loadedMiles?: number | null;
    totalMiles?: number | null;
    revenue?: number;
    subtotal?: number | null;
    rate?: number | null;
    isFromNextPeriod?: boolean;
}

