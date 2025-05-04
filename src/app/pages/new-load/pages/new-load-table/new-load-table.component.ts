import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

// modules
import { NgbPopover, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

// enums
import {
    eColor,
    eSharedString,
    eDateTimeFormat,
    eDropdownMenu,
    eGeneralActions,
    eStringPlaceholder,
    eThousandSeparatorFormat,
} from '@shared/enums';
import { eLoadStatusStringType } from '@pages/new-load/enums';

// base classes
import { LoadDropdownMenuActionsBase } from '@pages/load/base-classes';

// components
import {
    CaDropdownMenuComponent,
    CaStatusChangeDropdownComponent,
    CaCheckboxComponent,
    CaLoadStatusComponent,
    CaCheckboxSelectedCountComponent,
} from 'ca-components';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { NewTableComponent } from '@shared/components/new-table/new-table.component';
import { CaProfileImageComponent } from 'ca-components';
import { SvgIconComponent } from 'angular-svg-icon';
import { TaNoteComponent } from '@shared/components/ta-note/ta-note.component';
import { LoadTypeComponent } from '@pages/new-load/components/load-type/load-type.component';
import { TaTruckTrailerIconComponent } from '@shared/components/ta-truck-trailer-icon/ta-truck-trailer-icon.component';

// services
import { LoadStoreService } from '@pages/new-load/state/services/load-store.service';
import { ModalService } from '@shared/services';

// interfaces
import { IDropdownMenuOptionEmit } from '@ca-shared/components/ca-dropdown-menu/interfaces';
import { ITableColumn } from '@shared/components/new-table/interfaces';

// helpers
import { DropdownMenuActionsHelper } from '@shared/utils/helpers/dropdown-menu-helpers';

// models
import {
    LoadListDto,
    LoadStatusResponse,
    LoadTemplateResponse,
} from 'appcoretruckassist';

// svg routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

// pipes
import { TableHighlightSearchTextPipe } from '@shared/components/new-table/pipes';
import { ePosition, eUnit } from 'ca-components';
@Component({
    selector: 'app-new-load-table',
    templateUrl: './new-load-table.component.html',
    styleUrl: './new-load-table.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        NgbTooltip,
        NgbPopover,

        // components
        NewTableComponent,
        CaLoadStatusComponent,
        CaDropdownMenuComponent,
        CaCheckboxComponent,
        CaCheckboxSelectedCountComponent,
        CaStatusChangeDropdownComponent,
        CaProfileImageComponent,
        SvgIconComponent,
        TaAppTooltipV2Component,
        TaNoteComponent,
        LoadTypeComponent,
        TaTruckTrailerIconComponent,

        // pipes
        TableHighlightSearchTextPipe,
    ],
})
export class NewLoadTableComponent
    extends LoadDropdownMenuActionsBase
    implements OnInit, OnDestroy
{
    protected destroy$ = new Subject<void>();

    public changeStatusPopover: NgbPopover;

    // svg-routes
    public sharedSvgRoutes = SharedSvgRoutes;

    // enums
    public eColor = eColor;
    public eSharedString = eSharedString;
    public eGeneralActions = eGeneralActions;
    public ePosition = ePosition;
    public eDropdownMenu = eDropdownMenu;
    public eDateTimeFormat = eDateTimeFormat;
    public eStringPlaceholder = eStringPlaceholder;
    public eThousandSeparatorFormat = eThousandSeparatorFormat;
    public eUnit = eUnit;

    constructor(
        protected router: Router,

        // services
        protected loadStoreService: LoadStoreService,
        protected modalService: ModalService
    ) {
        super();
    }

    ngOnInit(): void {
        this.initChangeStatusDropdownListener();
    }

    public navigateToLoadDetails(id: number): void {
        this.loadStoreService.navigateToLoadDetails(id);
    }

    public onOpenModal(id: number, selectedTab: eLoadStatusStringType): void {
        const isTemplate = selectedTab === eLoadStatusStringType.TEMPLATE;

        this.loadStoreService.onOpenModal({
            id,
            isTemplate,
            isEdit: true,
        });
    }

    public onShowMoreClick(): void {
        this.loadStoreService.getNewPage();
    }

    public onToggleDropdownMenuActions(
        action: IDropdownMenuOptionEmit,
        data: LoadListDto | LoadTemplateResponse,
        selectedTab: string
    ): void {
        const { type } = action;

        const tableAction =
            DropdownMenuActionsHelper.createDropdownMenuActionsEmitAction(
                type,
                data
            );

        // this is because we have load and new load - it will be removed
        if (type === eDropdownMenu.VIEW_DETAILS_TYPE) {
            const { id } = data;

            this.navigateToLoadDetails(id);

            return;
        }

        this.handleDropdownMenuActions(
            tableAction,
            eDropdownMenu.LOAD,
            selectedTab
        );
    }

    public onNextStatus(status: LoadStatusResponse): void {
        this.loadStoreService.dispatchUpdateLoadStatus(status);
    }

    public onPreviousStatus(status: LoadStatusResponse): void {
        this.loadStoreService.dispatchRevertLoadStatus(status);
    }

    public onOpenChangeStatusDropdown(
        tooltip: NgbPopover,
        loadId: number
    ): void {
        this.changeStatusPopover = tooltip;
        this.loadStoreService.dispatchOpenChangeStatuDropdown(loadId);
    }

    public initChangeStatusDropdownListener(): void {
        this.loadStoreService.changeDropdownpossibleStatusesSelector$
            .pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value) this.changeStatusPopover.open();
            });
    }

    public onCheckboxCountClick(action: string): void {
        this.loadStoreService.onSelectAll(action);
    }

    public onSelectLoad(id: number): void {
        this.loadStoreService.onSelectLoad(id);
    }

    public onSortingChange(column: ITableColumn): void {
        this.loadStoreService.dispatchSortingChange(column);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
