import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'multiSwitchCase',
    standalone: true,
})
export class MultiSwitchCasePipe implements PipeTransform {
    transform<T>(cases: T[], value: T): T {
        return cases.includes(value) ? value : cases[0];
    }
}
