import {
    InspectionResponse,
    RegistrationResponse,
    TitleResponse,
    TrailerResponse,
} from 'appcoretruckassist';

export interface LengthData {
    id: number;
    key: string;
    value: string;
    domain: string;
    entityId: any;
    parentId: any;
    companyId: any;
    createdAt: string;
    protected: number;
    updatedAt: string;
    entityName: any;
}

export interface MakeData {
    file: string;
    name: string;
    color: string;
}

export interface TypeData {
    file: string;
    name: string;
    type: string;
    color: string;
    whiteFile: string;
    class?: string;
}

export interface ReeferUnitData {
    id: number;
    name: string;
}

export interface ColorData {
    id: number;
    key: string;
    value: string;
    domain: string;
}

export interface TrailerLicense {
    id?: string;
    startDate?: string;
    endDate?: string;
    licensePlate?: string;
    attachments?: any;
}

export interface TrailerInspection {
    id?: string;
    startDate?: string;
    endDate?: string;
    attachments?: any;
}

export interface TrailerTitle {
    id?: string;
    titleNumber?: string;
    startDate?: string;
    attachments?: any;
}

export interface TrailerLease {
    id?: string;
    lessor?: any;
    seller?: any;
    date?: any;
    paymentAmount?: any;
    numberOfPayments?: any;
    downPayment?: any;
    attachments?: any;
}

export interface TrailerOwner {
    id: number;
    ownerName: string;
    ownerType: string;
    divisionFlag: number;
}

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
