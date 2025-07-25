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
import { AssignedLoadResponse } from './assignedLoadResponse';
import { TrailerTypeResponse } from './trailerTypeResponse';
import { EnumValue } from './enumValue';
import { TruckTypeResponse } from './truckTypeResponse';
import { CompanyUserShortResponse } from './companyUserShortResponse';
import { DispatchLoadModalResponse } from './dispatchLoadModalResponse';


export interface AssignLoadModalResponse { 
    dispatches?: Array<DispatchLoadModalResponse> | null;
    dispatchers?: Array<CompanyUserShortResponse> | null;
    unassignedLoadsCount?: number;
    unassignedLoads?: Array<AssignedLoadResponse> | null;
    dispatchFutureTimes?: Array<EnumValue> | null;
    truckTypes?: Array<TruckTypeResponse> | null;
    trailerTypes?: Array<TrailerTypeResponse> | null;
}

