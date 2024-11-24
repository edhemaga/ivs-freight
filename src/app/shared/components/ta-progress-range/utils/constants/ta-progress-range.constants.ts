// enums
import { eProgressRangePrice } from "@shared/components/ta-progress-range/enums/index";

// models
import { IProgressRangeLastPriceRangeItem } from "@shared/components/ta-progress-range/models/index";

export class TaProgressRangeConstants {
    static CLASS_ARROW_CHEAPEST: string = 'price-range-cheapest';
    static CLASS_ARROW_LOW: string = 'price-range-low';
    static CLASS_ARROW_MODERATE: string = 'price-range-moderate';
    static CLASS_ARROW_HIGH: string = 'price-range-high';
    static CLASS_ARROW_MOST_EXPENSIVE: string = 'price-range-most-expensive';

    static CLASS_CIRCLE_CHEAPEST: string = 'circle-color-cheapest';
    static CLASS_CIRCLE_LOW: string = 'circle-color-low';
    static CLASS_CIRCLE_MODERATE: string = 'circle-color-moderate';
    static CLASS_CIRCLE_HIGH: string = 'circle-color-high';
    static CLASS_CIRCLE_MOST_EXPENSIVE: string = 'circle-color-most-expensive';
    static CLASS_CIRCLE_EXPIRED_NO_VALUE: string = 'circle-color-expired-no-value';

    static PROGRESS_RANGE_LAST_PRICE_ITEMS: IProgressRangeLastPriceRangeItem[] = [
        {
            id: eProgressRangePrice.Cheapest,
            arrowClassName: this.CLASS_ARROW_CHEAPEST,
            circleClassName: this.CLASS_CIRCLE_CHEAPEST
        },
        {
            id: eProgressRangePrice.Low,
            arrowClassName: this.CLASS_ARROW_LOW,
            circleClassName: this.CLASS_CIRCLE_LOW
        },
        {
            id: eProgressRangePrice.Moderate,
            arrowClassName: this.CLASS_ARROW_MODERATE,
            circleClassName: this.CLASS_CIRCLE_MODERATE
        },
        {
            id: eProgressRangePrice.High,
            arrowClassName: this.CLASS_ARROW_HIGH,
            circleClassName: this.CLASS_CIRCLE_HIGH
        },
        {
            id: eProgressRangePrice.MostExpensive,
            arrowClassName: this.CLASS_ARROW_MOST_EXPENSIVE,
            circleClassName: this.CLASS_CIRCLE_MOST_EXPENSIVE
        }
    ]
}