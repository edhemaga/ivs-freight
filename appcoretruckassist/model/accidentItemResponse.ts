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
import { AccidentItemReviewResponse } from './accidentItemReviewResponse';
import { TruckTypeResponse } from './truckTypeResponse';
import { AddressEntity } from './addressEntity';


export interface AccidentItemResponse { 
    id?: number;
    location?: AddressEntity;
    date?: string;
    fatalities?: number;
    injuries?: number;
    collisions?: number | null;
    hazmatSpill?: boolean;
    vehicleType?: TruckTypeResponse;
    description?: string | null;
    accidentItemReview?: AccidentItemReviewResponse;
}

