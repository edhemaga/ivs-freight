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
import { DriverDto } from './driverDto';


export interface DriverDtoPagination { 
    pageIndex?: number;
    pageSize?: number;
    count?: number;
    data?: Array<DriverDto> | null;
}

