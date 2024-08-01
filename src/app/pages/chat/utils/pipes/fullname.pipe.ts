import {
    Pipe,
    PipeTransform
} from '@angular/core';

@Pipe({
    name: 'fullName',
    standalone: true,
})
export class FullnamePipe implements PipeTransform {
    transform(
        names: string[]
    ): string {
        let fullname: string = '';
        names.forEach(arg => {
            fullname += `${fullname} ${arg}`
        })
        return fullname.trim();
    }
}
