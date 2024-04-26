import { Pipe, PipeTransform } from '@angular/core';

//Models
import { CardRows } from '@shared/models/card-models/card-rows.model';

@Pipe({
    name: 'ngForLengthFilter',
    standalone: true,
})
export class NgForLengthFilterPipe implements PipeTransform {
    transform(data: CardRows[], length: number): CardRows[] {
        return Array.from({ length }, (_, i) => data[i]);
    }
}
