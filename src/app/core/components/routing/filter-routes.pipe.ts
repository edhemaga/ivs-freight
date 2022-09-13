import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterRoutes'
})
export class FilterRoutesPipe implements PipeTransform {

  transform(routes: any[] | undefined, condition: boolean) {
    console.log('filterRoutes', routes, condition);
    var newRoutesArray = JSON.parse(JSON.stringify(routes));
    console.log('filterRoutes newRoutesArray 1', newRoutesArray);

    if ( condition ) {
      newRoutesArray = newRoutesArray.filter(route => route.freeMove === true);
    } else {
      newRoutesArray = newRoutesArray.filter(route => !route.freeMove);
    }
    console.log('filterRoutes newRoutesArray 2', newRoutesArray);

    //return newRoutesArray;
    return routes;
  }

}
