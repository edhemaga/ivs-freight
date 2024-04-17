import { EnumValue } from "appcoretruckassist";

export interface PMTableData {
    id?: number;
    isChecked?: boolean;
    svg?: string;
    title?: string;
    mileage?: string;
    defaultMileage?: string;
    status?: EnumValue;
}