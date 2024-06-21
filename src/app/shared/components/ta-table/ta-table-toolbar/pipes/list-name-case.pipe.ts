import { Pipe, PipeTransform } from '@angular/core';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';

@Pipe({
    name: 'listNameCase',
    standalone: true,
})
export class ListNameCasePipe implements PipeTransform {
    transform(listName: string, isUppercase: boolean): string {
        if (isUppercase) return new UpperCasePipe().transform(listName);

        return new TitleCasePipe().transform(listName);
    }
}
