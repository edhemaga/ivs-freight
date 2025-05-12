import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';

// modules
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';

// Enums
import { eLoadStatusType } from '@pages/load/pages/load-table/enums';
import {
    eCommonElement,
    eDropdownMenu,
    eDropdownMenuColumns,
    eGeneralActions,
} from '@shared/enums';
import { eLoadStatusStringType } from '@pages/new-load/enums';

// Models
import { TableCardBodyActions, TableToolbarActions } from '@shared/models';

// Services
import { LoadStoreService } from '@pages/new-load/state/services/load-store.service';
import { ModalService } from '@shared/services/modal.service';

// Components
import { ToolbarTabsWrapperComponent } from '@shared/components/new-table-toolbar/components/toolbar-tabs-wrapper/toolbar-tabs-wrapper.component';
import { NewTableToolbarComponent } from '@shared/components/new-table-toolbar/new-table-toolbar.component';
import {
    CaFilterComponent,
    CaFilterListDropdownComponent,
    CaFilterTimeDropdownComponent,
    CaSearchMultipleStates2Component,
    CaCheckboxSelectedCountComponent,
    IFilterAction,
    CaSortingCardDropdownComponent,
} from 'ca-components';
import { NewLoadCardsComponent } from '@pages/new-load/pages/new-load-cards/new-load-cards.component';
import { NewLoadTableComponent } from '@pages/new-load/pages/new-load-table/new-load-table.component';
import { SvgIconComponent } from 'angular-svg-icon';
import { ConfirmationResetModalComponent } from '@shared/components/ta-shared-modals/confirmation-reset-modal/confirmation-reset-modal.component';

// Svg routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

// Interfaces
import { ILoadModal } from '@pages/new-load/pages/new-load-modal/interfaces';
import { IMappedLoad } from '@pages/new-load/interfaces';
import { ITableColumn } from '@shared/components/new-table/interfaces';

@Component({
    selector: 'app-new-load',
    templateUrl: './new-load.component.html',
    styleUrl: './new-load.component.scss',
    standalone: true,
    imports: [
        // modules
        CommonModule,
        NgbTooltipModule,
        AngularSvgIconModule,

        // Components
        NewTableToolbarComponent,
        NewLoadCardsComponent,
        NewLoadTableComponent,
        ToolbarTabsWrapperComponent,
        CaFilterComponent,
        CaFilterTimeDropdownComponent,
        CaFilterListDropdownComponent,
        CaSearchMultipleStates2Component,
        SvgIconComponent,
        CaCheckboxSelectedCountComponent,
        CaSortingCardDropdownComponent,
    ],
})
export class NewLoadComponent<T> {
    @ViewChild(NewLoadCardsComponent) loadCardComponent!: NewLoadCardsComponent;
    @ViewChild('deleteTemplate') deleteTemplate!: TemplateRef<T>;
    // enums
    public eLoadStatusStringType = eLoadStatusStringType;
    public generalActions = eGeneralActions;
    public eCommonElement = eCommonElement;

    // Shared routes
    public sharedIcons = SharedSvgRoutes;

    public selectedTab = eLoadStatusStringType.ACTIVE;

    constructor(
        // services
        public loadStoreService: LoadStoreService,
        private modalService: ModalService
    ) {}

    public onToolBarAction(event: TableToolbarActions): void {
        if (!event) return;

        const { action, mode } = event;

        switch (action) {
            case eGeneralActions.OPEN_MODAL:
                this.onCreateNewLoad();
                break;

            case eGeneralActions.TAB_SELECTED:
                this.onLoadTypeChange(mode);
                break;

            case eGeneralActions.VIEW_MODE:
                this.onViewModeChange(mode);
                break;
        }
    }

    public onSearchQueryChange(query: string[]): void {
        this.loadStoreService.dispatchSearchChange(query);
    }

    public setFilters(filters: IFilterAction): void {
        this.loadStoreService.dispatchFiltersChange(filters);
    }

    public navigateToLoadDetails(id: number): void {
        this.loadStoreService.navigateToLoadDetails(id);
    }

    public onCheckboxCountClick(action: string): void {
        this.loadStoreService.onSelectAll(action);
    }

    public onToolbarDropdownMenuActions<T>(action: TableCardBodyActions<T>) {
        const { type, isActive } = action;
        switch (type) {
            case eDropdownMenuColumns.OPEN_TYPE:
                break;
            case eDropdownMenuColumns.CLOSE_TYPE:
                this.setToolbarDropdownMenuColumnsActive(false);
                break;
            case eDropdownMenuColumns.COLUMNS_TYPE:
                this.setToolbarDropdownMenuColumnsActive(true);
                break;
            case eDropdownMenuColumns.COLUMNS_BACK_TYPE:
                this.setToolbarDropdownMenuColumnsActive(false);
                break;
            case eDropdownMenuColumns.UNLOCK_TABLE_TYPE:
            case eDropdownMenuColumns.LOCK_TABLE_TYPE:
                this.handleTableLockingStatus();
                break;
            case eDropdownMenuColumns.RESET_TABLE_TYPE:
                this.openResetConfirmationModal();
                break;
            case eDropdownMenuColumns.RESET_TABLE_CONFIRMED_TYPE:
                this.handleResetTable();
                break;
            case eDropdownMenuColumns.FLIP_ALL_CARDS_TYPE:
                this.handleFlipAllCards();
                break;
            case eDropdownMenuColumns.COLUMNS_CARD_TYPE:
                this.loadCardComponent.openColumnsModal();
                break;
            default:
                this.toggleColumnVisibility(type, isActive);
                break;
        }
    }

    private onLoadTypeChange(mode: string): void {
        this.selectedTab = mode as eLoadStatusStringType;
        this.loadStoreService.dispatchLoadTypeChange(eLoadStatusType[mode]);
    }

    private onViewModeChange(viewMode: string): void {
        this.loadStoreService.dispatchViewModeChange(
            viewMode as eCommonElement
        );
    }

    public onDeleteLoadList(isTemplate: boolean, loads: IMappedLoad[]): void {
        this.loadStoreService.onDeleteLoadsFromList({
            isTemplate,
            loads,
            isDetailsPage: false,
        });
    }

    private onCreateNewLoad(): void {
        const modalData: ILoadModal = {
            isEdit: false,
            id: null,
            isTemplate: this.selectedTab === eLoadStatusStringType.TEMPLATE,
        };

        this.loadStoreService.onOpenModal(modalData);
    }

    private setToolbarDropdownMenuColumnsActive(isActive: boolean): void {
        this.loadStoreService.dispatchSetToolbarDropdownMenuColumnsActive(
            isActive
        );
    }
    private handleTableLockingStatus(): void {
        this.loadStoreService.dispatchTableUnlockToggle();
    }
    private openResetConfirmationModal(): void {
        this.modalService.openModal(
            ConfirmationResetModalComponent,
            { size: eDropdownMenu.SMALL },
            {
                template: eGeneralActions.RESET_MODAL,
                type: eGeneralActions.RESET,
                modalTitle: 'List | Load',
                tableType: 'Load',
            }
        );
    }
    private handleResetTable(): void {
        this.loadStoreService.dispatchTableColumnReset();
    }
    private handleFlipAllCards(): void {
        this.loadStoreService.dispatchToggleCardFlipViewMode();
    }
    private toggleColumnVisibility(columnType: string, isChecked): void {
        this.loadStoreService.dispatchToggleColumnsVisibility(
            columnType,
            isChecked
        );
    }

    public onSelectSortItem(column: ITableColumn): void {
        this.loadStoreService.dispatchSortingChange(column);
    }
}
