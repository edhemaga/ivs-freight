import { Enums } from 'src/app/core/model/enums';
export interface Truck {
    id: number;
    property: number;
    type: Enums;
    make: Make;
    divisionCompany: number;
    owner: Owner;
    inspection: Inspection;
    endDateTimeStamp: number;
    ifta: Ifta;
    note: string;
    status: boolean;
    model: string;
    VIN: string;
    licensePlate: string;
    commission: any;
    companyOwned: boolean;
    tireSize: any;
    engine: any;
    checked: boolean;
    isSelected: boolean;
}

export interface Ifta {
    mileage: number;
    year: number;
    insurancePolicyNumber: string;
    emptyWeight: number;
    axises: string;
    engine: string;
}

export interface Make {
    id: any;
    name: string;
    image: string;
}

export interface Owner {
    id: any;
    name: string;
}

export interface Inspection {
    start: Date;
    end: Date;
}
