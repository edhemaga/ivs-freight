import {
    Component,
    EventEmitter,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { FormControl, UntypedFormArray } from '@angular/forms';
import { Clipboard } from '@angular/cdk/clipboard';
import { DOCUMENT } from '@angular/common';

import { Subject, takeUntil } from 'rxjs';

// base classes
import { AccountDropdownMenuActionsBase } from '@pages/account/base-classes';

// helpers
import { CardHelper } from '@shared/utils/helpers/card-helper';
import { DropdownMenuActionsHelper } from '@shared/utils/helpers/dropdown-menu-helpers';

// services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { ModalService } from '@shared/services/modal.service';
import { AccountService } from '@pages/account/services/account.service';

// enums
import { DropdownMenuStringEnum } from '@shared/enums';

// models
import { CardDetails } from '@shared/models/card-models/card-table-data.model';
import { CardRows } from '@shared/models/card-models/card-rows.model';
import { CompanyAccountLabelResponse } from 'appcoretruckassist';
import { CardDataResult } from '@shared/models/card-models/card-data-result.model';
import { TableBodyColorLabel } from '@shared/models/table-models/table-body-color-label.model';
import { AccountResponse } from '@pages/account/pages/account-table/models/account-response.model';
import { DropdownMenuOptionEmit } from '@ca-shared/components/ca-dropdown-menu/models';

@Component({
    selector: 'app-account-card',
    templateUrl: './account-card.component.html',
    styleUrls: ['./account-card.component.scss'],
    providers: [CardHelper],
})
export class AccountCardComponent
    extends AccountDropdownMenuActionsBase
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

    @Output() saveValueNote: EventEmitter<{ value: string; id: number }> =
        new EventEmitter<{ value: string; id: number }>();

    public destroy$ = new Subject<void>();

    public dropdownSelectionArray = new UntypedFormArray([]);

    public _viewData: CardDetails[];

    public cardData: CardDetails;

    public isCardFlippedCheckInCards: number[] = [];
    public isAllCardsFlipp: boolean = false;

    public selectedContactLabel: CompanyAccountLabelResponse[] = [];

    public cardsFront: CardDataResult[][][] = [];
    public cardsBack: CardDataResult[][][] = [];

    get viewData() {
        return this._viewData;
    }

    constructor(
        @Inject(DOCUMENT) protected readonly documentRef: Document,

        // clipboard
        protected clipboard: Clipboard,

        // services
        protected modalService: ModalService,
        protected accountService: AccountService,

        private tableService: TruckassistTableService,

        // helpers
        private cardHelper: CardHelper
    ) {
        super(documentRef, clipboard, modalService, accountService);
    }

    ngOnInit(): void {
        this.flipAllCards();

        this._viewData.length && this.labelDropdown();
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

    public labelDropdown(): TableBodyColorLabel {
        for (let card of this._viewData) {
            this.dropdownSelectionArray.push(new FormControl());
            if (card.companyContactLabel) {
                return card.companyContactLabel;
            } else if (card.companyAccountLabel) {
                this.selectedContactLabel.push(card.companyAccountLabel);
            }
        }
    }

    public saveNoteValue(note: string, id: number): void {
        this.saveValueNote.emit({
            value: note,
            id: id,
        });
    }

    public handleToggleDropdownMenuActions(
        event: DropdownMenuOptionEmit,
        cardData: AccountResponse
    ): void {
        const { type } = event;

        const emitEvent =
            DropdownMenuActionsHelper.createDropdownMenuActionsEmitEvent(
                type,
                cardData
            );

        this.handleDropdownMenuActions(
            emitEvent,
            DropdownMenuStringEnum.ACCOUNT
        );
    }

    public handleShowMoreAction(): void {
        /*    this.backFilterQuery.pageIndex++;

        this.accountBackFilter(this.backFilterQuery, true); */
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
