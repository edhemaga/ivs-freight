import { Component, Input, OnInit } from '@angular/core';
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
import { CardDetails } from '../../shared/model/cardTableData';

// services
import { DetailsDataService } from 'src/app/core/services/details-data/details-data.service';

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
    ],
    templateUrl: './ta-input-dropdown-table.component.html',
    styleUrls: ['./ta-input-dropdown-table.component.scss'],
})
export class TaInputDropdownTableComponent implements OnInit {
    @Input() data: DropdownData;

    public tooltip: NgbTooltip;
    public dropDownActive: number;

    public truckDropdown: boolean = true;
    public trailerDropdown: boolean = true;

    searchTerm: string = '';
    arrayToFilter: string[] = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];
    filteredArray: string[] = [];
    constructor(
        private router: Router,
        private detailsDataService: DetailsDataService
    ) {}

    ngOnInit(): void {}

    public filterArray(event: InputEvent): void {
        // if (event.target instanceof HTMLInputElement) {
        //     console.log(this.data.filter((item) =>
        //     item.toLowerCase().includes(this.searchTerm.toLowerCase())
        //   ));
        //     // Now you can use event.target.value safely
        // }
    }

    public goToDetailsPage(card: CardDetails, link: string): void {
        this.detailsDataService.setNewData(card);

        this.router.navigate([link]);
    }

    // Owner dropdown
    public toggleDropdownOwnerFleet(
        tooltip: NgbTooltip,
        card: CardDetails
    ): void {
        this.tooltip = tooltip;

        this.dropDownActive = tooltip.isOpen() ? card.id : -1;
        tooltip.open({ data: card });

        return;
    }

    public toggleDropdownTruckTrailer(
        truckOrTrailer: string,
        toggle: boolean
    ): void {
        switch (truckOrTrailer) {
            case 'Truck':
                this.truckDropdown = toggle;
                break;

            case 'Trailer':
                this.trailerDropdown = toggle;
                break;
            default:
                break;
        }
    }
}
