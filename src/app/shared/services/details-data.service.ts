import { Injectable } from '@angular/core';

import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DetailsDataService {
    private leftSideMenuStatus = new BehaviorSubject<boolean>(false);
    public leftSideMenuChanges = this.leftSideMenuStatus.asObservable();
    public dropdownOpenedChange: Subject<any> = new Subject<any>();

    public mainData: any;
    public cardMainTitle: any;
    public leftMenuOpened: any = false;
    public stopName: any;
    public documentName: any;
    public unitValue: any;
    public cdlId: any;
    public isActivationInProgress = true;

    constructor() {}

    setNewData(newData) {
        this.mainData = { ...newData };
    }

    public setActivation(isActive: boolean): void  {
        this.isActivationInProgress = isActive;
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

    setCdlId(mod) {
        this.cdlId = mod;
    }

    changeRateStatus(type, mod) {
        if (type == 'like') {
            if (mod) {
                this.mainData.rating = 1;
            } else {
                this.mainData.rating = 0;
            }
        } else {
            if (mod) {
                this.mainData.rating = -1;
            } else {
                this.mainData.rating = 0;
            }
        }
    }

    setStopName(mod) {
        this.stopName = mod;
    }

    setDocumentName(mod) {
        this.documentName = mod;
    }

    setUnitValue(mod) {
        this.unitValue = mod;
    }

    dropdownOpened(data) {
        this.dropdownOpenedChange.next(data);
    }
}
