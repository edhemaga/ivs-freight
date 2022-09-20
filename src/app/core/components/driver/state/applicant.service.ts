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
   /*  return this.applicantService.apiApplicantPost(data) */
   return null;
  }

  public updateApplicant(data: UpdateApplicantCommand): Observable<object> {
    /* return this.applicantService.apiApplicantPut(data); */
    return null;
  }

  public resendApplicantInvite(data:ResendInviteCommand): Observable<object> {
    /* return this.applicantService.apiApplicantResendInvitePost(data); */
    return null;
  }

  public getApplicantById(id: number): Observable<ApplicantResponse> {
    return this.applicantService.apiApplicantIdGet(id)
  }
}
