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
import { DayOfWeek } from './dayOfWeek';
import { PayPeriod } from './payPeriod';
import { AddressEntity } from './addressEntity';


export interface CreateTerminalCommand { 
    isOwner?: boolean;
    name?: string | null;
    address?: AddressEntity;
    phone?: string | null;
    extensionPhone?: string | null;
    email?: string | null;
    officeChecked?: boolean;
    officePhone?: string | null;
    officeExtPhone?: string | null;
    officeEmail?: string | null;
    parkingChecked?: boolean;
    parkingPhone?: string | null;
    parkingExtPhone?: string | null;
    parkingEmail?: string | null;
    terminalParkingSlot?: string | null;
    terminalFullParkingSlot?: string | null;
    gate?: boolean | null;
    securityCamera?: boolean | null;
    warehouseChecked?: boolean;
    warehousePhone?: string | null;
    warehouseExtPhone?: string | null;
    warehouseEmail?: string | null;
    fuelStationChecked?: boolean;
    rent?: number | null;
    payPeriod?: PayPeriod;
    weeklyDay?: DayOfWeek;
    monthlyDay?: number | null;
    terminalParkingCount?: number | null;
    terminalParkingSlotCount?: number | null;
    fullTerminalParkingSlotCount?: number | null;
}

