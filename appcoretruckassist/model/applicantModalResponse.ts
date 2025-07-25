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
import { CdlEndorsementResponse } from './cdlEndorsementResponse';
import { TrailerLengthResponse } from './trailerLengthResponse';
import { TrailerTypeResponse } from './trailerTypeResponse';
import { BankResponse } from './bankResponse';
import { TruckMakeResponse } from './truckMakeResponse';
import { CdlRestrictionResponse } from './cdlRestrictionResponse';
import { EnumValue } from './enumValue';
import { TrailerMakeResponse } from './trailerMakeResponse';
import { StateResponse } from './stateResponse';
import { ColorResponse } from './colorResponse';
import { TruckTypeResponse } from './truckTypeResponse';


export interface ApplicantModalResponse { 
    endorsements?: Array<CdlEndorsementResponse> | null;
    restrictions?: Array<CdlRestrictionResponse> | null;
    usStates?: Array<StateResponse> | null;
    canadaStates?: Array<StateResponse> | null;
    banks?: Array<BankResponse> | null;
    classTypes?: Array<EnumValue> | null;
    countryTypes?: Array<EnumValue> | null;
    reasonsForLeave?: Array<EnumValue> | null;
    sphReceivedBy?: Array<EnumValue> | null;
    truckTypes?: Array<TruckTypeResponse> | null;
    truckLengths?: Array<EnumValue> | null;
    truckMakes?: Array<TruckMakeResponse> | null;
    trailerTypes?: Array<TrailerTypeResponse> | null;
    trailerMakes?: Array<TrailerMakeResponse> | null;
    trailerLenghts?: Array<TrailerLengthResponse> | null;
    colors?: Array<ColorResponse> | null;
}

