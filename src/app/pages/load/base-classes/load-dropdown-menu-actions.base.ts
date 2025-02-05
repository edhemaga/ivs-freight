// base classes
import { DropdownMenuActionsBase } from '@shared/base-classes';

// services
import { LoadStoreService } from '@pages/load/pages/load-table/services/load-store.service';

// enums
import { DropdownMenuStringEnum } from '@shared/enums';
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
        event: TableCardBodyActions<T>,
        tableType: string,
        selectedTab?: string
    ) {
        const { type } = event;

        switch (type) {
            case DropdownMenuStringEnum.EDIT_TYPE:
                this.handleLoadEditAction(event, selectedTab);

                break;
            case DropdownMenuStringEnum.CREATE_TEMPLATE_TYPE:
            case DropdownMenuStringEnum.CREATE_LOAD_TYPE:
                this.handleCreateLoadOrTemplateAction(event, selectedTab);

                break;
            case DropdownMenuStringEnum.DELETE_TYPE:
                this.handleLoadDeleteAction(event, tableType, selectedTab);

                break;
            default:
                // call the parent class method to handle shared cases
                super.handleSharedDropdownMenuActions(event, tableType);

                break;
        }
    }

    private handleLoadEditAction<T>(
        event: TableCardBodyActions<T>,
        selectedTab: string
    ) {
        const { type, id } = event;

        const selectedLoadTab: eLoadStatusType = eLoadStatusType[selectedTab];

        this.loadStoreService.dispatchGetEditLoadOrTemplateModalData(
            id,
            selectedLoadTab,
            type
        );
    }

    private handleCreateLoadOrTemplateAction<T>(
        event: TableCardBodyActions<T>,
        selectedTab: string
    ) {
        const { type, id } = event;

        const selectedLoadTab: eLoadStatusType = eLoadStatusType[selectedTab];

        this.loadStoreService.dispatchGetConvertToLoadOrTemplateModalData(
            id,
            selectedLoadTab,
            type
        );
    }

    private handleLoadDeleteAction<T>(
        event: TableCardBodyActions<T>,
        tableType: string,
        selectedTab: string
    ): void {
        const modalHeaderTitle =
            LoadTableHelper.composeDeleteModalTitle(selectedTab);

        const adjustedEvent = {
            ...event,
            template: DropdownMenuStringEnum.LOAD,
            subType: selectedTab.toLowerCase(),
            modalHeaderTitle,
        };

        super.handleSharedDropdownMenuActions(adjustedEvent, tableType);
    }
}
