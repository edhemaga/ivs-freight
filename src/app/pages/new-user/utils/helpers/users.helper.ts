// Interface
import { IMappedUser } from '@pages/new-user/interfaces';
import { ITableData } from '@shared/models';

// Models
import {
    CompanyUserListItemResponse,
    CompanyUserListResponse,
} from 'appcoretruckassist';

export class UsersHelper {
    static updateTabsCount(
        payload: CompanyUserListResponse,
        toolbarTabs: ITableData[]
    ): ITableData[] {
        return [
            { ...toolbarTabs[0], length: payload.activeCount },
            {
                ...toolbarTabs[1],
                length: payload.inactiveCount,
            },
        ];
    }

    static usersMapper(users: CompanyUserListItemResponse[]): IMappedUser[] {
        return users.map((user) => {
            const { firstName, lastName, avatar, id } = user;

            const mapped: IMappedUser = {
                id,
                isSelected: false,
                fullName: `${firstName} ${lastName}`,
                avatar,
            };

            return mapped;
        });
    }
}
