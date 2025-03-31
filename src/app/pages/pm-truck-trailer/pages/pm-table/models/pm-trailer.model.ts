// models
import { TrailerShortResponse } from 'appcoretruckassist';
import { PmTrailerProgressData } from '@shared/models/card-models/card-table-data.model';
import { IDropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/interfaces';

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
    tableDropdownContent: IDropdownMenuItem[];
    trailer: TrailerShortResponse;
    pmId: number;
}
