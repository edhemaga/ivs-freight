// Interface
import { IMappedUser } from '@pages/new-user/interfaces';

// Models
import { CompanyUserListItemResponse } from 'appcoretruckassist';

export class UsersHelper {
    static usersMapper(users: CompanyUserListItemResponse[]): IMappedUser[] {
        return users.map((user) => user);
    }
}
