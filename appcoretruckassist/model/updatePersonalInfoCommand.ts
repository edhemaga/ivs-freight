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
import { UpdatePreviousAddressCommand } from './updatePreviousAddressCommand';
import { AddressEntity } from './addressEntity';


export interface UpdatePersonalInfoCommand { 
    applicantId?: number;
    firstName?: string | null;
    lastName?: string | null;
    phone?: string | null;
    doB?: string;
    isAgreed?: boolean;
    address?: AddressEntity;
    ssn?: string | null;
    bankId?: number | null;
    accountNumber?: string | null;
    routingNumber?: string | null;
    usCitizen?: boolean;
    legalWork?: boolean;
    anotherName?: boolean | null;
    anotherNameDescription?: string | null;
    inMilitary?: boolean | null;
    inMilitaryDescription?: string | null;
    felony?: boolean | null;
    felonyDescription?: string | null;
    misdemeanor?: boolean | null;
    misdemeanorDescription?: string | null;
    drunkDriving?: boolean | null;
    drunkDrivingDescription?: string | null;
    previousAddresses?: Array<UpdatePreviousAddressCommand> | null;
}

