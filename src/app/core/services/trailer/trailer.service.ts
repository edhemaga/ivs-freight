import {EventEmitter, Injectable } from '@angular/core';
import {map, Observable, Subject, tap} from 'rxjs';
import {TrailerData, TrailerOwner, TrailerTabData} from "../../model/trailer";
import {UpdatedData} from "../../model/enums";
import {HttpClient} from "@angular/common/http";
import {SortPipe} from "../../pipes/sort.pipe";
import {environment} from "../../../../environments/environment";
import {checkParamas} from "../../utils/methods.globals";
import {Vin} from "../../model/vin";

@Injectable({
  providedIn: 'root'
})
export class TrailerService {
  public deleteItemAction: EventEmitter<any[]> = new EventEmitter();
  public updateItemAction: EventEmitter<any[]> = new EventEmitter();
  private updatedTrailerSubject = new Subject<TrailerData>();
  private addedTrailerSubject = new Subject<TrailerData>();
  private deletedItemsSubject = new Subject<UpdatedData>();
  private updatedItemsSubject = new Subject<UpdatedData>();

  constructor(private http: HttpClient, private sortPipe: SortPipe) {
  }

  get updatedTrailer() {
    return this.updatedTrailerSubject;
  }

  get addedTrailer() {
    return this.addedTrailerSubject;
  }

  get deletedTrailers() {
    return this.deletedItemsSubject;
  }

  get updatedStatuses() {
    return this.updatedItemsSubject;
  }

  addTrailer(trailer: TrailerData) {
    return this.http.post(environment.API_ENDPOINT + 'trailer', trailer).pipe(
      tap((trailerData: TrailerData) => {
        trailer.id = trailerData.id;
        this.addedTrailerSubject.next(trailer);
      })
    );
  }

  updateTrailerData(data: TrailerData, id: number): Observable<TrailerData> {
    return this.http.put<TrailerData>(environment.API_ENDPOINT + `trailer/${id}`, data).pipe(
      tap((trailerData: TrailerData) => {
        if (trailerData.doc) {
          //@ts-ignore
          trailerData.doc.inspectionData = this.sortPipe.transform(
            trailerData.doc.inspectionData,
            'startDate'
          );
          //@ts-ignore
          trailerData.doc.licenseData = this.sortPipe.transform(
            trailerData.doc.licenseData,
            'startDate'
          );
          //@ts-ignore
          trailerData.doc.titleData = this.sortPipe.transform(
            trailerData.doc.titleData,
            'startDate'
          );
          //@ts-ignore
          trailerData.doc.trailerLeaseData = this.sortPipe.transform(
            trailerData.doc.trailerLeaseData,
            'date'
          );
        }

        this.updatedTrailerSubject.next(trailerData);
      })
    );
  }

  updateTrailerBasic(data: any, id: number): Observable<TrailerData> {
    return this.http.put<TrailerData>(environment.API_ENDPOINT + `trailer/${id}`, data).pipe(
      tap((trailerData: TrailerData) => {
        if (trailerData.doc) {
          //@ts-ignore
          trailerData.doc.inspectionData = this.sortPipe.transform(
            trailerData.doc.inspectionData,
            'startDate'
          );
          //@ts-ignore
          trailerData.doc.licenseData = this.sortPipe.transform(
            trailerData.doc.licenseData,
            'startDate'
          );
          //@ts-ignore
          trailerData.doc.titleData = this.sortPipe.transform(
            trailerData.doc.titleData,
            'startDate'
          );
          //@ts-ignore
          trailerData.doc.trailerLeaseData = this.sortPipe.transform(
            trailerData.doc.trailerLeaseData,
            'date'
          );
        }

        this.updatedTrailerSubject.next(trailerData);
      })
    );
  }

  getTrailers(
    pageIndex?: number,
    pageSize?: number,
    queryParams?: any
  ): Observable<TrailerTabData> {
    const params = checkParamas(queryParams);

    return this.http
      .get<TrailerTabData>(environment.API_ENDPOINT + `trailer/list/all/${pageIndex}/${pageSize}`, {
        params,
      })
      .pipe(
        map((response: TrailerTabData) => {
          return response;
        })
      );
  }

  getOwners(): Observable<TrailerOwner[]> {
    const endpoint = environment.API_ENDPOINT + 'select/owner/list';
    return this.http.get<TrailerOwner[]>(endpoint);
  }

  importTrailers(trailers) {
    return this.http.post(environment.API_ENDPOINT + `import/b64/trailer`, trailers);
  }

  editTrailers(id) {
    return this.http.get(environment.API_ENDPOINT + `trailer/${id}/all`);
  }

  deleteMaintennaceItem(id) {
    return this.http.delete(environment.API_ENDPOINT + 'maintenance/' + id);
  }

  removeTrailerLoad(id) {
    return this.http.delete(environment.API_ENDPOINT + `trailerload/${id}`);
  }

  getVinData(vin: string): Observable<Vin[]> {
    const endpoint = environment.API_ENDPOINT + 'vin/trailer/';
    return this.http.get<Vin[]>(endpoint + vin);
  }

  getTrailerList(): Observable<TrailerTabData> {
    return this.http.get<TrailerTabData>(
      environment.API_ENDPOINT + 'trailer/list/all/1/' + environment.perPage
    );
  }

  getTrailerData(id: number, jsonNode: string): Observable<TrailerData> {
    return this.http.get<TrailerData>(environment.API_ENDPOINT + `trailer/${id}/${jsonNode}`).pipe(
      map((trailerData: TrailerData) => {
        //@ts-ignore
        trailerData.doc.inspectionData = this.sortPipe.transform(
          trailerData.doc.inspectionData,
          'startDate'
        );
        //@ts-ignore
        trailerData.doc.licenseData = this.sortPipe.transform(
          trailerData.doc.licenseData,
          'startDate'
        );
        //@ts-ignore
        trailerData.doc.titleData = this.sortPipe.transform(trailerData.doc.titleData, 'startDate');
        //@ts-ignore
        trailerData.doc.trailerLeaseData = this.sortPipe.transform(
          trailerData.doc.trailerLeaseData,
          'date'
        );
        return trailerData;
      })
    );
  }

  deleteAllTrailers(data) {
    console.log('Api trailer/multiple/delete se poziva');
    console.log(data);
    return this.http.put(environment.API_ENDPOINT + 'trailer/multiple/delete', data).pipe(
      tap((items: UpdatedData) => {
        // items.failure = JSON.parse(items.failure.toString());
        // items.notExist = JSON.parse(items.notExist.toString());
        // items.success = JSON.parse(items.success.toString());
        this.deletedItemsSubject.next(items);
      })
    );
  }

  changeTrailerStatuses(data) {
    return this.http.put(environment.API_ENDPOINT + 'trailer/multiple/status', data).pipe(
      tap((items: UpdatedData) => {
        // items.failure = JSON.parse(items.failure.toString());
        // items.notExist = JSON.parse(items.notExist.toString());
        // items.success = JSON.parse(items.success.toString());
        this.updatedItemsSubject.next(items);
      })
    );
  }
}
