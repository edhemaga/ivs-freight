import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

// Models
import { CardDetails } from '@shared/models/card-models/card-table-data.model';
import { SendDataCard } from '@shared/models/card-models/send-data-card.model';
import { CardRows } from '@shared/models/card-models/card-rows.model';
import { CardDataResult } from '@shared/models/card-models/card-data-result.model';

// Pipes
import { FormatCurrencyPipe } from '@shared/pipes/format-currency.pipe';
import { TimeFormatPipe } from '@shared/pipes/time-format-am-pm.pipe';

// Services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { DetailsDataService } from '@shared/services/details-data.service';
import { ModalService } from '@shared/services/modal.service';
import { ImageBase64Service } from '@shared/services/image-base64.service';

// Helpers
import { CardHelper } from '@shared/utils/helpers/card-helper';

// Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';

//Components
import { LoadModalComponent } from '@pages/load/pages/load-modal/load-modal.component';

// Svg-Routes
import { LoadCardSvgRoutes } from '@pages/load/pages/load-card/utils/svg-routes/load-card-svg-routes';

@Component({
    selector: 'app-load-card',
    templateUrl: './load-card.component.html',
    styleUrls: ['./load-card.component.scss'],
    providers: [FormatCurrencyPipe, TimeFormatPipe, CardHelper],
})
export class LoadCardComponent implements OnInit, OnDestroy {
    @Output() bodyActions: EventEmitter<SendDataCard> = new EventEmitter();

    @Input() set viewData(value: CardDetails[]) {
        this._viewData = value;
    }

    // Card body keys
    @Input() cardTitle: string;
    @Input() rows: number[];
    @Input() displayRowsFront: CardRows[];
    @Input() displayRowsBack: CardRows[];
    @Input() cardTitleLink: string;
    @Input() selectedTab: string;

    private destroy$ = new Subject<void>();

    // Array holding id of checked cards
    public isCheckboxCheckedArray: number[] = [];

    public isCardFlippedCheckInCards: number[] = [];

    public isAllCardsFlipp: boolean = false;
    public _viewData: CardDetails[];
    public cardsFront: CardDataResult[][][] = [];
    public cardsBack: CardDataResult[][][] = [];
    public titleArray: string[][] = [];

    public loadImageRoutes = LoadCardSvgRoutes;

    constructor(
        // Services
        private tableService: TruckassistTableService,
        private detailsDataService: DetailsDataService,
        private modalService: ModalService,
        public imageBase64Service: ImageBase64Service,

        // Router
        private router: Router,

        // Helpers
        private cardHelper: CardHelper
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

    // When checkbox is selected
    public onCheckboxSelect(index: number, card: CardDetails): void {
        this._viewData[index].isSelected = !this._viewData[index].isSelected;

        const checkedCard = this.onCheckboxSelect(index, card);

        this.tableService.sendRowsSelected(checkedCard);
    }

    // Flip card based on card index
    public flipCard(index: number): void {
        this.isCardFlippedCheckInCards = this.cardHelper.flipCard(index);
    }

    public goToDetailsPage(card: CardDetails): void {
        this.detailsDataService.setNewData(card);

        if (this.selectedTab === TableStringEnum.ACTIVE)
            this.router.navigate([`/list/load/${card.id}/broker-details`]);
        else this.router.navigate([`/list/load/${card.id}/shipper-details`]);
    }

    public trackCard(item: number): number {
        return item;
    }

    public onCardActions(event: any): void {
        if (event.type === TableStringEnum.EDIT) {
            this.modalService.openModal(
                LoadModalComponent,
                { size: TableStringEnum.SMALL },
                {
                    ...event,
                    type: TableStringEnum.EDIT,
                    openedTab:
                        event.type === TableStringEnum.ADD_CONTRACT
                            ? TableStringEnum.CONTRACT
                            : event.type === TableStringEnum.WRITE_REVIEW
                            ? TableStringEnum.REVIEW
                            : TableStringEnum.DETAIL,
                }
            );
        }
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
