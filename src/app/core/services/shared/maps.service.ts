import { Injectable } from '@angular/core';

declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class MapsService {
  
  public mapCircle: any = {
    lat: 41.860119,
    lng: -87.660156,
    radius: 160934.4 // 100 miles
  };

  constructor() { }

  getMeters(miles) {
    return miles*1609.344;
  }

  getMiles(meters) {
    return meters*0.000621371192;
  }

  getDistanceBetween(lat1,long1,lat2,long2){
    var from = new google.maps.LatLng(lat1,long1);
    var to = new google.maps.LatLng(lat2,long2);

    console.log('getDistanceBetween lat1', lat1);
    console.log('getDistanceBetween long1', long1);
    console.log('getDistanceBetween lat2', lat2);
    console.log('getDistanceBetween long2', long2);
    console.log('getDistanceBetween from', from);
    console.log('getDistanceBetween to', to);

    var distanceBetween = google.maps.geometry.spherical.computeDistanceBetween(from,to);

    if(distanceBetween <= this.mapCircle.radius){    
      console.log('Radius',this.mapCircle.radius);
      console.log('Distance Between',distanceBetween);
      return [true, distanceBetween];
    }else{
      return [false, distanceBetween];
    }
  }
}
