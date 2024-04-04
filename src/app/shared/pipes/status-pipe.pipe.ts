import { Pipe, PipeTransform } from '@angular/core';

// models
import { IDispatchModel } from '../components/ta-status-switch/models/dispatch.model';

const STATUS_COLORS = {
    '-1': 'F276EF',
    1: '919191',
    2: '008496',
    3: '3074D3',
    4: '6C6C6C',
    5: 'D80300',
    6: 'FF9800',
    7: 'FF9800',
    8: 'FF9800',
    9: 'FF9800',
    10: 'F276EF',
    11: '62B264',
    12: '26A690',
    13: 'FB5555',
    14: 'FB5555',
};

@Pipe({
    name: 'statusPipe',
    standalone: true,
})
export class StatusPipe implements PipeTransform {
    transform(status_id: number, nextPossibleStatus: IDispatchModel): unknown {
        if (status_id === 11) {
            return `${
                nextPossibleStatus?.name == 'Pickup'
                    ? STATUS_COLORS[status_id]
                    : STATUS_COLORS['-1']
            }`;
        } else {
            return `${STATUS_COLORS[status_id]}`;
        }
    }
}
