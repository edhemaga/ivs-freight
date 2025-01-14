import type {
    InspectionResponse,
    RegistrationResponse,
    TitleResponse,
} from 'appcoretruckassist';

export interface TrailerDetailsConfig {
    id: number;
    name: string;
    template: string;
    data: any;
    status: boolean;
    length?: number;
    voidedOn?: string | null;
    expDate?: string;
    registrations?: RegistrationResponse[];
    inspections?: InspectionResponse[];
    titles?: TitleResponse[];
    businessOpen?: boolean;
}
