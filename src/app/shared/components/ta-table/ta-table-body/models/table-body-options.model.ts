import { TableBodyOptionActions } from './table-body-option-actions.model';
import { TableBodyOptionsConfig } from './table-body-options-config.model';
import { ToolbarActions } from '../../ta-table-toolbar/models/table-toolbar-actions.model';

export interface TableBodyOptions {
    toolbarActions?: ToolbarActions;
    config?: TableBodyOptionsConfig;
    disabledMutedStyle?: null;
    actions?: TableBodyOptionActions[];
}
