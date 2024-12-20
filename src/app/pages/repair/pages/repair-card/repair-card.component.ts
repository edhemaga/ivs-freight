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
import { Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

// modules
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

// Models
import { CardDetails } from '@shared/models/card-models/card-table-data.model';
import { SendDataCard } from '@shared/models/card-models/send-data-card.model';
import { CardRows } from '@shared/models/card-models/card-rows.model';
import { CardDataResult } from '@shared/models/card-models/card-data-result.model';
import { MappedRepair } from '@pages/repair/pages/repair-table/models';

// Services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';

// Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';

// Helpers
import { CardHelper } from '@shared/utils/helpers/card-helper';

@Component({
    selector: 'app-repair-card',
    templateUrl: './repair-card.component.html',
    styleUrls: ['./repair-card.component.scss'],
    providers: [CardHelper],
})
export class RepairCardComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('parentElement', { read: ElementRef })
    private cardBodyElement!: ElementRef;

    @ViewChildren('itemsRepair', { read: ElementRef })
    public itemsContainers!: QueryList<ElementRef>;

    @Output() bodyActions: EventEmitter<SendDataCard> = new EventEmitter();

    // All data
    @Input() set viewData(value: CardDetails[]) {
        this._viewData = value;

        this.getDescriptionSpecialStyleIndexes();
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

    public elementWidth: number;

    private destroy$ = new Subject<void>();
    public isAllCardsFlipp: boolean = false;

    public cardsFront: CardDataResult[][][] = [];
    public cardsBack: CardDataResult[][][] = [];
    public titleArray: string[][] = [];

    constructor(
        private ngZone: NgZone,
        private renderer: Renderer2,
        public router: Router,

        // Services
        private tableService: TruckassistTableService,

        // Helpers
        private cardHelper: CardHelper
    ) {}

    ngOnInit() {
        this.flipAllCards();
    }

    ngAfterViewInit(): void {
        this.windowResizeUpdateDescriptionDropdown();

        this.windownResizeUpdateCountNumberInCards();
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

    // Description
    private getDescriptionSpecialStyleIndexes(): void {
        this._viewData = this._viewData.map((repair) => {
            const { items } = repair;

            const pmItemsIndexArray = [];

            items.forEach(
                (item, index) =>
                    (item?.pmTruck || item?.pmTrailer) &&
                    pmItemsIndexArray.push(index)
            );

            return {
                ...repair,
                pmItemsIndexArray,
            };
        });
    }

    public onShowDescriptionDropdown(
        popover: NgbPopover,
        card: MappedRepair
    ): void {
        const { isRepairOrder, tableDescription, tableDescriptionDropTotal } =
            card;

        const repairItemsData = {
            isRepairOrder,
            descriptionItems: tableDescription,
            totalCost: tableDescriptionDropTotal,
        };

        popover.isOpen()
            ? popover.close()
            : popover.open({ data: repairItemsData });
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

    public onCardActions(event: SendDataCard): void {
        this.bodyActions.emit(event);
    }

    public goToDetailsPage(card: CardDetails): void {
        if (this.selectedTab === TableStringEnum.REPAIR_SHOP)
            this.router.navigate([`/list/repair/${card.id}/details`]);
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
