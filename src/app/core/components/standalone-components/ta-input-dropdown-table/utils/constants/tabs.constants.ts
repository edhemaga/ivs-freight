import { Tabs } from 'src/app/core/components/shared/model/modal-tabs';

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
