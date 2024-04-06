import {
    Component,
    Input,
    OnDestroy,
    OnInit,
    SimpleChanges,
    OnChanges,
} from '@angular/core';
import { CardDetails } from 'src/app/shared/models/card-table-data.model';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

// pipes
import { FormatCurrency } from 'src/app/shared/pipes/format-currency.pipe';
import { FormatMilesPipe } from 'src/app/shared/pipes/format-miles.pipe';

// models
import { CardRows, DataResult } from 'src/app/shared/models/card-data.model';

// services
import { TruckassistTableService } from 'src/app/shared/services/truckassist-table.service';
import { DetailsDataService } from 'src/app/shared/services/details-data.service';

// store
import { LoadQuery } from 'src/app/core/components/modals/cards-modal/state/store/load-modal.query';

// helpers
import { CardHelper } from 'src/app/shared/utils/helpers/card-helper';

@Component({
    selector: 'app-load-card',
    templateUrl: './load-card.component.html',
    styleUrls: ['./load-card.component.scss'],
    providers: [FormatMilesPipe, FormatCurrency, CardHelper],
})
export class LoadCardComponent implements OnInit, OnDestroy, OnChanges {
    // All data
    @Input() viewData: CardDetails[];

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

    public cardsFront: DataResult[][][] = [];
    public cardsBack: DataResult[][][] = [];
    public titleArray: string[][] = [];

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
            this.viewData,
            this.cardTitle,
            null
        );

        const frontOfCards = this.cardHelper.renderCards(
            this.viewData,
            null,
            this.displayRowsFront
        );

        const backOfCards = this.cardHelper.renderCards(
            this.viewData,
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
    public onCheckboxSelect(index: number, card: CardDetails): void {
        this.viewData[index].isSelected = !this.viewData[index].isSelected;

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

    public goToDetailsPage(card: CardDetails, link: string): void {
        this.detailsDataService.setNewData(card);

        this.router.navigate([link]);
    }

    public trackCard(item: number): number {
        return item;
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
