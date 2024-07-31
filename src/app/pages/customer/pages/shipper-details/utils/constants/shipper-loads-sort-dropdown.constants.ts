import { LoadsSortDropdownModel } from "@pages/customer/models/loads-sort-dropdown.model";

export class ShipperLoadsSortDropdownConstants {
    static SHIPPER_LOADS_SORT_DROPDOWN: LoadsSortDropdownModel[] = [
        {
            id: 1,
            name: 'Load No.',
            sortName: 'loadNumber',
            active: true,
        },
        {
            id: 2,
            name: 'Truck',
            sortName: 'truck',
        },
        {
            id: 3,
            name: 'Trailer',
            sortName: 'trailer',
        },
        {
            id: 4,
            name: 'Driver',
            sortName: 'driver',
        },
        {
            id: 5,
            name: 'Arrive',
            sortName: 'arrive',
        },
        {
            id: 6,
            name: 'Depart',
            sortName: 'depart',
        },
        {
            id: 7,
            name: 'Wait',
            sortName: 'wait',
        },
    ];
}
