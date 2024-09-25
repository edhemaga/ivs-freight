import {
    ColumnFields,
    DispatchTableHeaderItems,
} from '@pages/dispatch/pages/dispatch/components/dispatch-table/models';

export class DispatchTableConstants {
    static HEADER_ITEMS: DispatchTableHeaderItems[] = [
        { title: 'TRUCK', sortBy: 'truckNumber' },
        { title: 'TRAILER', sortBy: 'trailerNumber' },
        { title: 'DRIVER', sortBy: 'firstName' },
        {
            title: 'INSPECTION',
            icon: 'assets/svg/common/ic_pm-filled.svg',
        },
        { title: 'LAST LOCATION', sortBy: 'city' },
        { title: 'STATUS' },
        {
            title: 'PICKUP',
            secondTitle: 'DELIVERY',
            icon: 'assets/svg/common/ic_pickup.svg',
            secondIcon: 'assets/svg/common/ic_delivery.svg',
        },
        { title: 'PROGRESS' },
        { title: 'PARKING', sortBy: 'slotNumber' },
        { title: 'DISPATCHER', icon: 'assets/svg/common/ic_user.svg' },
        {
            title: 'NOTE',
            icon: 'assets/svg/truckassist-table/note/Note-hover.svg',
        },
    ];

    static COLUMN_FIELDS: ColumnFields[] = [
        { className: 'truck-field', key: 'truckWidth' },
        { className: 'trailer-field', key: 'trailerWidth' },
        { className: 'driver-field', key: 'driverWidth' },
        { className: 'location-field', key: 'locationWidth' },
    ];
}
