import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { checkParamas } from '../../utils/methods.globals';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AppFuelService {
  public newFuel = new Subject<void>();
  public editAddFuel = new Subject<void>();

  /* For Fuel Tabel */
  public newFuelAdd = new Subject<void>();
  public editFuel = new Subject<any>();

  constructor(private http: HttpClient) {}

  /* For Fuel Tabel */
  get getNewFuel() {
    return this.newFuelAdd;
  }

  get getEditFuel() {
    return this.editFuel;
  }

  get load() {
    return this.newFuel;
  }

  get editedLoad() {
    return this.editAddFuel;
  }

  getFuellist(pageIndex?: number, pageSize?: number, queryParams?: any) {
    const params = checkParamas(queryParams);

    return this.http.get(
      environment.API_ENDPOINT + `fuel/list/all/${pageIndex}/${pageSize}`,
      {
        params,
      }
    );
  }

  getFuelById(id) {
    return this.http.get(environment.API_ENDPOINT + `fuel/${id}`);
  }

  editFuelById(data, id) {
    return this.http.put(environment.API_ENDPOINT + `fuel/${id}`, data).pipe(
      tap((fuelData) => {
        this.editAddFuel.next(data);
      })
    );
  }

  deleteFuel(fuelId: number) {
    return this.http.delete(environment.API_ENDPOINT + `fuel/${fuelId}`);
  }

  fuelMultipleDelete(fuelData: any) {
    return this.http.put(
      environment.API_ENDPOINT + `fuel/multiple/delete`,
      fuelData
    );
  }

  addFuel(data) {
    return this.http.post(environment.API_ENDPOINT + 'fuel', data).pipe(
      tap(() => {
        this.editAddFuel.next();
      })
    );
  }

  importFuel(fuel) {
    return this.http.post(environment.API_ENDPOINT + `import/b64/fuel`, fuel);
  }

  /* Fuel List Category */
  getFuelCategoryList() {
    return this.http.get(
      environment.API_ENDPOINT + 'select/fuel/category/list'
    );
  }

  getFuelAvailableCredit(companyAccountId: number) {
    return this.http.get(
      environment.API_ENDPOINT + `fuel/availableCredit/${companyAccountId}`
    );
  }

  getAccountCompanyId(apiCategoryId: number) {
    return this.http.get(
      environment.API_ENDPOINT +
        `company/api/${apiCategoryId}/account/list/all/1/20`
    );
  }
}
