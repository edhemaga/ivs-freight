import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  public loaderStatus$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Show function
   *
   * @param value Boolean
   */
  public show(value: boolean) {
    this.loaderStatus$.next(value);

    if (value) {
      $('.save-btn').addClass('loading');
    } else {
      $('.save-btn').removeClass('loading');
    }
  }

  /**
   * Show function
   *
   * @param value Boolean
   */
  public showInputLoading(value: boolean) {
    this.loaderStatus$.next(value);

    if (value) {
      $('.input-loader').addClass('loading');
    } else {
      $('.input-loader').removeClass('loading');
    }
  }

}
