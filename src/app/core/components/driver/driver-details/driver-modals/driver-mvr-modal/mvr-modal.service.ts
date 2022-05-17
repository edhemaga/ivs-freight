import { Injectable } from '@angular/core';
import { DriverResponse, DriverService } from 'appcoretruckassist';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MvrModalService {
  constructor(private driverService: DriverService) {}

  public getDriverById(id: number): Observable<DriverResponse> {
    return this.driverService.apiDriverIdGet(id);
  }
}
