import { Tabs } from '@shared/models/tabs.model';
import { ShipperModalString } from '@pages/customer/pages/shipper-modal/enums';

export class ShipperModalConfiguration {
    static physicalAddressTabs: Tabs[] = [
        {
            id: 1,
            name: ShipperModalString.PHYSICAL_ADDRESS,
            checked: true,
        },
        {
            id: 2,
            name: ShipperModalString.COORDINATES,
            checked: false,
        },
    ];

    static TABS: Tabs[] = [
        {
            id: 1,
            name: ShipperModalString.BASIC,
            checked: true,
        },
        {
            id: 2,
            name: ShipperModalString.ADDITIONAL,
            checked: false,
        },
    ];
}
