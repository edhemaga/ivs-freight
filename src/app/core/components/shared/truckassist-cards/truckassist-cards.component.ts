import {
    FormControl,
    FormsModule,
    ReactiveFormsModule,
    UntypedFormArray,
    UntypedFormControl,
} from '@angular/forms';
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
    OnInit,
    ChangeDetectionStrategy,
} from '@angular/core';
import { Router } from '@angular/router';

// Models
import { CardRows, LoadTableData } from '../model/cardData';
import {
    DropdownItem,
    CardDetails,
    SendDataCard,
} from '../model/cardTableData';
import { CompanyAccountLabelResponse } from 'appcoretruckassist';
import { tableBodyColorLabel } from '../model/tableBody';

// Services
import { DetailsDataService } from 'src/app/core/services/details-data/details-data.service';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';

// Modules
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import {
    NgbModule,
    NgbPopover,
    NgbPopoverModule,
} from '@ng-bootstrap/ng-bootstrap';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

// Components
import { AppTooltipComponent } from '../../standalone-components/app-tooltip/app-tooltip.component';
import { TaNoteComponent } from 'src/app/core/components/shared/ta-note/ta-note.component';
import { ProgresBarComponent } from './progres-bar/progres-bar.component';
import { TaInputDropdownLabelComponent } from '../ta-input-dropdown-label/ta-input-dropdown-label.component';
import { TaLikeDislikeComponent } from '../ta-like-dislike/ta-like-dislike.component';
import { TaInputDropdownTableComponent } from '../../standalone-components/ta-input-dropdown-table/ta-input-dropdown-table.component';

// Pipes
import { formatDatePipe } from 'src/app/core/pipes/formatDate.pipe';
import { formatCurrency } from 'src/app/core/pipes/formatCurrency.pipe';
import { TaThousandSeparatorPipe } from 'src/app/core/pipes/taThousandSeparator.pipe';
import { MaskNumberPipe } from './pipes/maskNumber.pipe';
import { FormatNumberMiPipe } from 'src/app/core/pipes/formatMiles.pipe';
import { TimeFormatPipe } from 'src/app/core/pipes/time-format-am-pm.pipe';

// Helpers
import { CardArrayHelper } from './utils/helpers/card-array-helper';

// Enums
import { ConstantStringTableComponentsEnum } from 'src/app/core/utils/enums/table-components.enums';
import { HidePasswordPipe } from 'src/app/core/pipes/hide-password.pipe';

// Directives
import { TextToggleDirective } from './directives/show-hide-pass.directive';
@Component({
    selector: 'app-truckassist-cards',
    templateUrl: './truckassist-cards.component.html',
    styleUrls: ['./truckassist-cards.component.scss'],
    standalone: true,
    providers: [
        formatCurrency,
        formatDatePipe,
        TaThousandSeparatorPipe,
        FormatNumberMiPipe,
        TimeFormatPipe,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //modules
        CommonModule,
        AngularSvgIconModule,
        NgbPopoverModule,
        NgbTooltipModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,

        //components
        AppTooltipComponent,
        TaNoteComponent,
        ProgresBarComponent,
        TaInputDropdownLabelComponent,
        TaLikeDislikeComponent,
        TaInputDropdownTableComponent,

        //pipes
        formatDatePipe,
        MaskNumberPipe,
        HidePasswordPipe,
        FormatNumberMiPipe,
        TimeFormatPipe,

        // Directives
        TextToggleDirective,
    ],
})
export class TruckassistCardsComponent implements OnInit {
    @ViewChild('parentElement', { read: ElementRef })
    private cardBodyElement!: ElementRef;

    @ViewChild('innerDropdownContent') innerDropdownContent: ElementRef;

    @ViewChildren('itemsRepair', { read: ElementRef })
    public itemsContainers!: QueryList<ElementRef>;

    public containerWidth: number = 0;

    public dropdownSelectionArray = new UntypedFormArray([]);

    public selectedContactLabel: CompanyAccountLabelResponse[] = [];

    @Output() bodyActions: EventEmitter<SendDataCard> = new EventEmitter();

    // All data
    @Input() viewData: CardDetails[];
    @Input() tableData: LoadTableData[];

    // Page
    @Input() page: string;

    // Card body endpoints
    @Input() cardTitle: string;
    @Input() rows: number[];
    @Input() displayRowsFront: CardRows;
    @Input() displayRowsBack: CardRows;
    @Input() activeTab: string;
    @Input() cardTitleLink: string;

    public isCardFlipped: Array<number> = [];
    public tooltip;
    public dropdownActions;
    public dropdownOpenedId: number;
    public dropDownIsOpened: number;
    public descriptionIsOpened: number;
    public cardData: CardDetails;
    public dropDownActive: number;
    public selectedContactColor: CompanyAccountLabelResponse;
    public ownerFormControl: UntypedFormControl = new UntypedFormControl();

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
        private tableService: TruckassistTableService,
        private formatCurrencyPipe: formatCurrency,
        private formatDatePipe: formatDatePipe,
        private formatNumberMi: FormatNumberMiPipe,
        private timeFormatPipe: TimeFormatPipe,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.viewData.length && this.labelDropdown();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.resetCheckedCardsOnTabSwitch();
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

    ngAfterViewInit(): void {
        this.windowResizeUpdateDescriptionDropdown();

        this.windownResizeUpdateCountNumberInCards();
    }

    public resetCheckedCardsOnTabSwitch(): void {
        this.isCardFlipped = [];
        this.mySelection = [];
        this.tableService.sendRowsSelected([]);
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
        this.viewData[index].isSelected = !this.viewData[index].isSelected;
        const indexSelected = this.isCheckboxCheckedArray.indexOf(index);

        if (indexSelected !== -1) {
            this.mySelection = this.mySelection.filter(
                (item) => item.id !== card.id
            );
            this.isCheckboxCheckedArray.splice(indexSelected, 1);
        } else {
            this.mySelection.push({ id: card.id, tableData: card });
            this.isCheckboxCheckedArray.push(index);
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

            this.dropDownActive = tooltip.isOpen() ? card.id : -1;
            this.cardData = card;
            tooltip.open({ data: this.dropdownActions });
            this.detailsDataService.setNewData(card);
        }

        return;
    }

    // Dropdown Actions
    public onDropAction(action: DropdownItem): void {
        if (!action?.mutedStyle) {
            // Send Drop Action

            this.bodyActions.emit({
                id: this.dropDownActive,
                data: this.cardData,
                type: action.name,
            });
        }
        this.tooltip.close();
        return;
    }

    public onShowInnerDropdown(action): void {
        const newDropdownActions = [...this.dropdownActions];

        newDropdownActions.map((actions) => {
            if (
                actions.isDropdown &&
                actions.isInnerDropActive &&
                actions.title !== action.title
            ) {
                actions.isInnerDropActive = false;
                actions.innerDropElement = null;
            }
        });

        this.dropdownActions = [...newDropdownActions];

        action.isInnerDropActive = !action.isInnerDropActive;
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

    // For closed tab status return true false to style status
    public checkLoadStatus(
        card: CardDetails,
        endpoint: string,
        value: string
    ): boolean {
        return this.getValueByStringPath(card, endpoint) === value;
    }

    //Remove quotes from string to convert into endpoint
    public getValueByStringPath(
        obj: CardDetails,
        ObjKey: string,
        format?: string
    ): string {
        if (ObjKey === ConstantStringTableComponentsEnum.NO_ENDPOINT)
            return ConstantStringTableComponentsEnum.NO_ENDPOINT_2;

        const isValueOfKey = !ObjKey.split(
            ConstantStringTableComponentsEnum.DOT_1
        ).reduce((acc, part) => acc && acc[part], obj);

        const isNotZeroValueOfKey =
            ObjKey.split(ConstantStringTableComponentsEnum.DOT_1).reduce(
                (acc, part) => acc && acc[part],
                obj
            ) !== 0;

        switch (format) {
            case ConstantStringTableComponentsEnum.MONEY:
                return this.formatCurrencyPipe.transform(
                    ObjKey.split(
                        ConstantStringTableComponentsEnum.DOT_1
                    ).reduce((acc, part) => acc && acc[part], obj)
                );

            // Transform to date format
            case ConstantStringTableComponentsEnum.DATE:
                return this.formatDatePipe.transform(
                    ObjKey.split(
                        ConstantStringTableComponentsEnum.DOT_1
                    ).reduce((acc, part) => acc && acc[part], obj)
                );

            // Transform to miles format
            case ConstantStringTableComponentsEnum.MILES_3:
                return this.formatNumberMi.transform(
                    ObjKey.split(
                        ConstantStringTableComponentsEnum.DOT_1
                    ).reduce((acc, part) => acc && acc[part], obj)
                );

            // Transform 24h time to am-pm
            case ConstantStringTableComponentsEnum.AM_PM:
                return this.timeFormatPipe.transform(
                    ObjKey.split(
                        ConstantStringTableComponentsEnum.DOT_1
                    ).reduce((acc, part) => acc && acc[part], obj)
                );

            default:
                if (isValueOfKey && isNotZeroValueOfKey)
                    return ConstantStringTableComponentsEnum.SLASH;

                return ObjKey.split(
                    ConstantStringTableComponentsEnum.DOT_1
                ).reduce((acc, part) => acc && acc[part], obj);
        }
    }

    public likeDislake(
        event: { type: string; subType: string },
        card: CardDetails
    ): void {
        this.detailsDataService.setNewData(card);
        this.bodyActions.emit({
            data: card,
            type: event.type,
            subType: event.subType,
        });
    }

    // Finish repair
    public onFinishOrder(card: CardDetails): void {
        this.bodyActions.emit({
            data: card,
            type: ConstantStringTableComponentsEnum.FINISH_ORDER,
        });
    }

    // Colors label on account page
    public onSaveLabel(
        data: { data: { name: string; action: string } },
        index: number
    ): void {
        this.selectedContactLabel[index] = {
            ...this.selectedContactLabel[index],
            name: data.data.name,
        };

        this.bodyActions.emit({
            data: this.selectedContactLabel[index],
            id: this.viewData[index].id,
            type:
                data.data?.action ===
                ConstantStringTableComponentsEnum.UPDATE_LABEL
                    ? ConstantStringTableComponentsEnum.UPDATE_LABEL
                    : ConstantStringTableComponentsEnum.LABEL_CHANGE,
        });
    }

    // Colors label on account page
    public onPickExistLabel(
        event: CompanyAccountLabelResponse,
        index: number
    ): void {
        this.selectedContactLabel[index] = event;
        this.onSaveLabel(
            {
                data: {
                    name: this.selectedContactLabel[index].name,
                    action: ConstantStringTableComponentsEnum.UPDATE_LABEL,
                },
            },
            index
        );
    }

    // Colors label on account page
    public onSelectColorLabel(
        event: CompanyAccountLabelResponse,
        index: number
    ): void {
        this.selectedContactColor = event;

        this.selectedContactLabel[index] = {
            ...this.selectedContactLabel[index],
            colorId: this.selectedContactColor.id,
            color: this.selectedContactColor.name,
            code: this.selectedContactColor.code,
            hoverCode: this.selectedContactColor.hoverCode,
        };
    }

    public labelDropdown(): tableBodyColorLabel {
        for (let card of this.viewData) {
            this.dropdownSelectionArray.push(new FormControl());
            if (card.companyContactLabel) {
                return card.companyContactLabel;
            } else if (card.companyAccountLabel) {
                this.selectedContactLabel.push(card.companyAccountLabel);
            }
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

    public goToDetailsPage(card: CardDetails, link: string): void {
        this.detailsDataService.setNewData(card);

        this.router.navigate([link]);
    }

    // Track By For Table Row
    public trackCard(item: number): number {
        return item;
    }
}
