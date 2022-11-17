import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'taDropdownCount',
})
export class DropdownCountPipe implements PipeTransform {
    transform(options: any, template: string): any {
        if (template === 'groups') {
            let groups: number = 0;
            options.forEach((item) => {
                groups++;
                if (item.groups) {
                    groups += item.groups.length;
                }
            });
            return groups > 20;
        } else {
            return options.length > 7;
        }
    }
}
