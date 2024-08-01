export class DispatchTableConstants {
    static HEADER_ITEMS: { title?: string; icon?: string }[] = [
        { title: 'TRUCK' },
        { title: 'TRAILER' },
        { title: 'DRIVER' },
        {
            title: 'PRE-TRIP-INSPECTION',
            icon: 'assets/svg/common/ic_pm-filled.svg',
        },
        { title: 'LAST LOCATION' },
        { title: 'STATUS' },
        { title: 'PICKUP' },
        { title: 'DELIVERY' },
        { title: 'PROGRESS' },
        { title: 'PARKING' },
        { title: 'DISPATCHER', icon: 'assets/svg/common/ic_user.svg' },
        {
            title: 'NOTE',
            icon: 'assets/svg/truckassist-table/note/Note-hover.svg',
        },
    ];

    static DISPATCH_HISTORY_GROUP_HEADER_ITEMS: string[] = [
        'STATUS',
        'START',
        'END',
        'TOTAL',
    ];

    static IS_INPUT_HOVER_ROW_DISPATCH: boolean[] = [
        false,
        false,
        false,
        false,
    ];
}
