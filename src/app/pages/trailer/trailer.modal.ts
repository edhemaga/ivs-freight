import { TrailerResponse } from 'appcoretruckassist';
import { ConstantStringTableComponentsEnum } from 'src/app/core/utils/enums/table-components.enum';
import { DropdownItem } from '../dashboard/state/models/dropdown-item.model';

export interface BodyResponseTrailer {
    data?: TrailerResponse;
    id?: number;
    type?: ConstantStringTableComponentsEnum;
}

export interface backFilterQueryInterface {
    active: number;
    pageIndex: number;
    pageSize: number;
    companyId: number;
    sort: string;
    searchOne: string;
    searchTwo: string;
    searchThree: string;
}
export interface TraillerData {
    axles: string;

    color: {
        id: number;
        companyId: number;
        name: string;
        code: string;
    };

    companyOwned: boolean;
    createdAt: string;

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

export interface MappedTrailer extends TraillerData {
    isSelected: boolean;
    tableTrailerTypeIcon: string;
    tableVin: {
        regularText: string;
        boldText: string;
    };
    tableTrailerName: string;
    tableTrailerColor: string;
    tableTrailerTypeClass: string;
    tableMake: string;
    tableModel: string;
    tableColor: string;
    colorName: string;
    tabelLength: string;
    tableDriver: string;
    tableTruck: string;
    tableTruckType: string;
    tableOwner: string;
    tableWeightEmpty: string;
    tableWeightVolume: string;
    tableAxle: string;
    tableSuspension: string;
    tableTireSize: string;
    tableReeferUnit: string;
    tableDoorType: string;
    tableInsPolicy: string;
    tableMileage: string;
    tableLicencePlateDetailNumber: string;
    tableLicencePlateDetailST: string;
    tableLicencePlateDetailExpiration: {
        expirationDays: number | null;
        expirationDaysText: string | null;
        percentage: number | null;
    };
    tableFHWAInspectionTerm: string;
    tableFHWAInspectionExpiration: {
        expirationDays: number | null;
        expirationDaysText: string | null;
        percentage: number | null;
    };
    tableTitleNumber: string;
    tableTitleST: string;
    tableTitlePurchase: string;
    tableTitleIssued: string;
    tablePurchaseDate: string;
    tablePurchasePrice: string;
    tableTerminated: string;
    tableAdded: string;
    tableEdited: string;
    tableAttachments: number | undefined[];
    fileCount: number | undefined;
    tableDropdownContent: {
        hasContent: boolean;
        content: DropdownItem[];
    };
}
