// model
import { CardDetails } from '../components/shared/model/card-table-data.model';
// enums
import { ConstantStringTableComponentsEnum } from '../utils/enums/table-components.enums';

// pipes
import { formatCurrency } from '../pipes/formatCurrency.pipe';
import { formatDatePipe } from '../pipes/formatDate.pipe';
import { FormatNumberMiPipe } from '../pipes/formatMiles.pipe';
import { TimeFormatPipe } from '../pipes/time-format-am-pm.pipe';

//Remove quotes from string to convert into endpoint
export class ValueByStringPath {
    private formatCurrencyPipe: formatCurrency = new formatCurrency();
    private formatDatePipe: formatDatePipe;
    private formatNumberMi: FormatNumberMiPipe;
    private timeFormatPipe: TimeFormatPipe;

    public mySelection: { id: number; tableData: CardDetails }[] = [];
    public isCheckboxCheckedArray: number[] = [];

    public isCardFlippedArray: number[] = [];
    public isCardFlipped: Array<number> = [];

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
}
