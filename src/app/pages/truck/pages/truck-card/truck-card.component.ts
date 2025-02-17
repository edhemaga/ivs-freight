import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

// base classes
import { TruckDropdownMenuActionsBase } from '@pages/truck/base-classes';

// helpers
import { CardHelper } from '@shared/utils/helpers/card-helper';
import { DropdownMenuActionsHelper } from '@shared/utils/helpers/dropdown-menu-helpers';

// services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { DetailsDataService } from '@shared/services/details-data.service';
import { ModalService } from '@shared/services/modal.service';

// enums
import { DropdownMenuStringEnum } from '@shared/enums';

// constants
import { TruckCardIcons } from '@pages/truck/pages/truck-card/utils/constants/truck-card-icons.constants';

// models
import { CardRows } from '@shared/models/card-models/card-rows.model';
import { CardDetails } from '@shared/models/card-models/card-table-data.model';
import { DropdownMenuOptionEmit } from '@ca-shared/components/ca-dropdown-menu/models';
import { TruckMapped } from '@pages/truck/pages/truck-table/models/truck-mapped.model';

@Component({
    selector: 'app-truck-card',
    templateUrl: './truck-card.component.html',
    styleUrls: ['./truck-card.component.scss'],
    providers: [CardHelper],
})
export class TruckCardComponent
    extends TruckDropdownMenuActionsBase
    implements OnInit, OnDestroy
{
    @Input() set viewData(value: CardDetails[]) {
        this._viewData = value;
    }

    // card body endpoints
    @Input() displayRowsFront: CardRows[];
    @Input() displayRowsBack: CardRows[];

    public destroy$ = new Subject<void>();

    public _viewData: CardDetails[];

    public isCardFlippedCheckInCards: number[] = [];
    public isAllCardsFlipp: boolean = false;

    public truckCardImageRoutes = TruckCardIcons;

    constructor(
        protected router: Router,

        // services
        protected modalService: ModalService,

        private tableService: TruckassistTableService,
        private detailsDataService: DetailsDataService,

        // helpers
        private cardHelper: CardHelper
    ) {
        super();
    }

    ngOnInit() {
        this.flipAllCards();
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

    public handleToggleDropdownMenuActions<T extends TruckMapped>(
        action: DropdownMenuOptionEmit,
        cardData: T
    ): void {
        const { type } = action;

        const emitAction =
            DropdownMenuActionsHelper.createDropdownMenuActionsEmitAction(
                type,
                cardData
            );

        this.handleDropdownMenuActions(emitAction, DropdownMenuStringEnum.TRUCK);
    }

    public goToDetailsPage(card: CardDetails, link: string): void {
        this.detailsDataService.setNewData(card);

        this.router.navigate([link]);
    }

    public handleShowMoreAction(): void {}

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
