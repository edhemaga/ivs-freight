import { ViolationGroupFilterSummaryEvent, ViolationGroupFilterEvent } from './../../model/violation-group-filter-event';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ViolationGroupFilterService {
  public dataSource = new BehaviorSubject<ViolationGroupFilterEvent>({
    violationGroupFilter: [],
    active: false,
  });
  public dataSourceSummary = new BehaviorSubject<ViolationGroupFilterSummaryEvent>({
    selectedTypeId: 0,
  });
  public currentDataSource = this.dataSource.asObservable();
  public currentDataSourceSummary = this.dataSourceSummary.asObservable();

  public violationCount = new Subject<[]>();

  constructor() {
  }

  /**
   * Send data source function
   *
   * @param violationGroupFilter ViolationGroupFilter
   */
  public sendDataSource(violationGroupFilter: number[]) {
    this.dataSource.next({violationGroupFilter, active: true});
  }

  /**
   * Send data source function
   *
   * @param selectedTypeId ViolationGroupFilter
   */
  public sendDataSourceSummary(selectedTypeId: number) {
    this.dataSourceSummary.next({selectedTypeId});
  }

  /*
   * @return {Observable<any>} : violationCount
   */
  public getViolationCount(): Observable<[]> {
    return this.violationCount.asObservable();
  }

  /*
   * @param {any} message : violationCount
   */
  public updateViolationCount(filteredData: any): void {
    this.violationCount.next(filteredData);
  }
}
