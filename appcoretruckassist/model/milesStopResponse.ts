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
import { ParkingResponse } from './parkingResponse';
import { TrailerMinimalResponse } from './trailerMinimalResponse';
import { EnumValue } from './enumValue';
import { FuelStopShortResponse } from './fuelStopShortResponse';
import { DriverMinimalResponse } from './driverMinimalResponse';
import { LoadStopShortResponse } from './loadStopShortResponse';
import { AddressEntity } from './addressEntity';
import { RepairShopMinimalResponse } from './repairShopMinimalResponse';


export interface MilesStopResponse { 
    id?: number;
    order?: number;
    type?: EnumValue;
    location?: AddressEntity;
    legMiles?: number;
    emptyMiles?: number;
    loadedMiles?: number;
    totalMiles?: number;
    travelHours?: number;
    travelMinutes?: number;
    dateTimeFrom?: string;
    dateTimeTo?: string | null;
    duration?: { [key: string]: number; } | null;
    trailer?: TrailerMinimalResponse;
    driver?: DriverMinimalResponse;
    loadStop?: LoadStopShortResponse;
    repairShop?: RepairShopMinimalResponse;
    fuelStopStore?: FuelStopShortResponse;
    parking?: ParkingResponse;
    createdAt?: string;
    updatedAt?: string;
}

