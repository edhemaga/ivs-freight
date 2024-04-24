import {
    Component,
    EventEmitter,
    Inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import { FormControl, UntypedFormArray } from '@angular/forms';
import { Subject } from 'rxjs';
import { Clipboard } from '@angular/cdk/clipboard';
import { DOCUMENT } from '@angular/common';

// models
import { CardDetails } from '@shared/models/card-models/card-table-data.model';
import { CardRows } from '@shared/models/card-models/card-rows.model';
import { CompanyAccountLabelResponse } from 'appcoretruckassist';
import { CardDataResult } from '@shared/models/card-models/card-data-result.model';
import { TableBodyColorLabel } from '@shared/models/table-models/table-body-color-label.model';
import { AccountData } from '@pages/account/pages/account-card/models/account-data.model';

// helpers
import { CardHelper } from '@shared/utils/helpers/card-helper';

// services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { AccountService } from '@pages/account/services/account.service';
import { ModalService } from '@shared/services/modal.service';

// components
import { AccountModalComponent } from '@pages/account/pages/account-modal/account-modal.component';
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';

// enums
import { TableActionsStringEnum } from '@shared/enums/table-actions-string.enum';
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { AccountStringEnum } from '@pages/account/enums/account-string.enum';

@Component({
    selector: 'app-account-card',
    templateUrl: './account-card.component.html',
    styleUrls: ['./account-card.component.scss'],
    providers: [CardHelper],
})
export class AccountCardComponent implements OnInit, OnChanges, OnDestroy {
    @Output() saveValueNote: EventEmitter<{ value: string; id: number }> =
        new EventEmitter<{ value: string; id: number }>();

    @Input() set viewData(value: CardDetails[]) {
        this._viewData = value;
        this.getTransformedCardsData();
    }
    @Input() selectedTab: string;

    // Card body endpoints
    @Input() cardTitle: string;
    @Input() rows: number[];
    @Input() displayRowsFront: CardRows[];
    @Input() cardTitleLink: string;

    public cardData: CardDetails;
    public _viewData: CardDetails[];

    public dropdownSelectionArray = new UntypedFormArray([]);
    public selectedContactLabel: CompanyAccountLabelResponse[] = [];

    public cardsFront: CardDataResult[][][] = [];
    public cardsBack: CardDataResult[][][] = [];
    public titleArray: string[][] = [];

    private destroy$ = new Subject<void>();

    constructor(
        private tableService: TruckassistTableService,
        private cardHelper: CardHelper,
        private accountService: AccountService,
        private modalService: ModalService,
        private clipboard: Clipboard,
        @Inject(DOCUMENT) private readonly documentRef: Document
    ) {}

    ngOnInit(): void {
        this._viewData.length && this.labelDropdown();
    }

    ngOnChanges(cardChanges: SimpleChanges) {
        if (cardChanges?.displayRowsFront?.currentValue)
            this.getTransformedCardsData();
    }

    public getTransformedCardsData(): void {
        this.cardsFront = [];
        this.cardsBack = [];
        this.titleArray = [];

        const cardTitles = this.cardHelper.renderCards(
            this._viewData,
            this.cardTitle,
            null
        );

        const frontOfCards = this.cardHelper.renderCards(
            this._viewData,
            null,
            this.displayRowsFront
        );

        this.cardsFront = [...this.cardsFront, frontOfCards.dataForRows];

        this.titleArray = [...this.titleArray, cardTitles.cardsTitle];
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

    public onCardActions(event: AccountData): void {
        switch (event.type) {
            case AccountStringEnum.EDIT_ACCOUNT:
                this.modalService.openModal(
                    AccountModalComponent,
                    { size: TableActionsStringEnum.SMALL },
                    {
                        ...event,
                        type: TableActionsStringEnum.EDIT,
                    }
                );
                break;
            case TableActionsStringEnum.GO_TO_LINK:
                if (event.data?.url) {
                    const url = !event.data.url.startsWith('https://')
                        ? 'https://' + event.data.url
                        : event.data.url;

                    this.documentRef.defaultView.open(url, '_blank');
                }
                break;
            case TableActionsStringEnum.COPY_PASSWORD:
                this.clipboard.copy(event.data.password);
                break;
            case TableActionsStringEnum.COPY_USERNAME:
                this.clipboard.copy(event.data.username);
                break;
            case AccountStringEnum.DELETE_ACCOUNT:
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
