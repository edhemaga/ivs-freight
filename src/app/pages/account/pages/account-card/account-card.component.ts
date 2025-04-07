import {
    Component,
    ElementRef,
    EventEmitter,
    Inject,
    Input,
    NgZone,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
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
import { AccountService } from '@pages/account/services/account.service';
import { ModalService } from '@shared/services/modal.service';
import { ConfirmationResetService } from '@shared/components/ta-shared-modals/confirmation-reset-modal/services/confirmation-reset.service';

// enums
import { eDropdownMenu } from '@shared/enums';

// models
import { CardDetails } from '@shared/models/card-models/card-table-data.model';
import { CardRows } from '@shared/models/card-models/card-rows.model';
import { CompanyAccountLabelResponse } from 'appcoretruckassist';
import { TableBodyColorLabel } from '@shared/models/table-models/table-body-color-label.model';
import { AccountResponse } from '@pages/account/pages/account-table/models/account-response.model';
import { IDropdownMenuOptionEmit } from '@ca-shared/components/ca-dropdown-menu/interfaces';

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
    @ViewChild('parentElement', { read: ElementRef })
    private cardBodyElement!: ElementRef;

    @Input() set viewData(value: CardDetails[]) {
        this._viewData = value;
    }

    // card body endpoints
    @Input() displayRowsFront: CardRows[];
    @Input() displayRowsBack: CardRows[];

    @Output() saveValueNote: EventEmitter<{ value: string; id: number }> =
        new EventEmitter<{ value: string; id: number }>();

    public destroy$ = new Subject<void>();

    public dropdownSelectionArray = new UntypedFormArray([]);

    public _viewData: CardDetails[];

    public isCardFlippedCheckInCards: number[] = [];
    public isAllCardsFlipp: boolean = false;

    public selectedContactLabel: CompanyAccountLabelResponse[] = [];

    public dropdownElementWidth: number;

    public eDropdownMenu = eDropdownMenu;

    get viewData() {
        return this._viewData;
    }

    constructor(
        @Inject(DOCUMENT) protected readonly documentRef: Document,

        // zone
        private ngZone: NgZone,

        // clipboard
        protected clipboard: Clipboard,

        // services
        protected modalService: ModalService,
        protected accountService: AccountService,
        protected confirmationResetService: ConfirmationResetService,
        protected tableService: TruckassistTableService,

        // helpers
        private cardHelper: CardHelper
    ) {
        super();
    }

    ngOnInit(): void {
        this.flipAllCards();

        this._viewData.length && this.labelDropdown();
    }

    ngAfterViewInit(): void {
        this.windowResizeUpdateDescriptionDropdown();
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

    public windowResizeUpdateDescriptionDropdown(): void {
        if (this.cardBodyElement) {
            const parentElement = this.cardBodyElement
                .nativeElement as HTMLElement;

            const resizeObserver = new ResizeObserver(() => {
                const width = parentElement.offsetWidth;

                this.ngZone.run(() => {
                    this.dropdownElementWidth = width;
                });
            });

            resizeObserver.observe(parentElement);
        }
    }

    public handleToggleDropdownMenuActions(
        action: IDropdownMenuOptionEmit,
        cardData: AccountResponse
    ): void {
        const { type } = action;

        const emitAction =
            DropdownMenuActionsHelper.createDropdownMenuActionsEmitAction(
                type,
                cardData
            );

        this.handleDropdownMenuActions(emitAction, eDropdownMenu.ACCOUNT);
    }

    public handleShowMoreAction(): void {}

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
