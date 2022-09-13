import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DetailsDataService {

  private leftSideMenuStatus = new BehaviorSubject<boolean>(false);
  public leftSideMenuChanges = this.leftSideMenuStatus.asObservable();

  public mainData: any;
  public leftMenuOpened: any = false;

  constructor() { }

  setNewData(newData){
    console.log('---set data---', newData);
    this.mainData = newData;
    console.log('---mainData---', this.mainData);
  }

  public updateLeftMenuStatus(leftSideMenuStatus: boolean) {
    this.leftSideMenuStatus.next(leftSideMenuStatus);
  }
}
