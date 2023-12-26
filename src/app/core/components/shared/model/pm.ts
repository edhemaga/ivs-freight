export interface Truck {
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

interface FilterData {
    expirationDays: number;
    expirationDaysText: string;
    percentage: number;
}

export interface Trailer {
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
