// models
import { CardDetails } from '../../models/card-table-data.model';
import {
    CardRows,
    DataResult,
} from '../../../core/components/shared/model/card-data.model';

// enums
import { ConstantStringTableComponentsEnum } from '../../../core/utils/enums/table-components.enum';

// pipes
import { FormatCurrency } from '../../pipes/format-currency.pipe';
import { FormatDatePipe } from '../../pipes/format-date.pipe';
import { FormatMilesPipe } from '../../pipes/format-miles.pipe';
import { TimeFormatPipe } from '../../pipes/time-format-am-pm.pipe';

//Remove quotes from string to convert into endpoint

export class CardHelper {
    private formatCurrencyPipe: FormatCurrency = new FormatCurrency();
    private formatDatePipe: FormatDatePipe = new FormatDatePipe();
    private formatNumberMi: FormatMilesPipe = new FormatMilesPipe();
    private timeFormatPipe: TimeFormatPipe = new TimeFormatPipe();

    public mySelection: { id: number; tableData: CardDetails }[] = [];
    public isCheckboxCheckedArray: number[] = [];

    public isCardFlippedArrayComparasion: number[] = [];
    public isCardFlippedCheckInCards: number[] = [];

    public dataForRows: DataResult[][] = [];
    public titleArray: string[] = [];

    public renderCards(
        viewData: CardDetails[],
        cardTitle?: string,
        rowsToDisplay?: CardRows[]
    ): { cardsTitle: string[]; dataForRows: CardRows[][] } {
        this.dataForRows = [];
        this.titleArray = [];

        viewData.forEach((card) => {
            let resultsRowsForCards: DataResult[] = [];

            if (cardTitle) {
                const title = this.getValueByStringPath(card, cardTitle);

                this.titleArray = [...this.titleArray, title];
            }

            if (rowsToDisplay) {
                rowsToDisplay.forEach((row) => {
                    let key: string;

                    if (row.key) {
                        if (
                            row.title ===
                            ConstantStringTableComponentsEnum.PHONE_2
                        ) {
                            row.key = ConstantStringTableComponentsEnum.PHONE;
                        }
                        if (
                            row.title ===
                            ConstantStringTableComponentsEnum.TYPE_2
                        ) {
                            row.key =
                                ConstantStringTableComponentsEnum.TEXT_TYPE;
                        }
                        if (
                            row.title ===
                            ConstantStringTableComponentsEnum.SSN_2
                        ) {
                            row.key = ConstantStringTableComponentsEnum.SSN_EIN;
                        }
                        key = this.getValueByStringPath(card, row.key);
                    }

                    let secondKey: string;
                    let thirdKey: string;

                    if (row?.secondKey) {
                        secondKey = this.getValueByStringPath(
                            card,
                            row?.secondKey
                        );
                    }

                    if (row?.thirdKey) {
                        thirdKey = this.getValueByStringPath(
                            card,
                            row?.thirdKey
                        );
                    }

                    resultsRowsForCards = [
                        ...resultsRowsForCards,
                        {
                            title: row.title,
                            key,
                            secondKey,
                            thirdKey,
                        },
                    ];
                });

                this.dataForRows = [...this.dataForRows, resultsRowsForCards];
            }
        });

        return { cardsTitle: this.titleArray, dataForRows: this.dataForRows };
    }

    public getValueByStringPath(
        obj: CardDetails,
        ObjKey: string,
        format?: string
    ): string {
        if (ObjKey === ConstantStringTableComponentsEnum.NO_ENDPOINT)
            return ConstantStringTableComponentsEnum.NO_ENDPOINT_2;

        const isValueOfKey = !ObjKey?.split(
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

    public onCheckboxSelect(index: number, card: CardDetails): any {
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

        return [...this.mySelection];
    }

    // Setting count number for each card on page
    public calculateItemsToFit(container: HTMLElement, renderer): void {
        const content =
            container?.textContent ||
            ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER;

        const containerWidth = container?.offsetWidth;

        const contentSentences = content
            .split('•')
            .map((sentence) => sentence.trim());

        let visibleSentencesCount = 0;
        let remainingSentences = 0;

        for (let i = 0; i < contentSentences.length; i++) {
            // Creating span for measuring the parent

            const content = contentSentences
                .slice(0, i + 1)
                .join(ConstantStringTableComponentsEnum.SEPARATOR); // Reconstructing sentences

            const element = renderer.createElement(
                ConstantStringTableComponentsEnum.SPAN
            );

            element.textContent = content;

            renderer.appendChild(document.body, element); // Append to the body to measure width

            const width = element?.offsetWidth;

            renderer.removeChild(document.body, element); // Remove element after measurement

            if (width <= containerWidth) {
                visibleSentencesCount = i + 2;
            } else if (width - 34 > containerWidth && i > 0) {
                remainingSentences =
                    contentSentences.length - visibleSentencesCount;

                const existingNewElement = container.parentNode.querySelector(
                    ConstantStringTableComponentsEnum.CONTAINER_COUNT_TA_FONT_MEDIUM
                );

                if (existingNewElement)
                    renderer.removeChild(container, existingNewElement);

                const newElement = renderer.createElement(
                    ConstantStringTableComponentsEnum.DIV
                );

                newElement.className =
                    'container-count ta-font-medium d-flex justify-content-center align-items-center';

                if (remainingSentences > 0) {
                    const text = renderer.createText(
                        ConstantStringTableComponentsEnum.PLUS +
                            remainingSentences
                    );

                    renderer.appendChild(newElement, text);

                    renderer.insertBefore(
                        container?.parentNode,
                        newElement,
                        container.nextSibling
                    );
                }
                break;
            }
        }
    }

    // Flip card based on card index
    public flipCard(index: number): number[] {
        const indexSelected = this.isCardFlippedArrayComparasion.indexOf(index);

        if (indexSelected !== -1) {
            this.isCardFlippedArrayComparasion.splice(indexSelected, 1);
            this.isCardFlippedCheckInCards = this.isCardFlippedArrayComparasion;
        } else {
            this.isCardFlippedArrayComparasion.push(index);
            this.isCardFlippedCheckInCards = this.isCardFlippedArrayComparasion;
        }

        return this.isCardFlippedCheckInCards;
    }
}
