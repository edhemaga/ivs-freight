import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoadTabledata } from '../../model/load';
import { environment } from '../../../../environments/environment';

@Injectable({
   providedIn: 'root',
})
export class AppLoadService {
   public newLoad = new Subject<void>();
   public editLoad = new Subject<LoadTabledata>();
   public editDispatchBoard = new Subject<void>();

   constructor(private http: HttpClient) {}

   get getDispatchBoardList() {
      return this.editDispatchBoard;
   }

   get load() {
      return this.newLoad;
   }

   get editedLoad() {
      return this.editLoad;
   }

   getLoadStatuses() {
      // return this.http.get(app_endpoint + 'app/load/enum/status/en');
   }

   // OLD: return this.http.get(app_endpoint + 'app/customer/customer/key/list');
   getLoadCustomers() {
      return this.http.get(environment.API_ENDPOINT + 'select/broker/list');
   }

   // OLD: return this.http.get(app_endpoint + 'app/truck/main/load/list');
   getLoadTrucks(dispatcherId?: any) {
      if (!dispatcherId) {
         return this.http.get(
            environment.API_ENDPOINT + `select/dispatchboard/list`
         );
      } else {
         return this.http.get(
            environment.API_ENDPOINT +
               `select/dispatchboard/list/${dispatcherId}`
         );
      }
   }

   // New Route to get all from dispatch board
   getAllLoadTrucks() {
      return this.http.get(
         environment.API_ENDPOINT + `select/dispatchboard/list/bystatus/all`
      );
   }

   getLoadTypes() {
      return this.http.get(environment.API_ENDPOINT + 'app/load/enum/type/en');
   }

   // OLD: return this.http.get(app_endpoint + 'app/customer/shipper/key/list');
   getLoadShippers() {
      return this.http.get(environment.API_ENDPOINT + 'select/shipper/list');
   }

   // OLD: return this.http.get(app_endpoint + 'app/driver/main/key/list');
   getLoadDrivers() {
      return this.http.get(
         environment.API_ENDPOINT + 'select/driver/available'
      );
   }

   // OLD: return this.http.get(app_endpoint + 'app/trailer/main/key/list');
   getLoadTrailers() {
      return this.http.get(
         environment.API_ENDPOINT + 'select/trailer/available'
      );
   }

   // OLD: return this.http.get(app_endpoint + 'app/truck/main/key/list');
   getDispatchTuckList() {
      return this.http.get(environment.API_ENDPOINT + 'select/truck/available');
   }

   // OLD: return this.http.delete(app_endpoint + 'app/dispatch_board/remove/' + id);
   removeDispatchTuckList(id) {
      this.editDispatchBoard.next();
      return this.http.delete(environment.API_ENDPOINT + `dispatchboard/${id}`);
   }

   // OLD: return this.http.get(app_endpoint + 'app/company/user/dispatcher/key/list');
   getDispatchers() {
      return this.http.get(environment.API_ENDPOINT + 'select/dispatcher/list');
   }

   // OLD: return this.http.get(app_endpoint + 'app/load/detail/' + id);
   getLoadEdit(id) {
      return this.http.get(
         environment.API_ENDPOINT + `truckload/${id}` + `/all`
      );
   }

   // OLD: return this.http.put(app_endpoint + 'app/load/update/'
   updateLoad(data, id): Observable<LoadTabledata> {
      return this.http
         .put(environment.API_ENDPOINT + `truckload/${id}`, data)
         .pipe(
            tap((loadData: LoadTabledata) => {
               this.editLoad.next(data);
            })
         );
   }

   addLoadToDispatchBoardItem(data) {
      return this.http
         .put(environment.API_ENDPOINT + 'dispatchboard/addload', data)
         .pipe(
            tap((res: any) => {
               this.editDispatchBoard.next();
               this.newLoad.next(res);
            })
         );
   }

   getByDispatchboardData(id) {
      return this.http.get(
         environment.API_ENDPOINT + `truckload/bydispatchboard/${id}/all`
      );
   }

   createLoad(data) {
      /* OLD API
    return this.http.post(app_endpoint + 'app/load/create', data).pipe(
      tap(() => {
        this.newLoad.next();
      })
    );
    */
      return this.http.post(environment.API_ENDPOINT + 'truckload', data).pipe(
         tap((res: any) => {
            this.newLoad.next(res);
         })
      );
   }

   /* getLoadData(type?) {
    return this.http
      .get(environment.API_ENDPOINT + 'truckload/list/' + 'all' + '/' + page + '/' + perPage)
      .pipe(
        map((response: any) => {
          response = response.allLoads.map((c) => {
            c.total = '$' + c.total;
            return c;
          });
          return response;
        })
      );
  } */

   getLoadData() {
      return this.http.get(
         environment.API_ENDPOINT +
            'truckload/list/' +
            'all' +
            '/' +
            environment.page +
            '/' +
            environment.perPage
      );
   }

   getUnnasignedLoads() {
      return this.http.get(environment.API_ENDPOINT + 'select/load/unnasigned');
   }

   // NEW: return this.http.get(environment.API_ENDPOINT + 'dispatchboard/list/all/' + page + '/' + perPage);
   // OLD: return this.http.get(app_endpoint + 'app/dispatch_board/list');
   getDispatchData(id?: number) {
      if (id === 0 || id === undefined) {
         +'?bydisp=1';
         return this.http.get(
            environment.API_ENDPOINT +
               'dispatchboard/list/all/' +
               environment.page +
               '/' +
               environment.perPage
         );
      } else if (id === -1) {
         return this.http.get(
            environment.API_ENDPOINT +
               'dispatchboard/byteam/1/list/all/' +
               environment.page +
               '/' +
               environment.perPage
         );
         /// api/v2/dispatchboard/byteam/{teamBoardId}/list/{jsonNode}/{page}/{perPage}
      } else {
         return this.http.get(
            environment.API_ENDPOINT +
               `dispatchboard/bydispatcher/${id}/list/all/` +
               environment.page +
               '/' +
               environment.perPage
         );
      }
   }

   // OLD:return this.http.post(app_endpoint + 'app/dispatch_board/create', null);
   addDispatchItem(data) {
      return this.http
         .post(environment.API_ENDPOINT + 'dispatchboard', data)
         .pipe(
            tap(() => {
               this.editDispatchBoard.next();
            })
         );
   }

   editDispatchBoardData(data, id) {
      return this.http
         .put(environment.API_ENDPOINT + `dispatchboard/${id}`, data)
         .pipe(
            tap(() => {
               this.editDispatchBoard.next();
            })
         );
   }

   getDispatchAffectedRow(id) {
      return this.http.get(
         environment.API_ENDPOINT + `dispatchboard/${id}/all`
      );
   }

   // Switch API set
   // OLD: return this.http.put(app_endpoint + 'app/dispatch_board/switch/driver', data, {responseType: 'text'});
   switchDrivers(data) {
      return this.http.put(
         environment.API_ENDPOINT + 'dispatchboard/switch/driver',
         data,
         {
            responseType: 'text',
         }
      );
   }

   // OLD: return this.http.put(app_endpoint + 'app/dispatch_board/switch/trailer', data);
   switchTrailers(data) {
      return this.http.put(
         environment.API_ENDPOINT + 'dispatchboard/switch/trailer',
         data,
         {
            responseType: 'text',
         }
      );
   }

   // OLD: return this.http.put(app_endpoint + 'app/dispatch_board/switch/truck', data);

   switchTrucks(data) {
      return this.http.put(
         environment.API_ENDPOINT + 'dispatchboard/switch/row',
         data,
         {
            responseType: 'text',
         }
      );
   }

   saveHos(data, driverId) {
      return this.http.put(
         environment.API_ENDPOINT + `driver/hos/${driverId}`,
         data
      );
   }

   /* Load table */
   deleteLoad(id: number) {
      return this.http.delete(environment.API_ENDPOINT + `truckload/${id}`);
   }

   addUpdateLoadNote(data) {
      return this.http.put(
         environment.API_ENDPOINT + `truckload/note/${data.id}`,
         {
            note: data.note,
         }
      );
   }

   updateDispatchStatus(data: any, id: number) {
      return this.http.put(
         environment.API_ENDPOINT + `dispatchboard/status/${id}`,
         data
      );
   }

   updateLoadStatus(data: any, id: number) {
      return this.http.put(
         environment.API_ENDPOINT + `truckload/status/${id}`,
         data
      );
   }

   // Comment section
   createLoadComment(data) {
      return this.http.post(
         environment.API_ENDPOINT + `truckload/comment`,
         data
      );
   }

   getLoadComments(id) {
      return this.http.get(
         environment.API_ENDPOINT +
            `truckload/comment/list/id/${id}/${environment.page}/${environment.perPage}`
      );
   }

   deleteLoadComment(id) {
      return this.http.delete(
         environment.API_ENDPOINT + `truckload/comment/id/${id}`
      );
   }

   updateLoadComment(id, data) {
      return this.http.put(
         environment.API_ENDPOINT + `truckload/comment/id/${id}`,
         data
      );
   }

   getLoadLogList(loadId: number) {
      return this.http.get(environment.API_ENDPOINT + `load/log/${loadId}/all`);
   }

   getLoadLastId() {
      return this.http.get(environment.API_ENDPOINT + 'truckload/last/id');
   }

   getDispatchboardHistoryUsed(params?) {
      return this.http.get(
         environment.API_ENDPOINT +
            `dispatchboard/usedby${params ? params : ''}`
      );
   }

   getDispatchboardHistoryData(params?, isStatus?) {
      if (isStatus) {
         return this.http.get(
            environment.API_ENDPOINT +
               `dispatchboard/status/history/${environment.page}/${
                  environment.perPage
               }${params ? params : ''}`
         );
      }
      return this.http.get(
         environment.API_ENDPOINT +
            `dispatchboard/board/history/${environment.page}/${
               environment.perPage
            }${params ? params : ''}`
      );
   }

   setDispatchboardStatus(data, dispID, isStatus?) {
      if (isStatus) {
         return this.http.put(
            environment.API_ENDPOINT +
               `dispatchboard/datetime/status/${dispID}`,
            data
         );
      }
      return this.http.put(
         environment.API_ENDPOINT + `dispatchboard/datetime/load/${dispID}`,
         data
      );
   }

   importLoads(loads) {
      return this.http.post(
         environment.API_ENDPOINT + `import/b64/load`,
         loads
      );
   }
}
