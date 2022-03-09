import { SearchFilter, SearchFilterEvent } from './../../model/searchFilter';
import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchDataService {
  public dataSource = new BehaviorSubject<SearchFilterEvent>({searchFilter: null, check: false});
  public resetPageSizeDataSource = new BehaviorSubject<boolean>(null);
  public currentDataSource = this.dataSource.asObservable();
  public currentResetPageSizeDataSource = this.resetPageSizeDataSource.asObservable();

  constructor() {
  }

  /**
   * Send data source function
   *
   * @param searchFilter SearchFilter
   */
  public sendDataSource(searchFilter: SearchFilter) {
    this.dataSource.next({searchFilter, check: false});
  }

  /**
   * Send data source function
   */
  public sendResetPageSizeDataSource() {
    this.resetPageSizeDataSource.next(true);
  }
}
