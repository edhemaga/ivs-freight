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
import { ShipperResponse } from './shipperResponse';


export interface ShipperResponsePagination { 
    pageIndex?: number;
    pageSize?: number;
    count?: number;
    data?: Array<ShipperResponse> | null;
}

