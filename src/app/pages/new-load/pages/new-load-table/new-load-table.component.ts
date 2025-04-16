import { CommonModule } from '@angular/common';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Enums
import { eColor, eDropdownMenu } from '@shared/enums';
import { eLoadStatusStringType } from '@pages/new-load/enums';

// base classes
import { LoadDropdownMenuActionsBase } from '@pages/load/base-classes';

// Components
import {
    CaDropdownMenuComponent,
    CaStatusChangeDropdownComponent,
    CaCheckboxComponent,
    CaLoadStatusComponent,
    CaCheckboxSelectedCountComponent,
    ePosition,
} from 'ca-components';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { NewTableComponent } from '@shared/components/new-table/new-table.component';
import { Subject, takeUntil } from 'rxjs';
import { NgbPopover, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

import { CaProfileImageComponent } from 'ca-components';
import { SvgIconComponent } from 'angular-svg-icon';

// Services
import { LoadStoreService } from '@pages/new-load/state/services/load-store.service';
import { ModalService } from '@shared/services';

// interfaces
import { IDropdownMenuOptionEmit } from '@ca-shared/components/ca-dropdown-menu/interfaces';

// helpers
import { DropdownMenuActionsHelper } from '@shared/utils/helpers/dropdown-menu-helpers';

// Models
import { LoadStatusResponse } from 'appcoretruckassist';

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
        TaAppTooltipV2Component
    ],
})
export class NewLoadTableComponent
    extends LoadDropdownMenuActionsBase
    implements OnInit, OnDestroy
{
    protected destroy$ = new Subject<void>();

    public changeStatusPopover: NgbPopover;

    public eColor = eColor;
    public ePosition = ePosition;
    public eDropdownMenu = eDropdownMenu;

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

    public onHandleShowMoreClick(): void {
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

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
