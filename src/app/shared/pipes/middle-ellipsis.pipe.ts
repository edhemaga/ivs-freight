import { Pipe, PipeTransform } from '@angular/core';

// enums
import { eStringPlaceholder } from '@shared/enums';

@Pipe({
    name: 'middleEllipsis',
    standalone: true,
})
export class MiddleEllipsisPipe implements PipeTransform {
    transform(value: string): string {
        if (!value) return eStringPlaceholder.EMPTY;

        const beforeEllipsis: string = value.slice(0, 4);
        const afterEllipsis: string = value.slice(value.length - 6);

        return `${beforeEllipsis}${eStringPlaceholder.ELLIPSIS}${afterEllipsis}`;
    }
}
