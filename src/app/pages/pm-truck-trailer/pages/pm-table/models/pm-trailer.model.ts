import { TrailerShortResponse } from 'appcoretruckassist';
import {
    DropdownItem,
    PmTrailerProgressData,
} from '@shared/models/card-models/card-table-data.model';

export interface PmTrailer {
    textUnit: string;
    textOdometer?: string;
    lastService?: string;
    textRepairShop?: string;
    textRepairShopAddress?: string;
    textMake?: string;
    textModel?: string;
    textYear?: number;
    alignment?: PmTrailerProgressData;
    general?: PmTrailerProgressData;
    ptoPump?: PmTrailerProgressData;
    reeferUnit?: PmTrailerProgressData;
    tableTrailerTypeIcon: string;
    tableTrailerName: string;
    tableTrailerColor: string;
    tableTrailerTypeClass: string;
    note?: string;
    tableDropdownContent: {
        hasContent: boolean;
        content: DropdownItem[];
    };
    trailer: TrailerShortResponse;
    pmId: number;
}
