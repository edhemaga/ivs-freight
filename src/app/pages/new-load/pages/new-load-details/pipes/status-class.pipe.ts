import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'statusClass',
    standalone: true,
})
export class StatusClassPipe implements PipeTransform {
    transform(statusId: number): string {
        switch (statusId) {
            case 1:
                return 'background-muted';
            case 2:
                return 'background-blue-13';
            case 3:
                return 'background-green';
        }
    }
}
