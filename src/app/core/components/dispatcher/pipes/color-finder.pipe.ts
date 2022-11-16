import { Pipe, PipeTransform } from '@angular/core';
import { ITrailerTypes, ITruckType, TRAILER_TYPES, TRUCK_TYPE } from 'src/assets/utils/settings/application-consts';

@Pipe({
  name: 'colorFinder'
})
export class ColorFinderPipe implements PipeTransform {

  transform(value: string, id: number): string {

    let searchInArray: ITrailerTypes[] | ITruckType[] = TRAILER_TYPES;
    if( value == "truck" ) searchInArray = TRUCK_TYPE;

    const findedColor = searchInArray.find(item => item.id == id);
    if( findedColor ){
      return findedColor.color;
    }
    return "";
  }

}
