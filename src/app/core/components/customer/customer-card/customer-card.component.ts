import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

// models
import {
    CardDetails,
    SendDataCard,
} from '../../shared/model/card-table-data.model';
import { CardRows } from '../../shared/model/cardData';

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
    providers: [formatCurrency, TimeFormatPipe],
})
export class CustomerCardComponent {
    @Output() bodyActions: EventEmitter<SendDataCard> = new EventEmitter();

    @Input() viewData: CardDetails[];

    // Card body endpoints
    @Input() cardTitle: string;
    @Input() rows: number[];
    @Input() displayRowsFront: CardRows;
    @Input() displayRowsBack: CardRows;
    @Input() cardTitleLink: string;

    private destroy$ = new Subject<void>();

    // Array holding id of checked cards
    public isCheckboxCheckedArray: number[] = [];

    public isCardFlippedCheckInCards: number[] = [];

    public valueByStringPathInstance = new ValueByStringPath();

    public allCardsFlipp: boolean = false;

    constructor(
        private tableService: TruckassistTableService,
        private detailsDataService: DetailsDataService,
        private router: Router
    ) {}

    ngOnInit() {
        this.flipAllCards();
    }

    public flipAllCards(): void {
        this.tableService.isFlipedAllCards
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                this.allCardsFlipp = res;
            });
    }

    // When checkbox is selected
    public onCheckboxSelect(index: number, card: CardDetails): void {
        this.viewData[index].isSelected = !this.viewData[index].isSelected;

        const checkedCard = this.valueByStringPathInstance.onCheckboxSelect(
            index,
            card
        );

        this.tableService.sendRowsSelected(checkedCard);
    }

    // Flip card based on card index
    public flipCard(index: number): void {
        this.isCardFlippedCheckInCards =
            this.valueByStringPathInstance.flipCard(index);
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
