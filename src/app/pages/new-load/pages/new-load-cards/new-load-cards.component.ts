import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

// modules
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';

// base classes
import { LoadDropdownMenuActionsBase } from '@pages/load/base-classes';

// services
import { LoadStoreService } from '@pages/new-load/state/services/load-store.service';
import { ModalService } from '@shared/services';

// components
import {
    CaTableCardViewComponent,
    CaStatusChangeDropdownComponent,
    ePosition,
} from 'ca-components';
import { CardColumnsModalComponent } from '@shared/components/card-columns-modal/card-columns-modal.component';
import { LoadTypeComponent } from '@pages/new-load/components/load-type/load-type.component';

// pipes
import {
    FormatCurrencyPipe,
    ThousandSeparatorPipe,
    GetNestedValuePipe,
    FormatDatePipe,
} from '@shared/pipes';
import { CaLoadStatusComponent } from 'ca-components';

// configs
import {
    LoadActiveCardDataConfig,
    LoadCardDataConfig,
    LoadClosedCardDataConfig,
    LoadPendingCardDataConfig,
    LoadTemplateCardDataConfig,
} from '@pages/new-load/pages/new-load-cards/utils/configs';

// interfaces
import { ICardValueData } from '@shared/interfaces';
import { IMappedLoad } from '@pages/new-load/interfaces';

// enums
import {
    eDropdownMenu,
    eSharedString,
    eStringPlaceholder,
    eTableCardViewData,
    TableStringEnum,
} from '@shared/enums';

// models
import { TableCardBodyActions } from '@shared/models';
import { LoadStatusResponse } from 'appcoretruckassist';

// svg-routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

@Component({
    selector: 'app-new-load-cards',
    templateUrl: './new-load-cards.component.html',
    styleUrl: './new-load-cards.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        AngularSvgIconModule,
        NgbPopover,

        // components
        CaTableCardViewComponent,
        CaStatusChangeDropdownComponent,
        LoadTypeComponent,
        CaLoadStatusComponent,

        // pipes
        FormatCurrencyPipe,
        ThousandSeparatorPipe,
        GetNestedValuePipe,
        FormatDatePipe,
    ],
})
export class NewLoadCardsComponent
    extends LoadDropdownMenuActionsBase
    implements OnInit, OnDestroy
{
    // destroy
    protected destroy$ = new Subject<void>();

    public changeStatusPopover: NgbPopover;

    // data (this will be changed when store is implemented)
    public tabCardData: {
        [key: string]: {
            front: ICardValueData[];
            back: ICardValueData[];
        };
    } = {
        Active: {
            front: LoadActiveCardDataConfig.FRONT_SIDE_DATA,
            back: LoadActiveCardDataConfig.BACK_SIDE_DATA,
        },
        Pending: {
            front: LoadPendingCardDataConfig.PENDING_FRONT_SIDE_DATA,
            back: LoadPendingCardDataConfig.PENDING_BACK_SIDE_DATA,
        },
        Closed: {
            front: LoadClosedCardDataConfig.CLOSED_FRONT_SIDE_DATA,
            back: LoadClosedCardDataConfig.CLOSED_BACK_SIDE_DATA,
        },
        Template: {
            front: LoadTemplateCardDataConfig.TEMPLATE_FRONT_SIDE_DATA,
            back: LoadTemplateCardDataConfig.TEMPLATE_BACK_SIDE_DATA,
        },
    };

    // enums
    public eTableCardViewData = eTableCardViewData;
    public eDropdownMenu = eDropdownMenu;

    // svg-routes
    public sharedSvgRoutes = SharedSvgRoutes;

    // tab
    public selectedTab!: string;

    // enums
    public eSharedString = eSharedString;
    public eStringPlaceholder = eStringPlaceholder;
    public ePosition = ePosition;

    constructor(
        protected modalService: ModalService,
        public loadStoreService: LoadStoreService
    ) {
        super();
    }

    ngOnInit(): void {
        this.loadStoreService.selectedTabSelector$
            .pipe(takeUntil(this.destroy$))
            .subscribe((tab) => {
                this.selectedTab = tab;
            });

        this.initChangeStatusDropdownListener();
    }

    private navigateToLoadDetails(id: number): void {
        this.loadStoreService.navigateToLoadDetails(id);
    }

    public openColumnsModal(): void {
        const action = {
            data: {
                cardsAllData: LoadCardDataConfig.CARD_ALL_DATA,
                front_side: this.tabCardData[this.selectedTab].front,
                back_side: this.tabCardData[this.selectedTab].back,
                numberOfRows: 4,
                checked: true,
            },
            title: eSharedString.LOAD_VERTICAL_LINE + this.selectedTab,
        };

        this.modalService
            .openModal(
                CardColumnsModalComponent,
                { size: TableStringEnum.SMALL },
                action
            )
            .then((result) => {
                if (result) {
                    this.tabCardData[this.selectedTab].front =
                        result.selectedColumns.front_side
                            .slice(0, result.selectedColumns.numberOfRows)
                            .map((front: ICardValueData) => front.inputItem);

                    this.tabCardData[this.selectedTab].back =
                        result.selectedColumns.back_side
                            .slice(0, result.selectedColumns.numberOfRows)
                            .map((back: ICardValueData) => back.inputItem);
                }
            });
    }

    public onShowMoreClick(): void {
        this.loadStoreService.getNewPage();
    }

    public onSelectLoad(id: number): void {
        this.loadStoreService.onSelectLoad(id);
    }

    public onToggleDropdownMenuActions(
        action: TableCardBodyActions<IMappedLoad>
    ): void {
        const { type, id } = action;

        // this is because we have load and new load - it will be removed
        if (type === eDropdownMenu.VIEW_DETAILS_TYPE) {
            this.navigateToLoadDetails(id);

            return;
        }
        this.handleDropdownMenuActions(
            action,
            eDropdownMenu.LOAD,
            this.selectedTab
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

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
