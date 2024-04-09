import { FilterData } from './filter-data.model';

export interface PmTrailer {
    textUnit: string;
    textOdometer: string;
    lastService: string;
    repairShop: string;
    color: string;
    svgIcon: string;
    ruMake: string;
    ptoNumber: FilterData;
    reeferUnit: FilterData;
    alignment: FilterData;
    general: FilterData;
}
