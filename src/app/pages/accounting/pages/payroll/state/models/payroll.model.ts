import {
    PayrollCountsResponse,
    PayrollDriverMileageListResponse,
} from 'appcoretruckassist';

export interface PayrollState {
    payrollCounts: PayrollCountsResponse;
    payrollDriverMileage: PayrollDriverMileageListResponse;
    loading: boolean;
}

export interface IPayrollCountsSelector {
    payrollCounts: PayrollCountsResponse;
    payrolls: string[];
}
