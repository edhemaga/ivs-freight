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
import { EnumValue } from './enumValue';
import { DriverShortResponse } from './driverShortResponse';
import { PayrollDeadlineShortResponse } from './payrollDeadlineShortResponse';


export interface PayrollDriverMileageListResponse { 
    id?: number;
    driver?: DriverShortResponse;
    payrollNumber?: string | null;
    periodStart?: string;
    periodEnd?: string;
    status?: EnumValue;
    payrollDeadLine?: PayrollDeadlineShortResponse;
    emptyRate?: number | null;
    loadedRate?: number | null;
    perStopRate?: number | null;
    emptyMiles?: number | null;
    loadedMiles?: number | null;
    totalMiles?: number | null;
    extraStops?: number | null;
    emptyPay?: number | null;
    loadedPay?: number | null;
    milePay?: number | null;
    extraStopPay?: number | null;
    bonus?: number | null;
    credit?: number | null;
    deduction?: number | null;
    salary?: number | null;
    earnings?: number | null;
}

