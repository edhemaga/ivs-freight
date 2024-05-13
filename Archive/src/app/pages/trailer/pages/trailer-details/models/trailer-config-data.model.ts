import {
    InspectionResponse,
    RegistrationResponse,
    TitleResponse,
    TrailerResponse,
} from 'appcoretruckassist';

export interface TrailerConfigData extends TrailerResponse {
    registrations?: RegistrationResponse[];
    inspections?: InspectionResponse[];
    titles?: TitleResponse[];
}
