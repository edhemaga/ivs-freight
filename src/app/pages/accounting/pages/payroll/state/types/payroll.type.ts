// import { PayrollTypeEnum } from "ca-components/lib/components/ca-period-content/enums";
// TODO: Slaviša
export enum PayrollTypeEnum {
    MILEAGE = "MILEAGE",
    COMMISSION = "COMMISSION",
    FLAT_RATE = "FLAT_RATE",
    OWNER_COMMISSION = "OWNER"
}
export type PayrollType = PayrollTypeEnum.MILEAGE  | PayrollTypeEnum.COMMISSION | PayrollTypeEnum.FLAT_RATE| PayrollTypeEnum.OWNER_COMMISSION;