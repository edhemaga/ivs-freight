import { Tabs } from '@shared/models/tabs.model';

export class RepairShopDetailsCardConstants {
    static MAP_LOCATION_COVER_TABS: Tabs[] = [
        {
            id: 1,
            name: 'Location',
            checked: true,
        },

        { id: 2, name: 'Cover Photo', checked: false },
    ];
}
