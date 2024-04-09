import { DropdownItem } from 'src/app/shared/models/card-models/card-table-data.model';
import { TraillerData } from './trailer-data.model';

export interface TrailerMapped extends TraillerData {
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
