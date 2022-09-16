import { Injectable } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { OnDestroy } from '@angular/core';

declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class MapsService implements OnDestroy {
  private destroy$ = new Subject<void>();

  public mapCircle: any = {
    lat: 41.860119,
    lng: -87.660156,
    radius: 160934.4 // 100 miles
  };

  sortCategory: any = {};
  sortCategoryChange: Subject<any> = new Subject<any>();

  constructor() { 
    this.sortCategoryChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((category) => {
        this.sortCategory = category
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getMeters(miles) {
    return miles*1609.344;
  }

  getMiles(meters) {
    return meters*0.000621371192;
  }

  getDistanceBetween(lat1,long1,lat2,long2){
    var from = new google.maps.LatLng(lat1,long1);
    var to = new google.maps.LatLng(lat2,long2);

    var distanceBetween = google.maps.geometry.spherical.computeDistanceBetween(from,to);

    if(distanceBetween <= this.mapCircle.radius){    
      return [true, distanceBetween];
    }else{
      return [false, distanceBetween];
    }
  }
}
