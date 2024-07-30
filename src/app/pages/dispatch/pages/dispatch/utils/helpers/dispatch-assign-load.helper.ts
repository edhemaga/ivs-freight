export class DispatchAssignLoadHelper {
    static getTableHeaderItems(): {
        label: string;
        className: string;
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
            },
            {
                label: 'DELIVERY',
                className:
                    'dispatch-load-header text-color-red-10 ta-font-bold',
            },
            {
                label: 'TOTAL',
                className:
                    'dispatch-load-header text-color-muted ta-font-bold text-right',
            },
        ];
    }
}
