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
import { MessageResponse } from './messageResponse';
import { CompanyUserShortResponse } from './companyUserShortResponse';


export interface CompanyUserChatResponse { 
    companyUser?: CompanyUserShortResponse;
    hasUnreadMessage?: boolean;
    isFavourite?: boolean;
    userType?: EnumValue;
    conversationId?: number | null;
    lastMessage?: MessageResponse;
}

