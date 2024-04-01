import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterRoutes',
})
export class FilterRoutesPipe implements PipeTransform {
    transform(routes: any[] | undefined, condition: boolean) {
        var newRoutesArray = JSON.parse(JSON.stringify(routes));

        if (condition) {
            newRoutesArray = newRoutesArray.filter(
                (route) => route.freeMove === true
            );
        } else {
            newRoutesArray = newRoutesArray.filter((route) => !route.freeMove);
        }

        //return newRoutesArray;
        return routes;
    }
}
