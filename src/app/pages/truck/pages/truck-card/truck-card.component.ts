import {
    Component,
    EventEmitter,
    Input,
    Output,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

// models
import { CardRows } from '@shared/models/card-models/card-rows.model';
import { CardDetails } from '@shared/models/card-models/card-table-data.model';
import { CardDataResult } from '@shared/models/card-models/card-data-result.model';

// helpers
import { CardHelper } from '@shared/utils/helpers/card-helper';
import { TruckFeaturesDataHelper } from '@pages/truck/pages/truck-table/utils/helpers/truck-features-data.helper';

// constants
import { TruckCardIcons } from '@pages/truck/pages/truck-card/utils/constants/truck-card-icons.constants';

// services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { DetailsDataService } from '@shared/services/details-data.service';
import { TruckBodyResponse } from '@pages/truck/pages/truck-table/models/truck-body-response.model';

@Component({
    selector: 'app-truck-card',
    templateUrl: './truck-card.component.html',
    styleUrls: ['./truck-card.component.scss'],
    providers: [CardHelper],
})
export class TruckCardComponent implements OnInit, OnDestroy {
    @Input() set viewData(value: CardDetails[]) {
        this._viewData = value;
    }
    @Input() cardTitle: string;
    @Input() displayRowsFront: CardRows[];
    @Input() displayRowsBack: CardRows[];
    @Output() onCardAction = new EventEmitter<TruckBodyResponse>();
    public isCardFlippedCheckInCards: number[] = [];

    private destroy$ = new Subject<void>();
    public isAllCardsFlipp: boolean = false;
    public _viewData: CardDetails[];
    public cardsFront: CardDataResult[][][] = [];
    public cardsBack: CardDataResult[][][] = [];
    public titleArray: string[][] = [];
    public truckCardImageRoutes = TruckCardIcons;
    constructor(
        private tableService: TruckassistTableService,
        private cardHelper: CardHelper,
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
                this.isAllCardsFlipp = res;

                this.isCardFlippedCheckInCards = [];
                this.cardHelper.isCardFlippedArrayComparasion = [];
            });
    }

    // Flip card based on card index
    public flipCard(index: number): void {
        this.isCardFlippedCheckInCards = this.cardHelper.flipCard(index);
    }
    public goToDetailsPage(card: CardDetails, link: string): void {
        this.detailsDataService.setNewData(card);

        this.router.navigate([link]);
    }
    // When checkbox is selected
    public onCheckboxSelect(index: number, card: CardDetails): void {
        this._viewData[index].isSelected = !this._viewData[index].isSelected;

        const checkedCard = this.cardHelper.onCheckboxSelect(index, card);

        this.tableService.sendRowsSelected(checkedCard);
    }

    public trackCard(id: number): number {
        return id;
    }
    public onCardActions(event: TruckBodyResponse): void {
        this.onCardAction.emit(event);
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
