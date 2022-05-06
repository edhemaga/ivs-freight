import { TaLikeDislikeService } from './ta-like-dislike.service';
import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-ta-like-dislike',
  templateUrl: './ta-like-dislike.component.html',
  styleUrls: ['./ta-like-dislike.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TaLikeDislikeComponent {
  @Input() taLikes: number = 0;
  @Input() taDislikes: number = 0;
  @Input() customClass: string = null;

  public isLiked: boolean = false;
  public isDisliked: boolean = false;

  constructor(private taLikeDislikeService: TaLikeDislikeService) {}

  public onAction(type: string, event: any) {
    event.preventDefault();
    event.stopPropagation();
    if (type === 'like') {
      this.isLiked = !this.isLiked;
      if (this.isDisliked) {
        this.taDislikes--;
        this.isDisliked = false;
      }

      if (this.isLiked) {
        this.taLikes++;
      } else {
        this.taLikes--;
      }
    } else {
      this.isDisliked = !this.isDisliked;
      if (this.isLiked) {
        this.taLikes--;
        this.isLiked = false;
      }
      if (this.isDisliked) {
        this.taDislikes++;
      } else {
        this.taDislikes--;
      }
    }
    this.taLikeDislikeService.userLikeDislikeEvent({
      action: type,
      likes: this.taLikes,
      dislikes: this.taDislikes,
    });
  }
}
