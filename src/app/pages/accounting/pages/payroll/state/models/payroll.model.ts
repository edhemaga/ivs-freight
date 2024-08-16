import { PayrollCountsResponse } from "appcoretruckassist";

export interface PayrollState{
    payrollCounts: PayrollCountsResponse,
    loading: boolean
}