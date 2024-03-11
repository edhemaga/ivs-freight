import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

// model
import { CardDetails } from '../../shared/model/card-table-data.model';
import { CardRows } from '../../shared/model/card-data.model';

// services
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';

// helpers
import { ValueByStringPath } from 'src/app/core/helpers/cards-helper';

@Component({
    selector: 'app-driver-card',
    templateUrl: './driver-card.component.html',
    styleUrls: ['./driver-card.component.scss'],
})
export class DriverCardComponent implements OnInit, OnDestroy {
    // All data
    @Input() viewData: CardDetails[];
    @Input() selectedTab: string;

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

    public trackCard(id: number): number {
        return id;
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
