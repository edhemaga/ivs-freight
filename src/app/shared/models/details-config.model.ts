import {
    CdlResponse,
    DriverResponse,
    MedicalResponse,
    MvrResponse,
    TestResponse,
} from 'appcoretruckassist';

export interface DetailsConfig {
    id?: number;
    name?: string;
    template?: string;
    req?: boolean;
    status?: boolean;
    statusType?: string;
    hasDanger?: boolean;
    length?: number;
    hide?: boolean;
    hasArrow?: boolean;
    capsulaText?: boolean | string;
    isMapBtn?: boolean;
    isMapDisplayed?: boolean;
    hasMultipleDetailsSelectDropdown?: boolean;
    data?:
        | DriverResponse
        | CdlResponse
        | TestResponse
        | MedicalResponse
        | MvrResponse;
}
