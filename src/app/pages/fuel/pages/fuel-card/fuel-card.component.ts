import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    NgZone,
    OnDestroy,
    OnInit,
    Output,
    QueryList,
    Renderer2,
    ViewChild,
    ViewChildren,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

// models
import { CardRows } from '@shared/models/card-models/card-rows.model';
import { CardDetails } from '@shared/models/card-models/card-table-data.model';
import { CardDataResult } from '@shared/models/card-models/card-data-result.model';
import { SendDataCard } from '@shared/models/card-models/send-data-card.model';
import { MappedRepair } from '@pages/repair/pages/repair-table/models';

// helpers
import { CardHelper } from '@shared/utils/helpers/card-helper';

// services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

// utils
import { FuelCardSvgRoutes } from '@pages/fuel/pages/fuel-card/utils/svg-routes/fuel-card-svg-routes';

@Component({
    selector: 'app-fuel-card',
    templateUrl: './fuel-card.component.html',
    styleUrls: ['./fuel-card.component.scss'],
    providers: [CardHelper],
})
export class FuelCardComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('parentElement', { read: ElementRef })
    private cardBodyElement!: ElementRef;

    @ViewChildren('itemsRepair', { read: ElementRef })
    public itemsContainers!: QueryList<ElementRef>;

    @Output() bodyActions: EventEmitter<SendDataCard> = new EventEmitter();

    @Input() set viewData(value: CardDetails[]) {
        this._viewData = value;
    }

    // Card body endpoints
    @Input() cardTitle: string;
    @Input() rows: number[];
    @Input() displayRowsFront: CardRows[];
    @Input() displayRowsBack: CardRows[];
    @Input() cardTitleLink: string;
    @Input() selectedTab: string;

    public isCardFlippedCheckInCards: number[] = [];
    public _viewData: CardDetails[];
    public cardsFront: CardDataResult[][][] = [];
    public cardsBack: CardDataResult[][][] = [];
    public isAllCardsFlipp: boolean;

    public elementWidth: number;

    public fuelImageRoutes = FuelCardSvgRoutes;

    private destroy$ = new Subject<void>();

    constructor(
        private ngZone: NgZone,
        private renderer: Renderer2,

        // services
        private tableService: TruckassistTableService,

        // helpers
        private cardHelper: CardHelper
    ) {}

    ngOnInit() {
        this.flipAllCards();
    }

    ngAfterViewInit(): void {
        this.windowResizeUpdateDescriptionDropdown();

        this.windownResizeUpdateCountNumberInCards();
    }

    public windownResizeUpdateCountNumberInCards(): void {
        if (this.cardBodyElement) {
            const parentElement = this.cardBodyElement
                .nativeElement as HTMLElement;

            const resizeObserver = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    const { width } = entry.contentRect;
                    if (width) {
                        this.itemsContainers.forEach(
                            (containerRef: ElementRef) => {
                                this.cardHelper.calculateItemsToFit(
                                    containerRef.nativeElement,
                                    this.renderer
                                );
                            }
                        );
                    }
                }
            });

            resizeObserver.observe(parentElement);
        }
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

        const checkedCard = this.cardHelper.onCheckboxSelect(index, card);

        this.tableService.sendRowsSelected(checkedCard);
    }

    // Flip card based on card index
    public flipCard(index: number): void {
        this.isCardFlippedCheckInCards = this.cardHelper.flipCard(index);
    }

    public trackCard(item: number): number {
        return item;
    }

    public onCardActions(event: SendDataCard): void {
        this.bodyActions.emit(event);
    }

    // Description
    public onShowDescriptionDropdown(
        popover: NgbPopover,
        card: MappedRepair
    ): void {
        const { tableDescription, tableDescriptionDropTotal } = card;

        const fuelItemsData = {
            descriptionItems: tableDescription,
            totalCost: tableDescriptionDropTotal,
        };

        popover.isOpen()
            ? popover.close()
            : popover.open({ data: fuelItemsData });
    }

    // On window resize update width of description popup
    public windowResizeUpdateDescriptionDropdown(): void {
        if (this.cardBodyElement) {
            const parentElement = this.cardBodyElement
                .nativeElement as HTMLElement;

            const resizeObserver = new ResizeObserver(() => {
                const width = parentElement.offsetWidth;

                this.ngZone.run(() => {
                    this.elementWidth = width;
                });
            });

            resizeObserver.observe(parentElement);
        }
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
