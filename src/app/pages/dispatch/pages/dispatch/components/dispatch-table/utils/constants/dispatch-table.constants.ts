export class DispatchTableConstants {
    static HEADER_ITEMS: {
        title?: string;
        secondTitle?: string;
        icon?: string;
        secondIcon?: string;
    }[] = [
        { title: 'TRUCK' },
        { title: 'TRAILER' },
        { title: 'DRIVER' },
        {
            icon: 'assets/svg/common/ic_pm-filled.svg',
        },
        { title: 'LAST LOCATION' },
        { title: 'STATUS' },
        {
            title: 'PICKUP',
            secondTitle: 'DELIVERY',
            icon: 'assets/svg/common/ic_pickup.svg',
            secondIcon: 'assets/svg/common/ic_delivery.svg',
        },
        { title: 'PROGRESS' },
        { title: 'PARKING' },
        { icon: 'assets/svg/common/ic_user.svg' },
        {
            icon: 'assets/svg/truckassist-table/note/Note-hover.svg',
        },
    ];
}
