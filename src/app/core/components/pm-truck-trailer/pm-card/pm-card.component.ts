import { Component, Input } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

// models
import { CardDetails } from '../../shared/model/card-table-data.model';
import { CardRows } from '../../shared/model/card-data.model';

// helpers
import { ValueByStringPath } from 'src/app/core/helpers/cards-helper';

// services
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';

@Component({
    selector: 'app-pm-card',
    templateUrl: './pm-card.component.html',
    styleUrls: ['./pm-card.component.scss'],
})
export class PmCardComponent {
    // All data
    @Input() viewData: CardDetails[];

    // Page
    @Input() selectedTab: string;

    // Card body endpoints
    @Input() cardTitle: string;
    @Input() rows: number[];
    @Input() displayRowsFront: CardRows;
    @Input() displayRowsBack: CardRows;
    @Input() cardTitleLink: string;

    public valueByStringPathInstance = new ValueByStringPath();

    public cardData: CardDetails;

    public isCardFlippedCheckInCards: number[] = [];

    private destroy$ = new Subject<void>();
    public isAllCardsFlipp: boolean = false;

    constructor(private tableService: TruckassistTableService) {}

    ngOnInit() {
        this.flipAllCards();
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

    public trackCard(item: number): number {
        return item;
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
