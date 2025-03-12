// models
import { IDropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/interfaces';
import { AvatarColors } from '@shared/models';

export interface IContactsViewModelData {
    isSelected?: boolean;
    email?: string | null;
    emailSecond?: string | null;
    phone?: string | null;
    phoneSecond?: string | null;
    phoneThird?: string | null;
    company?: string | null;
    textAddress?: string | null;
    textShortName?: string | null;
    avatarColor?: AvatarColors;
    avatarImg?: string | null;
    isShared?: boolean;
    lable?: {
        name?: string | null;
        color?: string | null;
    } | null;
    added?: string | null;
    edited?: string | null;
    tableDropdownContent?: IDropdownMenuItem[];
}
