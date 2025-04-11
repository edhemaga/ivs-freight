// models
import { User } from '@shared/models';

// enums
import { eSharedString } from '@shared/enums';

export class UserHelper {
    public static getUserFromLocalStorage(): User {
        const user: User = JSON.parse(
            localStorage.getItem(eSharedString.USER_LOWERCASE)
        );
        return user;
    }
}
