import {
    PayrollCountsResponse,
    PayrollDriverMileageListResponse
} from 'appcoretruckassist';
import { PayrollDriverMileageResponse } from 'appcoretruckassist/model/payrollDriverMileageResponse';

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
