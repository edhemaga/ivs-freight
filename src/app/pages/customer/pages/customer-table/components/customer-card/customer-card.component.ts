import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

// models
import { CardDetails, SendDataCard } from 'src/app/core/components/shared/model/card-table-data.model';
import { CardRows, DataResult } from 'src/app/core/components/shared/model/card-data.model';

// pipes
import { formatCurrency } from 'src/app/core/pipes/formatCurrency.pipe';
import { TimeFormatPipe } from 'src/app/core/pipes/time-format-am-pm.pipe';

// services
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { DetailsDataService } from 'src/app/core/services/details-data/details-data.service';

// helpers
import { ValueByStringPath } from 'src/app/core/helpers/cards-helper';

@Component({
    selector: 'app-customer-card',
    templateUrl: './customer-card.component.html',
    styleUrls: ['./customer-card.component.scss'],
    providers: [formatCurrency, TimeFormatPipe, ValueByStringPath],
})
export class CustomerCardComponent implements OnInit, OnChanges, OnDestroy {
    @Output() bodyActions: EventEmitter<SendDataCard> = new EventEmitter();

    @Input() viewData: CardDetails[];

    // Card body keys
    @Input() cardTitle: string;
    @Input() rows: number[];
    @Input() displayRowsFront: CardRows[];
    @Input() displayRowsBack: CardRows[];
    @Input() cardTitleLink: string;

    private destroy$ = new Subject<void>();

    // Array holding id of checked cards
    public isCheckboxCheckedArray: number[] = [];

    public isCardFlippedCheckInCards: number[] = [];

    public isAllCardsFlipp: boolean = false;

    public cardsFront: DataResult[][][] = [];
    public cardsBack: DataResult[][][] = [];
    public titleArray: string[][] = [];

    constructor(
        // Services
        private tableService: TruckassistTableService,
        private detailsDataService: DetailsDataService,

        // Router
        private router: Router,

        // Helpers
        private valueByStringPath: ValueByStringPath
    ) {}

    ngOnInit() {
        this.flipAllCards();
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

        const cardTitles = this.valueByStringPath.renderCards(
            this.viewData,
            this.cardTitle,
            null
        );

        const frontOfCards = this.valueByStringPath.renderCards(
            this.viewData,
            null,
            this.displayRowsFront
        );

        const backOfCards = this.valueByStringPath.renderCards(
            this.viewData,
            null,
            this.displayRowsBack
        );

        this.cardsFront = [...this.cardsFront, frontOfCards.dataForRows];

        this.cardsBack = [...this.cardsBack, backOfCards.dataForRows];

        this.titleArray = [...this.titleArray, cardTitles.cardsTitle];
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

        const checkedCard = this.onCheckboxSelect(index, card);

        this.tableService.sendRowsSelected(checkedCard);
    }

    // Flip card based on card index
    public flipCard(index: number): void {
        this.isCardFlippedCheckInCards = this.valueByStringPath.flipCard(index);
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
