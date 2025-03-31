// base classes
import { DropdownMenuActionsBase } from '@shared/base-classes';

// services
import { LoadStoreService } from '@pages/load/pages/load-table/services/load-store.service';

// enums
import { eDropdownMenu } from '@shared/enums';
import { eLoadStatusType } from '@pages/load/pages/load-table/enums/index';

// helpers
import { LoadTableHelper } from 'src/app/pages/load/pages/load-table/utils/helpers/load-table.helper';

// models
import { TableCardBodyActions } from '@shared/models';

export abstract class LoadDropdownMenuActionsBase extends DropdownMenuActionsBase {
    // services
    protected abstract loadStoreService: LoadStoreService;

    constructor() {
        super();
    }

    protected handleDropdownMenuActions<T>(
        action: TableCardBodyActions<T>,
        tableType: string,
        selectedTab?: string
    ) {
        const { type } = action;

        switch (type) {
            case eDropdownMenu.EDIT_TYPE:
                this.handleLoadEditAction(action, selectedTab);

                break;
            case eDropdownMenu.CREATE_TEMPLATE_TYPE:
            case eDropdownMenu.CREATE_LOAD_TYPE:
            case eDropdownMenu.CREATE_TEMPLATE_TYPE:
                this.handleCreateLoadOrTemplateAction(action, selectedTab);

                break;
            case eDropdownMenu.DELETE_TYPE:
                this.handleLoadDeleteAction(action, tableType, selectedTab);

                break;
            default:
                // call the parent class method to handle shared cases
                super.handleSharedDropdownMenuActions(action, tableType);

                break;
        }
    }

    private handleLoadEditAction<T>(
        action: TableCardBodyActions<T>,
        selectedTab: string
    ) {
        const { type, id } = action;

        const selectedLoadTab: eLoadStatusType = eLoadStatusType[selectedTab];

        this.loadStoreService.dispatchGetEditLoadOrTemplateModalData(
            id,
            selectedLoadTab,
            type
        );
    }

    private handleCreateLoadOrTemplateAction<T>(
        action: TableCardBodyActions<T>,
        selectedTab: string
    ) {
        const { type, id } = action;

        const selectedLoadTab: eLoadStatusType = eLoadStatusType[selectedTab];

        this.loadStoreService.dispatchGetConvertToLoadOrTemplateModalData(
            id,
            selectedLoadTab,
            type
        );
    }

    private handleLoadDeleteAction<T>(
        action: TableCardBodyActions<T>,
        tableType: string,
        selectedTab: string
    ): void {
        const modalHeaderTitle =
            LoadTableHelper.composeDeleteModalTitle(selectedTab);

        const adjustedAction = {
            ...action,
            template: eDropdownMenu.LOAD,
            subType: selectedTab.toLowerCase(),
            modalHeaderTitle,
        };

        super.handleSharedDropdownMenuActions(adjustedAction, tableType);
    }
}
