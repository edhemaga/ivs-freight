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


export interface ApiTitlePostRequest { 
    Id?: number;
    Number?: string;
    Note?: string;
    StateId?: number;
    PurchaseDate?: string;
    IssueDate?: string;
    Files?: Array<Blob>;
    FilesForDeleteIds?: Array<number>;
}

