import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'hideAccount',
    standalone: true,
})
export class DriverHideAccountPipe implements PipeTransform {
    transform(value: any, template: string, toogleVisibility: boolean): any {
        let hideNumber: string = '';
        switch (template) {
            case 'account': {
                if (!toogleVisibility) {
                    for (let i = 0; i < value.length; i++) {
                        if (i < 4) {
                            hideNumber += '*';
                        } else {
                            hideNumber += value[i];
                        }
                    }
                } else {
                    hideNumber = value;
                }
            }
            default: {
                break;
            }
        }

        return hideNumber;
    }
}
