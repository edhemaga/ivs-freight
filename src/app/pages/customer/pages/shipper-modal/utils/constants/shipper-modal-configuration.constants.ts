
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
    ]

    static shipperTabs() : Tabs[]   {
        return  [
            {
                id: 1,
                name: ShipperModalString.DETAILS,
                checked: true,
            },
            {
                id: 2,
                name: ShipperModalString.CONTACT,
                checked: false,
            },
        ]
    }
    
}
