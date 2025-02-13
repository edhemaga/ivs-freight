import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

// components
import { BrokerModalComponent } from '@pages/customer/pages/broker-modal/broker-modal.component';
import { ShipperModalComponent } from '@pages/customer/pages/shipper-modal/shipper-modal.component';
import { ConfirmationMoveModalComponent } from '@shared/components/ta-shared-modals/confirmation-move-modal/confirmation-move-modal.component';
import { ConfirmationActivationModalComponent } from '@shared/components/ta-shared-modals/confirmation-activation-modal/confirmation-activation-modal.component';
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';
import { MappedShipperBroker } from '../../models/mapped-shipper-broker.model';
import { DropdownMenuOptionEmit } from '@ca-shared/components/ca-dropdown-menu/models';

// base classes
import { CustomerDropdownMenuActionsBase } from '@pages/customer/base-classes';

// helpers
import { CardHelper } from '@shared/utils/helpers/card-helper';
import { DropdownMenuActionsHelper } from '@shared/utils/helpers/dropdown-menu-helpers';

// services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { DetailsDataService } from '@shared/services/details-data.service';
import { ModalService } from '@shared/services/modal.service';
import { LoadStoreService } from '@pages/load/pages/load-table/services/load-store.service';

// pipes
import { FormatCurrencyPipe } from '@shared/pipes/format-currency.pipe';
import { TimeFormatPipe } from '@shared/pipes/time-format-am-pm.pipe';

// enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { ConfirmationModalStringEnum } from '@shared/components/ta-shared-modals/confirmation-modal/enums/confirmation-modal-string.enum';
import { ConfirmationActivationStringEnum } from '@shared/components/ta-shared-modals/confirmation-activation-modal/enums/confirmation-activation-string.enum';
import { ConfirmationMoveStringEnum } from '@shared/components/ta-shared-modals/confirmation-move-modal/enums/confirmation-move-string.enum';

// models
import { CardDetails } from '@shared/models/card-models/card-table-data.model';
import { CardRows } from '@shared/models';

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

        private tableService: TruckassistTableService,

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
        action: DropdownMenuOptionEmit,
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

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
