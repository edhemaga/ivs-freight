// enums
import { TableStringEnum } from '@shared/enums/table-string.enum';

// pipes
import { FormatCurrencyPipe } from '@shared/pipes/format-currency.pipe';
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';
import { FormatMilesPipe } from '@shared/pipes/format-miles.pipe';
import { TimeFormatPipe } from '@shared/pipes/time-format-am-pm.pipe';

// models
import { CardDetails } from '@shared/models/card-models/card-table-data.model';
import { CardRows } from '@shared/models/card-models/card-rows.model';
import { CardDataResult } from '@shared/models/card-models/card-data-result.model';

// Remove quotes from string to convert into endpoint

export class CardHelper {
    private formatCurrencyPipe: FormatCurrencyPipe = new FormatCurrencyPipe();
    private formatDatePipe: FormatDatePipe = new FormatDatePipe();
    private formatNumberMi: FormatMilesPipe = new FormatMilesPipe();
    private timeFormatPipe: TimeFormatPipe = new TimeFormatPipe();

    public mySelection: { id: number; tableData: CardDetails }[] = [];
    public isCheckboxCheckedArray: number[] = [];

    public isCardFlippedArrayComparasion: number[] = [];
    public isCardFlippedCheckInCards: number[] = [];

    public dataForRows: CardDataResult[][] = [];
    public titleArray: string[] = [];

    public renderCards(
        viewData: CardDetails[],
        cardTitle?: string,
        rowsToDisplay?: CardRows[]
    ): { cardsTitle: string[]; dataForRows: CardRows[][] } {
        this.dataForRows = [];
        this.titleArray = [];

        viewData.forEach((card) => {
            let resultsRowsForCards: CardDataResult[] = [];

            if (cardTitle) {
                const title = this.getValueByStringPath(card, cardTitle);

                this.titleArray = [...this.titleArray, title];
            }

            if (rowsToDisplay) {
                rowsToDisplay.forEach((row) => {
                    let key: string;

                    if (row.key) {
                        if (row.title === TableStringEnum.PHONE_2) {
                            row.key = TableStringEnum.PHONE;
                        }
                        if (row.title === TableStringEnum.TYPE_2) {
                            row.key = TableStringEnum.TEXT_TYPE;
                        }
                        if (row.title === TableStringEnum.SSN_2) {
                            row.key = TableStringEnum.SSN_EIN;
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
                            field: row.field,
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
        if (ObjKey === TableStringEnum.NO_ENDPOINT)
            return TableStringEnum.NO_ENDPOINT_2;

        const isValueOfKey = !ObjKey?.split(TableStringEnum.DOT_1).reduce(
            (acc, part) => acc && acc[part],
            obj
        );
        const isNotZeroValueOfKey =
            ObjKey.split(TableStringEnum.DOT_1).reduce(
                (acc, part) => acc && acc[part],
                obj
            ) !== 0;

        switch (format) {
            case TableStringEnum.MONEY:
                return this.formatCurrencyPipe.transform(
                    ObjKey.split(TableStringEnum.DOT_1).reduce(
                        (acc, part) => acc && acc[part],
                        obj
                    )
                );

            // Transform to date format
            case TableStringEnum.DATE:
                return this.formatDatePipe.transform(
                    ObjKey.split(TableStringEnum.DOT_1).reduce(
                        (acc, part) => acc && acc[part],
                        obj
                    )
                );

            // Transform to miles format
            case TableStringEnum.MILES_3:
                return this.formatNumberMi.transform(
                    ObjKey.split(TableStringEnum.DOT_1).reduce(
                        (acc, part) => acc && acc[part],
                        obj
                    )
                );

            // Transform 24h time to am-pm
            case TableStringEnum.AM_PM:
                return this.timeFormatPipe.transform(
                    ObjKey.split(TableStringEnum.DOT_1).reduce(
                        (acc, part) => acc && acc[part],
                        obj
                    )
                );

            default:
                if (isValueOfKey && isNotZeroValueOfKey)
                    return TableStringEnum.SLASH;

                return ObjKey.split(TableStringEnum.DOT_1).reduce(
                    (acc, part) => acc && acc[part],
                    obj
                );
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
            container?.textContent || TableStringEnum.EMPTY_STRING_PLACEHOLDER;

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
                .join(TableStringEnum.SEPARATOR); // Reconstructing sentences

            const element = renderer.createElement(TableStringEnum.SPAN);

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
                    TableStringEnum.CONTAINER_COUNT_TA_FONT_MEDIUM
                );

                if (existingNewElement)
                    renderer.removeChild(container, existingNewElement);

                const newElement = renderer.createElement(TableStringEnum.DIV);

                newElement.className =
                    'container-count ta-font-medium d-flex justify-content-center align-items-center';

                if (remainingSentences > 0) {
                    const text = renderer.createText(
                        TableStringEnum.PLUS + remainingSentences
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

        return [...this.isCardFlippedCheckInCards];
    }

    public resetSelectedCards(): void {
        this.mySelection = [];
        this.isCheckboxCheckedArray = [];
    }
}
