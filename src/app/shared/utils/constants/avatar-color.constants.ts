// Enums
import { eAvatarColor } from '@shared/enums';

export class AvatarColorConstants {
    static AVATAR_COLOR_HEX_MAP: Record<eAvatarColor, string> = {
        [eAvatarColor.DARK_BLUE]: '#2724D6',
        [eAvatarColor.LIGHT_BLUE]: '#1AB5E6',
        [eAvatarColor.RED]: '#DF3C3C',
        [eAvatarColor.ORANGE]: '#F89B2E',
        [eAvatarColor.YELLOW]: '#F89B2E',
        [eAvatarColor.GOLD]: '#CF961D',
        [eAvatarColor.DARK_GREEN]: '#259F94',
        [eAvatarColor.LIGHT_GREEN]: '#50AC25',
        [eAvatarColor.PURPLE]: '#9E47EC',
        [eAvatarColor.PINK]: '#DF3D85',
        [eAvatarColor.BROWN]: '#865E3A',
        [eAvatarColor.GRAY]: '#919191',
    };
}
