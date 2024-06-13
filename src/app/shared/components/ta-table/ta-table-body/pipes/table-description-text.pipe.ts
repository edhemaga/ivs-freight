import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    standalone: true,
    name: 'tableDescriptionTextPipe',
})
export class TableDescriptionTextPipe implements PipeTransform {
    transform(descriptionItems: any[], width: number): string {
        let itemsToShow = '';
        let numberOfItemsInList = 0;
        let checkItemsWidth = '';

        let description = '';
        let size = 0;
        for (let descriptionItem of descriptionItems) {
            if (descriptionItem?.price) {
                description = descriptionItem.description;
                size = 8;
            } else if (descriptionItem.code) {
                description = descriptionItem.code;
                size = 20;
            } else if (descriptionItem.nickname) {
                description = descriptionItem.nickname;
                size = 18;
            }
            checkItemsWidth += description;
            if (checkItemsWidth.length * size < width) {
                if (numberOfItemsInList > 0) {
                    itemsToShow += ' • ';
                }
                itemsToShow += description;
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
