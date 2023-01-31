import {Subject} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NoticeService {
  public updateField = new Subject<void>();

  constructor() {
  }
}