import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TruckassistTableService {
  /* Columns Order */
  private columnsOrder = new BehaviorSubject<string>('');
  public currentColumnsOrder = this.columnsOrder.asObservable();

  constructor() {}

  /* Columns Order*/
  public sendColumnsOrder(columnsOrder: any) {
    this.columnsOrder.next(columnsOrder);
  }
}
