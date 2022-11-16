import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Injectable({ providedIn: 'root' })
@Pipe({
    name: 'reviewSort',
})
export class ReviewsSortPipe implements PipeTransform {
    transform(value: any): any {
        return value.sort((a, b) => {
            return a.updatedAt > b.updatedAt
                ? -1
                : a.updatedAt > b.updatedAt
                ? 1
                : 0;
        });
    }
}
