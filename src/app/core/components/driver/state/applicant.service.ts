import { Injectable } from '@angular/core';
import {
  ApplicantResponse,
  ApplicantService,
  CreateApplicantCommand,
  ResendInviteCommand,
  UpdateApplicantCommand
} from "../../../../../../appcoretruckassist";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApplicantTService {

  constructor(private applicantService: ApplicantService) { }

  public addApplicant(data: CreateApplicantCommand): Observable<object> {
    return this.applicantService.apiApplicantPost(data)
  }

  public updateApplicant(data: UpdateApplicantCommand): Observable<object> {
    return this.applicantService.apiApplicantPut(data);
  }

  public resendApplicantInvite(data:ResendInviteCommand): Observable<object> {
    return this.applicantService.apiApplicantResendInvitePost(data);
  }

  public getApplicantById(id: number): Observable<ApplicantResponse> {
    return this.applicantService.apiApplicantIdGet(id)
  }
}
