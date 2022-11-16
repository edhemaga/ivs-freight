import { Injectable } from '@angular/core';
import {
   AccidentListResponse,
   AccidentResponse,
   AccidentService,
   CreateResponse,
} from 'appcoretruckassist';
import { Observable, of } from 'rxjs';
import { AccidentModalResponse } from '../../../../../../../appcoretruckassist/model/accidentModalResponse';

@Injectable({
   providedIn: 'root',
})
export class AccidentTService {
   constructor(private accidentService: AccidentService) {}

   // Get Accident List
   public getAccidentList(
      active?: boolean,
      reported?: boolean,
      dateFrom?: string,
      dateTo?: string,
      _long?: number,
      lat?: number,
      distance?: number,
      driverIds?: Array<number>,
      truckIds?: Array<number>,
      trailerIds?: Array<number>,
      injury?: number,
      fatality?: number,
      towing?: boolean,
      hazMat?: boolean,
      pageIndex?: number,
      pageSize?: number,
      companyId?: number,
      sort?: string,
      search?: string,
      search1?: string,
      search2?: string
   ): Observable<AccidentListResponse> {
      /* return this.accidentService.apiAccidentListGet(
      active,
      reported,
      dateFrom,
      dateTo,
      _long,
      lat,
      distance,
      driverIds,
      truckIds,
      trailerIds,
      injury,
      fatality,
      towing,
      hazMat,
      pageIndex,
      pageSize,
      companyId,
      sort,
      search,
      search1,
      search2
    ); */
      return of();
   }

   public addAccident(data: any): Observable<CreateResponse> {
      /* return this.accidentService.apiAccidentPost(data); */
      return of();
   }

   public updateAccident(data: any): Observable<any> {
      /* return this.accidentService.apiAccidentPut(data); */
      return of();
   }

   public getAccidentById(id: number): Observable<AccidentResponse> {
      /* return this.accidentService.apiAccidentIdGet(id); */
      return of();
   }

   public getModalDropdowns(): Observable<AccidentModalResponse> {
      return this.accidentService.apiAccidentModalGet();
   }
}
