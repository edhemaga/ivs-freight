import { Injectable } from '@angular/core';
import {
  CreateTestCommand,
  CreateTestResponse,
  DriverResponse,
  DriverService,
  EditTestCommand,
  GetTestModalResponse,
  TestResponse,
  TestService,
} from 'appcoretruckassist';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DrugModalService {
  constructor(
    private drugService: TestService,
    private driverService: DriverService
  ) {}

  public getDriverById(id: number): Observable<DriverResponse> {
    return this.driverService.apiDriverIdGet(id);
  }

  public addDrug(data: CreateTestCommand): Observable<CreateTestResponse> {
    return this.drugService.apiTestPost(data);
  }

  public updateDrug(data: EditTestCommand): Observable<object> {
    return this.drugService.apiTestPut(data);
  }

  public deleteDrugById(id: number): Observable<any> {
    return this.drugService.apiTestIdDelete(id);
  }

  public getDrugById(id: number): Observable<TestResponse> {
    return this.drugService.apiTestIdGet(id);
  }

  public getDrugDropdowns(): Observable<GetTestModalResponse> {
    return this.drugService.apiTestModalGet();
  }
}
