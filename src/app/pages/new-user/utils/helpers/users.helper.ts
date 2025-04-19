// Interface
import { IMappedUser } from '@pages/new-user/interfaces';
import { eStatusTab } from '@shared/enums';
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

    static updateTabsCountAfterDelete(
        tab: eStatusTab,
        deletedLength: number,
        toolbarTabs: ITableData[]
    ): ITableData[] {
        return toolbarTabs.map((t, i) => {
            if (
                (tab === eStatusTab.ACTIVE && i === 0) ||
                (tab !== eStatusTab.ACTIVE && i === 1)
            ) {
                return {
                    ...t,
                    length: Math.max(0, t.length - deletedLength),
                };
            }
            return t;
        });
    }

    static usersMapper(users: CompanyUserListItemResponse[]): IMappedUser[] {
        return users.map((user) => {
            const { firstName, lastName, avatar, id, department } = user;

            const mapped: IMappedUser = {
                id,
                isSelected: false,
                fullName: `${firstName} ${lastName}`,
                avatar,
                department,
            };

            return mapped;
        });
    }
}
