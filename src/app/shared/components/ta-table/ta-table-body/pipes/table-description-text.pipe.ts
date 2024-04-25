import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    standalone: true,
    name: 'tableDescriptionTextPipe',
})
export class TableDescriptionTextPipe implements PipeTransform {
    transform(descriptionItems: any[], width: number): string {
        let itemsToShow = '';
        let numberOfItemsInList = 0;
        let k = '';
        for (let descriptionItem of descriptionItems) {
            k += descriptionItem.description;
            if (k.length * 8 < width) {
                if (numberOfItemsInList > 0) {
                    itemsToShow += ' • ';
                }
                itemsToShow += descriptionItem.description;
                numberOfItemsInList++;
            } else {
                itemsToShow += `<div class="round-number d-flex justify-content-center align-items-center">
                            <span class="ta-font-medium">+${
                                descriptionItems.length - numberOfItemsInList
                            }</span>
                        </div>`;
                break;
            }
        }
        return itemsToShow;
    }
}
