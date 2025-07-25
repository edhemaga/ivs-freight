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
import { EnumValue } from './enumValue';
import { ShipperShortResponse } from './shipperShortResponse';


export interface LoadStopLoadListResponse { 
    stopType?: EnumValue;
    dateFrom?: string | null;
    dateTo?: string | null;
    timeFrom?: string | null;
    timeTo?: string | null;
    timeType?: EnumValue;
    stopOrder?: number;
    stopLoadOrder?: number;
    arrive?: string | null;
    depart?: string | null;
    legMiles?: number | null;
    wait?: { [key: string]: number; } | null;
    shipper?: ShipperShortResponse;
    avgWaitTime?: number | null;
}

