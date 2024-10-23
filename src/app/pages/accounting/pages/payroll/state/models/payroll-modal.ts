import {
    CreatePayrollCreditCommand,
    DriverMinimalResponse,
    PayrollCreditType,
    TruckMinimalResponse,
} from 'appcoretruckassist';
import { PayrollStringEnum } from '../enums';

export type PayrollModalAction =
    | PayrollStringEnum.EDIT
    | PayrollStringEnum.CREATE;

export interface PayrollModal {
    // Foe edit mode pass value to form
    data: CreatePayrollCreditCommand;
    // Based on type we know which endpoint to call
    type: PayrollModalAction;
    // This will preselect tab when user add payroll from payroll table
    creditType: PayrollCreditType;
    // Selected payroll user from table
    selectedValue: DriverMinimalResponse | TruckMinimalResponse;
}
