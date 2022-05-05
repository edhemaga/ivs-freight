import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaLikeDislikeService {
  private likeDislikeSubject: BehaviorSubject<string> =
    new BehaviorSubject<string>(null);

  public get likeDislikeSubject$() {
    return this.likeDislikeSubject.asObservable();
  }

  public userLikeDislikeEvent(type: string) {
    this.likeDislikeSubject.next(type);
  }
}
