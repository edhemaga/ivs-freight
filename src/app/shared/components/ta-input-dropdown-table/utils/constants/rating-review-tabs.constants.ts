import { Tabs } from '@shared/models/tabs.model';

export class RatingReviewTabsConstants {
    static TABS: Tabs[] = [
        {
            id: 1,
            name: 'ALL',
            checked: true,
        },
        {
            id: 2,
            name: 'RATING',
            checked: false,
        },
        {
            id: 3,
            name: 'REVIEW',
            checked: false,
        },
    ];
}
