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
import { RepairType } from './repairType';
import { RepairUnitType } from './repairUnitType';
import { RepairItemCommand } from './repairItemCommand';
import { RepairServiceTypeCommand } from './repairServiceTypeCommand';
import { CreateTagCommand } from './createTagCommand';


export interface ApiRepairPostRequest { 
    Id?: number;
    RepairType?: RepairType;
    UnitType?: RepairUnitType;
    TruckId?: number;
    TrailerId?: number;
    Odometer?: number;
    Date?: string;
    Invoice?: string;
    OrderNumber?: string;
    RepairShopId?: number;
    Total?: number;
    ServiceTypes?: Array<RepairServiceTypeCommand>;
    Note?: string;
    Items?: Array<RepairItemCommand>;
    Files?: Array<Blob>;
    Tags?: Array<CreateTagCommand>;
    FilesForDeleteIds?: Array<number>;
    ShopServiceType?: number;
    PayType?: number;
    DatePaid?: string;
    FinishOrder?: boolean;
}

