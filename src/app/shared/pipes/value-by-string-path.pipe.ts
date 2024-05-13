import { Pipe, PipeTransform } from '@angular/core';

// Models
import { CardDetails } from '@shared/models/card-models/card-table-data.model';

// Helpers
import { CardHelper } from '@shared/utils/helpers/card-helper';

@Pipe({
    name: 'valueByStringPath',
    standalone: true,
})
export class ValueByStringPathPipe implements PipeTransform {
    constructor(
        // Helpers
        private cardHelper: CardHelper
    ) {}

    transform(obj: CardDetails, objKey: string, format?: string): string {
        return this.cardHelper.getValueByStringPath(obj, objKey, format);
    }
}
