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
import { Router } from '@angular/router';

// Models
import { CardDetails } from '@shared/models/card-models/card-table-data.model';
import { SendDataCard } from '@shared/models/card-models/send-data-card.model';
import { CardRows } from '@shared/models/card-models/card-rows.model';
import { CardDataResult } from '@shared/models/card-models/card-data-result.model';
import { RepairData } from '@pages/repair/models/repair-data.model';

// Services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';

// Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';

// Helpers
import { CardHelper } from '@shared/utils/helpers/card-helper';

//Components
import { RepairOrderModalComponent } from '@pages/repair/pages/repair-modals/repair-order-modal/repair-order-modal.component';
import { RepairShopModalComponent } from '@pages/repair/pages/repair-modals/repair-shop-modal/repair-shop-modal.component';
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';

//Services
import { ModalService } from '@shared/services/modal.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { RepairService } from '@shared/services/repair.service';

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
    public descriptionTooltip: NgbPopover;
    public descriptionIsOpened: number;
    public activeDescriptionDropdown: number = -1;

    public elementWidth: number;

    private destroy$ = new Subject<void>();
    public isAllCardsFlipp: boolean = false;

    public cardsFront: CardDataResult[][][] = [];
    public cardsBack: CardDataResult[][][] = [];
    public titleArray: string[][] = [];

    public itemsForRepair: string[] = [];

    constructor(
        private ngZone: NgZone,
        private renderer: Renderer2,
        public router: Router,

        //Services
        private tableService: TruckassistTableService,
        private modalService: ModalService,
        private confiramtionService: ConfirmationService,
        private repairService: RepairService,

        //Helpers
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

    public onCardActions(event: RepairData): void {
        switch (event.type) {
            case TableStringEnum.VIEW_DETAILS:
                if (this.selectedTab === TableStringEnum.REPAIR_SHOP)
                    this.router.navigate([
                        `/list/repair/${event.id}/shop-details`,
                    ]);
                break;
            case TableStringEnum.DELETE_REPAIR:
            case TableStringEnum.DELETE:
                switch (this.selectedTab) {
                    case TableStringEnum.REPAIR_SHOP:
                        this.modalService.openModal(
                            ConfirmationModalComponent,
                            { size: TableStringEnum.SMALL },
                            {
                                ...event,
                                template: TableStringEnum.REPAIR_SHOP,
                                type: TableStringEnum.DELETE,
                            }
                        );

                        break;

                    default:
                        this.modalService.openModal(
                            ConfirmationModalComponent,
                            { size: TableStringEnum.SMALL },
                            {
                                ...event,
                                template: TableStringEnum.REPAIR_2,
                                type: TableStringEnum.DELETE,
                                subType:
                                    this.selectedTab === TableStringEnum.ACTIVE
                                        ? TableStringEnum.TRUCK
                                        : TableStringEnum.TRAILER_2,
                            }
                        );
                        break;
                }
                break;
            case TableStringEnum.EDIT:
                switch (this.selectedTab) {
                    case TableStringEnum.ACTIVE:
                        this.modalService.openModal(
                            RepairOrderModalComponent,
                            { size: TableStringEnum.LARGE },
                            {
                                ...event,
                                type: TableStringEnum.EDIT_TRUCK,
                            }
                        );
                        break;
                    case TableStringEnum.INACTIVE:
                        this.modalService.openModal(
                            RepairOrderModalComponent,
                            { size: TableStringEnum.LARGE },
                            {
                                ...event,
                                type: TableStringEnum.EDIT_TRAILER,
                            }
                        );
                        break;
                    default:
                        this.modalService.openModal(
                            RepairShopModalComponent,
                            { size: TableStringEnum.SMALL },
                            {
                                ...event,
                                openedTab: this.selectedTab,
                            }
                        );
                        break;
                }
                break;
            default:
                break;
        }
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
