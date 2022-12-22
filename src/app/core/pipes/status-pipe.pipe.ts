import { Pipe, PipeTransform } from '@angular/core';
import { IDispatchModel } from '../components/shared/ta-status-switch/ta-status-switch.component';

const STATUS_COLORS = {
    '-1': 'FFA7A7',
    1: '919191',
    2: '008496',
    3: '7FA2E6',
    4: '6C6C6C',
    5: 'E27579',
    6: 'FF9800',
    7: 'FFC368',
    8: 'FFC368',
    9: 'FFC368',
    10: 'F276EF',
    11: '60D5BD',
    12: '74BF97',
    13: 'FB5555',
    14: 'FB5555',
};

@Pipe({
    name: 'statusPipe',
})
export class StatusPipePipe implements PipeTransform {
    transform(status_id: number, nextPossibleStatus: IDispatchModel): unknown {
        if (status_id === 11) {
            return `${
                nextPossibleStatus.name == 'Pickup'
                    ? STATUS_COLORS[status_id]
                    : STATUS_COLORS['-1']
            }`;
        } else {
            return `${STATUS_COLORS[status_id]}`;
        }
    }
}
