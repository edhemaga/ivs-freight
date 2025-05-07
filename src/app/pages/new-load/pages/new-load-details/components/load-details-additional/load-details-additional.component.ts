import { CommonModule } from '@angular/common';
import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

// Third-party modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Components
import { TaCommentsSearchComponent } from '@shared/components/ta-comments-search/ta-comments-search.component';
import {
    CaLoadStatusLogComponent,
    CaTabSwitchComponent,
    CaToolbarDropdownComponent,
    CaCommentsComponent,
    IComment,
} from 'ca-components';

// Services
import { LoadStoreService } from '@pages/new-load/state/services/load-store.service';

// Enums
import { eColor, eSharedString } from '@shared/enums';
import { eStringPlaceholder } from 'ca-components';
import { eLoadDetailsGeneral } from '@pages/new-load/enums';

// Models
import { Tabs, User } from '@shared/models';
import { CommentService, SignInResponse } from 'appcoretruckassist';
import { IDropdownItem } from 'ca-components';

// helpers
import { UserHelper } from '@shared/utils/helpers';
import { CommentTabHelper } from '@pages/new-load/pages/new-load-details/utils';

// pipes
import { CreateLoadCommentsPipe } from '@shared/pipes';
import { CreateLoadAdditionalInfoDropdownOptionsPipe } from '@pages/new-load/pages/new-load-details/pipes';

// assets
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

@Component({
    selector: 'app-load-details-additional',
    templateUrl: './load-details-additional.component.html',
    styleUrl: './load-details-additional.component.scss',
    standalone: true,
    imports: [
        // modules
        CommonModule,
        AngularSvgIconModule,
        NgbModule,
        // components
        TaCommentsSearchComponent,
        CaLoadStatusLogComponent,
        CaToolbarDropdownComponent,
        CaTabSwitchComponent,
        CaCommentsComponent,
        // pipes
        CreateLoadCommentsPipe,
        CreateLoadAdditionalInfoDropdownOptionsPipe,
    ],
})
export class LoadDetailsAdditionalComponent implements OnDestroy, OnInit {
    @Input() isAddNewComment: boolean;
    @Input() isSearchComment: boolean;
    @Input() isHeaderHidden: boolean = false;

    @Output() onCommentsCountChanged = new EventEmitter<boolean>();

    private destroy$ = new Subject<void>();

    public statusLogSortDirection = eSharedString.DSC;

    public companyUser: SignInResponse;

    // boolean flags
    public isSearchActive: boolean = false;
    public isDriverButtonSelected: boolean = false;
    public hasNewComment: Subject<boolean> = new Subject();

    // TODO mozda ovo preko nekog id-a odraditi
    public displayedSection:
        | eLoadDetailsGeneral.COMMENT
        | eLoadDetailsGeneral.STATUS_LOG = eLoadDetailsGeneral.COMMENT;

    // enums
    public eColor = eColor;
    public eSharedString = eSharedString;
    public eLoadDetailsGeneral = eLoadDetailsGeneral;

    // assets
    public sharedSvgRoutes = SharedSvgRoutes;
    public commentTabs: Tabs[] = CommentTabHelper.getCommentTabs();

    // filter
    public commentFilter: string = eStringPlaceholder.EMPTY;

    public currentUser: User = UserHelper.getUserFromLocalStorage();

    constructor(
        public loadStoreService: LoadStoreService,
        public commentService: CommentService
    ) {}

    public ngOnInit(): void {
        this.getCompanyUser();
    }

    private getCompanyUser(): void {
        this.companyUser = UserHelper.getUserFromLocalStorage();
    }

    public onSortChange(sortDirection: eSharedString): void {
        this.statusLogSortDirection = sortDirection;
    }

    public onSearchHighlightAction(searchHighlightValue: string): void {
        this.commentFilter = searchHighlightValue;
    }

    public onToggleIsSearchActive(): void {
        this.isSearchActive = !this.isSearchActive;
    }

    public onAddNewComment(): void {
        this.hasNewComment.next(false);
        this.hasNewComment.next(true);
    }

    public onDropdownItemSelect(event: IDropdownItem): void {
        if (
            event.title !== eLoadDetailsGeneral.COMMENT &&
            event.title !== eLoadDetailsGeneral.STATUS_LOG
        )
            return;

        this.displayedSection = event.title;
    }

    public onItemSelected(event: Tabs): void {
        this.isDriverButtonSelected = event.id === 2;
    }

    public onCommentDelete(commentId: number, loadId): void {
        this.loadStoreService.dispatchDeleteComment(commentId, loadId);
    }

    public onCommentAdded(comment: IComment, loadId: number): void {
        this.loadStoreService.dispatchAddComment(comment, loadId);
    }

    public onCommentEdited(comment: IComment, loadId: number): void {
        this.loadStoreService.dispatchEditComment(comment, loadId);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
