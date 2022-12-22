import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DetailsDataService {
    private leftSideMenuStatus = new BehaviorSubject<boolean>(false);
    public leftSideMenuChanges = this.leftSideMenuStatus.asObservable();

    public mainData: any;
    public cardMainTitle: any;
    public leftMenuOpened: any = false;
    public stopName: any;
    public documentName: any;

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

    setCardMainTitle(mod) {
        this.cardMainTitle = mod;
    }

    changeRateStatus(type, mod) {
        if (type == 'like') {
            this.mainData.raiting.hasLiked = mod;
            this.mainData.raiting.hasDislike = false;
        } else {
            this.mainData.raiting.hasDislike = mod;
            this.mainData.raiting.hasLiked = false;
        }
    }

    setStopName(mod) {
        this.stopName = mod;
    }

    setDocumentName(mod){
        this.documentName = mod;
    }
}
