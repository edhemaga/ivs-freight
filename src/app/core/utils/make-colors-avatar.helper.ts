import { AvatarColors } from '../components/shared/model/table-components/driver-modal';
import { TableDropdownComponentConstants } from '../../shared/utils/constants/table-dropdown-component.constants';

// Get Avatar Color
export class MAKE_COLORS_FOR_AVATAR {
    static getAvatarColors(mapingIndex: number): AvatarColors {
        const textColors: string[] =
            TableDropdownComponentConstants.TEXT_COLORS;

        const backgroundColors: string[] =
            TableDropdownComponentConstants.BACKGROUND_COLORS;

        const randomNumber = Math.floor(Math.random() * 11);

        mapingIndex = mapingIndex <= 11 ? mapingIndex : randomNumber;

        return {
            background: backgroundColors[mapingIndex],
            color: textColors[mapingIndex],
        };
    }
}
