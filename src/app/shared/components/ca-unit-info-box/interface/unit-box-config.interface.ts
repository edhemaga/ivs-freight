import { eSharedString } from '@shared/enums';

export interface IUnitInfoBoxConfig {
    id: string;
    label: string;
    isUnitAssigned: boolean;
    type: eSharedString;
    iconPath?: string;
    isSvgIcon?: boolean;
    isImage?: boolean;
    imagePath?: string;
}
