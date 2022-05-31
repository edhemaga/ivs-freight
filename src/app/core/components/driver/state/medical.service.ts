import { Injectable } from '@angular/core';
import {
  CreateMedicalCommand,
  CreateMedicalResponse,
  EditMedicalCommand,
  MedicalResponse,
  MedicalService,
} from 'appcoretruckassist';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MedicalTService {
  constructor(private medicalService: MedicalService) {}

  public deleteMedicalById(id: number): Observable<any> {
    return this.medicalService.apiMedicalIdDelete(id);
  }

  public getMedicalById(id: number): Observable<MedicalResponse> {
    return this.medicalService.apiMedicalIdGet(id);
  }

  public addMedical(
    data: CreateMedicalCommand
  ): Observable<CreateMedicalResponse> {
    return this.medicalService.apiMedicalPost(data);
  }

  public updateMedical(data: EditMedicalCommand): Observable<object> {
    return this.medicalService.apiMedicalPut(data);
  }
}
