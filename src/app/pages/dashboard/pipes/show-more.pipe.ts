import { Pipe, PipeTransform } from '@angular/core';

//constants
import { DashboardConstants } from '../utils/constants';

@Pipe({
    name: 'showMore',
    standalone: true,
})
export class ShowMorePipe implements PipeTransform {
    transform(isShowingMore: boolean): string {
        //TODO: Bogdan - implement this pipe also on topRated

        return isShowingMore ? DashboardConstants.SHOW_LESS : DashboardConstants.SHOW_MORE;
    }
}