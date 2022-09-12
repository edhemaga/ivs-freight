import { ParkingListResponse } from './../../../../../../../../appcoretruckassist/model/parkingListResponse';
import { Injectable } from '@angular/core';
import { TerminalService } from 'appcoretruckassist';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CompanyTerminalService {
  constructor(private terminalService: TerminalService) {}

  // Get Parking List
  public getTerminalList(
    pageIndex?: number,
    pageSize?: number,
    count?: number
  ): Observable<ParkingListResponse> {
    return this.terminalService.apiTerminalListGet(pageIndex, pageSize, count);
  }
}
