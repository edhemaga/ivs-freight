import {
    CardDetails,
    PmTrailerProgressData,
    PmTruckProgressData,
} from '@shared/models/card-models/card-table-data.model';

export interface ProgressDropdownData {
    row: CardDetails;
    column: PmTruckProgressData | PmTrailerProgressData;
}
