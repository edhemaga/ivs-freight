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
import { TruckFuelConsumptionChartResponse } from './truckFuelConsumptionChartResponse';


export interface TruckFuelConsumptionResponse { 
    milesPerGallon?: number | null;
    costPerGallon?: number | null;
    truckFuelConsumptionCharts?: Array<TruckFuelConsumptionChartResponse> | null;
}

