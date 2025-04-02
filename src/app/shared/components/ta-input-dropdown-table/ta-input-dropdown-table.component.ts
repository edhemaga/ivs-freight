import { Subject, takeUntil } from 'rxjs';
import {
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
} from '@angular/core';
import {
    NgbModule,
    NgbPopoverModule,
    NgbTooltip,
} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

// modules
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SharedModule } from '@shared/shared.module';

// models
import {
    CardDetails,
    Trailer,
    Trucks,
    Comment,
    Rating,
} from '@shared/models/card-models/card-table-data.model';
import { Tabs } from '@shared/models/tabs.model';
import { CardRows } from '@shared/models/card-models/card-rows.model';

// services
import { DetailsDataService } from '@shared/services/details-data.service';

// pipes
import { SafeHtmlPipe } from '@shared/pipes/safe-html.pipe';

// enums
import { TaInputDropdownTableStringEnum } from '@shared/components/ta-input-dropdown-table/enums/ta-input-dropdown-table-string.enum';

// constants
import { RatingReviewTabsConstants } from '@shared/components/ta-input-dropdown-table/utils/constants/rating-review-tabs.constants';

// helpers
import { CardDropdownHelper } from '@shared/utils/helpers/card-dropdown-helper';
import { MethodsGlobalHelper } from '@shared/utils/helpers/methods-global.helper';
import { AvatarColorsHelper } from '@shared/utils/helpers/avatar-colors.helper';

// components
import { TaCommentComponent } from '@shared/components/ta-comment/ta-comment.component';
import { TaNewCommentComponent } from '@shared/components/ta-input-dropdown-table/components/ta-new-comment/ta-new-comment.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaAppTooltipComponent } from '@shared/components/ta-app-tooltip/ta-app-tooltip.component';
import { CaTabSwitchComponent } from 'ca-components';

// models
import { DepartmentResponse } from 'appcoretruckassist';
import { ContactsData } from '@shared/components/ta-input-dropdown-table/models/contacts-data.model';

@Component({
    selector: 'app-ta-input-dropdown-table',
    standalone: true,
    imports: [
        // Modules
        CommonModule,
        AngularSvgIconModule,
        NgbModule,
        NgbPopoverModule,
        SafeHtmlPipe,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,

        // Components
        TaCommentComponent,
        TaAppTooltipComponent,
        TaNewCommentComponent,
        CaTabSwitchComponent,
        TaCustomCardComponent,
    ],
    templateUrl: './ta-input-dropdown-table.component.html',
    styleUrls: ['./ta-input-dropdown-table.component.scss'],
})
export class TaInputDropdownTableComponent
    implements OnInit, OnChanges, OnDestroy
{
    @Input() set data(value: CardDetails) {
        this._data = value;
        this.filteredData = { ...value };

        this.cdr.detectChanges();
    }

    public _data: CardDetails;
    public filteredData: CardDetails;

    @Input() defaultValue: CardRows;
    @Input() emptyValue: boolean;

    @Input() svg: string;

    @Input() type: string;
    @Input() searchPlaceholder?: string = TaInputDropdownTableStringEnum.SEARCH;
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

    public contactsData: ContactsData;
    public contactsDataBeforeSearch: ContactsData;
    public isContactCardOpenArray: boolean[] = [];
    public showFilter: boolean = false;
    constructor(
        private router: Router,
        private detailsDataService: DetailsDataService,
        private cdr: ChangeDetectorRef,
        private sanitizer: DomSanitizer
    ) {}

    ngOnInit() {
        if (this.checkForLoggedUser)
            this.checkIfLoggedUserCommented(this.filteredData);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.type === TaInputDropdownTableStringEnum.CONTACTS)
            this.mapContactsData(changes.data.currentValue);
    }

    public trackByIdentity(id: number): number {
        return id;
    }

    public checkIfLoggedUserCommented(data: CardDetails): void {
        data.rating.map((comment) => {
            if (this.getUserLoggedUserFromLocalStorage(comment.companyUser.id))
                this.loggedUserCommented = true;
        });
    }

    public onPrefferedLoadCheck(event: { name: string }): void {
        switch (event.name) {
            case TaInputDropdownTableStringEnum.RATING_CAPS:
                const filteredRating = this.filteredData.rating.filter(
                    (item) => item.liked || item.disliked
                );

                this.filteredData.rating = filteredRating;
                break;

            case TaInputDropdownTableStringEnum.REVIEW:
                const filteredComment = this.filteredData.rating.filter(
                    (item) => !item.commentContent
                );

                this.filteredData.rating = filteredComment;
                break;

            case TaInputDropdownTableStringEnum.ALL:
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
            localStorage.getItem(TaInputDropdownTableStringEnum.USER)
        );
        return user === userLocalStorage.companyUserId;
    }

    public filterArrayCommentsRating(event: KeyboardEvent, type: string): void {
        if (event.target instanceof HTMLInputElement) {
            this.showFilter = true;
            const searchParam = event.target.value.toLowerCase();

            // Check if the user has typed at least 2 characters
            if (searchParam.length >= 2) {
                this.tabs = this.tabs.map((tab) => {
                    if (tab.id === 1) {
                        return { ...tab, checked: true };
                    } else {
                        return { ...tab, checked: false };
                    }
                });

                // Reset on every key press
                if (type === TaInputDropdownTableStringEnum.COMMENTS) {
                    this.filteredData.comments = this._data.comments;
                } else {
                    this.filteredData.rating = this._data.rating;
                }

                this.lattersToHighlight = searchParam;

                // Filter function for title and comment
                let filteredCommentTitle;

                if (type === TaInputDropdownTableStringEnum.COMMENTS) {
                    filteredCommentTitle = this.filterCommentsTitle(
                        searchParam,
                        TaInputDropdownTableStringEnum.COMMENTS
                    );
                } else {
                    filteredCommentTitle = this.filterCommentsTitle(
                        searchParam,
                        TaInputDropdownTableStringEnum.RATING
                    );
                }

                // If there is empty array in filteredComment set object value to default
                if (!filteredCommentTitle.length) {
                    if (type === TaInputDropdownTableStringEnum.COMMENTS) {
                        this.filteredData.comments = [];
                    } else {
                        this.filteredData.rating = this._data.rating;
                    }
                }

                // If there is filtered value set value to filteredData
                else {
                    if (type === TaInputDropdownTableStringEnum.COMMENTS) {
                        this.filteredData.comments = filteredCommentTitle;
                    } else {
                        this.filteredData.rating = filteredCommentTitle;
                    }
                }
            }

            // Set to default value in case user deleted all value in input
            else {
                this.lattersToHighlight = '';

                if (type === TaInputDropdownTableStringEnum.COMMENTS) {
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
            case TaInputDropdownTableStringEnum.COMMENTS:
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

            case TaInputDropdownTableStringEnum.RATING:
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

    public filterContacts(event: KeyboardEvent): void {
        if (event.target instanceof HTMLInputElement) {
            const searchTerm = event.target.value.trim().toLowerCase();
            const results: DepartmentResponse[] = [];

            // handle search
            this.contactsDataBeforeSearch.departments.forEach(
                (department, index) => {
                    const filteredUsers = department.companyUsers.filter(
                        (user) =>
                            user.fullName.toLowerCase().includes(searchTerm)
                    );

                    const filteredDepartment = {
                        ...department,
                        count: filteredUsers.length,
                        companyUsers: filteredUsers,
                    };

                    results.push(filteredDepartment);

                    if (filteredUsers.length)
                        this.isContactCardOpenArray[index] = true;
                }
            );

            // handle results
            const contactsCount = results.reduce(
                (sum, item) => sum + item.count,
                0
            );

            this.contactsData = {
                departments: results,
                contactsCount,
                departmentsCount: results.length,
            };

            if (!searchTerm) {
                this.contactsData = this.contactsDataBeforeSearch;

                this.isContactCardOpenArray = this.isContactCardOpenArray.map(
                    () => false
                );
            }
        }
    }

    public higlitsPartOfCommentSearchValue(commentTitle: string): string {
        return CardDropdownHelper.higlitsPartOfCommentSearchValue(
            commentTitle,
            this.commentHighlight,
            this.sanitizer
        );
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
        return CardDropdownHelper.higlitsPartOfCommentSearchValue(
            trailerTruckNumber,
            this.commentHighlight,
            this.sanitizer
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
            case TaInputDropdownTableStringEnum.TRUCK:
                this.truckDropdown = toggle;
                break;

            case TaInputDropdownTableStringEnum.TRAILER:
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

        tooltip.open({ contacts: card });
    }

    public toggleDropdownRating(tooltip: NgbTooltip, card: CardDetails): void {
        this.tooltip = tooltip;

        this.dropDownActive = tooltip.isOpen() ? card.id : -1;
        tooltip.open({ rating: card });
    }

    private mapContactsData(contactsData: DepartmentResponse[]): void {
        let filteredDepartments =
            MethodsGlobalHelper.removeDuplicateObjects(contactsData);

        filteredDepartments = filteredDepartments.map((department) => {
            this.isContactCardOpenArray = [
                ...this.isContactCardOpenArray,
                false,
            ];

            return {
                ...department,
                companyUsers: department.companyUsers.map((contact, index) => {
                    return {
                        ...contact,
                        avatarColor: AvatarColorsHelper.getAvatarColors(index),
                    };
                }),
            };
        });

        const contactsCount = filteredDepartments.reduce(
            (sum, item) => sum + item.count,
            0
        );

        this.contactsData = {
            departmentsCount: filteredDepartments.length,
            contactsCount,
            departments: filteredDepartments,
        };
        this.contactsDataBeforeSearch = { ...this.contactsData };
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
