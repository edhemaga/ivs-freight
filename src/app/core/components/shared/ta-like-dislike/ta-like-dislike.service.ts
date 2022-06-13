import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export interface LikeDislikeModel {
  action: string;
  likeDislike: number;
}

@Injectable({
  providedIn: 'root',
})
export class TaLikeDislikeService {
  private userLikeDislikeSubject: Subject<LikeDislikeModel> =
    new Subject<LikeDislikeModel>();

  public get userLikeDislike$() {
    return this.userLikeDislikeSubject.asObservable();
  }

  public likeDislikeEvent(data: LikeDislikeModel) {
    this.userLikeDislikeSubject.next(data);
  }
}
