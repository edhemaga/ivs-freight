import {
    CdlResponse,
    DriverResponse,
    MedicalResponse,
    MvrResponse,
    TestResponse,
} from 'appcoretruckassist';

export interface DriverDetailsConfig {
    id?: number;
    name?: string;
    template?: string;
    req?: boolean;
    status?: boolean;
    hasDanger?: boolean;
    length?: number;
    data?:
        | DriverResponse
        | CdlResponse
        | TestResponse
        | MedicalResponse
        | MvrResponse;
}
