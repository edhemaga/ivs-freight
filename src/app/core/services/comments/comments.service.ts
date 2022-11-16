import { Injectable } from '@angular/core';
import {
   CreateCommentCommand,
   CreateResponse,
   UpdateCommentCommand,
   CommentService,
   GetCommentModalResponse,
} from 'appcoretruckassist';
import { Observable } from 'rxjs';

@Injectable({
   providedIn: 'root',
})
export class CommentsService {
   constructor(private commentService: CommentService) {}

   // Comments
   public createComment(
      data: CreateCommentCommand
   ): Observable<CreateResponse> {
      return this.commentService.apiCommentPost(data);
   }

   public deleteCommentById(id: number): Observable<any> {
      return this.commentService.apiCommentIdDelete(id);
   }

   public updateComment(data: UpdateCommentCommand): Observable<any> {
      return this.commentService.apiCommentPut(data);
   }

   public getModalComments(): Observable<GetCommentModalResponse> {
      return this.commentService.apiCommentModalGet();
   }
}
