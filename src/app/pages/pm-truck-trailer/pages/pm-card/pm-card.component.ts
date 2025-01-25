import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Subject, takeUntil } from 'rxjs';

// base classes
import { PmDropdownMenuActionsBase } from '@pages/pm-truck-trailer/base-classes';

// enums
import { DropdownMenuStringEnum } from '@shared/enums';

// helpers
import { CardHelper } from '@shared/utils/helpers/card-helper';
import { DropdownMenuActionsHelper } from '@shared/utils/helpers/dropdown-menu-helpers';

// services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { ModalService } from '@shared/services/modal.service';

// models
import { CardDetails } from '@shared/models/card-models/card-table-data.model';
import { CardRows } from '@shared/models/card-models/card-rows.model';
import { DropdownMenuOptionEmit } from '@ca-shared/components/ca-dropdown-menu/models';
import { PMTrailerUnitResponse, PMTruckUnitResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-pm-card',
    templateUrl: './pm-card.component.html',
    styleUrls: ['./pm-card.component.scss'],
    providers: [CardHelper],
})
export class PmCardComponent
    extends PmDropdownMenuActionsBase
    implements OnInit, OnDestroy
{
    @Input() set viewData(value: CardDetails[]) {
        this._viewData = value;
    }

    @Input() selectedTab: string;

    // card body endpoints
    @Input() cardTitle: string;
    @Input() rows: number[];
    @Input() displayRowsFront: CardRows[];
    @Input() displayRowsBack: CardRows[];
    @Input() cardTitleLink: string;

    private destroy$ = new Subject<void>();

    public _viewData: CardDetails[];

    public isCardFlippedCheckInCards: number[] = [];
    public isAllCardsFlipp: boolean = false;

    constructor(
        // services
        protected modalService: ModalService,

        private tableService: TruckassistTableService,

        // helpers
        private cardHelper: CardHelper
    ) {
        super();
    }

    ngOnInit() {
        this.flipAllCards();
    }

    public trackCard(item: number): number {
        return item;
    }

    public flipCard(index: number): void {
        this.isCardFlippedCheckInCards = this.cardHelper.flipCard(index);
    }

    public flipAllCards(): void {
        this.tableService.isFlipedAllCards
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                this.isAllCardsFlipp = res;

                this.isCardFlippedCheckInCards = [];
                this.cardHelper.isCardFlippedArrayComparasion = [];
            });
    }

    public onCheckboxSelect(index: number, card: CardDetails): void {
        this._viewData[index].isSelected = !this._viewData[index].isSelected;

        const checkedCard = this.cardHelper.onCheckboxSelect(index, card);

        this.tableService.sendRowsSelected(checkedCard);
    }

    public handleToggleDropdownMenuActions(
        event: DropdownMenuOptionEmit,
        cardData: PMTruckUnitResponse | PMTrailerUnitResponse
    ): void {
        const { type } = event;

        const emitEvent =
            DropdownMenuActionsHelper.createDropdownMenuActionsEmitEvent(
                type,
                cardData
            );

        this.handleDropdownMenuActions(emitEvent, DropdownMenuStringEnum.PM);
    }

    public handleShowMoreAction(): void {
        /*    this.backFilterQuery.pageIndex++;
           
                   this.accountBackFilter(this.backFilterQuery, true); */
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
