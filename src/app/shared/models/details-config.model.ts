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
    isMapDisplayed?: boolean;
    data?:
        | DriverResponse
        | CdlResponse
        | TestResponse
        | MedicalResponse
        | MvrResponse;
}
