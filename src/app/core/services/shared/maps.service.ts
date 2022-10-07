import { Injectable } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { OnDestroy } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { GpsLastPositionsDataModel } from '../../model/gpslastpositionsdatamodel.model';
import { environment } from '../../../../environments/environment';
import { NotificationService } from '../notification/notification.service';

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
  
  private hubConnection: signalR.HubConnection;
  public statusChange = new Subject<any>();

  constructor(private notificationService: NotificationService) { 
    this.sortCategoryChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((category) => {
        this.sortCategory = category
      });
  }

  public startGpsConnection = () => {
    //=var token = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hcmljb2duamVuMDBAZ21haWwuY29tIiwiVXNlcklkIjoiMyIsIkNvbXBhbnlJZCI6IjEiLCJDb21wYW55VXNlcklkIjoiMyIsIm5iZiI6MTY2NTA4NDcwMCwiZXhwIjoxNjY1MTA2MzAwLCJpYXQiOjE2NjUwODQ3MDAsImlzcyI6Imh0dHBzOi8vbG9jYWxob3N0OjcyMjYifQ.yqMxFtPLzvYpgDAbbLx0_zmR6wj8NPy_EAp6f7elLuSkk47ms8KrWCIFufJUyd1raQlzkmGSK6TcviNBNpfSKg';
    const token = JSON.parse(localStorage.getItem('user')).token;

    return new Promise((resolve, reject) => {
      Object.defineProperty(WebSocket, 'OPEN', { value: 1 }); // workaround za da se otvori socket jbg
      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(`https://apiex.truckassist.io/gpsHub`,{ accessTokenFactory: () => token })
        // .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();
      this.hubConnection
        .start()
        .then(() => {
          resolve('success');
          console.log(this.hubConnection);
          this.notificationService.success('GPS service connected', 'gpssuccess');
        })
        .catch((err) => { console.log('Error while starting connection: ' + err); this.notificationService.error('GPS service failed', 'gpserror'); })
    });
  };

  public stopGpsConnection = () => {
    this.hubConnection.stop();
  };

  public addGpsConnectionListener = () => {
    this.hubConnection.on('GpsData', (data) => {
      console.log(
        'receive gpsdata ',
        data
      );
      // data.map(item => {
      //     item.statusId = item.status;
      //     return item;
      // });
      // this.data = data;

      this.statusChange.next(data);
    });
  };

  // startGPSConnection() {
  //   var token = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN0ZWZhbm5pa29saWMxNzAyQGdtYWlsLmNvbSIsIlVzZXJJZCI6IjEiLCJDb21wYW55SWQiOiIxIiwiQ29tcGFueVVzZXJJZCI6IjEiLCJuYmYiOjE2NjUwNTcwMjQsImV4cCI6MTY2NTA3ODYyNCwiaWF0IjoxNjY1MDU3MDI0LCJpc3MiOiJodHRwczovL2xvY2FsaG9zdDo3MjI2In0.WJG4pnIPHki1piqJGppLnVS6AYvL4bUjv6Aq-EFECGgbinA3K1eYaqsdXx2NQuUu_WcbD6kjsGEudN00NCWziA';
  //   var connection = new signalR.HubConnectionBuilder().withUrl("https://apiex.truckassist.io/gpsHub",{ accessTokenFactory: () => token }).build();
  
  //   connection.on("GpsData", function (gps) {
  //       console.log(gps);
  //       // var li = document.createElement("li");
  //       // document.getElementById("gpsDataList").appendChild(li);
  //       // li.className = gps.companyId != null ? "red-line" : null;
  //       // li.textContent = `DEV_ID: ${gps.deviceId}, LAT: ${gps.latitude}, LONG: ${gps.longitude}, ALT(foot): ${gps.altitude}`;
  //   });

  //   connection.start().then(function () {
    
  //   }).catch(function (err) {
  //       return console.error(err.toString());
  //   });    
  // }

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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
