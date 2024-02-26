import { Component, Input, OnDestroy, OnInit } from '@angular/core';

// models
import { CardRows } from '../../shared/model/cardData';
import { CardDetails } from '../../shared/model/card-table-data.model';

// helpers
import { ValueByStringPath } from 'src/app/core/helpers/cards-helper';
import { Subject, takeUntil } from 'rxjs';

// services
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';

@Component({
    selector: 'app-truck-card',
    templateUrl: './truck-card.component.html',
    styleUrls: ['./truck-card.component.scss'],
})
export class TruckCardComponent implements OnInit, OnDestroy {
    @Input() viewData: CardDetails[];

    @Input() cardTitle: string;
    @Input() displayRowsFront: CardRows;
    @Input() displayRowsBack: CardRows;

    public valueByStringPathInstance = new ValueByStringPath();

    public isCardFlippedCheckInCards: number[] = [];

    private destroy$ = new Subject<void>();
    public allCardsFlipp: boolean = false;

    constructor(private tableService: TruckassistTableService) {}

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

    // Flip card based on card index
    public flipCard(index: number): void {
        this.isCardFlippedCheckInCards =
            this.valueByStringPathInstance.flipCard(index);
    }

    public trackCard(id: number): number {
        return id;
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
