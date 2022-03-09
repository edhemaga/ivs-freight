import {EventEmitter, Injectable} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {NotificationService} from "../notification/notification.service";
import {Address} from "../../model/address";
import {Observable, Subject, tap} from "rxjs";
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {SpinnerService} from "../spinner/spinner.service";

class OwnerData {
}

class ManageMaintenance {
}

class DriverOwnerData {
}

class OwnerTabData {
}

class BankData {
}

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public emitTogglePdf: EventEmitter<boolean> = new EventEmitter();
  public emitCloseNote: EventEmitter<boolean> = new EventEmitter();
  public emitMagicLine: EventEmitter<boolean> = new EventEmitter();
  public emitOpenNote: EventEmitter<any> = new EventEmitter();
  public emitDeleteAction: EventEmitter<any> = new EventEmitter();
  public emitSortStatusUpdate: EventEmitter<any> = new EventEmitter();
  public emitStatusUpdate: EventEmitter<any> = new EventEmitter();

  public emitAllNoteOpened: EventEmitter<boolean> = new EventEmitter();
  public emitUpdateNoteActiveList: EventEmitter<any[]> = new EventEmitter();

  public emitViewChange: EventEmitter<boolean> = new EventEmitter();

  // Owner
  public createOwner = new Subject<OwnerData>();
  public editOwnerSubject = new Subject<void>();
  public updateOwnerSubject = new Subject<OwnerData>();

  // Repair shop
  public createRepairShop = new Subject<void>();
  // TODO: dodati tip za RepairShop
  public updateRepairShopSubject = new Subject<any>();

  // Maintenance
  public createMaintenance = new Subject<void>();
  public editMaintenanceSubject = new Subject<ManageMaintenance>();
  public deleteMaintenanceSubject = new Subject<void>();
  // ublic multiDeleteMaintenanceSubject = new Subject<void>();

  public reloadTruckList = new Subject<void>();
  public reloadTrailerList = new Subject<void>();

  // Office / Factoring
  public editOfficeFactoringSubject = new Subject<void>();

  public enableDisable: EventEmitter<boolean> = new EventEmitter();
  public emitTab: EventEmitter<number> = new EventEmitter();
  public reloadOwner: boolean;
  headers = {'Content-Type': 'application/json', Accept: 'application/json'};
  private notify = new Subject<any>();

  constructor(public notification: NotificationService,
              private spinner: SpinnerService,
              public http: HttpClient
              ) { }

  public notifyOther(data: any) {
    if (data) {
      this.notify.next(data);
    }
  }

  /**
   * Marks all controls in a form group as touched
   *
   * @param formGroup FormGroup - The form group to touch
   */
  public markInvalid(formGroup: FormGroup, isSpecialCase?: boolean) {
    if (!isSpecialCase) {
      this.spinner.show(true);
    }

    if (formGroup.invalid) {
      (Object as any).values(formGroup.controls).forEach((control: any) => {
        control.markAsTouched();
        if (control.controls) {
          this.markInvalid(control);
        }
      });
      this.notification.warning('Please fill all required fields.', 'Warning:');
      this.spinner.show(false);
      return false;
    } else {
      (Object as any).values(formGroup.controls).forEach((control: any) => {
        control.markAsTouched();
        if (control.controls) {
          this.markInvalid(control);
        }
      });
      return true;
    }
  }

  public manageInputValidation(formElement: any): any {
    if (formElement.valid) {
      return 'touched-valid';
    }
    if (formElement.invalid) {
      return 'touched-invalid';
    }
    if (formElement.pristine || formElement.valid) {
      return 'untouched-valid';
    }
    if (formElement.pristine || formElement.invalid) {
      return 'untouched-invalid';
    }
  }

  /**
   * Server error handling
   */
  public handleServerError() {
    this.notification.error('Something went wrong. Please try again.', 'Error:');
    this.spinner.show(false);
  }

  /**
   * It handles  error.
   */
  public handleError(error?: HttpErrorResponse) {
    const message =
      error && error.error && error.error.message
        ? error.error.message
        : 'Something went wrong. Please try again.';
    this.notification.error(message, 'Error:');
    this.spinner.show(false);
  }

  /**
   * It handles input values.
   */
  public handleInputValues(form: any, data: any) {
    Object.keys(data).forEach((key1: any) => {
      Object.keys(form.controls).forEach((key2: any) => {
        if (key1 == key2) {
          const control = form.controls[key2];

          control.valueChanges.subscribe(() => {
            if (control.value !== undefined && control.value !== null && control.value !== '') {
              switch (data[key1]) {
                // First letter capitalized
                case 'capitalize':
                  const firstLetter = control.value.slice(0, 1);
                  const newValue =
                    firstLetter.toUpperCase() +
                    control.value.slice(1, control.value.length).toLowerCase();
                  control.patchValue(newValue, {emitEvent: false});
                  break;

                // lowercased and uppercases with first letter capitalized
                case 'nameInput':
                  const firstC = control.value.slice(0, 1);
                  const newName =
                    firstC.toUpperCase() + control.value.slice(1, control.value.length);
                  control.patchValue(newName, {emitEvent: false});
                  break;

                // All letters lowercased
                case 'lower':
                  control.patchValue(control.value.toLowerCase(), {emitEvent: false});
                  break;

                // All letters uppercases
                case 'upper':
                  control.patchValue(control.value.toUpperCase(), {emitEvent: false});
                  break;

                default:
                  break;
              }
            }
          });
        }
      });
    });
  }

  public selectAddress(form: FormGroup, address: any) {
    const ret: Address = {
      address: address.formatted_address,
      streetNumber: this.retrieveAddressComponents(address.address_components, 'street_number', 'long_name'),
      streetName: this.retrieveAddressComponents(address.address_components, 'route', 'long_name'),
      city: this.retrieveAddressComponents(address.address_components, 'locality', 'long_name'),
      state: this.retrieveAddressComponents(
        address.address_components,
        'administrative_area_level_1',
        'short_name'
      ),
      stateShortName: this.retrieveAddressComponents(
        address.address_components,
        'administrative_area_level_1',
        'short_name'
      ),
      country: this.retrieveAddressComponents(address.address_components, 'country', 'short_name'),
      zipCode: this.retrieveAddressComponents(
        address.address_components,
        'postal_code',
        'long_name'
      ),
    };
    return ret;
  }

  public retrieveAddressComponents(addressArray: any, type: string, name: string) {
    if (!addressArray) {
      return '';
    }
    const res = addressArray.find((addressComponents: any) => addressComponents.types[0] === type);
    if (res !== undefined) {
      return res[name];
    } else {
      return '';
    }
  }

  // Owner
  get newOwner() {
    return this.createOwner;
  }

  get updateOwnerData() {
    return this.updateOwnerSubject;
  }

  // Repair shop
  get newRepairShop() {
    return this.createRepairShop;
  }

  // Maintenance
  get newMaintenance() {
    return this.createMaintenance;
  }

  get updateMaintenanceSubject() {
    return this.editMaintenanceSubject;
  }

  get removeMaintenance() {
    return this.deleteMaintenanceSubject;
  }

  // get multiRemoveMaintenance() {
  //   return this.multiDeleteMaintenanceSubject;
  // }

  // Office
  get updateOfficeFactoringSubject() {
    return this.editOfficeFactoringSubject;
  }

  get reloadTruckListSubject() {
    return this.reloadTruckList;
  }

  get reloadTrailerListSubject() {
    return this.reloadTrailerList;
  }

  get updatedRepairShopData() {
    return this.updateRepairShopSubject;
  }

  deleteRepairShop(id) {
    return this.http.delete(environment.API_ENDPOINT + 'repairshop/' + id);
  }

  // Bank
  getBankList() {
    return this.http.get<BankData[]>(
      environment.API_ENDPOINT + `metadata/app/bank/list/1/${environment.perPage}`
    );
  }

  deleteMaintenanceV2(id: any) {
    return this.http.delete(environment.API_ENDPOINT + `maintenance/${id}`);
  }

  // OWNER
  editOwner(id: number) {
    return this.http.get(environment.API_ENDPOINT + `owner/${id}/all`);
  }

  addOwner(ownerData: OwnerData): Observable<OwnerData> {
    return this.http.post<OwnerData>(environment.API_ENDPOINT + 'owner', ownerData).pipe(
      tap((owner: OwnerData) => {
        this.createOwner.next(owner);
      })
    );
  }

  updateOwner(data: any, id: number) {
    return this.http.put(environment.API_ENDPOINT + `owner/${id}`, data).pipe(
      tap(() => {
        this.updateOwnerSubject.next(data);
      })
    );
  }

  deleteOwner(id: number) {
    return this.http.delete(environment.API_ENDPOINT + `owner/` + id);
  }

  getOwners(): Observable<OwnerTabData> {
    return this.http.get<OwnerTabData>(
      environment.API_ENDPOINT + `owner/list/all/1/${environment.perPage}`
    );
  }

  getOwner(id: number): Observable<OwnerData> {
    return this.http.get<OwnerData>(environment.API_ENDPOINT + `owner/${id}/all`);
  }

  pingSsn(ssn) {
    return this.http.get(environment.API_ENDPOINT + `ping/ssn/${ssn}`);
  }

  // Maintenance
  addMaintenanceGlobal(data: any) {
    return this.http.post(environment.API_ENDPOINT + 'maintenance', data).pipe(
      tap(() => {
        if (data.category === 'truck') {
          this.reloadTruckList.next();
        }
        if (data.category === 'trailer') {
          this.reloadTrailerList.next();
        }
      })
    );
  }

  updateMaintennace(id: number, data: any) {
    return this.http.put(environment.API_ENDPOINT + `maintenance/${id}`, data).pipe(
      tap(() => {
        // if (data.category == 'truck') {
        //   this.reloadTruckList.next();
        // }
        // if (data.category == 'trailer') {
        //   this.reloadTrailerList.next();
        // }
        this.editMaintenanceSubject.next(data);
      })
    );
  }

  getMaintenanceList() {
    return this.http.get(
      environment.API_ENDPOINT + `maintenance/list/all/1/${environment.perPage}`
    );
  }

  editMaintennace(id: number) {
    return this.http.get(environment.API_ENDPOINT + `maintenance/${id}/all`);
  }

  addRepairShop(data: any) {
    return this.http.post(environment.API_ENDPOINT + 'repairshop', data).pipe(
      tap(() => {
        this.createRepairShop.next();
      })
    );
  }

  getRepairShop(id: number) {
    return this.http.get(environment.API_ENDPOINT + `repairshop/${id}/all`);
  }

  getRepairShops() {
    return this.http.get(environment.API_ENDPOINT + `repairshop/list/all/1/${environment.perPage}`);
  }

  importShops(shop) {
    return this.http.post(environment.API_ENDPOINT + `import/b64/repairshop`, shop);
  }

  getRepairShopCommentById(repairShopId: number) {
    return this.http.get(
      environment.API_ENDPOINT +
      `repairshop/rating/reviews/${repairShopId}/1/${environment.perPage}`
    );
  }

  updateRepairShop(data: any, id) {
    return this.http.put(environment.API_ENDPOINT + `repairshop/${id}`, data).pipe(
      tap(() => {
        this.updateRepairShopSubject.next(data);
      })
    );
  }

  pinRepairShop(id: number, data: any) {
    return this.http.put(environment.API_ENDPOINT + `repairshop/pin/${id}`, data);
  }

  /* Comment Api */
  createComment(data: any) {
    return this.http.post(environment.API_ENDPOINT + `comment`, data);
  }

  getCommentList() {
    return this.http.get(environment.API_ENDPOINT + `comment/list/1/${environment.perPage}`);
  }

  updateComment(id: number, data: any) {
    return this.http.put(environment.API_ENDPOINT + `comment/${id}`, data);
  }

  deleteComment(id: number) {
    return this.http.delete(environment.API_ENDPOINT + `comment/${id}`);
  }

  /* Repair Shop Review Api */
  createRepairShopReview(data: any) {
    return this.http.post(environment.API_ENDPOINT + `repairshop/review`, data);
  }

  getRepairShopReview(repairShopReviewId: number) {
    return this.http.get(environment.API_ENDPOINT + `repairshop/review/${repairShopReviewId}`);
  }

  getRepairShopReviewList(repairShopId: number) {
    return this.http.get(environment.API_ENDPOINT + `repairshop/review/list/${repairShopId}/1/100`);
  }

  updateRepairShopReview(data: any, repairShopReviewId: number) {
    return this.http.put(
      environment.API_ENDPOINT + `repairshop/review/${repairShopReviewId}`,
      data
    );
  }

  deleteRepairShopReview(repairShopReviewId: number) {
    return this.http.delete(environment.API_ENDPOINT + `repairshop/review/${repairShopReviewId}`);
  }

  /* RepairShopRatingApi */
  createRepairShopRating(data: any) {
    return this.http.post(environment.API_ENDPOINT + `repairshop/rating/`, data);
  }

  updateRepairShopRating(data: any, id: number) {
    return this.http.put(environment.API_ENDPOINT + `repairshop/rating/${id}`, data);
  }

  getRepairShopRating(repairShopId: number) {
    return this.http.get(
      environment.API_ENDPOINT + `repairshop/rating/list/${repairShopId}/1/${environment.perPage}`,
      {
        headers: this.headers,
      }
    );
  }

  deleteRepairShopRating(id: number) {
    return this.http.delete(environment.API_ENDPOINT + `repairshop/rating/${id}`);
  }

  /* End of RepairShopRatingApi */

  getCompany(id: number) {
    // return this.http.get(environment.API_ENDPOINT + `company/list/all/1/${environment.perPage}`);
    return this.http.get(environment.API_ENDPOINT + `company/${id}/all`);
  }

  updateCompany(data: any, id: number) {
    return this.http.put(environment.API_ENDPOINT + `company/${id}`, data).pipe(
      tap(() => {
        this.editOfficeFactoringSubject.next();
      })
    );
  }

  createCompany(data: any) {
    return this.http.post(environment.API_ENDPOINT + `company`, data).pipe(
      tap(() => {
        this.editOfficeFactoringSubject.next();
      })
    );
  }

  deleteDivisionCompany(id: number) {
    return this.http.delete(environment.API_ENDPOINT + `company/${id}`).pipe(
      tap(() => {
        this.editOfficeFactoringSubject.next();
      })
    );
  }

  getShipperInfo(id: number) {
    return this.http.get(environment.API_ENDPOINT + `shipper/${id}/all`);
  }

  getDriverOwnerData(ein: number): Observable<DriverOwnerData> {
    return this.http.get<DriverOwnerData>(environment.API_ENDPOINT + `ping/taxnumber/${ein}`);
  }

  public touchFormFields(formGroup: FormGroup) {
    (Object as any).values(formGroup.controls).forEach((control: any) => {
      control.markAsTouched();
    });
  }

}
