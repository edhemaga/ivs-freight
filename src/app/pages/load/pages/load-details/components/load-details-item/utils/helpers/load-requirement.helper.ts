export class LoadRequirementHelper {
    static getLoadRequirementHeaderItems(): {
        label: string;
        className: string;
    }[] {
        return [
            {
                label: 'TRUCK',
                className:
                    'load-requirement-header text-color-muted ta-font-bold',
            },
            {
                label: 'TRAILER',
                className:
                    'load-requirement-header text-color-muted ta-font-bold',
            },
            {
                label: 'LENGTH',
                className:
                    'load-requirement-header text-color-muted ta-font-bold',
            },
            {
                label: 'DOOR',
                className:
                    'load-requirement-header text-color-muted ta-font-bold',
            },
            {
                label: 'SUSPENSION',
                className:
                    'load-requirement-header text-color-muted ta-font-bold',
            },
            {
                label: 'YEAR',
                className:
                    'load-requirement-header text-color-muted ta-font-bold',
            },
            {
                label: 'LG',
                className:
                    'load-requirement-header text-color-muted ta-font-bold text-right',
            },
        ];
    }
}
