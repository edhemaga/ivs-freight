import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Subject, takeUntil } from 'rxjs';

// base classes
import { ContactsDropdownMenuActionsBase } from '@pages/contacts/base-classes';

// helpers
import { CardHelper } from '@shared/utils/helpers/card-helper';
import { DropdownMenuActionsHelper } from '@shared/utils/helpers/dropdown-menu-helpers';

// services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { ContactsService } from '@shared/services/contacts.service';
import { ModalService } from '@shared/services/modal.service';

// enums
import { eDropdownMenu } from '@shared/enums';

// models
import { CardDetails } from '@shared/models/card-models/card-table-data.model';
import { CardRows } from '@shared/models/card-models/card-rows.model';
import { IDropdownMenuOptionEmit } from '@ca-shared/components/ca-dropdown-menu/interfaces';
import { CompanyContactResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-contacts-card',
    templateUrl: './contacts-card.component.html',
    styleUrls: ['./contacts-card.component.scss'],
    providers: [CardHelper],
})
export class ContactsCardComponent
    extends ContactsDropdownMenuActionsBase
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

    get viewData() {
        return this._viewData;
    }

    constructor(
        // services
        protected modalService: ModalService,
        protected contactsService: ContactsService,

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
            });
    }

    public onCheckboxSelect(index: number, card: CardDetails): void {
        this._viewData[index].isSelected = !this._viewData[index].isSelected;

        const checkedCard = this.cardHelper.onCheckboxSelect(index, card);

        this.tableService.sendRowsSelected(checkedCard);
    }

    public handleToggleDropdownMenuActions(
        action: IDropdownMenuOptionEmit,
        cardData: CompanyContactResponse
    ): void {
        const { type } = action;

        const emitAction =
            DropdownMenuActionsHelper.createDropdownMenuActionsEmitAction(
                type,
                cardData
            );

        this.handleDropdownMenuActions(emitAction, eDropdownMenu.CONTACT);
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
