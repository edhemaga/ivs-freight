import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { DispatchboardModel } from '../../model/dispatchboardmodel.model';
import { GpsLastPositionsDataModel } from '../../model/gpslastpositionsdatamodel.model';
import { environment } from '../../../../environments/environment';

@Injectable({
   providedIn: 'root',
})
export class SignalRService {
   public data: DispatchboardModel[];
   public broadcastedData: any[];
   public gps: GpsLastPositionsDataModel[];
   // public broadcastedDataGps: GpsLastPositionsDataModel[];
   public statusChange = new Subject<any>();
   private hubConnection: signalR.HubConnection;
   /* Gps Properties */
   private gpsData = new BehaviorSubject<boolean>(false);
   public currentGpsData = this.gpsData.asObservable();

   public startConnection = () => {
      return new Promise((resolve, reject) => {
         Object.defineProperty(WebSocket, 'OPEN', { value: 1 }); // workaround za da se otvori socket jbg
         this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${environment.API_ENDPOINT}tahub`)
            // .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();
         this.hubConnection
            .start()
            .then(() => {
               resolve('success');
               console.log(this.hubConnection);
            })
            .catch((err) =>
               console.log('Error while starting connection: ' + err)
            );
      });
   };

   public stopConnection = () => {
      this.hubConnection.stop();
   };

   /* status - dbstatusdata */
   public broadcastDbStatusData = (data?) => {
      const newData = JSON.parse(JSON.stringify(data));
      newData.map((item) => {
         console.log(item);
         if (item.hosJson) {
            item.hosJson = JSON.stringify(item.hosJson);
         }
         if (item.deliveryJson) {
            item.deliveryJson = JSON.stringify(item.deliveryJson);
         }
         if (item.pickupJson) {
            item.pickupJson = JSON.stringify(item.pickupJson);
         }
         if (item.driverAddress) {
            item.driverAddress = JSON.stringify(item.driverAddress);
         }
         if (item.route) {
            item.route = JSON.stringify(item.route);
         }
         if (item.truckloadJson) {
            item.truckloadJson = JSON.stringify(item.truckloadJson);
         }
         return item;
      });

      if (this.hubConnection && this.hubConnection.state == 'Connected') {
         this.hubConnection
            .invoke('dbstatusdata', newData)
            .then((res) => {
               console.log('SUccess');
            })
            .catch((err) => {
               console.log('ERRORR');
               console.log(err);
            });
      }
   };

   public addBroadcastDbStatusDataListener = () => {
      this.hubConnection.on('dbstatusdata', (data) => {
         console.log(
            'receive data < dbstatusdata < addBroadcastDbStatusDataListener ',
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

   /* table - dbtabledata */
   public broadcastDbTableData = () => {
      this.hubConnection
         .invoke('dbtabledata', this.data)
         .catch((err) => console.error(err));
      console.log('send data > broadcastDbTableData > dbtabledata', this.data);
   };

   public addBroadcastDBTableDataListener = () => {
      this.hubConnection.on('dbtabledata', (data) => {
         // data.map(item => {
         //     item.statusId = item.status;
         //     return item;
         //   });
         // this.data = data;
         console.log(
            'receive data < dbtabledata < addBroadcastDBTableDataListener ',
            data
         );
      });
   };

   /* switch row - dbtableswitchrow */
   public broadcastDbTableSwitchRow = () => {
      this.hubConnection
         .invoke('dbtableswitchrow', this.data)
         .catch((err) => console.error(err));
      console.log(
         'send data > broadcastDbTableSwitchRow > dbtableswitchrow',
         this.data
      );
   };

   public addBroadcastDBTableSwitchRowListener = () => {
      this.hubConnection.on('dbtableswitchrow', (data) => {
         // data.map(item => {
         //     item.statusId = item.status;
         //     return item;
         //   });
         // this.data = data;
         console.log(
            'receive data < dbtableswitchrow < addBroadcastDBTableSwitchRowDataListener ',
            data
         );
      });
   };

   /* gps last data */
   public addTransferGpsDataListener = () => {
      this.hubConnection.on('transfergpsdata', (gps) => {
         this.gps = gps;
         this.gpsData.next(gps);
      });
   };

   public broadcastGpsLastData = () => {
      this.hubConnection
         .invoke('gpslastdata', this.gps)
         .catch((err) => console.error(err));
      console.log('send data > broadcastGpsLastData > gpslastdata', this.gps);
   };

   public addBroadcastGpsLastDataListener = () => {
      this.hubConnection.on('gpslastdata', (gps) => {
         this.gps = gps;
         /* this.gpsData.next(gps); */
         console.log(
            'receive data < gpslastdata < addBroadcastGpsLastDataListener ',
            gps
         );
      });
   };
}
