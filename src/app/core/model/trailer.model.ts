import {
    InspectionResponse,
    RegistrationResponse,
    TitleResponse,
    TrailerResponse,
} from 'appcoretruckassist';

export interface TrailerDropdown {
    id: number;
    name: string;
    svg: string;
    folder: string;
    status: number;
    active: boolean;
}

export interface TrailerDetailsConfig {
    id: number;
    name: string;
    template: string;
    data: any;
    status: boolean;
    length?: number;
}

export interface TrailerConfigData extends TrailerResponse {
    registrations?: RegistrationResponse[];
    inspections?: InspectionResponse[];
    titles?: TitleResponse[];
}
