import { Tabs } from '@shared/models';

export class CommentTabHelper {
    public static getCommentTabs = (): Tabs[] => [
        {
            id: 1,
            name: 'General',
            checked: true,
        },
        {
            id: 2,
            name: 'Driver',
            checked: false,
        },
    ];
}
