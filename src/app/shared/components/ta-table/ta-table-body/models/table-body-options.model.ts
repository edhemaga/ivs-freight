import { TableBodyOptionActions } from '@shared/components/ta-table/ta-table-body/models/table-body-option-actions.model';
import { TableBodyOptionsConfig } from '@shared/components/ta-table/ta-table-body/models/table-body-options-config.model';
import { ToolbarActions } from '@shared/components/ta-table/ta-table-toolbar/models/table-toolbar-actions.model';

export interface TableBodyOptions {
    toolbarActions?: ToolbarActions;
    config?: TableBodyOptionsConfig;
    disabledMutedStyle?: null;
    actions?: TableBodyOptionActions[];
}
