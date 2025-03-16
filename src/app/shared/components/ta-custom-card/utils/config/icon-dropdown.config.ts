import {
    ePlacement,
    IIconDropdownConfig,
    IIconDropdownItem,
} from 'ca-components';
// Constants
import { AvatarColorConstants } from '@shared/utils/constants/avatar-color.constants';

export class IconDropdownConfig {
    private static dropdownItems: IIconDropdownItem[] = Object.entries(
        AvatarColorConstants.AVATAR_COLOR_HEX_MAP
    ).map(([key, value]) => ({
        label: key,
        value: value,
    }));

    static ICON_DROPDOWN_CONFIG: IIconDropdownConfig = {
        icon: 'assets/svg/common/colors/ic_color.svg',
        iconColor: '#919191',
        iconBackgroundColor: 'transparent',
        iconHoverColor: '#424242',
        iconHoverBackgroundColor: '#EEEEEE',
        iconActiveColor: '#DADADA',
        iconActiveBackgroundColor: '#2f2f2f',
        dropdownWidth: '140',
        dropdownItems: this.dropdownItems,
        tooltipLabel: 'Color',
        placement: [ePlacement.BOTTOM_RIGHT],
    };
}
