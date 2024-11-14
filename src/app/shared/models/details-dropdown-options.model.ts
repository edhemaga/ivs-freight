export interface DetailsDropdownOptions {
    disabledMutedStyle: boolean;
    toolbarActions: {
        hideViewMode: boolean;
    };
    export?: boolean;
    config: {
        showSort: boolean;
        sortBy: string;
        sortDirection: string;
        disabledColumns: number[];
        minWidth: number;
    };
    actions: Action[];
}

interface Action {
    title?: string;
    name?: string;
    svg?: string;
    disabled?: boolean;
    show?: boolean;
    iconName?: string;
    subType?: SubType[];
    activate?: boolean;
    deactivate?: boolean;
    redIcon?: boolean;
    blueIcon?: boolean;
    greenIcon?: boolean;
    type?: string;
    text?: string;
    danger?: boolean;
    subText?: string;
}

interface SubType {
    subName: string;
    actionName: string;
}
