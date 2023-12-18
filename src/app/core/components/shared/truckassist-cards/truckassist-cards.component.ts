import {
    Component,
    OnInit,
    Input,
    EventEmitter,
    Output,
    ViewEncapsulation,
    ElementRef,
    ViewChild,
    NgZone,
    QueryList,
    ViewChildren,
    Renderer2,
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

// Modules
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

// Components
import { AppTooltipComponent } from '../../standalone-components/app-tooltip/app-tooltip.component';
import { TaNoteComponent } from 'src/app/core/components/shared/ta-note/ta-note.component';
import { ProgresBarComponent } from './progres-bar/progres-bar.component';

// Pipes
import { formatDatePipe } from 'src/app/core/pipes/formatDate.pipe';
import { formatCurrency } from 'src/app/core/pipes/formatCurrency.pipe';
import { TaThousandSeparatorPipe } from 'src/app/core/pipes/taThousandSeparator.pipe';
import { CardArrayHelper } from './utils/card-array-helper';

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
    ],
})
export class TruckassistCardsComponent implements OnInit {
    @ViewChild('parentElement', { read: ElementRef })
    private cardBodyElement!: ElementRef;

    @ViewChildren('itemsRepair', { read: ElementRef })
    itemsContainers!: QueryList<ElementRef>;

    containerWidth: number = 0;
    itemWidth: number = 0;
    wordsArray: string[] = [];

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
    public descriptionTooltip: HTMLElement;

    constructor(
        private detailsDataService: DetailsDataService,
        private ngZone: NgZone,
        private renderer: Renderer2
    ) {}

    //---------------------------------------ON INIT---------------------------------------
    ngOnInit(): void {
        console.log(this.viewData);
    }

    //---------------------------------------ON AFTER INIT---------------------------------------
    ngAfterViewInit(): void {
        // On window resize update width of description popup
        if (this.cardBodyElement) {
            const parentElement = this.cardBodyElement
                .nativeElement as HTMLElement;

            const resizeObserver = new ResizeObserver(() => {
                const width = parentElement.offsetWidth;
                this.ngZone.run(() => {
                    console.log(width);
                    this.elementWidth = width;
                });
            });
            resizeObserver.observe(parentElement);
        }
        // On window resize update items count in Repair page
        if (this.cardBodyElement) {
            const parentElement = this.cardBodyElement
                .nativeElement as HTMLElement;

            const resizeObserver = new ResizeObserver(() => {
                // Setting count number for each card on page
                this.itemsContainers.forEach((containerRef: ElementRef) => {
                    this.calculateItemsToFit(containerRef.nativeElement);
                });
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
    public onCheckboxSelect(index: number): void {
        const indexSelected = this.isCheckboxCheckedArray.indexOf(index);

        if (indexSelected !== -1) {
            this.isCheckboxCheckedArray.splice(indexSelected, 1);
            this.isCardChecked = this.isCheckboxCheckedArray;
        } else {
            this.isCheckboxCheckedArray.push(index);
            this.isCardChecked = this.isCheckboxCheckedArray;
        }

        return;
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
            '.inner-dropdown-action-title'
        );

        innerDropdownContent.forEach((content) => {
            content.removeAllListeners('click');
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
    public onShowDescriptionDropdown(popup, card): void {
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
        return CardArrayHelper.getValueByStringPath(obj, ObjKey);
    }

    public onFinishOrder(card: CardDetails): void {
        this.bodyActions.emit({
            data: card,
            type: 'finish-order',
        });
    }

    // Setting count number for each card on page
    public calculateItemsToFit(container: HTMLElement): void {
        const content = container.textContent || '';
        const containerWidth = container.offsetWidth;
        const contentSentences = content
            .split('•')
            .map((sentence) => sentence.trim());

        let visibleSentencesCount = 0;
        let visibleWidth = 0;
        let remainingSentences = 0;

        for (let i = 0; i < contentSentences.length; i++) {
            // Creating test span for measuring the parent
            const testContent = contentSentences.slice(0, i + 1).join(' • '); // Reconstructing sentences
            const testElement = this.renderer.createElement('span');
            testElement.textContent = testContent;
            document.body.appendChild(testElement); // Append to the body to measure width
            const testWidth = testElement.offsetWidth;
            document.body.removeChild(testElement); // Remove element after measurement

            if (testWidth <= containerWidth) {
                visibleSentencesCount = i + 1;
                visibleWidth = testWidth;
            } else if (testWidth - 34 > containerWidth && i > 0) {
                remainingSentences =
                    contentSentences.length - visibleSentencesCount;
                const existingNewElement = container.parentNode.querySelector(
                    '.container-count.ta-font-medium'
                );
                if (existingNewElement) {
                    container.parentNode.removeChild(existingNewElement);
                }
                const newElement = this.renderer.createElement('div');
                newElement.className =
                    'container-count ta-font-medium d-flex justify-content-center';
                const text = this.renderer.createText('+' + remainingSentences);
                this.renderer.appendChild(newElement, text);
                this.renderer.insertBefore(
                    container.parentNode,
                    newElement,
                    container.nextSibling
                );
                break;
            }
        }
    }

    // Track By For Table Row
    public trackCard(item: number): number {
        return item;
    }
}
