import {
   PopulateLikeDislikeModel,
   TaLikeDislikeService,
} from './ta-like-dislike.service';
import {
   Component,
   Input,
   OnDestroy,
   OnInit,
   ViewEncapsulation,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DetailsDataService } from '../../../services/details-data/details-data.service';

@Component({
   selector: 'app-ta-like-dislike',
   templateUrl: './ta-like-dislike.component.html',
   styleUrls: ['./ta-like-dislike.component.scss'],
   encapsulation: ViewEncapsulation.None,
})
export class TaLikeDislikeComponent implements OnInit, OnDestroy {
   private destroy$ = new Subject<void>();
   @Input() taLikes: number = 0;
   @Input() taDislikes: number = 0;
   @Input() customClass: string = null;

   public isLiked: boolean = false;
   public isDisliked: boolean = false;

   constructor(
      private taLikeDislikeService: TaLikeDislikeService,
      private DetailsDataService: DetailsDataService
   ) {}

   ngOnInit(): void {
      this.taLikeDislikeService.populateLikeDislike$
         .pipe(takeUntil(this.destroy$))
         .subscribe((data: PopulateLikeDislikeModel) => {
            this.taLikes = data.upRatingCount ? data.upRatingCount : 0;
            this.taDislikes = data.downRatingCount ? data.downRatingCount : 0;
            this.isLiked = data.currentCompanyUserRating === 1;
            this.isDisliked = data.currentCompanyUserRating === -1;
         });
   }

   public onAction(type: string, event: any) {
      event.preventDefault();
      event.stopPropagation();
      if (type === 'liked') {
         this.isLiked = !this.isLiked;
         if (this.isDisliked) {
            this.taDislikes--;
            this.isDisliked = false;
            this.DetailsDataService.changeRateStatus(
               'dislike',
               this.isDisliked
            );
         }

         if (this.isLiked) {
            this.taLikes++;
         } else {
            this.taLikes--;
         }

         this.taLikeDislikeService.likeDislikeEvent({
            action: type,
            likeDislike: 1,
         });
         this.DetailsDataService.changeRateStatus('like', this.isLiked);
      } else {
         this.isDisliked = !this.isDisliked;
         if (this.isLiked) {
            this.taLikes--;
            this.isLiked = false;
            this.DetailsDataService.changeRateStatus('like', this.isLiked);
         }
         if (this.isDisliked) {
            this.taDislikes++;
         } else {
            this.taDislikes--;
         }

         this.taLikeDislikeService.likeDislikeEvent({
            action: type,
            likeDislike: -1,
         });
         this.DetailsDataService.changeRateStatus('dislike', this.isDisliked);
      }
   }

   ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
   }
}
