import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    OnDestroy,
    ChangeDetectorRef,
    ElementRef,
    ViewChild,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Subject, takeUntil } from 'rxjs';

// icon
import { AngularSvgIconModule } from 'angular-svg-icon';

// services
import { MapsService } from '@shared/services/maps.service';
import { DetailsDataService } from '@shared/services/details-data.service';

// pipes
import { ThousandSeparatorPipe } from '@shared/pipes/thousand-separator.pipe';
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';

// components
import { TaDetailsDropdownComponent } from '@shared/components/ta-details-dropdown/ta-details-dropdown.component';
import { TaProfileImagesComponent } from '@shared/components/ta-profile-images/ta-profile-images.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

// Models
import { AddressEntity } from 'appcoretruckassist';
import { SortColumn } from '@shared/components/ta-sort-dropdown/models';

// tooltip
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

// Svg Routes
import { MapListCardSvgRoutes } from '@shared/components/ta-map-list-card/utils/svg-routes';

@Component({
    selector: 'app-ta-map-list-card',
    templateUrl: './ta-map-list-card.component.html',
    styleUrls: ['./ta-map-list-card.component.scss'],
    providers: [ThousandSeparatorPipe],
    standalone: true,
    imports: [
        // Modules
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AngularSvgIconModule,
        NgbTooltipModule,

        // Components
        TaDetailsDropdownComponent,
        TaProfileImagesComponent,
        TaAppTooltipV2Component,

        // Pipes
        FormatDatePipe,
        ThousandSeparatorPipe,
    ],
})
export class TaMapListCardComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    @Input() isSelected: boolean = false;
    @Input() status: number = 1;
    @Input() title: string = '';
    @Input() address: AddressEntity | null = null;
    @Input() rating: {
        hasLiked: boolean;
        hasDislike: boolean;
        likeCount: number;
        dislikeCount: number;
    } | null = null;
    @Input() item: any = {};
    @Input() type: string = '';
    @Output() bodyActions: EventEmitter<any> = new EventEmitter();
    @ViewChild('detailsDropdown') detailsDropdown: TaDetailsDropdownComponent;

    public locationFilterOn: boolean = false;
    public selectedSortColumn: SortColumn | null = null;
    public hasClickedOnDots: boolean = false;
    dropdownActions: any = {};

    // Svg routes
    public mapListCardSvgRoutes: MapListCardSvgRoutes = MapListCardSvgRoutes;

    constructor(
        private mapsService: MapsService,
        private ref: ChangeDetectorRef,
        public elementRef: ElementRef,
        private detailsDataService: DetailsDataService
    ) {}

    ngOnInit(): void {
        this.addMapServiceListeners();

        this.getDropdownActions();
    }

    public selectCard(): void {
        if (this.hasClickedOnDots) {
            this.hasClickedOnDots = false;
            return;
        }

        const selectId = this.isSelected ? 0 : this.item.id;
        this.mapsService.selectedMapListCard(selectId);
    }

    public showMoreOptions(): void {
        this.hasClickedOnDots = true;
    }

    public callBodyAction(action): void {
        this.bodyActions.emit(action);
    }

    // RAITING
    public onLike(event: Event): void {
        event.preventDefault();
        event.stopPropagation();

        this.detailsDataService.setNewData(this.item);
        this.detailsDataService.changeRateStatus(
            'like',
            !this.rating?.hasLiked
        );

        this.bodyActions.emit({
            data: this.item,
            type: 'raiting',
            subType: 'like',
        });
    }

    public onDislike(event: Event): void {
        event.preventDefault();
        event.stopPropagation();

        this.detailsDataService.setNewData(this.item);
        this.detailsDataService.changeRateStatus(
            'dislike',
            !this.rating?.hasDislike
        );

        this.bodyActions.emit({
            data: this.item,
            type: 'raiting',
            subType: 'dislike',
        });
    }

    public addRemoveSelection(isAdd: boolean): void {
        this.isSelected = isAdd;
        this.item.isSelected = isAdd;

        this.ref.detectChanges();
    }

    public getDropdownActions(): void {
        this.dropdownActions = this.mapsService.getDropdownActions(
            this.item,
            this.type
        );
    }

    public addMapServiceListeners(): void {
        this.selectedSortColumn = this.mapsService.sortCategory;

        this.mapsService.sortCategoryChange
            .pipe(takeUntil(this.destroy$))
            .subscribe((category) => {
                this.selectedSortColumn = category;
            });

        this.mapsService.markerUpdateChange
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => {
                if (item.id == this.item.id) {
                    this.item = item;
                    this.getDropdownActions();
                }
            });

        this.isSelected = this.mapsService.selectedMarkerId == this.item.id;

        this.mapsService.selectedMarkerChange
            .pipe(takeUntil(this.destroy$))
            .subscribe((id) => {
                if (id !== this.item.id && this.detailsDropdown?.tooltip) {
                    this.detailsDropdown.dropDownActive = -1;
                    this.detailsDropdown.tooltip.close();
                }

                this.addRemoveSelection(id == this.item.id);

                this.ref.detectChanges();
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
