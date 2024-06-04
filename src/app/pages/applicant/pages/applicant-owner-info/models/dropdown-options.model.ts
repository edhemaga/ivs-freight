import {
    BankResponse,
    ColorResponse,
    TrailerLengthResponse,
    TrailerMakeResponse,
    TrailerTypeResponse,
    TruckMakeResponse,
    TruckTypeResponse,
} from 'appcoretruckassist';

export interface ApplicantDropdownOptions {
    banksDropdownList?: BankResponse[];
    truckType?: TruckTypeResponse[];
    truckMakeType?: TruckMakeResponse[];
    colorType?: ColorResponse[];
    trailerType?: TrailerTypeResponse[];
    trailerMakeType?: TrailerMakeResponse[];
    trailerLengthType?: TrailerLengthResponse[];
}
