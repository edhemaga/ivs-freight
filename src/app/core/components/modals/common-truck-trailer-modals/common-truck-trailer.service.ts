import { Injectable } from '@angular/core';
import {
  CreateInspectionCommand,
  CreateInspectionResponse,
  CreateRegistrationCommand,
  CreateRegistrationResponse,
  CreateTitleCommand,
  CreateTitleResponse,
  InspectionResponse,
  InspectionService,
  RegistrationResponse,
  RegistrationService,
  TitleResponse,
  TitleService,
  UpdateInspectionCommand,
  UpdateRegistrationCommand,
  UpdateTitleCommand,
} from 'appcoretruckassist';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonTruckTrailerService {
  constructor(
    private registrationService: RegistrationService,
    private inspectionService: InspectionService,
    private titleService: TitleService
  ) {}

  // Registration
  public addRegistration(
    data: CreateRegistrationCommand
  ): Observable<CreateRegistrationResponse> {
    return this.registrationService.apiRegistrationPost(data);
  }

  public updateRegistration(
    data: UpdateRegistrationCommand
  ): Observable<object> {
    return this.registrationService.apiRegistrationPut(data);
  }

  public getRegistrationById(id: number): Observable<RegistrationResponse> {
    return this.registrationService.apiRegistrationIdGet(id);
  }

  public deleteRegistrationById(id: number): Observable<any> {
    return this.registrationService.apiRegistrationIdDelete(id);
  }

  // Inspection
  public deleteInspectionById(id: number): Observable<any> {
    return this.inspectionService.apiInspectionIdDelete(id);
  }

  public getInspectionById(id: number): Observable<InspectionResponse> {
    return this.inspectionService.apiInspectionIdGet(id);
  }

  public addInspection(data: CreateInspectionCommand): Observable<CreateInspectionResponse> {
    return this.inspectionService.apiInspectionPost(data);
  }

  public updateInspection(data: UpdateInspectionCommand): Observable<object> {
    return this.inspectionService.apiInspectionPut(data);
  }

  // Title
  public deleteTitleById(id: number): Observable<any> {
    return this.titleService.apiTitleIdDelete(id);
  }

  public getTitleById(id: number): Observable<TitleResponse> {
    return this.titleService.apiTitleIdGet(id);
  }

  public addTitle(data: CreateTitleCommand): Observable<CreateTitleResponse> {
    return this.titleService.apiTitlePost(data);
  }

  public updateITitle(data: UpdateTitleCommand): Observable<object> {
    return this.titleService.apiTitlePut(data);
  }
}
