import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MetaData } from '../../model/enums';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MetaDataService {
  private states = 'assets/utils/states.json';
  private provinces = 'assets/utils/provinces.json';

  constructor(private http: HttpClient) {}

  getMetaDataByDomainKey(domain: string, key: string) {
    return this.http.get<MetaData[]>(
      environment.API_ENDPOINT + `metadata/domain/${domain}/key/${key}`
    );
  }

  getColorList() {
    return this.http.get<MetaData[]>(
      environment.API_ENDPOINT +
        'metadata/app/color/list/' +
        1 +
        '/' +
        environment.perPage
    );
  }

  public getJSON(key: string): Observable<MetaData[]> {
    if (key === 'US') {
      return this.http.get<MetaData[]>(this.states);
    } else if (key === 'Canada') {
      return this.http.get<MetaData[]>(this.provinces);
    }
  }

  createMetadata(data: any) {
    return this.http.post(environment.API_ENDPOINT + `metadata`, data);
  }

  deleteColor(id: number) {
    return this.http.delete(
      environment.API_ENDPOINT + `metadata/app/color/` + id
    );
  }

  deleteBank(id: number) {
    return this.http.delete(
      environment.API_ENDPOINT + `metadata/app/bank/` + id
    );
  }
}
