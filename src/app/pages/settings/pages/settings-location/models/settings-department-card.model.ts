import { CompanyOfficeDepartmentContactResponse } from "appcoretruckassist";

export interface SettingsDepartmentCardModel {
    isCardOpen: boolean;
    cardName: string;
    values: CompanyOfficeDepartmentContactResponse[];
}