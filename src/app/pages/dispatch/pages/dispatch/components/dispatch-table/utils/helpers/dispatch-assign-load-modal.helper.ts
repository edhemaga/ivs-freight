export class DispatchAssignLoadModalHelper {
    static getTableHeaderItems(): {
        label: string;
        className: string;
        svgIcon?: string;
        iconClassName?: string;
    }[] {
        return [
            {
                label: '#',
                className: 'dispatch-load-header text-color-muted ta-font-bold',
            },
            {
                label: 'LOAD',
                className: 'dispatch-load-header text-color-muted ta-font-bold',
            },
            {
                label: 'PICKUP',
                className: 'dispatch-load-header text-color-green ta-font-bold',
                svgIcon: '/assets/svg/common/ic_arrow-line-left.svg',
                iconClassName: 'pickup-arrow',
            },
            {
                label: 'DELIVERY',
                className:
                    'dispatch-load-header text-color-red-10 ta-font-bold',
                svgIcon: '/assets/svg/common/ic_arrow-right-line.svg',
                iconClassName: 'pickup-arrow arrow-right',
            },
            {
                label: 'TOTAL',
                className:
                    'dispatch-load-header text-color-muted ta-font-bold text-right',
            },
        ];
    }
}
