import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, tap} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';
import {
  DriverData,
  DriverTabData,
  EndorsementData,
  LicenseData,
  RestrictionData,
  UpsertedLicenseData,
} from '../../model/driver';
import {environment} from 'src/environments/environment';
import {UpdatedData} from '../../model/enums';
import {SortPipe} from '../../pipes/sort.pipe';

@Injectable({
  providedIn: 'root',
})
export class DriverService {
  public driverSelected = new Subject<any>();
  public deleteItemAction: EventEmitter<any[]> = new EventEmitter();
  public updateItemAction: EventEmitter<any[]> = new EventEmitter();
  private updatedDriverSubject = new Subject<DriverData>();
  private addedDriverSubject = new Subject<DriverData>();
  private deletedItemsSubject = new Subject<UpdatedData>();
  private updatedItemsSubject = new Subject<UpdatedData>();
  private upsertCDLSubject = new Subject<UpsertedLicenseData>();

  constructor(private http: HttpClient, private sortPipe: SortPipe) {
  }

  get getDriverSelected() {
    return this.driverSelected;
  }

  get updatedDriver() {
    return this.updatedDriverSubject;
  }

  get addedDriver() {
    return this.addedDriverSubject;
  }

  get deletedDrivers() {
    return this.deletedItemsSubject;
  }

  get updatedStatuses() {
    return this.updatedItemsSubject;
  }

  get upsertedCDL() {
    return this.upsertCDLSubject;
  }

  getDrivers(): Observable<DriverTabData> {
    return this.http.get<DriverTabData>(
      environment.API_ENDPOINT + 'driver/list/all/' + 1 + '/' + environment.perPage
    );
  }

  getDriverSelect() {
    return this.http.get<any>(environment.API_ENDPOINT + 'select/driver/all');
  }

  getDriverData(id: number, jsonNode: string): Observable<DriverData> {
    return this.http.get<DriverData>(environment.API_ENDPOINT + `driver/${id}/${jsonNode}`).pipe(
      map((driverData: DriverData) => {
        //@ts-ignore
        driverData.doc.testData = this.sortPipe.transform(driverData.doc.testData, 'testingDate');
        //@ts-ignore
        driverData.doc.licenseData = this.sortPipe.transform(driverData.doc.licenseData, 'endDate');
        //@ts-ignore
        driverData.doc.medicalData = this.sortPipe.transform(driverData.doc.medicalData, 'endDate');
        //@ts-ignore
        driverData.doc.mvrData = this.sortPipe.transform(driverData.doc.mvrData, 'startDate');
        return driverData;
      })
    );
  }

  getDriverAllFiles(id) {
    return this.http.get<any>(
      environment.API_ENDPOINT + `storage/driver/list/${id}/` + 1 + '/' + environment.perPage
    );
  }

  deleteDriver(id: number) {
    return this.http.delete(environment.API_ENDPOINT + `driver/${id}`);
  }

  deleteAllDrivers(data) {
    return this.http.put(environment.API_ENDPOINT + 'driver/multiple/delete', data).pipe(
      tap((items: UpdatedData) => {
        this.deletedItemsSubject.next(items);
      })
    );
  }

  updateDriverBasic(data: any, id: number): Observable<DriverData> {
    return this.http.put<DriverData>(environment.API_ENDPOINT + `driver/${id}`, data).pipe(
      tap(() => {
        data.id = id;
        data.doc.testData = this.sortPipe.transform(data.doc.testData, 'testingDate');
        data.doc.licenseData = this.sortPipe.transform(data.doc.licenseData, 'endDate');
        data.doc.medicalData = this.sortPipe.transform(data.doc.medicalData, 'endDate');
        data.doc.mvrData = this.sortPipe.transform(data.doc.mvrData, 'startDate');
        this.updatedDriverSubject.next(data);
      })
    );
  }

  updateDriverData(data: any, id: number): Observable<DriverData> {
    return this.http.put<DriverData>(environment.API_ENDPOINT + `driver/${id}`, data).pipe(
      tap(() => {
        data.id = id;
        data.doc.testData = this.sortPipe.transform(data.doc.testData, 'testingDate');
        data.doc.licenseData = this.sortPipe.transform(data.doc.licenseData, 'endDate');
        data.doc.medicalData = this.sortPipe.transform(data.doc.medicalData, 'endDate');
        data.doc.mvrData = this.sortPipe.transform(data.doc.mvrData, 'startDate');

        this.updatedDriverSubject.next(data);
      })
    );
  }

  addDriver(driver): Observable<DriverData> {
    return this.http.post<DriverData>(environment.API_ENDPOINT + 'driver', driver).pipe(
      tap((driverData: DriverData) => {
        driver.id = driverData.id;
        this.addedDriverSubject.next(driver);
      })
    );
  }

  importDrivers(driver) {
    return this.http.post(environment.API_ENDPOINT + `import/b64/driver`, driver);
  }

  getRestriction(): Observable<RestrictionData[]> {
    return this.http.get<RestrictionData[]>(
      environment.API_ENDPOINT + 'metadata/app/restriction/list'
    );
  }

  getEndorsement(): Observable<EndorsementData[]> {
    return this.http.get<EndorsementData[]>(
      environment.API_ENDPOINT + 'metadata/app/endorsement/list'
    );
  }

  changeDriverStatuses(data) {
    return this.http.put(environment.API_ENDPOINT + 'driver/multiple/status', data).pipe(
      tap((items: UpdatedData) => {
        this.updatedItemsSubject.next(items);
      })
    );
  }

  upsertCDL(licenseData: LicenseData, driverId: number): Observable<LicenseData> {
    return this.http
      .put<LicenseData>(environment.API_ENDPOINT + `driver/cdl/${driverId}`, licenseData)
      .pipe(
        tap((upsertedCDL: LicenseData) => {
          this.upsertCDLSubject.next({licenseData: upsertedCDL, driverId});
        })
      );
  }
}
