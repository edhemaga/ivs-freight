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
import { TrailerTypeResponse } from './trailerTypeResponse';
import { EnumValue } from './enumValue';
import { AddressEntity } from './addressEntity';


export interface MilesStopDetailsResponse { 
    id?: number;
    order?: number;
    type?: EnumValue;
    location?: AddressEntity;
    longitude?: number | null;
    latitude?: number | null;
    businessName?: string | null;
    legMiles?: number | null;
    dateTimeFrom?: string;
    dateTimeTo?: string | null;
    stopDuration?: { [key: string]: number; } | null;
    travelHours?: number | null;
    travelMinutes?: number | null;
    isIntegrated?: boolean | null;
    loadId?: number | null;
    loadNumber?: string | null;
    trailerNumber?: string | null;
    trailerType?: TrailerTypeResponse;
    driverFullName?: string | null;
}

