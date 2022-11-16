import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export interface LikeDislikeModel {
   action: string;
   likeDislike: number;
}

export interface PopulateLikeDislikeModel {
   downRatingCount: number;
   upRatingCount: number;
   currentCompanyUserRating: number;
}

@Injectable({
   providedIn: 'root',
})
export class TaLikeDislikeService {
   private userLikeDislikeSubject: Subject<LikeDislikeModel> =
      new Subject<LikeDislikeModel>();

   public populateLikeDislikeSubject: BehaviorSubject<PopulateLikeDislikeModel> =
      new BehaviorSubject<PopulateLikeDislikeModel>(null);

   public get userLikeDislike$() {
      return this.userLikeDislikeSubject.asObservable();
   }

   public likeDislikeEvent(data: LikeDislikeModel) {
      this.userLikeDislikeSubject.next(data);
   }

   public get populateLikeDislike$() {
      return this.populateLikeDislikeSubject.asObservable();
   }
   public populateLikeDislikeEvent(data: PopulateLikeDislikeModel) {
      this.populateLikeDislikeSubject.next(data);
   }
}
