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
import { TrailerShortResponse } from './trailerShortResponse';
import { RepairShopPMResponse } from './repairShopPMResponse';
import { PMTrailerResponse } from './pMTrailerResponse';


export interface PMTrailerUnitResponse { 
    id?: number;
    trailer?: TrailerShortResponse;
    odometer?: number | null;
    pMs?: Array<PMTrailerResponse> | null;
    invoice?: string | null;
    lastShop?: RepairShopPMResponse;
    lastService?: string | null;
    note?: string | null;
}

