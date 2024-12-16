import {
    DispatchShortResponse,
    StateResponse,
    TitleResponse,
} from 'appcoretruckassist';

export interface TrailerData {
    axles: string;

    color: {
        id: number;
        companyId: number;
        name: string;
        code: string;
    };

    companyOwned: boolean;
    createdAt: string;
    assignedTo?: DispatchShortResponse;
    registrationState?: StateResponse;
    title?: TitleResponse;

    doorType: {
        name: string;
        id: number;
    };

    emptyWeight: number;

    fhwaExp: number;
    fhwaInspection: string;

    fileCount: number;
    id: number;

    inspectionExpirationDays: number;
    inspectionExpirationHours: number;
    inspectionPercentage: number;
    insurancePolicy: string;

    licensePlate: string;
    mileage: number;
    model: string;
    note: number;

    owner: {
        id: number;
        name: string;
    };

    purchaseDate: number;
    purchasePrice: number;
    reeferUnit: {
        name: string;
        id: number;
    };

    registrationExpirationDays: number;
    registrationExpirationHours: number;
    registrationPercentage: number;
    status: number;
    suspension: {
        name: string;
        id: number;
    };

    tireSize: {
        name: string;
    };

    trailerLength: {
        id: number;
        companyId: number;
        name: string;
    };

    trailerMake: {
        id: number;
        companyId: number;
        name: string;
        logoName: string;
    };

    trailerNumber: string;
    trailerType: {
        id: number;
        companyId: number;
        name: string;
        logoName: string;
        hasVolume: boolean;
    };

    updatedAt: string;
    vin: string;
    year: number;
    files: number;

    volume: string;
}
