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


export interface LiveTrackingHistoryItemResponse { 
    id?: number;
    latitude?: number | null;
    longitude?: number | null;
    motionStatus?: number | null;
    updateTime?: string;
    stopTime?: string | null;
    startTime?: string | null;
    dateString?: string | null;
}

