import { Injectable } from '@angular/core';
import {
  ApplicantAdminResponse,
  ApplicantService,
  CreateApplicantCommand,
  ResendInviteCommand,
  UpdateApplicantCommand,
} from '../../../../../../appcoretruckassist';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApplicantTService {
  constructor(private applicantService: ApplicantService) {}

  public addApplicantAdmin(data: CreateApplicantCommand): Observable<object> {
    return this.applicantService.apiApplicantAdminPost(data);
  }

  public updateApplicantAdmin(
    data: UpdateApplicantCommand
  ): Observable<object> {
    return this.applicantService.apiApplicantAdminPut(data);
  }

  public resendApplicantInviteAdmin(
    data: ResendInviteCommand
  ): Observable<object> {
    return this.applicantService.apiApplicantAdminResendInvitePost(data);
  }

  public getApplicantByIdAdmin(id: number): Observable<ApplicantAdminResponse> {
    return this.applicantService.apiApplicantAdminIdGet(id);
  }
}
