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

  constructor(private taLikeDislikeService: TaLikeDislikeService) {}

  public onAction(type: string, event: any) {
    console.log(type)
    event.preventDefault();
    event.stopPropagation();
    this.taLikeDislikeService.userLikeDislikeEvent(type);
  }
}
