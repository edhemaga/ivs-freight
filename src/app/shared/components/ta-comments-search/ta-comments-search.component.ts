import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';

// components
import { TaCommentComponent } from '@shared/components/ta-comment/ta-comment.component';

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

        // components
        TaCommentComponent,
    ],
})
export class TaCommentsSearchComponent implements OnChanges {
    @Input() commentsData: CommentCompanyUser[];
    @Input() isCommented: boolean;
    @Input() isCommentEdited: boolean;

    @Output() btnActionEmitter = new EventEmitter<CommentData>();

    constructor() {}

    ngOnChanges(changes: SimpleChanges): void {
        console.log('changes', changes);
    }

    public handleCommentActionEmit(commentData: CommentData): void {
        this.btnActionEmitter.emit(commentData);
    }
}
