import { Pipe, PipeTransform } from '@angular/core';

// enums
import { eStringPlaceholder } from '@shared/enums';

// pipes
import { ThousandSeparatorPipe } from '@shared/pipes';

@Pipe({
    name: 'lastFuelPriceCardTitle',
    standalone: true,
})
export class LastFuelPriceCardTitlePipe implements PipeTransform {
    constructor(private thousandSeparatorPipe: ThousandSeparatorPipe) {}

    transform(cardData: {
        pricePerGallon?: number;
        priceOutDated?: boolean;
        defPrice?: number;
        defPriceOutDated?: boolean;
    }): string {
        const { pricePerGallon, priceOutDated, defPrice, defPriceOutDated } =
            cardData;

        if (priceOutDated || defPriceOutDated) return 'Outdated';

        const formatPrice = (value: number) =>
            this.thousandSeparatorPipe.transform(value);

        const dieselPriceText = pricePerGallon
            ? `Diesel $${formatPrice(pricePerGallon)}`
            : eStringPlaceholder.EMPTY;
        const defPriceText = defPrice
            ? ` | DEF $${formatPrice(defPrice)}`
            : eStringPlaceholder.EMPTY;

        return dieselPriceText + defPriceText;
    }
}
