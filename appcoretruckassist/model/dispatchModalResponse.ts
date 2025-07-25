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
import { TrailerDispatchModalResponse } from './trailerDispatchModalResponse';
import { DispatchBoardResponse } from './dispatchBoardResponse';
import { EnumValue } from './enumValue';
import { ParkingDispatchModalResponse } from './parkingDispatchModalResponse';
import { TruckDispatchModalResponse } from './truckDispatchModalResponse';
import { DriverDispatchModalResponse } from './driverDispatchModalResponse';
import { LoadShortResponse } from './loadShortResponse';


export interface DispatchModalResponse { 
    trucks?: Array<TruckDispatchModalResponse> | null;
    trailers?: Array<TrailerDispatchModalResponse> | null;
    drivers?: Array<DriverDispatchModalResponse> | null;
    dispatchBoards?: Array<DispatchBoardResponse> | null;
    loads?: Array<LoadShortResponse> | null;
    parkings?: Array<ParkingDispatchModalResponse> | null;
    dispatchStatuses?: Array<EnumValue> | null;
}

