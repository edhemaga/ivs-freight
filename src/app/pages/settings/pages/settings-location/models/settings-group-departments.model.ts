import { CompanyOfficeResponse } from "appcoretruckassist";
import { SettingsDepartmentCardModel } from '@pages/settings/pages/settings-location/models';

export interface CompanyOfficeResponseWithGroupedContacts
    extends CompanyOfficeResponse {
    groupedContacts?: Record<string, SettingsDepartmentCardModel>;
}
