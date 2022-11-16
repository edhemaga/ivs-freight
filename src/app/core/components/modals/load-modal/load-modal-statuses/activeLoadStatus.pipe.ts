import { Pipe, PipeTransform } from '@angular/core';
import { ILoadStatus } from './load-modal-statuses.component';

@Pipe({
    name: 'activeLoadStatus',
})
export class ActiveLoadStatusPipe implements PipeTransform {
    transform(statuses: ILoadStatus[]): any {
        return statuses.find((item) => item?.active);
    }
}
