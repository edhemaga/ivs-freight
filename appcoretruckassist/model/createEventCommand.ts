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
import { EventType } from './eventType';


export interface CreateEventCommand { 
    eventTitle?: string | null;
    startDate?: string;
    endDate?: string;
    eventType?: EventType;
    description?: string | null;
    allDay?: boolean;
    weekendDays?: boolean;
    repeat?: boolean;
    rrule?: string | null;
}

