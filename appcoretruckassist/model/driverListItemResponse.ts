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
import { DriverListNotificationResponse } from './driverListNotificationResponse';
import { DriverListEmergencyContactResponse } from './driverListEmergencyContactResponse';
import { EnumValue } from './enumValue';
import { DriverListOffDutyLocationResponse } from './driverListOffDutyLocationResponse';
import { DriverListFuelCardResponse } from './driverListFuelCardResponse';
import { FileResponse } from './fileResponse';
import { DriverListMedicalResponse } from './driverListMedicalResponse';
import { DriverListOwnerResponse } from './driverListOwnerResponse';
import { DriverListMvrResponse } from './driverListMvrResponse';
import { DriverListBankResponse } from './driverListBankResponse';
import { DriverListPayrollResponse } from './driverListPayrollResponse';
import { DriverListTestResponse } from './driverListTestResponse';
import { DriverListCdlResponse } from './driverListCdlResponse';
import { AddressEntity } from './addressEntity';


export interface DriverListItemResponse { 
    id?: number;
    name?: string | null;
    status?: number;
    avatarFile?: FileResponse;
    colorFlag?: EnumValue;
    note?: string | null;
    fileCount?: number | null;
    dateOfBirth?: string | null;
    ssn?: string | null;
    phone?: string | null;
    email?: string | null;
    fleetType?: EnumValue;
    address?: AddressEntity;
    owner?: DriverListOwnerResponse;
    driverType?: EnumValue;
    payType?: EnumValue;
    solo?: DriverListPayrollResponse;
    team?: DriverListPayrollResponse;
    bank?: DriverListBankResponse;
    offDutyLocations?: Array<DriverListOffDutyLocationResponse> | null;
    emergencyContact?: DriverListEmergencyContactResponse;
    twicExpirationDate?: string | null;
    fuelCards?: Array<DriverListFuelCardResponse> | null;
    cdl?: DriverListCdlResponse;
    test?: DriverListTestResponse;
    medical?: DriverListMedicalResponse;
    mvr?: DriverListMvrResponse;
    general?: DriverListNotificationResponse;
    payroll?: DriverListNotificationResponse;
    truck?: string | null;
    truckType?: string | null;
    trailer?: string | null;
    trailerType?: string | null;
    hiredAt?: string | null;
    terminatedAt?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

