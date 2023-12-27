import {
    Component,
    Input,
    EventEmitter,
    Output,
    ElementRef,
    ViewChild,
    NgZone,
    QueryList,
    ViewChildren,
    Renderer2,
    SimpleChanges,
    ViewEncapsulation,
} from '@angular/core';

// Models
import { CardRows, LoadTableData } from '../model/cardData';
import {
    DropdownItem,
    CardDetails,
    SendDataCard,
} from '../model/cardTableData';

// Services
import { DetailsDataService } from 'src/app/core/services/details-data/details-data.service';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';

// Modules
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbPopover, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

// Components
import { AppTooltipComponent } from '../../standalone-components/app-tooltip/app-tooltip.component';
import { TaNoteComponent } from 'src/app/core/components/shared/ta-note/ta-note.component';
import { ProgresBarComponent } from './progres-bar/progres-bar.component';

// Pipes
import { formatDatePipe } from 'src/app/core/pipes/formatDate.pipe';
import { formatCurrency } from 'src/app/core/pipes/formatCurrency.pipe';
import { TaThousandSeparatorPipe } from 'src/app/core/pipes/taThousandSeparator.pipe';
import { MaskNumberPipe } from './pipes/maskNumber.pipe';

// Helpers
import { CardArrayHelper } from './utils/card-array-helper';

// Enums
import { ConstantStringTableComponentsEnum } from 'src/app/core/utils/enums/table-components.enums';

@Component({
    selector: 'app-truckassist-cards',
    templateUrl: './truckassist-cards.component.html',
    styleUrls: ['./truckassist-cards.component.scss'],
    standalone: true,
    providers: [formatCurrency, formatDatePipe, TaThousandSeparatorPipe],
    encapsulation: ViewEncapsulation.None,
    imports: [
        //modules
        CommonModule,
        AngularSvgIconModule,
        NgbPopoverModule,
        NgbTooltipModule,

        //components
        AppTooltipComponent,
        TaNoteComponent,
        ProgresBarComponent,

        //pipes
        formatDatePipe,
        MaskNumberPipe,
    ],
})
export class TruckassistCardsComponent {
    @ViewChild('parentElement', { read: ElementRef })
    private cardBodyElement!: ElementRef;

    @ViewChildren('itemsRepair', { read: ElementRef })
    public itemsContainers!: QueryList<ElementRef>;

    public containerWidth: number = 0;
    public itemWidth: number = 0;
    public wordsArray: string[] = [];

    @Output() bodyActions: EventEmitter<SendDataCard> = new EventEmitter();

    // All data
    @Input() viewData: CardDetails[];
    @Input() tableData: LoadTableData[];

    // Page
    @Input() page: string;
    @Input() selectedTab: string;

    // For Front And back of the cards
    @Input() deadline: boolean;

    // Card body endpoints
    @Input() cardTitle: string;
    @Input() rows: number[];
    @Input() displayRowsFront: CardRows;
    @Input() displayRowsBack: CardRows;

    public isCardFlipped: Array<number> = [];
    public isCardChecked: Array<number> = [];
    public tooltip;
    public dropdownActions;
    public dropdownOpenedId: number;
    public dropDownIsOpened: number;
    public descriptionIsOpened: number;
    public cardData: CardDetails;
    public dropDownActive: number;

    // Array holding id of fliped cards
    public isCardFlippedArray: number[] = [];
    public elementWidth: number;

    // Array holding id of checked cards
    public isCheckboxCheckedArray: number[] = [];

    public activeDescriptionDropdown: number = -1;

    public descriptionTooltip: NgbPopover;
    public mySelection: { id: number; tableData: CardDetails }[] = [];

    constructor(
        private detailsDataService: DetailsDataService,
        private ngZone: NgZone,
        private renderer: Renderer2,
        private tableService: TruckassistTableService
    ) {}

    //---------------------------------------ON CHANGES---------------------------------------
    ngOnChanges(changes: SimpleChanges): void {
        if (
            this.page === ConstantStringTableComponentsEnum.REPAIR &&
            !changes.firstChange
        ) {
            setTimeout(() => {
                this.itemsContainers.forEach((containerRef: ElementRef) => {
                    this.calculateItemsToFit(containerRef.nativeElement);
                });
            }, 500);
        }
    }

    //---------------------------------------ON AFTER INIT---------------------------------------
    ngAfterViewInit(): void {
        this.windowResizeUpdateDescriptionDropdown();

        this.windownResizeUpdateCountNumberInCards();
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

    // When checkbox is selected
    public onCheckboxSelect(index: number, card: CardDetails): void {
        const indexSelected = this.isCheckboxCheckedArray.indexOf(index);
        this.mySelection.push({ id: card.id, tableData: card });
        if (indexSelected !== -1) {
            this.isCheckboxCheckedArray.splice(indexSelected, 1);
            this.isCardChecked = this.isCheckboxCheckedArray;
        } else {
            this.isCheckboxCheckedArray.push(index);
            this.isCardChecked = this.isCheckboxCheckedArray;
        }

        this.tableService.sendRowsSelected(this.mySelection);
    }

    // Show hide dropdown
    public toggleDropdown(tooltip, card: CardDetails): void {
        this.tooltip = tooltip;

        if (tooltip.isOpen()) {
            tooltip.close();
            this.dropDownIsOpened = null;
        } else {
            if (card?.tableDropdownContent?.content) {
                this.dropDownIsOpened = card.id;
                let actions = [...card.tableDropdownContent.content];

                actions = actions.map((actions: DropdownItem) => {
                    if (actions?.isDropdown) {
                        return {
                            ...actions,
                            isInnerDropActive: false,
                        };
                    }

                    return actions;
                });

                this.dropdownActions = [...actions];

                tooltip.open({ data: this.dropdownActions });
            }

            tooltip.open({ data: this.dropdownActions });
            this.detailsDataService.setNewData(card);
        }

        return;
    }

    // Remove Click Event On Inner Dropdown
    public onRemoveClickEventListener(): void {
        const innerDropdownContent = document.querySelectorAll(
            ConstantStringTableComponentsEnum.INNER_DROPDOWN_ACTION
        );

        innerDropdownContent.forEach((content) => {
            content.removeAllListeners(ConstantStringTableComponentsEnum.CLICK);
        });

        return;
    }

    // Dropdown Actions
    public onDropAction(action: DropdownItem, card: CardDetails): void {
        if (!action?.mutedStyle) {
            // Send Drop Action
            this.bodyActions.emit({
                id: this.dropDownActive,
                data: card,
                type: action.name,
            });
        }
        this.tooltip.close();
        return;
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

    public objectsWithDropDown(obj: CardDetails, ObjKey: string): string {
        return CardArrayHelper.objectsWithDropDown(obj, ObjKey);
    }

    //Remove quotes from string to convert into endpoint
    public getValueByStringPath(obj: CardDetails, ObjKey: string): string {
        if (ObjKey === ConstantStringTableComponentsEnum.SERVICE_TYPES) {
            CardArrayHelper.getValueByStringPath(obj, ObjKey);
        }
        return CardArrayHelper.getValueByStringPath(obj, ObjKey);
    }

    // Add favorite repairshop
    public onFavorite(card: CardDetails): void {
        this.bodyActions.emit({
            data: card,
            type: ConstantStringTableComponentsEnum.FAVORITE,
        });
    }

    // Finish repair
    public onFinishOrder(card: CardDetails): void {
        this.bodyActions.emit({
            data: card,
            type: ConstantStringTableComponentsEnum.FINISH_ORDER,
        });
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
                    'container-count ta-font-medium d-flex justify-content-center';

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

    // Track By For Table Row
    public trackCard(item: number): number {
        return item;
    }
}
