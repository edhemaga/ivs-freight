import { ToolbarActions } from '@shared/components/ta-table/ta-table-toolbar/models/table-toolbar-actions.model';

export interface TableBodyOptionActions {
    toolbarActions: ToolbarActions;
    actions: any;
    title?: string;
    name?: string;
    show?: boolean;
    type?: string;
    text?: string;
    class?: string;
    contentType?: string;
    svg?: string;
    iconName?: string;
    danger?: boolean;
    redIcon?: boolean;
}
