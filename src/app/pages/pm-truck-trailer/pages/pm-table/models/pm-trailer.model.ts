import { DropdownItem, PmTrailerProgressData } from 'src/app/shared/models/card-models/card-table-data.model';

export interface PmTrailer {
    textUnit: string;
    textOdometer: string;
    lastService: string;
    repairShop: string;
    ruMake: string;
    alignment?: PmTrailerProgressData;
    general?: PmTrailerProgressData;
    ptoPump?: PmTrailerProgressData;
    reeferUnit?: PmTrailerProgressData;
    tableTrailerTypeIcon: string;
    tableTrailerName: string;
    tableTrailerColor: string;
    tableTrailerTypeClass: string;
    additionalData: any;
    tableDropdownContent: {
        hasContent: boolean;
        content: DropdownItem[];
    };
}
