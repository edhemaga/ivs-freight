import {
    CreatePayrollCreditCommand,
    DriverMinimalResponse,
    PayrollCreditResponse,
    PayrollCreditType,
    TruckMinimalResponse,
} from 'appcoretruckassist';
import { PayrollStringEnum } from '../enums';

export type PayrollModalAction =
    | PayrollStringEnum.EDIT
    | PayrollStringEnum.CREATE;

export type PayrollModalType =
    | PayrollStringEnum.MODAL_DEDUCTION
    | PayrollStringEnum.MODAL_BONUS;

export interface PayrollModal {
    editCredit: PayrollCreditResponse;
    // When creating new credit for selected truck or driver
    data: CreatePayrollCreditCommand;
    // Based on type we know which endpoint to call
    type: PayrollModalAction;
    // This will preselect tab when user add payroll from payroll table
    creditType: PayrollCreditType;
    // Selected payroll user from table
    selectedValue: DriverMinimalResponse | TruckMinimalResponse;
    isShortModal?: boolean;
}