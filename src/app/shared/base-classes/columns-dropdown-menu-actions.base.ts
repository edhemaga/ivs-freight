import { Subject, takeUntil } from 'rxjs';

// models
import { ITableColummn, TableCardBodyActions } from '@shared/models';

// enums
import {
    eDropdownMenu,
    eDropdownMenuColumns,
    eGeneralActions,
    TableStringEnum,
} from '@shared/enums';

// components
import { ConfirmationResetModalComponent } from '@shared/components/ta-shared-modals/confirmation-reset-modal/confirmation-reset-modal.component';

// services
import { ConfirmationResetService } from '@shared/components/ta-shared-modals/confirmation-reset-modal/services/confirmation-reset.service';
import { ModalService } from '@shared/services/modal.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';

// helpers
import { DropdownMenuColumnsActionsHelper } from '@shared/utils/helpers/dropdown-menu-helpers';

export abstract class ColumnsDropdownMenuActionsBase {
    protected abstract modalService: ModalService;
    protected abstract tableService: TruckassistTableService;
    protected abstract confirmationResetService: ConfirmationResetService;
    protected abstract destroy$: Subject<void>;

    protected abstract updateToolbarDropdownMenuContent(action?: string): void;

    protected handleColumnsDropdownMenuActions<T>(
        action: TableCardBodyActions<T>
    ): void {
        const { type, subType, isActive } = action;

        switch (type) {
            case eDropdownMenuColumns.OPEN_TYPE:
                this.updateToolbarDropdownMenuContent();

                break;
            case eDropdownMenuColumns.COLUMNS_TYPE:
                this.updateToolbarDropdownMenuContent(type);

                break;
            case eDropdownMenuColumns.UNLOCK_TABLE_TYPE:
            case eDropdownMenuColumns.LOCK_TABLE_TYPE:
                this.handleLockUnlockTableAction(type, subType);

                break;
            case eDropdownMenuColumns.RESET_TABLE_TYPE:
                this.handleResetTableAction(subType);

                break;
            case eDropdownMenuColumns.RESET_TABLE_CONFIRMED_TYPE:
                this.handleResetTableConfirmedAction(subType);

                break;
            default:
                this.handleColumnsCheckAction(type, subType, isActive);

                break;
        }
    }

    private handleLockUnlockTableAction(
        actionType: string,
        subType: string
    ): void {
        const tableType =
            DropdownMenuColumnsActionsHelper.getConfigTableType(subType);

        const unlockTableConfig = {
            toaggleUnlockTable: true,
        };

        this.tableService.sendUnlockTable(unlockTableConfig);

        const config = DropdownMenuColumnsActionsHelper.getTableConfig(subType);

        const tableConfig = {
            tableType,
            config,
        };

        if (config) {
            this.tableService
                .sendTableConfig(tableConfig)
                .pipe(takeUntil(this.destroy$))
                .subscribe();
        }

        this.updateToolbarDropdownMenuContent(actionType);
    }

    private handleResetTableAction(subType: string): void {
        const tableConfig = JSON.parse(
            DropdownMenuColumnsActionsHelper.getTableConfig(subType)
        );

        if (tableConfig) {
            this.modalService.openModal(
                ConfirmationResetModalComponent,
                { size: eDropdownMenu.SMALL },
                {
                    template: eGeneralActions.RESET_MODAL,
                    type: eGeneralActions.RESET,
                    modalTitle: TableStringEnum.RESET_MODAL_CONTACTS_TITLE,
                    tableType: TableStringEnum.RESET_MODAL_CONTACTS_TABLE_TYPE,
                }
            );
        }
    }

    private handleColumnsCheckAction(
        actionType: string,
        subType: string,
        isChecked: boolean
    ): void {
        const tableType =
            DropdownMenuColumnsActionsHelper.getConfigTableType(subType);
        const initialTableConfig =
            DropdownMenuColumnsActionsHelper.getTableConfig(subType);

        let config = initialTableConfig
            ? JSON.parse(initialTableConfig)
            : DropdownMenuColumnsActionsHelper.getColumnDefinition(subType);

        config = config?.map((column: ITableColummn) =>
            column.field === actionType || column.groupName === actionType
                ? { ...column, hidden: !isChecked }
                : column
        );

        const tableConfig = {
            tableType,
            config: JSON.stringify(config),
        };

        this.tableService
            .sendTableConfig(tableConfig)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                config.forEach((column, index) => {
                    if (
                        column.field === actionType ||
                        column.groupName === actionType
                    ) {
                        this.tableService.sendToaggleColumn({ column, index });
                    }
                });
            });

        DropdownMenuColumnsActionsHelper.setTableConfig(subType, config);
    }

    private handleResetTableConfirmedAction(subType: string): void {
        const tableType =
            DropdownMenuColumnsActionsHelper.getConfigTableType(subType);

        DropdownMenuColumnsActionsHelper.clearTableConfig(subType);

        const tableConfig = {
            tableType,
            config: null,
        };

        this.tableService
            .sendTableConfig(tableConfig)
            .pipe(takeUntil(this.destroy$))
            .subscribe();

        this.confirmationResetService.setConfirmationResetData(false);
        this.tableService.sendResetColumns(true);
        this.updateToolbarDropdownMenuContent();
    }
}
