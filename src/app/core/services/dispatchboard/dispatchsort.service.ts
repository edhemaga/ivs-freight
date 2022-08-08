import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = {
  asc: 'desc',
  desc: '',
  '': 'asc',
};

@Injectable({
  providedIn: 'root'
})

export class DispatchSortService {
  sortDirection: SortDirection = '';
  public sortItem: any[] = [
    {
      field: 'status'
    }
  ];
  private sortItemUpdated = new Subject<any>();

  constructor() {
  }

  get sortUpdated() {
    return this.sortItemUpdated;
  }

  public comparemain = (v1: string | number, v2: string | number) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);

  public compare(v1: any, v2: any): any {
    if (v1 === v2) {
      return 0;
    } else {
      return this.comparemain(v1, v2);
    }
  }

  public sort(array: Array<any>, direction: string, savedArray: Array<any>): Array<any> {
    if (direction === '') {
      return savedArray;
    } else {
      return [...array].sort((a, b) => {
        if (a.id) {
          const res = this.compare(
            a.truckId !== null && (a.driverId !== null || (a.pickup !== null && a.delivery !== null)) ? a.statusId : -1,
            b.truckId !== null && (b.driverId !== null || (b.pickup !== null && b.delivery !== null)) ? b.statusId : -1,
          );
          return direction === 'asc' ? res : -res;
        }
      });
    }
  }
}
