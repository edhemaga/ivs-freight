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
import { CreateFuelItemCommand } from './createFuelItemCommand';


export interface ApiFuelTransactionPostRequest1 { 
    Invoice?: string;
    DriverId?: number;
    TruckId?: number;
    TrailerId?: number;
    FuelStopStoreId?: number;
    PayrollOwnerId?: number;
    TransactionDate?: string;
    Total?: number;
    PaidWith?: number;
    FuelItems?: Array<CreateFuelItemCommand>;
    Files?: Array<Blob>;
}

