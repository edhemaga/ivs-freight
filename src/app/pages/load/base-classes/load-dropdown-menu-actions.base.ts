// base classes
import { DropdownMenuActionsBase } from '@shared/base-classes';

// services
import { LoadStoreService } from '@pages/new-load/state/services/load-store.service';

// enums
import { eDropdownMenu } from '@shared/enums';
import { eLoadStatusType } from '@pages/load/pages/load-table/enums/index';

// models
import { TableCardBodyActions } from '@shared/models';
import { LoadResponse } from 'appcoretruckassist';

export abstract class LoadDropdownMenuActionsBase extends DropdownMenuActionsBase {
    // services Not working on old stuff keep as any but it is LoadStoreService
    protected abstract loadStoreService: any;

    constructor() {
        super();
    }

    protected handleDropdownMenuActions<T>(
        action: TableCardBodyActions<T>,
        tableType: string,
        selectedTab?: string,
        load?: LoadResponse,
        isDetailsPage?: boolean
    ) {
        const { type } = action;

        switch (type) {
            case eDropdownMenu.EDIT_TYPE:
                this.handleLoadEditAction(action, selectedTab);

                break;
            case eDropdownMenu.EXPORT_BATCH_TYPE:
                // todo
                break;
            case eDropdownMenu.CREATE_TEMPLATE_TYPE:
            case eDropdownMenu.CREATE_LOAD_TYPE:
            case eDropdownMenu.CREATE_TEMPLATE_TYPE:
                this.handleCreateLoadOrTemplateAction(action, selectedTab);

                break;
            case eDropdownMenu.DELETE_TYPE:
                this.handleLoadDeleteAction(
                    action,
                    tableType,
                    selectedTab,
                    load,
                    isDetailsPage
                );

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
        selectedTab: string,
        load?: LoadResponse,
        isDetailsPage?: boolean
    ): void {
        this.loadStoreService.onDeleteLoadFromDropdown({
            isTemplate: false,
            loads: [load],
            isDetailsPage,
        });
    }
}
