export interface DriverDropdowns {
    id: number;
    name: string;
    status: number;
    svg: string;
    folder: string;
    active: boolean;
}

export interface DriverDateInfo {
    startDate: moment.MomentInput;
    endDate: moment.MomentInput;
}
