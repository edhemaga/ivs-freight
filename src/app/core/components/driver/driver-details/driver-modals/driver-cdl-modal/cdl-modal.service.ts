import { Injectable } from '@angular/core';
import {
  CdlResponse,
  CdlService,
  CreateCdlCommand,
  CreateCdlResponse,
  EditCdlCommand,
  GetCdlModalResponse,
} from 'appcoretruckassist';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CdlModalService {
  constructor(private cdlService: CdlService) {}

  public addCdl(data: CreateCdlCommand): Observable<CreateCdlResponse> {
    return this.cdlService.apiCdlPost(data);
  }

  public updateCdl(data: EditCdlCommand): Observable<object> {
    return this.cdlService.apiCdlPut(data);
  }

  public deleteCdlById(id: number): Observable<any> {
    return this.cdlService.apiCdlIdDelete(id);
  }

  public getCdlById(id: number): Observable<CdlResponse> {
    return this.cdlService.apiCdlIdGet(id);
  }

  public getCdlDropdowns(): Observable<GetCdlModalResponse> {
    return this.cdlService.apiCdlModalGet();
  }
}
