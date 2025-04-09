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
import { eGeneralActions, eSortDirection } from '@shared/enums';

// models
import { CommentCompanyUser, CommentData } from '@shared/models';

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
    @Input() isDisplaySearch: boolean = false;
    @Input() isHeaderHidden: boolean = false;

    @Output() handleActionEmitter = new EventEmitter<CommentData>();
    @Output() handleSortEmitter = new EventEmitter<string>();
    @Output() handleSearchHighlightEmitter = new EventEmitter<string>();

    public commentsSearchSvgRoutes = CommentsSearchSvgRoutes;

    public sortDirection: string = eSortDirection.DSC;

    public eGeneralActions = eGeneralActions;
    public eSortDirection = eSortDirection;

    public lettersToHighlight: string;

    constructor() {}

    public handleCommentActionEmit(commentData: CommentData): void {
        this.handleActionEmitter.emit(commentData);
    }

    public handleSortClick(): void {
        this.sortDirection =
            this.sortDirection === eSortDirection.DSC
                ? eSortDirection.ASC
                : eSortDirection.DSC;

        this.handleSortEmitter.emit(this.sortDirection);
    }

    public onHandleSearchValue(searchValue: string): void {
        this.lettersToHighlight = searchValue;
        this.handleSearchHighlightEmitter.emit(searchValue);
    }
}
