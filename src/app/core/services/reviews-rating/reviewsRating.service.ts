import { Injectable } from '@angular/core';
import {
  CreateRatingCommand,
  CreateResponse,
  CreateReviewCommand,
  GetRatingReviewModalResponse,
  RatingReviewService,
  ReviewResponse,
  UpdateReviewCommand,
} from 'appcoretruckassist';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReviewsRatingService {
  constructor(private reviewRatingService: RatingReviewService) {}

  public getReviewRatingModal(): Observable<GetRatingReviewModalResponse> {
    return this.reviewRatingService.apiRatingReviewModalGet();
  }

  public addRating(data: CreateRatingCommand): Observable<any> {
    return this.reviewRatingService.apiRatingReviewRatingPost(data);
  }

  public deleteReview(id: number): Observable<any> {
    return this.reviewRatingService.apiRatingReviewReviewIdDelete(id);
  }

  public getReviewById(id: number): Observable<ReviewResponse> {
    return this.reviewRatingService.apiRatingReviewReviewIdGet(id);
  }

  public addReview(data: CreateReviewCommand): Observable<CreateResponse> {
    return this.reviewRatingService.apiRatingReviewReviewPost(data);
  }

  public updateReview(data: UpdateReviewCommand): Observable<any> {
    return this.reviewRatingService.apiRatingReviewReviewPut(data);
  }
}
