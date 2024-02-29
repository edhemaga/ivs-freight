import { Subject, takeUntil } from 'rxjs';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    Self,
} from '@angular/core';
import {
    NgbModule,
    NgbPopoverModule,
    NgbTooltip,
} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import {
    ControlValueAccessor,
    FormsModule,
    NgControl,
    ReactiveFormsModule,
} from '@angular/forms';

// modules
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';

// models
import {
    CardDetails,
    Trailer,
    Trucks,
    Comment,
    Rating,
} from '../../shared/model/card-table-data.model';
import { Tabs } from '../../shared/model/modal-tabs';
import { CardRows } from '../../shared/model/cardData';

// services
import { DetailsDataService } from 'src/app/core/services/details-data/details-data.service';
import { ImageBase64Service } from 'src/app/core/utils/base64.image';

// pipes
import { SafeHtmlPipe } from 'src/app/core/pipes/safe-html.pipe';

// enums
import { ConstantStringTableDropdownEnum } from 'src/app/core/utils/enums/ta-input-dropdown-table';

// constants
import { RatingReviewTabsConstants } from './utils/constants/tabs.constants';

// components
import { TaCommentComponent } from '../ta-comment/ta-comment.component';
import { TaNewCommentComponent } from './ta-new-comment/ta-new-comment.component';
import { TaTabSwitchComponent } from '../ta-tab-switch/ta-tab-switch.component';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedModule } from '../../shared/shared.module';

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
        ReactiveFormsModule,
        SharedModule,

        // Components
        TaCommentComponent,
        TaNewCommentComponent,
        TaTabSwitchComponent,
    ],
    templateUrl: './ta-input-dropdown-table.component.html',
    styleUrls: ['./ta-input-dropdown-table.component.scss'],
})
export class TaInputDropdownTableComponent
    implements OnDestroy, ControlValueAccessor
{
    public _data: CardDetails;
    public filteredData: CardDetails;
    @Input() set data(value: CardDetails) {
        this._data = value;
        this.filteredData = { ...value };

        this.cdr.detectChanges();
    }

    public _dataCardsModal: any;
    public filteredCardsModalData: any;
    @Input() set dataCardModal(value: any) {
        this._dataCardsModal = value;
        this.filteredCardsModalData = value;

        this.cdr.detectChanges();
    }
    @Input() defaultValue: CardRows;
    @Input() emptyValue: boolean;

    @Input() svg: string;

    @Input() type: string;
    @Input() searchPlaceholder?: string =
        ConstantStringTableDropdownEnum.SEARCH;
    @Input() checkForLoggedUser: boolean;

    private destroy$ = new Subject<void>();

    public tooltip: NgbTooltip;
    public dropDownActive: number;

    public filteredTruckCount: number;
    public filteredTrailerCount: number;

    public truckDropdown: boolean = true;
    public trailerDropdown: boolean = true;

    public lattersToHighlight: string;

    public tabs: Tabs[] = RatingReviewTabsConstants.TABS;

    public loggedUserCommented: boolean;

    public commentHighlight: string;

    constructor(
        private router: Router,
        private detailsDataService: DetailsDataService,
        public imageBase64Service: ImageBase64Service,
        private cdr: ChangeDetectorRef,
        private sanitizer: DomSanitizer,
        @Self() public superControl: NgControl
    ) {
        this.superControl.valueAccessor = this;
    }

    public writeValue(_: any): void {}
    public registerOnChange(_: any): void {}
    public onChange(_: any): void {}
    public registerOnTouched(_: any): void {}

    get getSuperControl() {
        return this.superControl.control;
    }

    ngOnInit() {
        if (this.checkForLoggedUser)
            this.checkIfLoggedUserCommented(this.filteredData);
    }

    public checkIfLoggedUserCommented(data: CardDetails): void {
        data.rating.map((comment) => {
            if (this.getUserLoggedUserFromLocalStorage(comment.companyUser.id))
                this.loggedUserCommented = true;
        });
    }

    public onPrefferedLoadCheck(event: { name: string }): void {
        switch (event.name) {
            case ConstantStringTableDropdownEnum.RATING_CAPS:
                const filteredRating = this.filteredData.rating.filter(
                    (item) => item.liked || item.disliked
                );

                this.filteredData.rating = filteredRating;
                break;

            case ConstantStringTableDropdownEnum.REVIEW:
                const filteredComment = this.filteredData.rating.filter(
                    (item) => !item.commentContent
                );

                this.filteredData.rating = filteredComment;
                break;

            case ConstantStringTableDropdownEnum.ALL:
                this.filteredData.rating = this._data.rating;
                break;
            default:
                break;
        }
    }

    public closeDropdownFromComment(): void {
        if (this.tooltip) this.tooltip.close();
    }

    public getUserLoggedUserFromLocalStorage(user: number): boolean {
        const userLocalStorage = JSON.parse(
            localStorage.getItem(ConstantStringTableDropdownEnum.USER)
        );
        return user === userLocalStorage.companyUserId;
    }

    public filterArrayCommentsRating(event: KeyboardEvent, type: string): void {
        if (event.target instanceof HTMLInputElement) {
            const searchParam = event.target.value.toLowerCase();

            // Check if the user has typed at least 2 characters
            if (searchParam.length >= 2) {
                this.tabs = this.tabs.map((tab) => {
                    console.log(tab);
                    if (tab.id === 1) {
                        return { ...tab, checked: true };
                    } else {
                        return { ...tab, checked: false };
                    }
                });

                // Reset on every key press
                if (type === ConstantStringTableDropdownEnum.COMMENTS) {
                    this.filteredData.comments = this._data.comments;
                } else {
                    this.filteredData.rating = this._data.rating;
                }

                this.lattersToHighlight = searchParam;

                // Filter function for title and comment
                let filteredCommentTitle;

                if (type === ConstantStringTableDropdownEnum.COMMENTS) {
                    filteredCommentTitle = this.filterCommentsTitle(
                        searchParam,
                        ConstantStringTableDropdownEnum.COMMENTS
                    );
                } else {
                    filteredCommentTitle = this.filterCommentsTitle(
                        searchParam,
                        ConstantStringTableDropdownEnum.RATING
                    );
                }

                // If there is empty array in filteredComment set object value to default
                if (!filteredCommentTitle.length) {
                    if (type === ConstantStringTableDropdownEnum.COMMENTS) {
                        this.filteredData.comments = this._data.comments;
                    } else {
                        this.filteredData.rating = this._data.rating;
                    }
                }

                // If there is filtered value set value to filteredData
                else {
                    if (type === ConstantStringTableDropdownEnum.COMMENTS) {
                        this.filteredData.comments = filteredCommentTitle;
                    } else {
                        this.filteredData.rating = filteredCommentTitle;
                    }
                }
            }

            // Set to default value in case user deleted all value in input
            else {
                this.lattersToHighlight = '';

                if (type === ConstantStringTableDropdownEnum.COMMENTS) {
                    this.filteredData.comments = this._data.comments;
                } else {
                    this.filteredData.rating = this._data.rating;
                }
            }
        }
    }

    private filterCommentsTitle(
        searchParam: string,
        type: string
    ): Comment[] | Rating[] {
        switch (type) {
            case ConstantStringTableDropdownEnum.COMMENTS:
                const filteredComments = this.filteredData.comments.filter(
                    (comment) =>
                        comment.companyUser.fullName
                            .toLowerCase()
                            .includes(searchParam) ||
                        comment.commentContent
                            .toLowerCase()
                            .includes(searchParam)
                );

                return filteredComments;

            case ConstantStringTableDropdownEnum.RATING:
                const filteredRating = this.filteredData.rating.filter(
                    (rating) =>
                        rating.companyUser.fullName
                            .toLowerCase()
                            .includes(searchParam) ||
                        rating?.commentContent
                            ?.toLowerCase()
                            .includes(searchParam)
                );

                return filteredRating;

            default:
                break;
        }
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

    public filterArrayCardsModalDropdown(event: KeyboardEvent): void {
        if (event.target instanceof HTMLInputElement) {
            const searchTerm = event.target.value.toLowerCase();

            if (searchTerm.length >= 2) {
                const filteredInModalTitles = this.filterModal(searchTerm);

                this.lattersToHighlight = searchTerm;

                if (!filteredInModalTitles.length) {
                    this.filteredCardsModalData = this._dataCardsModal;
                } else {
                    this.filteredCardsModalData = [...filteredInModalTitles];
                }
                console.log(filteredInModalTitles);
            }
        }
    }

    public higlitsPartOfCommentSearchValue(commentTitle: string): string {
        if (!commentTitle || !this.commentHighlight) return commentTitle;

        const sanitizedHtml = commentTitle.replace(
            new RegExp(this.commentHighlight, 'gi'),
            (match) => {
                return (
                    '<span class="highlighted" style="color:#92b1f5; background: #6f9ee033">' +
                    match +
                    '</span>'
                );
            }
        );

        return this.sanitizer.bypassSecurityTrustHtml(sanitizedHtml) as string;
    }

    private filterModal(searchString: string): Trucks[] {
        const filterTrucks = this.filteredCardsModalData.filter((title) =>
            title.title.toLowerCase().includes(searchString)
        );

        this.filteredTruckCount = filterTrucks.length;

        return filterTrucks;
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

    public toggleCardsModalDropdown(
        tooltip: NgbTooltip,
        card: CardDetails
    ): void {
        this.tooltip = tooltip;

        this.dropDownActive = tooltip.isOpen() ? card.id : -1;
        tooltip.open({ titles: card });
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

    public toggleDropdownContacts(
        tooltip: NgbTooltip,
        card: CardDetails
    ): void {
        this.tooltip = tooltip;

        this.dropDownActive = tooltip.isOpen() ? card.id : -1;
        console.log(card);
        tooltip.open({ contacts: card });
    }

    public toggleDropdownRating(tooltip: NgbTooltip, card: CardDetails): void {
        this.tooltip = tooltip;

        this.dropDownActive = tooltip.isOpen() ? card.id : -1;
        tooltip.open({ rating: card });
    }

    public trackByIdentity(id: number): number {
        return id;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
