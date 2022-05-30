import { MvrService } from './../../../../../../appcoretruckassist/api/mvr.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreateMvrCommand,
  CreateMvrResponse,
  EditMvrCommand,
  MvrResponse,
} from 'appcoretruckassist';

@Injectable({
  providedIn: 'root',
})
export class MvrTService {
  constructor(private mvrService: MvrService) {}

  public deleteMvrById(id: number): Observable<any> {
    return this.mvrService.apiMvrIdDelete(id);
  }

  public getMvrById(id: number): Observable<MvrResponse> {
    return this.mvrService.apiMvrIdGet(id);
  }

  public addMvr(data: CreateMvrCommand): Observable<CreateMvrResponse> {
    return this.mvrService.apiMvrPost(data);
  }

  public updateMvr(data: EditMvrCommand): Observable<object> {
    return this.mvrService.apiMvrPut(data);
  }
}
