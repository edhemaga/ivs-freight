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
import { Subject, takeUntil } from 'rxjs';
import { Clipboard } from '@angular/cdk/clipboard';
import { DOCUMENT } from '@angular/common';

// models
import { CardDetails } from '@shared/models/card-models/card-table-data.model';
import { CardRows } from '@shared/models/card-models/card-rows.model';
import { CompanyAccountLabelResponse } from 'appcoretruckassist';
import { CardDataResult } from '@shared/models/card-models/card-data-result.model';
import { TableBodyColorLabel } from '@shared/models/table-models/table-body-color-label.model';

// helpers
import { CardHelper } from '@shared/utils/helpers/card-helper';

// services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { ModalService } from '@shared/services/modal.service';

// components
import { AccountModalComponent } from '@pages/account/pages/account-modal/account-modal.component';
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';

// enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { AccountStringEnum } from '@pages/account/enums/account-string.enum';
import { DropdownMenuStringEnum } from '@shared/enums';

@Component({
    selector: 'app-account-card',
    templateUrl: './account-card.component.html',
    styleUrls: ['./account-card.component.scss'],
    providers: [CardHelper],
})
export class AccountCardComponent implements OnInit, OnDestroy {
    @Output() saveValueNote: EventEmitter<{ value: string; id: number }> =
        new EventEmitter<{ value: string; id: number }>();

    @Input() set viewData(value: CardDetails[]) {
        this._viewData = value;
    }
    @Input() selectedTab: string;

    // Card body endpoints
    @Input() cardTitle: string;
    @Input() rows: number[];
    @Input() displayRowsFront: CardRows[];
    @Input() displayRowsBack: CardRows[];
    @Input() cardTitleLink: string;

    public isCardFlippedCheckInCards: number[] = [];
    public cardData: CardDetails;
    public _viewData: CardDetails[];
    public isAllCardsFlipp: boolean = false;

    public dropdownSelectionArray = new UntypedFormArray([]);
    public selectedContactLabel: CompanyAccountLabelResponse[] = [];

    public cardsFront: CardDataResult[][][] = [];
    public cardsBack: CardDataResult[][][] = [];

    private destroy$ = new Subject<void>();

    constructor(
        private tableService: TruckassistTableService,
        private cardHelper: CardHelper,
        private modalService: ModalService,
        private clipboard: Clipboard,
        @Inject(DOCUMENT) private readonly documentRef: Document
    ) {}

    ngOnInit(): void {
        this.flipAllCards();

        this._viewData.length && this.labelDropdown();
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

    // When checkbox is selected
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

    public trackCard(item: number): number {
        return item;
    }

    public onCardActions(event: any): void {
        switch (event.type) {
            case AccountStringEnum.EDIT_ACCOUNT:
                this.modalService.openModal(
                    AccountModalComponent,
                    { size: TableStringEnum.SMALL },
                    {
                        ...event,
                        type: DropdownMenuStringEnum.EDIT_TYPE,
                    }
                );
                break;
            case DropdownMenuStringEnum.GO_TO_LINK_TYPE:
                if (event.data?.url) {
                    const url = !event.data.url.startsWith('https://')
                        ? 'https://' + event.data.url
                        : event.data.url;

                    this.documentRef.defaultView.open(url, '_blank');
                }
                break;
            case DropdownMenuStringEnum.COPY_PASSWORD_TYPE:
                this.clipboard.copy(event.data.password);
                break;
            case DropdownMenuStringEnum.COPY_USERNAME_TYPE:
                this.clipboard.copy(event.data.username);
                break;
            case DropdownMenuStringEnum.DELETE_TYPE:
                this.modalService.openModal(
                    ConfirmationModalComponent,
                    { size: TableStringEnum.SMALL },
                    {
                        ...event,
                        template: TableStringEnum.USER_1,
                        type: TableStringEnum.DELETE,
                        svg: true,
                    }
                );
                break;
            default:
                break;
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
