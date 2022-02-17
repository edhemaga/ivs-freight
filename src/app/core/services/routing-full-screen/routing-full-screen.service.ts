import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RoutingFullScreenService {
  /* Full Screen */
  private mapMode = new BehaviorSubject<boolean>(false);
  public currentMapMode = this.mapMode.asObservable();

  /* Full Screen Special Style*/
  private mapModeSpecial = new BehaviorSubject<boolean>(false);
  public currentMapModeSpecial = this.mapModeSpecial.asObservable();

  /* Search Address*/
  private typeSelected = new BehaviorSubject<any>(undefined);
  public currentTypeSelected = this.typeSelected.asObservable();

  constructor() {
  }

  /**
   * Send data source function
   *
   * @param data Boolean
   */

  /* On Off Full Screen */
  public toggleFullScreenMap(data: boolean) {
    this.mapMode.next(data);
  }

  /* Full Screen Special Style*/
  public fullScreenSpecial(data: boolean) {
    this.mapModeSpecial.next(data);
  }

  /* Search Address*/
  public onTypeSelected(data: any) {
    this.typeSelected.next(data);
  }
}
