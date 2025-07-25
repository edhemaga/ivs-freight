/* eslint-disable */
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
import { CaFilesCountComponent, ePosition } from 'ca-components';

// base classes
import { LoadDropdownMenuActionsBase } from '@pages/load/base-classes';

// components
import {
    CaDropdownMenuComponent,
    CaStatusChangeDropdownComponent,
    CaCheckboxComponent,
    CaLoadStatusComponent,
    CaCheckboxSelectedCountComponent,
    CaLoadPickupDeliveryComponent,
    CaCommentsComponent,
    IComment,
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
import { FilesService } from '@shared/services/files.service';

// interfaces
import { IDropdownMenuOptionEmit } from '@ca-shared/components/ca-dropdown-menu/interfaces';
import {
    ITableColumn,
    ITableReorderAction,
    ITableResizeAction,
    ITableTagAction,
} from '@shared/components/new-table/interfaces';
import { IMappedLoad } from '@pages/new-load/interfaces';

// helpers
import { DropdownMenuActionsHelper } from '@shared/utils/helpers/dropdown-menu-helpers';
import { UserHelper } from '@shared/utils/helpers';

// models
import {
    LoadListDto,
    LoadStatusResponse,
    LoadTemplateResponse,
} from 'appcoretruckassist';

// svg routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';
import { User } from '@shared/models';

// pipes
import { TableHighlightSearchTextPipe } from '@shared/components/new-table/pipes';

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
        CaLoadPickupDeliveryComponent,
        SvgIconComponent,
        TaAppTooltipV2Component,
        TaNoteComponent,
        LoadTypeComponent,
        TaTruckTrailerIconComponent,
        CaCommentsComponent,
        CaFilesCountComponent,

        // pipes
        TableHighlightSearchTextPipe,
    ],
})
export class NewLoadTableComponent
    extends LoadDropdownMenuActionsBase
    implements OnInit, OnDestroy
{
    protected destroy$ = new Subject<void>();

    public currentUser: User = UserHelper.getUserFromLocalStorage();

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

    // action ids
    public selectedFilesLoadId: number | null = null;
    public selectedCommentsLoadId: number | null = null;

    // files
    public isDownloadAllFilesAction: boolean = false;

    constructor(
        protected router: Router,

        // services
        protected loadStoreService: LoadStoreService,
        protected modalService: ModalService,

        private filesService: FilesService
    ) {
        super();
    }

    ngOnInit(): void {
        this.initChangeStatusDropdownListener();
    }

    private initChangeStatusDropdownListener(): void {
        this.loadStoreService.changeDropdownpossibleStatusesSelector$
            .pipe(takeUntil(this.destroy$))
            .subscribe((value) => value && this.changeStatusPopover.open());
    }

    public onColumnSort(column: ITableColumn): void {
        this.loadStoreService.dispatchSortingChange(column);
    }

    public onColumnPin(column: ITableColumn): void {
        this.loadStoreService.dispatchColumnPinnedAction(column);
    }

    public onColumnRemove(columnKey: string): void {
        this.loadStoreService.dispatchToggleColumnsVisibility(columnKey, false);
    }

    public onColumnResize(resizeAction: ITableResizeAction): void {
        this.loadStoreService.dispatchResizeColumn(resizeAction);
    }

    public onColumnReorder(reorderAction: ITableReorderAction): void {
        this.loadStoreService.dispatchReorderColumn(reorderAction);
    }

    public onShowMore(): void {
        this.loadStoreService.getNewPage();
    }

    public onCheckboxCountClick(action: string): void {
        this.loadStoreService.onSelectAll(action);
    }

    public onSelectLoad(id: number): void {
        this.loadStoreService.onSelectLoad(id);
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

    public onOpenChangeStatusDropdown(
        tooltip: NgbPopover,
        loadId: number
    ): void {
        this.changeStatusPopover = tooltip;

        this.loadStoreService.dispatchOpenChangeStatusDropdown(loadId);
    }

    public onNextStatus(status: LoadStatusResponse): void {
        this.loadStoreService.dispatchUpdateLoadStatus(status);
    }

    public onPreviousStatus(status: LoadStatusResponse): void {
        this.loadStoreService.dispatchRevertLoadStatus(status);
    }

    public navigateToLoadDetails(id: number): void {
        this.loadStoreService.navigateToLoadDetails(id);
    }

    public onPickupDeliveryClick(loadData: IMappedLoad): void {
        this.loadStoreService.dispatchGetLoadStops(loadData);
    }

    public onFilesCountClick(rowId: number): void {
        this.filesService
            .getFiles(eSharedString.LOAD_LOWERCASE, rowId)
            .pipe(takeUntil(this.destroy$))
            .subscribe((files) => {
                if (files?.length) {
                    this.selectedFilesLoadId = rowId;

                    this.isDownloadAllFilesAction = false;

                    this.loadStoreService.dispatchGetLoadFiles(files, rowId);
                }
            });
    }

    public onDocumentsDrawerAction(type: string): void {
        if (type === eGeneralActions.DOWNLOAD_ALL) {
            this.isDownloadAllFilesAction = true;
        } else {
            this.selectedFilesLoadId = null;

            this.isDownloadAllFilesAction = false;
        }
    }

    public onDocumentsDrawerTag(action: ITableTagAction): void {
        this.loadStoreService.dispatchFilterLoadFilesByTag(action);
    }

    public onToggleComments(id: number): void {
        this.selectedCommentsLoadId =
            this.selectedCommentsLoadId === id ? null : id;
    }

    public onCommentDelete(commentId: number, loadId: number): void {
        this.loadStoreService.dispatchDeleteComment(commentId, loadId);
    }

    public onCommentAdded(comment: IComment, loadId: number): void {
        this.loadStoreService.dispatchAddComment(comment, loadId);
    }

    public onCommentEdited(comment: IComment, loadId: number): void {
        this.loadStoreService.dispatchEditComment(comment, loadId);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
