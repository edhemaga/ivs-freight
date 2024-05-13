import { Pipe, PipeTransform } from '@angular/core';
import { CardRows } from '@shared/models/card-models/card-rows.model';

@Pipe({
    name: 'flipCards',
    standalone: true,
})
export class FlipCardsPipe implements PipeTransform {
    transform(
        displayFrontRows: CardRows[],
        index: number,
        flippedArray: number[],
        isAllFlipped: boolean,
        displayBackRows: CardRows[]
    ): CardRows[] {
        if (flippedArray.includes(index) || isAllFlipped) return displayBackRows;

        return displayFrontRows;
    }
}
