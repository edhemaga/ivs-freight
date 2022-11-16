import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PayrollService {
  public toggleTables = new Subject<any>();

  constructor() {}
}
