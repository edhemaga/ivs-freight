import { AvatarColors } from '../components/shared/model/table-components/driver-modal';
import { TableDropdownComponentConstants } from './constants/table-components.constants';

// Get Avatar Color
export class MAKE_COLORS_FOR_AVATAR {
    static getAvatarColors(mapingIndex): AvatarColors {
        const textColors: string[] =
            TableDropdownComponentConstants.TEXT_COLORS;

        const backgroundColors: string[] =
            TableDropdownComponentConstants.BACKGROUND_COLORS;

        mapingIndex = mapingIndex <= 11 ? mapingIndex : 0;

        return {
            background: backgroundColors[mapingIndex],
            color: textColors[mapingIndex],
        };
    }
}
