import { Injectable } from '@angular/core';
import {
  CreateTrailerCommand,
  CreateTrailerResponse,
  GetTrailerModalResponse,
  TrailerResponse,
  TrailerService,
  UpdateTrailerCommand,
} from 'appcoretruckassist';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TrailerModalService {
  constructor(private trailerService: TrailerService) {}

  public addTrailer(
    data: CreateTrailerCommand
  ): Observable<CreateTrailerResponse> {
    return this.trailerService.apiTrailerPost(data);
  }

  public updateTrailer(data: UpdateTrailerCommand): Observable<any> {
    return this.trailerService.apiTrailerPut(data);
  }

  public deleteTrailerById(id: number): Observable<any> {
    return this.trailerService.apiTrailerIdDelete(id);
  }

  public getTrailerById(id: number): Observable<TrailerResponse> {
    return this.trailerService.apiTrailerIdGet(id);
  }

  public getTrailerDropdowns(): Observable<GetTrailerModalResponse> {
    return this.trailerService.apiTrailerModalGet();
  }
}
