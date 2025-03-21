import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

// base classes
import { CustomerDropdownMenuActionsBase } from '@pages/customer/base-classes';

// helpers
import { CardHelper } from '@shared/utils/helpers';
import { DropdownMenuActionsHelper } from '@shared/utils/helpers/dropdown-menu-helpers';

// services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { DetailsDataService } from '@shared/services/details-data.service';
import { ModalService } from '@shared/services/modal.service';
import { LoadStoreService } from '@pages/load/pages/load-table/services/load-store.service';
import { ConfirmationResetService } from '@shared/components/ta-shared-modals/confirmation-reset-modal/services/confirmation-reset.service';

// pipes
import { FormatCurrencyPipe, TimeFormatPipe } from '@shared/pipes';

// enums
import { TableStringEnum } from '@shared/enums';

// models
import { CardDetails } from '@shared/models/card-models/card-table-data.model';
import { CardRows } from '@shared/models';
import { MappedShipperBroker } from '@pages/customer/pages/customer-table/models/mapped-shipper-broker.model';
import { IDropdownMenuOptionEmit } from '@ca-shared/components/ca-dropdown-menu/interfaces';

@Component({
    selector: 'app-customer-card',
    templateUrl: './customer-card.component.html',
    styleUrls: ['./customer-card.component.scss'],
    providers: [FormatCurrencyPipe, TimeFormatPipe, CardHelper],
})
export class CustomerCardComponent
    extends CustomerDropdownMenuActionsBase
    implements OnInit, OnDestroy
{
    @Input() set viewData(value: CardDetails[]) {
        this._viewData = value;
    }

    @Input() set selectedTab(value: string) {
        this._selectedTab = value;

        this.cardHelper.resetSelectedCards();
    }

    // card body endpoints
    @Input() displayRowsFront: CardRows[];
    @Input() displayRowsBack: CardRows[];

    public destroy$ = new Subject<void>();

    public _viewData: CardDetails[];
    public _selectedTab: string = TableStringEnum.ACTIVE;

    public isCardFlippedCheckInCards: number[] = [];
    public isAllCardsFlipp: boolean = false;

    constructor(
        // services
        protected detailsDataService: DetailsDataService,
        protected modalService: ModalService,
        protected loadStoreService: LoadStoreService,
        protected tableService: TruckassistTableService,
        protected confirmationResetService: ConfirmationResetService,

        // router
        protected router: Router,

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

    public goToDetailsPage(card: CardDetails): void {
        this.detailsDataService.setNewData(card);

        if (this._selectedTab === TableStringEnum.ACTIVE)
            this.router.navigate([`/list/customer/${card.id}/broker-details`]);
        else
            this.router.navigate([`/list/customer/${card.id}/shipper-details`]);
    }

    public handleToggleDropdownMenuActions<T extends MappedShipperBroker>(
        action: IDropdownMenuOptionEmit,
        cardData: T
    ): void {
        const { type } = action;

        const emitAction =
            DropdownMenuActionsHelper.createDropdownMenuActionsEmitAction(
                type,
                cardData
            );

        this.handleDropdownMenuActions(emitAction, this._selectedTab);
    }

    public handleShowMoreAction(): void {}

    public updateToolbarDropdownMenuContent(): void {}

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
