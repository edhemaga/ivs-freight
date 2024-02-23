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
import { CardArrayHelper } from '../../../helpers/card-array-helper';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { ConstantStringTableComponentsEnum } from 'src/app/core/utils/enums/table-components.enums';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

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

    public isCardFlippedArray: number[] = [];
    public isCardFlipped: Array<number> = [];

    public descriptionTooltip: NgbPopover;
    public descriptionIsOpened: number;
    public activeDescriptionDropdown: number = -1;

    public elementWidth: number;

    constructor(
        private tableService: TruckassistTableService,
        private ngZone: NgZone,
        private renderer: Renderer2
    ) {}

    ngOnChanges(): void {
        setTimeout(() => {
            this.itemsContainers.forEach((containerRef: ElementRef) => {
                this.calculateItemsToFit(containerRef.nativeElement);
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
                    if (width !== undefined) {
                        this.itemsContainers.forEach(
                            (containerRef: ElementRef) => {
                                this.calculateItemsToFit(
                                    containerRef.nativeElement
                                );
                            }
                        );
                    }
                }
            });

            resizeObserver.observe(parentElement);
        }
    }

    // Setting count number for each card on page
    public calculateItemsToFit(container: HTMLElement): void {
        const content =
            container?.textContent ||
            ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER;

        const containerWidth = container?.offsetWidth;

        const contentSentences = content
            .split('•')
            .map((sentence) => sentence.trim());

        let visibleSentencesCount = 0;
        let visibleWidth = 0;
        let remainingSentences = 0;

        for (let i = 0; i < contentSentences.length; i++) {
            // Creating test span for measuring the parent

            const testContent = contentSentences
                .slice(0, i + 1)
                .join(ConstantStringTableComponentsEnum.SEPARATOR); // Reconstructing sentences

            const testElement = this.renderer.createElement(
                ConstantStringTableComponentsEnum.SPAN
            );

            testElement.textContent = testContent;

            this.renderer.appendChild(document.body, testElement); // Append to the body to measure width

            const testWidth = testElement?.offsetWidth;

            this.renderer.removeChild(document.body, testElement); // Remove element after measurement

            if (testWidth <= containerWidth) {
                visibleSentencesCount = i + 2;
                visibleWidth = testWidth;
            } else if (testWidth - 34 > containerWidth && i > 0) {
                remainingSentences =
                    contentSentences.length - visibleSentencesCount;

                const existingNewElement = container.parentNode.querySelector(
                    ConstantStringTableComponentsEnum.CONTAINER_COUNT_TA_FONT_MEDIUM
                );

                if (existingNewElement) {
                    this.renderer.removeChild(container, existingNewElement);
                }

                const newElement = this.renderer.createElement(
                    ConstantStringTableComponentsEnum.DIV
                );

                newElement.className =
                    'container-count ta-font-medium d-flex justify-content-center align-items-center';

                if (remainingSentences > 0) {
                    const text = this.renderer.createText(
                        ConstantStringTableComponentsEnum.PLUS +
                            remainingSentences
                    );

                    this.renderer.appendChild(newElement, text);

                    this.renderer.insertBefore(
                        container?.parentNode,
                        newElement,
                        container.nextSibling
                    );
                }
                break;
            }
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
        const indexSelected = this.isCardFlippedArray.indexOf(index);

        if (indexSelected !== -1) {
            this.isCardFlippedArray.splice(indexSelected, 1);
            this.isCardFlipped = this.isCardFlippedArray;
        } else {
            this.isCardFlippedArray.push(index);
            this.isCardFlipped = this.isCardFlippedArray;
        }

        return;
    }

    public trackCard(item: number): number {
        return item;
    }
}
