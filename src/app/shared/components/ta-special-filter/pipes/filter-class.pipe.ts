import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    standalone: true,
    name: 'filterClass',
})
export class FilterClassPipe implements PipeTransform {
    transform(type: string, activeFilter: boolean, dataArray: any): any {
        return {
            'load-filter': type === 'load-filter' && !activeFilter,
            'load-filter-active': type === 'load-filter' && activeFilter,
            'fuel-filter': type === 'fuel-filter' && !activeFilter,
            'fuel-filter-active': type === 'fuel-filter' && activeFilter,
            'repair-filter': type === 'repair-filter' && !activeFilter,
            'repair-filter-active': type === 'repair-filter' && activeFilter,
            'archive-filter':
                ['ban-filter', 'archiveFilter'].includes(type) && !activeFilter,
            'archive-filter-active':
                ['ban-filter', 'archiveFilter'].includes(type) && activeFilter,
            'broker-filter':
                ['dnu-filter', 'closed-filter', 'broker-filter'].includes(
                    type
                ) && !activeFilter,
            'broker-filter-active':
                ['dnu-filter', 'closed-filter', 'broker-filter'].includes(
                    type
                ) && activeFilter,
            'pickup-filter': type === 'pickupFilter' && !activeFilter,
            'pickup-filter-active': type === 'pickupFilter' && activeFilter,
            'delivery-filter': type === 'deliveryFilter' && !activeFilter,
            'delivery-filter-active': type === 'deliveryFilter' && activeFilter,
            'zero-filter':
                dataArray?.filteredArray?.length === 0 ||
                !dataArray?.filteredArray?.length,
        };
    }
}
