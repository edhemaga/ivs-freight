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
import { AddressEntity } from './addressEntity';


export interface DriverDetailsOwnerResponse { 
    id?: number | null;
    type?: string | null;
    name?: string | null;
    ssnEin?: string | null;
    address?: AddressEntity;
    email?: string | null;
    phone?: string | null;
}

