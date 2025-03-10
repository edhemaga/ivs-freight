import { Pipe, PipeTransform } from '@angular/core';

// enums
import { eStringPlaceholder } from '@shared/enums';

@Pipe({
    name: 'lastFuelPriceCardTitle',
    standalone: true,
})
export class LastFuelPriceCardTitlePipe implements PipeTransform {
    constructor() {}

    transform(cardData: {
        pricePerGallon?: number;
        priceOutDated?: boolean;
        defPrice?: number;
        defPriceOutDated?: boolean;
    }): string {
        const { pricePerGallon, priceOutDated, defPrice, defPriceOutDated } =
            cardData;

        if (priceOutDated || defPriceOutDated) return 'Outdated';

        const dieselPriceText = pricePerGallon
            ? `Diesel $${pricePerGallon}`
            : eStringPlaceholder.EMPTY;
        const defPriceText = defPrice
            ? ` | DEF $${defPrice}`
            : eStringPlaceholder.EMPTY;

        return dieselPriceText + defPriceText;
    }
}
