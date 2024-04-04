import { AvatarColors } from '../../../core/components/shared/model/table-components/driver-modal';

// constants
import { TableDropdownComponentConstants } from '../constants/table-dropdown-component.constants';

export class AvatarColorsHelper {
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
