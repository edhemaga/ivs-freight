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
import { TransponderGroup } from './transponderGroup';
import { TagResponse } from './tagResponse';
import { TruckMakeResponse } from './truckMakeResponse';
import { EnumValue } from './enumValue';
import { TruckGrossWeightResponse } from './truckGrossWeightResponse';
import { ColorResponse } from './colorResponse';
import { TruckEngineModelResponse } from './truckEngineModelResponse';
import { TireSizeResponse } from './tireSizeResponse';
import { TruckTypeResponse } from './truckTypeResponse';
import { OwnerShortResponse } from './ownerShortResponse';


export interface GetTruckModalResponse { 
    truckTypes?: Array<TruckTypeResponse> | null;
    truckMakes?: Array<TruckMakeResponse> | null;
    truckLengths?: Array<EnumValue> | null;
    tireSizes?: Array<TireSizeResponse> | null;
    colors?: Array<ColorResponse> | null;
    owners?: Array<OwnerShortResponse> | null;
    truckGrossWeights?: Array<TruckGrossWeightResponse> | null;
    truckEngineModels?: Array<TruckEngineModelResponse> | null;
    shifters?: Array<EnumValue> | null;
    gearRatios?: Array<EnumValue> | null;
    engineOilTypes?: Array<EnumValue> | null;
    apUnits?: Array<EnumValue> | null;
    ezPass?: Array<TransponderGroup> | null;
    wheelsTypes?: Array<EnumValue> | null;
    brakes?: Array<EnumValue> | null;
    fhwaExp?: number;
    fuelTypes?: Array<EnumValue> | null;
    tags?: Array<TagResponse> | null;
}

