// enums
import { eProgressRangePrice } from "@shared/components/ta-progress-range/enums/index";

// models
import { IProgressRangeLastPriceRangeItem } from "@shared/components/ta-progress-range/models/index";

export class TaProgressRangeConstants {
    static PROGRESS_RANGE_LAST_PRICE_ITEMS: IProgressRangeLastPriceRangeItem[] = [
        {
            id: eProgressRangePrice.Cheapest,
            arrowClassName: 'price-range-cheapest',
            circleClassName: 'circle-cheapest'
        },
        {
            id: eProgressRangePrice.Low,
            arrowClassName: 'price-range-low',
            circleClassName: 'circle-low'
        },
        {
            id: eProgressRangePrice.Moderate,
            arrowClassName: 'price-range-moderate',
            circleClassName: 'circle-moderate'
        },
        {
            id: eProgressRangePrice.High,
            arrowClassName: 'price-range-high',
            circleClassName: 'circle-high'
        },
        {
            id: eProgressRangePrice.MostExpensive,
            arrowClassName: 'price-range-most-expensive',
            circleClassName: 'circle-most-expensive'
        }
    ]
}