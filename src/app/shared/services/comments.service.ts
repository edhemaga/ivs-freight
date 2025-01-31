import { Injectable } from '@angular/core';

import { Observable, tap } from 'rxjs';

// services
import { LoadService } from '@shared/services/load.service';

// store
import { LoadDetailsListStore } from '@pages/load/state_old/load-details-state/load-details-list-state/load-details-list.store';
import { LoadItemStore } from '@pages/load/state_old/load-details-state/load-details.store';

// models
import {
    CreateCommentCommand,
    CreateResponse,
    UpdateCommentCommand,
    CommentService,
    GetCommentModalResponse,
} from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class CommentsService {
    constructor(
        private commentService: CommentService,
        private loadService: LoadService,
        private loadDetailsListStore: LoadDetailsListStore,
        private loadItemStore: LoadItemStore
    ) {}

    public createComment(
        data: CreateCommentCommand,
        loadId?: number
    ): Observable<CreateResponse> {
        return this.commentService.apiCommentPost(data).pipe(
            tap(() => {
                if (loadId) this.handleLoadDetailsState(loadId);
            })
        );
    }

    public deleteCommentById(id: number, loadId?: number): Observable<any> {
        return this.commentService.apiCommentIdDelete(id).pipe(
            tap(() => {
                if (loadId) this.handleLoadDetailsState(loadId);
            })
        );
    }

    public updateComment(
        data: UpdateCommentCommand,
        loadId?: number
    ): Observable<any> {
        return this.commentService.apiCommentPut(data).pipe(
            tap(() => {
                if (loadId) this.handleLoadDetailsState(loadId);
            })
        );
    }

    public getModalComments(): Observable<GetCommentModalResponse> {
        return this.commentService.apiCommentModalGet();
    }

    private handleLoadDetailsState(loadId: number): void {
        this.loadService.getLoadById(loadId).subscribe((load) => {
            this.loadDetailsListStore.remove(({ id }) => id === loadId);
            this.loadItemStore.remove(({ id }) => id === loadId);

            this.loadDetailsListStore.add(load);
            this.loadItemStore.set([load]);
        });
    }
}
