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
import { PayrollCountItemResponse } from './payrollCountItemResponse';


export interface PayrollCountsResponse { 
    soloMiles?: PayrollCountItemResponse;
    teamMiles?: PayrollCountItemResponse;
    soloCommission?: PayrollCountItemResponse;
    teamCommission?: PayrollCountItemResponse;
    soloFlatRate?: PayrollCountItemResponse;
    teamFlatRate?: PayrollCountItemResponse;
    owner?: PayrollCountItemResponse;
    opentPayrollCount?: number;
    closedPayrollCount?: number;
}

