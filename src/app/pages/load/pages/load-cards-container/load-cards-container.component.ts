import {
    Component,
    Input,
    OnDestroy,
    OnInit,
    SimpleChanges,
    OnChanges,
} from '@angular/core';
import { CardDetails } from '@shared/models/card-models/card-table-data.model';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

// pipes
import { FormatCurrencyPipe } from '@shared/pipes/format-currency.pipe';
import { FormatMilesPipe } from '@shared/pipes/format-miles.pipe';

// models
import { CardRows } from '@shared/models/card-models/card-rows.model';
import { CardDataResult } from '@shared/models/card-models/card-data-result.model';

// services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { DetailsDataService } from '@shared/services/details-data.service';

// store
import { LoadQuery } from '@shared/components/ta-shared-modals/cards-modal/state/load-modal.query';

// helpers
import { CardHelper } from '@shared/utils/helpers/card-helper';

@Component({
    selector: 'app-load-cards-container',
    templateUrl: './load-cards-container.component.html',
    styleUrls: ['./load-cards-container.component.scss'],
    providers: [FormatMilesPipe, FormatCurrencyPipe, CardHelper],
})
export class LoadCardsContainerComponent implements OnInit, OnDestroy, OnChanges {
    // All data
    @Input() set viewData(value: CardDetails[]) {
        this._viewData = value;
    }

    // Page
    @Input() selectedTab: string;

    // Card body endpoints
    @Input() cardTitle: string;
    @Input() rows: number[];
    @Input() displayRowsFront: CardRows[];
    @Input() displayRowsBack: CardRows[];
    @Input() cardTitleLink: string;

    private destroy$ = new Subject<void>();

    public isAllCardsFlipp: boolean = false;
    public isExpandCardChecked: boolean = true;

    public isCardFlippedCheckInCards: number[] = [];

    public cardConfigurationForFront: CardRows[];

    public cardsFront: CardDataResult[][][] = [];
    public cardsBack: CardDataResult[][][] = [];
    public titleArray: string[][] = [];
    public _viewData: CardDetails[];

    constructor(
        private tableService: TruckassistTableService,
        private detailsDataService: DetailsDataService,
        private router: Router,
        private cardHelper: CardHelper,
        private loadQuery: LoadQuery
    ) {}

    ngOnInit() {
        this.flipAllCards();

        this.expandCard();
    }

    ngOnChanges(cardChanges: SimpleChanges) {
        if (
            cardChanges.displayRowsBack.currentValue ||
            cardChanges.displayRowsFront.currentValue
        )
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

        const backOfCards = this.cardHelper.renderCards(
            this._viewData,
            null,
            this.displayRowsBack
        );

        this.cardsFront = [...this.cardsFront, frontOfCards.dataForRows];

        this.cardsBack = [...this.cardsBack, backOfCards.dataForRows];

        this.titleArray = [...this.titleArray, cardTitles.cardsTitle];
    }

    public expandCard(): void {
        this.loadQuery.pending$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                this.isExpandCardChecked = res.checked;
            });
    }

    public flipAllCards(): void {
        this.tableService.isFlipedAllCards
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                this.isAllCardsFlipp = res;
            });
    }

    // When checkbox is selected
    public onCheckboxSelect(event: { index: number; card: CardDetails }): void {
        const { index, card } = event;

        this._viewData[index].isSelected = !this._viewData[index].isSelected;

        const checkedCard = this.cardHelper.onCheckboxSelect(index, card);

        this.tableService.sendRowsSelected(checkedCard);
    }

    // For closed tab status return true false to style status
    public checkLoadStatus(
        card: CardDetails,
        endpoint: string,
        value: string
    ): boolean {
        return this.cardHelper.getValueByStringPath(card, endpoint) === value;
    }

    // Flip card based on card index
    public flipCard(index: number): void {
        this.isCardFlippedCheckInCards = this.cardHelper.flipCard(index);
    }

    public goToDetailsPage(event: { card: CardDetails; link: string }): void {
        const { card, link } = event;

        this.detailsDataService.setNewData(card);

        this.router.navigate([link]);
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
