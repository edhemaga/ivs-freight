import { AvatarColors } from '../components/shared/model/table-components/driver-modal';
import { TableDriverColorsConstants } from './constants/table-components.constants';

// Get Avatar Color
export class MAKE_COLORS_FOR_AVATAR {
    static getAvatarColors(mapingIndex): AvatarColors {
        const textColors: string[] = TableDriverColorsConstants.TEXT_COLORS;

        const backgroundColors: string[] =
            TableDriverColorsConstants.BACKGROUND_COLORS;

        mapingIndex = mapingIndex <= 11 ? mapingIndex : 0;

        return {
            background: backgroundColors[mapingIndex],
            color: textColors[mapingIndex],
        };
    }
}
