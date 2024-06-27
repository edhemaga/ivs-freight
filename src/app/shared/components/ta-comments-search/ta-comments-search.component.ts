import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// svg routes
import { CommentsSearchSvgRoutes } from '@shared/components/ta-comments-search/utils/svg-routes/comments-search-svg.routes';

// components
import { TaCommentComponent } from '@shared/components/ta-comment/ta-comment.component';
import { TaSearchV2Component } from '@shared/components/ta-search-v2/ta-search-v2.component';

// enums
import { CommentsSearchStringEnum } from '@shared/components/ta-comments-search/enums/comments-search-string.enum';

// models
import { CommentCompanyUser } from '@shared/models/comment-company-user.model';
import { CommentData } from '@shared/models/comment-data.model';

@Component({
    selector: 'app-ta-comments-search',
    templateUrl: './ta-comments-search.component.html',
    styleUrls: ['./ta-comments-search.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        AngularSvgIconModule,

        // components
        TaCommentComponent,
        TaSearchV2Component,
    ],
})
export class TaCommentsSearchComponent {
    @Input() commentsData: CommentCompanyUser[];
    @Input() isCommented: boolean;
    @Input() isCommentEdited: boolean;
    @Input() isDisplaySearch: boolean = false;

    @Output() btnActionEmitter = new EventEmitter<CommentData>();
    @Output() btnSortEmitter = new EventEmitter<string>();
    @Output() searchHightlightEmitter = new EventEmitter<string>();

    public commentsSearchSvgRoutes = CommentsSearchSvgRoutes;

    public sortDirection: string = CommentsSearchStringEnum.DSC;

    public lettersToHightlight: string;

    constructor() {}

    public handleCommentActionEmit(commentData: CommentData): void {
        this.btnActionEmitter.emit(commentData);
    }

    public handleSortClick(): void {
        this.sortDirection =
            this.sortDirection === CommentsSearchStringEnum.DSC
                ? CommentsSearchStringEnum.ASC
                : CommentsSearchStringEnum.DSC;

        this.btnSortEmitter.emit(this.sortDirection);
    }

    public handleSearchValue(searchValue: string): void {
        this.lettersToHightlight = searchValue;

        this.searchHightlightEmitter.emit(searchValue);
    }
}
