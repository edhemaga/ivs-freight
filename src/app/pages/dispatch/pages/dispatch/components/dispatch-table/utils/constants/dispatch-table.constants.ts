import {
    ColumnFields,
    DispatchTableHeaderItems,
} from '@pages/dispatch/pages/dispatch/components/dispatch-table/models';

export class DispatchTableConstants {
    static HEADER_ITEMS: DispatchTableHeaderItems[] = [
        {
            title: "TRUCK",
            sortBy: "truckNumber",
            headerProperty: "truckNumber",
            height: "162px",
            minHeight: "122px",
            maxHeight: "162px",
            width: "162px",
            maxWidth: "302px",
            minWidth: "122px"
        },
        {
            title: "TRAILER",
            sortBy: "trailerNumber",
            headerProperty: "trailerNumber",
            height: "162px",
            minHeight: "122px",
            maxHeight: "162px",
            width: "162px",
            maxWidth: "302px",
            minWidth: "122px"
        },
        {
            title: "DRIVER",
            sortBy: "firstName",
            headerProperty: "firstName",
            height: "302px",
            minHeight: "242px",
            maxHeight: "302px",
            width: "302px",
            maxWidth: "302px",
            minWidth: "242px"
        },
        {
            title: "INSPECTION",
            icon: "assets/svg/common/ic_pm-filled.svg",
            headerProperty: "inspection",
            height: "auto"
        }, 
        {
            title: "LAST LOCATION",
            headerProperty: "city",
            height: "auto",
            width: "162px",
            maxWidth: "302px",
            minWidth: "162px"
        },
        {
            title: "STATUS",
            headerProperty: "status",
            height: "auto",
            width: "142px",
            maxWidth: "202px",
            minWidth: "142px"
        },
        {
            title: "PICKUP",
            secondTitle: "DELIVERY",
            icon: "assets/svg/common/ic_pickup.svg",
            secondIcon: "assets/svg/common/ic_delivery.svg",
            headerProperty: "pickup_delivery",
            height: "auto",
            width: "342px",
            maxWidth: "422px",
            minWidth: "342px"
        },
        {
            title: "PROGRESS",
            headerProperty: "progress",
            height: "auto",
            width: "228px",
            maxWidth: "328px",
            minWidth: "228px"
        },
        {
            title: "PARKING",
            sortBy: "slotNumber",
            headerProperty: "slotNumber",
            height: "auto",
            width: "102px",
            maxWidth: "102px",
            minWidth: "102px"
        },
        {
            title: "DISPATCHER",
            icon: "assets/svg/common/ic_user.svg",
            headerProperty: "dispatcher",
            height: "auto"
        },
        {
            title: "NOTE",
            icon: "assets/svg/truckassist-table/note/Note-hover.svg",
            headerProperty: "note",
            height: "auto"
        }
    ];
    

    static COLUMN_FIELDS: ColumnFields[] = [
        { className: 'truck-field', key: 'truckWidth' },
        { className: 'trailer-field', key: 'trailerWidth' },
        { className: 'driver-field', key: 'driverWidth' },
        { className: 'location-field', key: 'locationWidth' },
        { className: 'parking-field', key: 'parkingWidth' },
    ];
}
