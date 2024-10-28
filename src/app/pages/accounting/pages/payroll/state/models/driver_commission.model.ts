import { DriverShortResponse } from 'appcoretruckassist';

export type IDriverCommissionList = IDriverCommissionResponse[];

export interface IDriverCommissionResponse {
    id: number;
    driver?: DriverShortResponse;
    driverUserId: number;
    payrollNumber: string;
    periodStart: string;
    periodEnd: string;
    closedDate: any;
    payrollDeadLine: PayrollDeadLine;
    status: Status;
    loadsCount: number;
    mileage: number;
    revenue: number;
    commission: number;
    salary: number;
    credit: number;
    deduction: number;
    total: number;
}

export interface PayrollDeadLine {
    numberOfDays: number;
    period: string;
}

export interface Status {
    name: string;
    id: number;
}
