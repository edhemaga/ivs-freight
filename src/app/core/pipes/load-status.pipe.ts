import { Pipe, PipeTransform } from '@angular/core';
import { LOAD_STATUS } from '../../const';

@Pipe({
    name: 'loadStatus',
})
export class LoadStatusPipe implements PipeTransform {
    transform(input: string, statusId: number): any {
        const statuses = LOAD_STATUS;
        const status = statuses.find((s) => s.id === statusId);
        return status ? status : '';
    }
}
