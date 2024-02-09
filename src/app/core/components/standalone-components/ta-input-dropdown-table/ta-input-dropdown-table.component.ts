import { Subject, Subscription, takeUntil } from 'rxjs';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
    NgbModule,
    NgbPopoverModule,
    NgbTooltip,
} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

//moment
import moment from 'moment';

// modules
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';

// models
import {
    CardDetails,
    Trailer,
    Trucks,
    Comment,
} from '../../shared/model/cardTableData';
import { UserModel } from 'src/app/core/model/user-localstorage.model';

// services
import { DetailsDataService } from 'src/app/core/services/details-data/details-data.service';
import { ImageBase64Service } from 'src/app/core/utils/base64.image';
import { LoadTService } from '../../load/state/load.service';
import { CommentsService } from 'src/app/core/services/comments/comments.service';

// pipes
import { SafeHtmlPipe } from 'src/app/core/pipes/safe-html.pipe';

// enums
import { ConstantStringTableDropdownEnum } from 'src/app/core/utils/enums/ta-input-dropdown-table';

// components
import { TaCommentComponent } from '../ta-comment/ta-comment.component';

@Component({
    selector: 'app-ta-input-dropdown-table',
    standalone: true,
    imports: [
        // Modules
        CommonModule,
        AngularSvgIconModule,
        NgbModule,
        NgbPopoverModule,
        FormsModule,
        SafeHtmlPipe,

        // Components
        TaCommentComponent,
    ],
    templateUrl: './ta-input-dropdown-table.component.html',
    styleUrls: ['./ta-input-dropdown-table.component.scss'],
})
export class TaInputDropdownTableComponent implements OnInit, OnDestroy {
    public _data: CardDetails;
    @Input() set data(value: CardDetails) {
        this._data = value;
        this.filteredData = { ...value };
    }
    @Input() svg: string;
    @Input() type: string;
    @Input() searchPlaceholder?: string =
        ConstantStringTableDropdownEnum.SEARCH;

    private destroy$ = new Subject<void>();

    public tooltip: NgbTooltip;
    public dropDownActive: number;

    public filteredData: CardDetails;

    public filteredTruckCount: number;
    public filteredTrailerCount: number;

    public truckDropdown: boolean = true;
    public trailerDropdown: boolean = true;

    public lattersToHighlight: string;

    public openNewComment: boolean = false;
    public newCommentText: string;

    public user: UserModel;

    public dataSubscription: Subscription;

    constructor(
        private router: Router,
        private detailsDataService: DetailsDataService,
        public imageBase64Service: ImageBase64Service,
        private loadService: LoadTService,
        private commentService: CommentsService
    ) {}

    ngOnInit(): void {}

    public adjustTextareaHeight(element: HTMLTextAreaElement): void {
        this.newCommentText = element.value;

        const lineHeight = 21;
        element.style.height = ConstantStringTableDropdownEnum.HEIGHT;

        if (element.scrollWidth > element.offsetWidth) {
            element.style.height =
                lineHeight +
                element.scrollHeight +
                ConstantStringTableDropdownEnum.PX;
        } else {
            element.style.height =
                element.scrollHeight + ConstantStringTableDropdownEnum.PX;
        }
    }

    public getUserFromLocalStorage(): void {
        const user = JSON.parse(
            localStorage.getItem(ConstantStringTableDropdownEnum.USER)
        );
        this.user = user;
    }

    public newComment(type: string, loadId: number): void {
        switch (type) {
            case ConstantStringTableDropdownEnum.OPEN_NEW_COMMENT:
                this.openNewComment = true;
                this.getUserFromLocalStorage();
                break;

            case ConstantStringTableDropdownEnum.ADD_NEW_COMMENT:
                this.openNewComment = false;

                const comment = {
                    entityTypeCommentId: 2,
                    entityTypeId: loadId,
                    commentContent: this.newCommentText,
                };

                this.commentService
                    .createComment(comment)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (res) => {
                            this.loadService.addData({
                                ...comment,
                                cardId: loadId,
                                createdAt: moment().format(),
                                companyUser: {
                                    avatar: this.user.avatar,
                                    fullName:
                                        this.user.firstName +
                                        ' ' +
                                        this.user.lastName,
                                    id: this.user.companyUserId,
                                },
                                id: res.id,
                            });
                        },
                    });
                break;

            default:
                break;
        }
    }

    public filterArrayComments(event: KeyboardEvent): void {
        if (event.target instanceof HTMLInputElement) {
            const searchParam = event.target.value.toLowerCase();

            // Check if the user has typed at least 2 characters
            if (searchParam.length >= 2) {
                // Reset on every key press
                this.filteredData.comments = this._data.comments;

                this.lattersToHighlight = searchParam;

                // Filter function for title and comment
                const filteredCommentTitle =
                    this.filterCommentsTitle(searchParam);

                // If there is empty array in filteredComment set object value to default
                if (!filteredCommentTitle.length) {
                    this.filteredData.comments = this._data.comments;
                }

                // If there is filtered value set value to filteredData
                else {
                    this.filteredData.comments = filteredCommentTitle;
                }
            }

            // Set to default value in case user deleted all value in input
            else {
                this.lattersToHighlight = '';

                this.filteredData.comments = this._data.comments;
            }
        }
    }

    private filterCommentsTitle(searchParam: string): Comment[] {
        const filteredComments = this.filteredData.comments.filter(
            (comment) =>
                comment.companyUser.fullName
                    .toLowerCase()
                    .includes(searchParam) ||
                comment.commentContent.toLowerCase().includes(searchParam)
        );

        return filteredComments;
    }

    public filterArrayOwner(event: KeyboardEvent): void {
        if (event.target instanceof HTMLInputElement) {
            const searchTerm = event.target.value.toLowerCase();

            // Check if the user has typed at least 2 characters
            if (searchTerm.length >= 2) {
                // Reset on every key press
                this.filteredData.trucks = this._data.trucks;

                this.filteredData.trailers = this._data.trailers;

                this.lattersToHighlight = searchTerm;

                const filteredTrucks = this.filterTrucks(searchTerm);

                const filteredTrailer = this.filterTrailer(searchTerm);

                // If there is empty array in filteredTrucks or filteredTrailer
                if (!filteredTrucks.length && !filteredTrailer.length) {
                    this.filteredData.trucks = this._data.trucks;

                    this.filteredData.trailers = this._data.trailers;
                }

                // Set value searched
                else {
                    this.filteredData.trucks = filteredTrucks;

                    this.filteredData.trailers = filteredTrailer;
                }
            }

            // Set to default value in case user deleted value in input
            else {
                this.lattersToHighlight = '';

                this.filteredTruckCount = null;

                this.filteredTrailerCount = null;

                this.filteredData.trucks = this._data.trucks;

                this.filteredData.trailers = this._data.trailers;
            }
        }
    }

    private filterTrucks(searchString: string): Trucks[] {
        const filterTrucks = this.filteredData.trucks.filter((truck) =>
            truck.truckNumber.toLowerCase().includes(searchString)
        );

        this.filteredTruckCount = filterTrucks.length;

        return filterTrucks;
    }

    private filterTrailer(searchString: string): Trailer[] {
        const filterTrailer = this.filteredData.trailers.filter((trailer) =>
            trailer.trailerNumber.toLowerCase().includes(searchString)
        );

        this.filteredTrailerCount = filterTrailer.length;

        return filterTrailer;
    }

    public highlightPartOfTheTextString(trailerTruckNumber: string): string {
        if (!trailerTruckNumber || !this.lattersToHighlight)
            return trailerTruckNumber;

        return trailerTruckNumber.replace(
            new RegExp(this.lattersToHighlight, 'gi'),
            (match) => {
                return (
                    '<span class="highlighted" style="color:#92b1f5; background: #6f9ee033">' +
                    match +
                    '</span>'
                );
            }
        );
    }

    public goToDetailsPage(card: CardDetails, link: string): void {
        this.detailsDataService.setNewData(card);

        this.router.navigate([link]);
    }

    public toggleDropdownComments(
        tooltip: NgbTooltip,
        card: CardDetails
    ): void {
        this.tooltip = tooltip;

        this.dropDownActive = tooltip.isOpen() ? card.id : -1;

        tooltip.open({ commentData: card });
    }

    // Owner dropdown
    public toggleDropdownOwnerFleet(
        tooltip: NgbTooltip,
        card: CardDetails
    ): void {
        this.tooltip = tooltip;

        this.dropDownActive = tooltip.isOpen() ? card.id : -1;

        tooltip.hidden.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.filteredData.trucks = this._data.trucks;

            this.lattersToHighlight = null;

            this.filteredTruckCount = null;

            this.filteredTrailerCount = null;

            this.filteredData.trailers = this._data.trailers;
        });

        tooltip.open({ data: card });

        return;
    }

    public toggleDropdownTruckTrailer(
        truckOrTrailer: string,
        toggle: boolean
    ): void {
        switch (truckOrTrailer) {
            case ConstantStringTableDropdownEnum.TRUCK:
                this.truckDropdown = toggle;
                break;

            case ConstantStringTableDropdownEnum.TRAILER:
                this.trailerDropdown = toggle;
                break;
            default:
                break;
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
