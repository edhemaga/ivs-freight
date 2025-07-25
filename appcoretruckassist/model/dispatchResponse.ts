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
import { TruckMinimalResponse } from './truckMinimalResponse';
import { TrailerMinimalResponse } from './trailerMinimalResponse';
import { DriverDispatchResponse } from './driverDispatchResponse';
import { ParkingSlotShortResponse } from './parkingSlotShortResponse';
import { EnumValue } from './enumValue';
import { DispatchHosResponse } from './dispatchHosResponse';
import { LoadProgressResponse } from './loadProgressResponse';
import { LoadShortResponse } from './loadShortResponse';
import { AddressEntity } from './addressEntity';
import { CompanyUserShortResponse } from './companyUserShortResponse';
import { DispatchStatusResponse } from './dispatchStatusResponse';


export interface DispatchResponse { 
    id?: number;
    order?: number;
    dispatchBoardId?: number | null;
    dispatcher?: CompanyUserShortResponse;
    truck?: TruckMinimalResponse;
    allowedTrailerIds?: Array<number> | null;
    trailer?: TrailerMinimalResponse;
    allowedTruckIds?: Array<number> | null;
    driver?: DriverDispatchResponse;
    coDriver?: DriverDispatchResponse;
    phone?: string | null;
    email?: string | null;
    location?: AddressEntity;
    isParkingLocation?: boolean;
    latitude?: number | null;
    longitude?: number | null;
    status?: DispatchStatusResponse;
    lastStatusPassed?: { [key: string]: number; } | null;
    currentStopType?: EnumValue;
    nextStopType?: EnumValue;
    hoursOfService?: Array<DispatchHosResponse> | null;
    note?: string | null;
    activeLoad?: LoadShortResponse;
    parkingSlot?: ParkingSlotShortResponse;
    loadProgress?: LoadProgressResponse;
    preTripInspection?: EnumValue;
    preTripInspectionTime?: string | null;
}

