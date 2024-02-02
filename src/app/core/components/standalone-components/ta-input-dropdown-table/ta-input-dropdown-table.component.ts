import { Subject, takeUntil } from 'rxjs';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
    NgbModule,
    NgbPopoverModule,
    NgbTooltip,
} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

// animations
import { DropdownData } from '../../../model/input-dropdown.model';

// modules
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';

// models
import { CardDetails, Trailer, Trucks } from '../../shared/model/cardTableData';

// services
import { DetailsDataService } from 'src/app/core/services/details-data/details-data.service';

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
    @Input() data: CardDetails;
    @Input() svg: string;
    @Input() type: string;
    @Input() searchPlaceholder?: string = 'Search';

    private destroy$ = new Subject<void>();

    public tooltip: NgbTooltip;
    public dropDownActive: number;

    public filteredData: CardDetails;

    public filteredTruckCount: number;
    public filteredTrailerCount: number;

    public truckDropdown: boolean = true;
    public trailerDropdown: boolean = true;

    public lattersToHighlight: string;

    public openDropdown: number;
    public openComment: boolean;

    constructor(
        private router: Router,
        private detailsDataService: DetailsDataService
    ) {}

    ngOnInit(): void {
        this.filteredData = { ...this.data };
    }

    public openCommentComponent(index: number): void {
        this.openDropdown === index
            ? (this.openDropdown = -1)
            : (this.openDropdown = index);
    }

    public openNewComment(): void {
        console.log('console');
    }

    public filterArray(event: KeyboardEvent): void {
        if (event.target instanceof HTMLInputElement) {
            const searchTerm = event.target.value.toLowerCase();

            // Check if the user has typed at least 2 characters
            if (searchTerm.length >= 2) {
                // Reset on every key press
                this.filteredData.trucks = this.data.trucks;

                this.filteredData.trailers = this.data.trailers;

                this.lattersToHighlight = searchTerm;

                const filteredTrucks = this.filterTrucks(searchTerm);

                const filteredTrailer = this.filterTrailer(searchTerm);

                // If there is empty array in filteredTrucks or filteredTrailer
                if (!filteredTrucks.length && !filteredTrailer.length) {
                    this.filteredData.trucks = this.data.trucks;

                    this.filteredData.trailers = this.data.trailers;
                }

                // Set to default value in case there are no resaults
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

                this.filteredData.trucks = this.data.trucks;

                this.filteredData.trailers = this.data.trailers;
            }
        }
    }

    public filterTrucks(searchString: string): Trucks[] {
        const filterTrucks = this.filteredData.trucks.filter((truck) =>
            truck.truckNumber.toLowerCase().includes(searchString)
        );

        this.filteredTruckCount = filterTrucks.length;

        return filterTrucks;
    }

    public filterTrailer(searchString: string): Trailer[] {
        const filterTrailer = this.filteredData.trailers.filter((trailer) =>
            trailer.trailerNumber.toLowerCase().includes(searchString)
        );

        this.filteredTrailerCount = filterTrailer.length;

        return filterTrailer;
    }

    public highlight(trailerTruckNumber: string): string {
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
        console.log(card);
        tooltip.hidden.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.filteredData.trucks = this.data.trucks;

            this.lattersToHighlight = null;

            this.filteredTruckCount = null;

            this.filteredTrailerCount = null;

            this.filteredData.trailers = this.data.trailers;
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
