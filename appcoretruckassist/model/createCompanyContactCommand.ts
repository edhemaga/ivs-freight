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
import { CreateContactPhoneCommand } from './createContactPhoneCommand';
import { CreateContactEmailCommand } from './createContactEmailCommand';
import { CompanyContactUser } from './companyContactUser';
import { AddressEntity } from './addressEntity';


export interface CreateCompanyContactCommand { 
    name?: string | null;
    address?: AddressEntity;
    note?: string | null;
    shared?: boolean;
    avatar?: string | null;
    companyContactLabelId?: number | null;
    contactPhones?: Array<CreateContactPhoneCommand> | null;
    contactEmails?: Array<CreateContactEmailCommand> | null;
    companyContactUsers?: Array<CompanyContactUser> | null;
    isSharedWithAllDepartments?: boolean;
    companyName?: string | null;
}

