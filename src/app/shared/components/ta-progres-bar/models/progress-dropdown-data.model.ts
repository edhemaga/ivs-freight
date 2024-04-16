import {
    CardDetails,
    PmTrailerProgressData,
    PmTruckProgressData,
} from 'src/app/shared/models/card-models/card-table-data.model';

export interface ProgressDropdownData {
    row: CardDetails;
    column: PmTruckProgressData | PmTrailerProgressData;
}
