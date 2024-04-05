import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    NgZone,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    QueryList,
    Renderer2,
    SimpleChanges,
    ViewChild,
    ViewChildren,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

// Models
import {
    CardDetails,
    SendDataCard,
} from 'src/app/shared/models/card-table-data.model';
import {
    CardRows,
    DataResult,
} from 'src/app/core/components/shared/model/card-data.model';

// Services
import { TruckassistTableService } from 'src/app/shared/services/truckassist-table.service';

// Enums
import { TableStringEnum } from 'src/app/shared/enums/table-string.enum';

// Helpers
import { CardArrayHelper } from 'src/app/shared/utils/helpers/card-array-helper';
import { CardHelper } from 'src/app/shared/utils/helpers/card-helper';

@Component({
    selector: 'app-repair-card',
    templateUrl: './repair-card.component.html',
    styleUrls: ['./repair-card.component.scss'],
    providers: [CardHelper],
})
export class RepairCardComponent
    implements OnInit, OnChanges, AfterViewInit, OnDestroy
{
    @ViewChild('parentElement', { read: ElementRef })
    private cardBodyElement!: ElementRef;

    @ViewChildren('itemsRepair', { read: ElementRef })
    public itemsContainers!: QueryList<ElementRef>;

    @Output() bodyActions: EventEmitter<SendDataCard> = new EventEmitter();

    // All data
    @Input() viewData: CardDetails[];

    // Card body endpoints
    @Input() cardTitle: string;
    @Input() rows: number[];
    @Input() displayRowsFront: CardRows[];
    @Input() displayRowsBack: CardRows[];
    @Input() cardTitleLink: string;

    public isCardFlippedCheckInCards: number[] = [];

    public descriptionTooltip: NgbPopover;
    public descriptionIsOpened: number;
    public activeDescriptionDropdown: number = -1;

    public elementWidth: number;

    private destroy$ = new Subject<void>();
    public isAllCardsFlipp: boolean = false;

    public cardsFront: DataResult[][][] = [];
    public cardsBack: DataResult[][][] = [];
    public titleArray: string[][] = [];

    public itemsForRepair: string[] = [];

    constructor(
        private tableService: TruckassistTableService,
        private ngZone: NgZone,
        private renderer: Renderer2,
        private cardHelper: CardHelper
    ) {}

    ngOnInit() {
        this.flipAllCards();
    }

    ngOnChanges(cardChanges: SimpleChanges): void {
        setTimeout(() => {
            this.itemsContainers.forEach((containerRef: ElementRef) => {
                this.cardHelper.calculateItemsToFit(
                    containerRef.nativeElement,
                    this.renderer
                );
            });
        }, 500);

        if (
            cardChanges?.displayRowsBack?.currentValue ||
            cardChanges?.displayRowsFront?.currentValue ||
            cardChanges?.viewData?.currentValue
        ) {
            this.getTransformedCardsData();
            this.objectsWithDropDown();
        }
    }

    ngAfterViewInit(): void {
        this.windowResizeUpdateDescriptionDropdown();

        this.windownResizeUpdateCountNumberInCards();
    }

    public getTransformedCardsData(): void {
        this.cardsFront = [];
        this.cardsBack = [];
        this.titleArray = [];

        const cardTitles = this.cardHelper.renderCards(
            this.viewData,
            this.cardTitle,
            null
        );

        const frontOfCards = this.cardHelper.renderCards(
            this.viewData,
            null,
            this.displayRowsFront
        );

        const backOfCards = this.cardHelper.renderCards(
            this.viewData,
            null,
            this.displayRowsBack
        );

        this.cardsFront = [...this.cardsFront, frontOfCards.dataForRows];

        this.cardsBack = [...this.cardsBack, backOfCards.dataForRows];

        this.titleArray = [...this.titleArray, cardTitles.cardsTitle];
    }

    public objectsWithDropDown(): void {
        this.itemsForRepair = [];

        this.viewData.forEach((row) => {
            this.itemsForRepair = [
                ...this.itemsForRepair,
                CardArrayHelper.objectsWithDropDown(row, 'items'),
            ];
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

        const checkedCard = this.cardHelper.onCheckboxSelect(index, card);

        this.tableService.sendRowsSelected(checkedCard);
    }

    // Description
    public onShowDescriptionDropdown(
        popup: NgbPopover,
        card: CardDetails
    ): void {
        if (card.descriptionItems.length > 1) {
            this.descriptionTooltip = popup;

            if (popup.isOpen()) {
                popup.close();
                this.descriptionIsOpened = null;
            } else {
                popup.open({ data: card });
                this.descriptionIsOpened = card.id;
            }

            this.activeDescriptionDropdown = popup.isOpen() ? card.id : -1;
        }
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

    // On window resize update items count in Repair page
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

    // Finish repair
    public onFinishOrder(card: CardDetails): void {
        this.bodyActions.emit({
            data: card,
            type: TableStringEnum.FINISH_ORDER,
        });
    }

    // Flip card based on card index
    public flipCard(index: number): void {
        this.isCardFlippedCheckInCards = this.cardHelper.flipCard(index);
    }

    public trackCard(item: number): number {
        return item;
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
