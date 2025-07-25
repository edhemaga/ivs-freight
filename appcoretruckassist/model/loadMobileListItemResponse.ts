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
import { LoadStatusResponse } from './loadStatusResponse';
import { LoadStopInfo } from './loadStopInfo';
import { MilesInfo } from './milesInfo';


export interface LoadMobileListItemResponse { 
    id?: number;
    loadNumber?: string | null;
    status?: LoadStatusResponse;
    totalRate?: number | null;
    brokerBusinessName?: string | null;
    miles?: MilesInfo;
    pickup?: LoadStopInfo;
    delivery?: LoadStopInfo;
    isInActivePayroll?: boolean;
    closingPayrollDate?: string | null;
}

