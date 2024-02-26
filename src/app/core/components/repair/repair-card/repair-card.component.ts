import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    NgZone,
    OnChanges,
    Output,
    QueryList,
    Renderer2,
    ViewChild,
    ViewChildren,
} from '@angular/core';
import { CardRows } from '../../shared/model/cardData';
import {
    CardDetails,
    SendDataCard,
} from '../../shared/model/card-table-data.model';
import { ValueByStringPath } from 'src/app/core/helpers/cards-helper';

// Helpers
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { ConstantStringTableComponentsEnum } from 'src/app/core/utils/enums/table-components.enum';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { CardArrayHelper } from 'src/app/core/helpers/card-array-helper';

@Component({
    selector: 'app-repair-card',
    templateUrl: './repair-card.component.html',
    styleUrls: ['./repair-card.component.scss'],
})
export class RepairCardComponent implements OnChanges, AfterViewInit {
    @ViewChild('parentElement', { read: ElementRef })
    private cardBodyElement!: ElementRef;

    @ViewChildren('itemsRepair', { read: ElementRef })
    public itemsContainers!: QueryList<ElementRef>;

    @Output() bodyActions: EventEmitter<SendDataCard> = new EventEmitter();

    public valueByStringPathInstance = new ValueByStringPath();

    // All data
    @Input() viewData: CardDetails[];

    // Card body endpoints
    @Input() cardTitle: string;
    @Input() rows: number[];
    @Input() displayRowsFront: CardRows;
    @Input() displayRowsBack: CardRows;
    @Input() cardTitleLink: string;

    public isCardFlippedCheckInCards: number[] = [];

    public descriptionTooltip: NgbPopover;
    public descriptionIsOpened: number;
    public activeDescriptionDropdown: number = -1;

    public elementWidth: number;

    public ValueByStringPath = new ValueByStringPath();

    constructor(
        private tableService: TruckassistTableService,
        private ngZone: NgZone,
        private renderer: Renderer2
    ) {}

    ngOnChanges(): void {
        setTimeout(() => {
            this.itemsContainers.forEach((containerRef: ElementRef) => {
                this.ValueByStringPath.calculateItemsToFit(
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

    // When checkbox is selected
    public onCheckboxSelect(index: number, card: CardDetails): void {
        this.viewData[index].isSelected = !this.viewData[index].isSelected;

        const checkedCard = this.valueByStringPathInstance.onCheckboxSelect(
            index,
            card
        );

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
                                this.ValueByStringPath.calculateItemsToFit(
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

    public objectsWithDropDown(obj: CardDetails, ObjKey: string): string {
        return CardArrayHelper.objectsWithDropDown(obj, ObjKey);
    }

    // Finish repair
    public onFinishOrder(card: CardDetails): void {
        this.bodyActions.emit({
            data: card,
            type: ConstantStringTableComponentsEnum.FINISH_ORDER,
        });
    }

    // Flip card based on card index
    public flipCard(index: number): void {
        this.isCardFlippedCheckInCards =
            this.valueByStringPathInstance.flipCard(index);
    }

    public trackCard(item: number): number {
        return item;
    }
}
