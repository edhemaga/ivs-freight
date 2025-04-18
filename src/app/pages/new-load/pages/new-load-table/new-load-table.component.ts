import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgbPopover, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import {
    CaProfileImageComponent,
    CaDropdownMenuComponent,
    CaStatusChangeDropdownComponent,
    CaCheckboxComponent,
    CaLoadStatusComponent,
    CaCheckboxSelectedCountComponent,
    ePosition,
} from 'ca-components';

import { Subject, takeUntil } from 'rxjs';

import { SvgIconComponent } from 'angular-svg-icon';

import { LoadDropdownMenuActionsBase } from '@pages/load/base-classes';
import { eLoadStatusStringType } from '@pages/new-load/enums';
import {
    eColor,
    eSharedString,
    eDateTimeFormat,
    eDropdownMenu,
    eGeneralActions,
} from '@shared/enums';
import { ModalService } from '@shared/services';
import { DropdownMenuActionsHelper } from '@shared/utils/helpers/dropdown-menu-helpers';
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

import { LoadStatusResponse } from 'appcoretruckassist';

import { LoadStoreService } from '@pages/new-load/state/services/load-store.service';

import { IDropdownMenuOptionEmit } from '@ca-shared/components/ca-dropdown-menu/interfaces';
import { NewTableComponent } from '@shared/components/new-table/new-table.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

@Component({
    selector: 'app-new-load-table',
    templateUrl: './new-load-table.component.html',
    styleUrl: './new-load-table.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        NgbTooltip,
        NgbPopover,

        // Components
        NewTableComponent,
        CaLoadStatusComponent,
        CaDropdownMenuComponent,
        CaCheckboxComponent,
        CaCheckboxSelectedCountComponent,
        CaStatusChangeDropdownComponent,
        CaProfileImageComponent,
        SvgIconComponent,
        TaAppTooltipV2Component,
    ],
})
export class NewLoadTableComponent
    extends LoadDropdownMenuActionsBase
    implements OnInit, OnDestroy
{
    protected destroy$ = new Subject<void>();

    public changeStatusPopover: NgbPopover;
    public eColor = eColor;
    public eDateTimeFormat = eDateTimeFormat;
    public eDropdownMenu = eDropdownMenu;
    public eGeneralActions = eGeneralActions;
    public ePosition = ePosition;
    public eSharedString = eSharedString;
    // svg-routes
    public sharedSvgRoutes = SharedSvgRoutes;

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

    private de(id: number): void {
        this.loadStoreService.navigateToLoadDetails(id);
    }

    public initChangeStatusDropdownListener(): void {
        this.loadStoreService.changeDropdownpossibleStatusesSelector$
            .pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value) this.changeStatusPopover.open();
            });
    }

    public navigateToLoadDetails(id: number): void {
        this.loadStoreService.navigateToLoadDetails(id);
    }

    public onCheckboxCountClick(action: string): void {
        this.loadStoreService.onSelectAll(action);
    }

    public onNextStatus(status: LoadStatusResponse): void {
        this.loadStoreService.dispatchUpdateLoadStatus(status);
    }

    public onOpenChangeStatusDropdown(
        tooltip: NgbPopover,
        loadId: number
    ): void {
        this.changeStatusPopover = tooltip;
        this.loadStoreService.dispatchOpenChangeStatuDropdown(loadId);
    }

    public onOpenModal(id: number, selectedTab: eLoadStatusStringType): void {
        const isTemplate = selectedTab === eLoadStatusStringType.TEMPLATE;

        this.loadStoreService.onOpenModal({
            id,
            isTemplate,
            isEdit: true,
        });
    }

    public onPreviousStatus(status: LoadStatusResponse): void {
        this.loadStoreService.dispatchRevertLoadStatus(status);
    }

    public onSelectLoad(id: number): void {
        this.loadStoreService.onSelectLoad(id);
    }

    public onShowMoreClick(): void {
        this.loadStoreService.getNewPage();
    }

    public onToggleDropdownMenuActions(
        action: IDropdownMenuOptionEmit,
        data,
        selectedTab
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

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
