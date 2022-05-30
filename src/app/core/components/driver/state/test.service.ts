import { Injectable } from '@angular/core';
import {
  CreateTestCommand,
  CreateTestResponse,
  EditTestCommand,
  GetTestModalResponse,
  TestResponse,
  TestService,
} from 'appcoretruckassist';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TestTService {
  constructor(private drugService: TestService) {}

  public addTest(data: CreateTestCommand): Observable<CreateTestResponse> {
    return this.drugService.apiTestPost(data);
  }

  public updateTest(data: EditTestCommand): Observable<object> {
    return this.drugService.apiTestPut(data);
  }

  public deleteTestById(id: number): Observable<any> {
    return this.drugService.apiTestIdDelete(id);
  }

  public getTestById(id: number): Observable<TestResponse> {
    return this.drugService.apiTestIdGet(id);
  }

  public getTestDropdowns(): Observable<GetTestModalResponse> {
    return this.drugService.apiTestModalGet();
  }
}
