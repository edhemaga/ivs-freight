import { Injectable } from '@angular/core';
import {
  CreateOwnerCommand,
  CreateResponse,
  OwnerModalResponse,
  OwnerResponse,
  OwnerService,
  UpdateOwnerCommand,
} from 'appcoretruckassist';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OwnerModalService {
  constructor(private ownerService: OwnerService) {}

  public addOwner(data: CreateOwnerCommand): Observable<CreateResponse> {
    return this.ownerService.apiOwnerPost(data);
  }

  public updateOwner(data: UpdateOwnerCommand): Observable<any> {
    return this.ownerService.apiOwnerPut(data);
  }

  public deleteOwnerById(id: number): Observable<any> {
    return this.ownerService.apiOwnerIdDelete(id);
  }

  public getOwnerById(id: number): Observable<OwnerResponse> {
    return this.ownerService.apiOwnerIdGet(id);
  }

  public getOwnerDropdowns(): Observable<OwnerModalResponse> {
    return this.ownerService.apiOwnerModalGet();
  }
}
