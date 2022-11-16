export interface ViolationSummary {
    summaryList: SummaryList[];
    violationTypeCountList: ViolationTypeCountList[];
}

interface ViolationTypeCountList {
    typeId: number;
    count: number;
    violationType: string;
}

interface SummaryList {
    count: number;
    code: string;
    description: string;
    typeId: number;
    oos: number;
    sw: number;
    violationList: ViolationList[];
}

interface ViolationList {
    id: number;
    report: string;
    driverId?: any;
    driverFullName: string;
    avatar?: any;
    truckId?: any;
    truckNumber: string;
    trailerId?: any;
    trailerNumber: string;
    eventDateTime: string;
    eventDate?: any;
    eventTime?: any;
    oos: string;
    lvl: string;
    location: string;
    milepost?: any;
}
