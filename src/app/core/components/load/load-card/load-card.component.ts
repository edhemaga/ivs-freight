import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CardDetails } from '../../shared/model/card-table-data.model';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

// pipes
import { formatCurrency } from 'src/app/core/pipes/formatCurrency.pipe';
import { FormatNumberMiPipe } from 'src/app/core/pipes/formatMiles.pipe';

// models
import { CardRows } from '../../shared/model/cardData';

// services
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { DetailsDataService } from 'src/app/core/services/details-data/details-data.service';

// helpers
import { ValueByStringPath } from 'src/app/core/helpers/cards-helper';
import { LoadServiceModal } from '../../modals/cards-modal/state/service/load.service';
import { LoadQuery } from '../../modals/cards-modal/state/store/load-modal.query';

@Component({
    selector: 'app-load-card',
    templateUrl: './load-card.component.html',
    styleUrls: ['./load-card.component.scss'],
    providers: [FormatNumberMiPipe, formatCurrency, ValueByStringPath],
})
export class LoadCardComponent implements OnInit, OnDestroy {
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

    private destroy$ = new Subject<void>();
    public isAllCardsFlipp: boolean = false;

    public cardData: CardDetails;

    public isCardFlippedCheckInCards: number[] = [];

    templateData: any;
    pendingData: any;
    activeData: any;
    closedData: any;

    constructor(
        private tableService: TruckassistTableService,
        private detailsDataService: DetailsDataService,
        private router: Router,
        private valueByStringPath: ValueByStringPath,
        private loadQuery: LoadQuery
    ) {}

    ngOnInit() {
        this.flipAllCards();

        this.getAllData();
    }

    getAllData() {
        this.loadQuery.pending$.subscribe((data) => {
            console.log(data);
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

        const checkedCard = this.valueByStringPath.onCheckboxSelect(
            index,
            card
        );

        this.tableService.sendRowsSelected(checkedCard);
    }

    // For closed tab status return true false to style status
    public checkLoadStatus(
        card: CardDetails,
        endpoint: string,
        value: string
    ): boolean {
        return (
            this.valueByStringPath.getValueByStringPath(card, endpoint) ===
            value
        );
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
