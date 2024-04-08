import { FilterData } from 'src/app/pages/pm-truck-trailer/pages/pm-table/models/filter-data.model';

export interface PmTruck {
    textUnit: string;
    textOdometer: string;
    oilFilter: FilterData;
    airFilter: FilterData;
    transFluid: FilterData;
    belts: FilterData;
    textInv: string;
    textLastShop: string;
    lastService: string;
    repairShop: string;
    ruMake: string;
}
