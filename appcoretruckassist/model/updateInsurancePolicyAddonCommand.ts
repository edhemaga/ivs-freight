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


export interface UpdateInsurancePolicyAddonCommand { 
    id?: number | null;
    policy?: string | null;
    insurerName?: string | null;
    rating?: number | null;
    isCommercialGeneralLiabillityChecked?: boolean;
    eachOccurrence?: number | null;
    damageToRentedPremises?: number | null;
    personalAndAdvertisingInjury?: number | null;
    medicalExpanses?: number | null;
    generalAggregate?: number | null;
    productsCompOperAggregate?: number | null;
    isAutomobileLiabillityChecked?: boolean;
    bodilyInjuryAccident?: number | null;
    bodilyInjuryPerson?: number | null;
    combinedSingleLimit?: number | null;
    propertyDamage?: number | null;
    isMotorTruckReeferChecked?: boolean;
    isMotorTruckChecked?: boolean;
    singleConveyance?: number | null;
    deductable?: number | null;
    isPhysicalDamageChecked?: boolean;
    comprehensiveAndCollision?: number | null;
    isTrailerInterchangeChecked?: boolean;
    value?: number | null;
}

