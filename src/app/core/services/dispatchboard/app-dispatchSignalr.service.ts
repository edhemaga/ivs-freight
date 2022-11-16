import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
   providedIn: 'root',
})
export class AppDispatchSignalrService {
   private gpsData = new BehaviorSubject<any[]>([]);
   public currentgpsData = this.gpsData.asObservable();
   public currentgpsDataSingleItem = this.gpsData.asObservable();
   private gpsDataSingleItem = new BehaviorSubject<any>({});

   constructor() {}

   public sendGpsData(data: any) {
      this.gpsData.next(data);
   }

   public sendGpsDataSingleItem(data: any) {
      this.gpsDataSingleItem.next(data);
   }
}
