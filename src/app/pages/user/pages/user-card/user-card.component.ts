import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Subject, takeUntil } from 'rxjs';

// base classes
import { UserDropdownMenuActionsBase } from '@pages/user/base-classes';

// helpers
import { CardHelper } from '@shared/utils/helpers/card-helper';
import { DropdownMenuActionsHelper } from '@shared/utils/helpers/dropdown-menu-helpers';

// services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { UserService } from '@pages/user/services/user.service';
import { ModalService } from '@shared/services/modal.service';
import { ConfirmationResetService } from '@shared/components/ta-shared-modals/confirmation-reset-modal/services/confirmation-reset.service';

// enums
import { eDropdownMenu } from '@shared/enums';

// models
import { CardRows } from '@shared/models/card-models/card-rows.model';
import { CardDetails } from '@shared/models/card-models/card-table-data.model';
import { IDropdownMenuOptionEmit } from '@ca-shared/components/ca-dropdown-menu/interfaces';
import { CompanyUserResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-user-card',
    templateUrl: './user-card.component.html',
    styleUrls: ['./user-card.component.scss'],
    providers: [CardHelper],
})
export class UserCardComponent
    extends UserDropdownMenuActionsBase
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

    public eDropdownMenu = eDropdownMenu;

    get viewData() {
        return this._viewData;
    }

    constructor(
        // services
        protected modalService: ModalService,
        protected userService: UserService,
        protected tableService: TruckassistTableService,
        protected confirmationResetService: ConfirmationResetService,

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
        action: IDropdownMenuOptionEmit,
        cardData: CompanyUserResponse
    ): void {
        const { type } = action;

        const emitAction =
            DropdownMenuActionsHelper.createDropdownMenuActionsEmitAction(
                type,
                cardData
            );

        this.handleDropdownMenuActions(emitAction, eDropdownMenu.USER);
    }

    public handleShowMoreAction(): void {}

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
