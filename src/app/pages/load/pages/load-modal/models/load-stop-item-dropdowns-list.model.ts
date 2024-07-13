import { EnumValue, HazardousMaterialResponse } from 'appcoretruckassist';

export interface LoadStopItemDropdownLists {
    quantityDropdownList: EnumValue[];
    stackDropdownList: EnumValue[];
    secureDropdownList: EnumValue[];
    tarpDropdownList: EnumValue[];
    hazardousDropdownList: HazardousMaterialResponse[];
}
