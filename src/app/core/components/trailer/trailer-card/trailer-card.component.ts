import { Subject, takeUntil } from 'rxjs';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';

// models
import { CardRows } from '../../shared/model/card-data.model';
import { CardDetails } from '../../shared/model/card-table-data.model';

// helpers
import { ValueByStringPath } from 'src/app/core/helpers/cards-helper';

// services
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';

@Component({
    selector: 'app-trailer-card',
    templateUrl: './trailer-card.component.html',
    styleUrls: ['./trailer-card.component.scss'],
})
export class TrailerCardComponent implements OnInit, OnDestroy {
    @Input() viewData: CardDetails[];

    @Input() cardTitle: string;
    @Input() displayRowsFront: CardRows;
    @Input() displayRowsBack: CardRows;

    private destroy$ = new Subject<void>();
    public isAllCardsFlipp: boolean = false;

    public valueByStringPathInstance = new ValueByStringPath();

    public isCardFlippedCheckInCards: number[] = [];

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

    // Flip card based on card index
    public flipCard(index: number): void {
        this.isCardFlippedCheckInCards =
            this.valueByStringPathInstance.flipCard(index);
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

    public trackCard(id: number): number {
        return id;
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
