import {
    PayrollCountsResponse,
    PayrollDriverMileageListResponse,
    PayrollDriverMileageResponse,
} from 'appcoretruckassist';

export interface PayrollState {
    payrollCounts: PayrollCountsResponse;
    payrollDriverMileage: PayrollDriverMileageListResponse[];
    payrollOpenedReport: PayrollDriverMileageResponse[];
    loading: boolean;
}

export interface IPayrollCountsSelector {
    payrollCounts: PayrollCountsResponse;
    payrolls: string[];
}
