import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
   providedIn: 'root',
})
export class DetailsDataService {
   private leftSideMenuStatus = new BehaviorSubject<boolean>(false);
   public leftSideMenuChanges = this.leftSideMenuStatus.asObservable();

   public mainData: any;
   public cdlNum: any;
   public leftMenuOpened: any = false;

   constructor() {}

   setNewData(newData) {
      this.mainData = newData;
   }

   public updateLeftMenuStatus(leftSideMenuStatus: boolean) {
      this.leftSideMenuStatus.next(leftSideMenuStatus);
   }

   changeDnuStatus(type, status) {
      if (type == 'dnu') {
         this.mainData.dnu = status;
      } else if (type == 'ban') {
         this.mainData.ban = status;
      } else if (type == 'status') {
         this.mainData.status = status;
      }
   }

   setCdlNum(mod) {
      this.cdlNum = mod;
   }

   changeRateStatus(type, mod) {
      if (type == 'like') {
         this.mainData.raiting.hasLiked = mod;
      } else {
         this.mainData.raiting.hasDislike = mod;
      }
   }
}
