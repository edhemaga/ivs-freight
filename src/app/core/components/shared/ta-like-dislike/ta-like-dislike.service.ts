import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaLikeDislikeService {
  private likeDislikeSubject: BehaviorSubject<{
    action: string;
    likes: number;
    dislikes: number;
  }> = new BehaviorSubject<{ action: string; likes: number; dislikes: number }>(
    null
  );

  public get likeDislikeSubject$() {
    return this.likeDislikeSubject.asObservable();
  }

  public userLikeDislikeEvent(data: {
    action: string;
    likes: number;
    dislikes: number;
  }) {
    this.likeDislikeSubject.next(data);
  }
}
