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
    this.mainData = newData;
    console.log('---mainData---', this.mainData);
  }

  public updateLeftMenuStatus(leftSideMenuStatus: boolean) {
    this.leftSideMenuStatus.next(leftSideMenuStatus);
  }

  changeDnuStatus(type, status){
    if ( type == 'dnu'){
      this.mainData.dnu = status;
    } else if ( type == 'ban' ) {
      this.mainData.ban = status;
    } else if ( type == 'status' ) {
      this.mainData.status = status;
    }
  }
}
