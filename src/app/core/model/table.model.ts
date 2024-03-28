export interface TableOptions {
    disabledMutedStyle: boolean;
    toolbarActions: ToolbarActions;
    config: Config;
    actions: Action[];
    export: boolean;
}

export interface ToolbarActions {
    action: import('c:/Users/Korisnik/Documents/carrierassist/carriera-fe/src/app/core/utils/enums/table-components.enum').ConstantStringTableComponentsEnum;
    tabData: any;
    mode: string;
    hideViewMode: boolean;
}

export interface Config {
    showSort: boolean;
    sortBy: string;
    sortDirection: string;
    disabledColumns: number[];
    minWidth: number;
}

export interface Action {
    title: string;
    name?: string;
    class?: string;
    contentType?: string;
    type?: string;
    text?: string;
    svg?: string;
    iconName?: string;
    show?: boolean;
    redIcon?: boolean;
    blueIcon?: boolean;
    danger?: boolean;
    disabled?: boolean;
    activate?: boolean;
    deactivate?: boolean;
    subType?: ActionSubType[];
}

export interface ActionSubType {
    subName: string;
    actionName: string;
}
