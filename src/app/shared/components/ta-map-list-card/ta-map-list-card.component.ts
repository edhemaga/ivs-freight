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
import { ModalService } from '@shared/services/modal.service';
import { DropDownService } from '@shared/services/drop-down.service';

// pipes
import { ThousandSeparatorPipe } from '@shared/pipes/thousand-separator.pipe';
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';

// components
import { TaDetailsDropdownComponent } from '@shared/components/ta-details-dropdown/ta-details-dropdown.component';
import { TaProfileImagesComponent } from '@shared/components/ta-profile-images/ta-profile-images.component';
import { AddressEntity } from 'appcoretruckassist';

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

        // Components
        TaDetailsDropdownComponent,
        TaProfileImagesComponent,

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
    @ViewChild('detailsDropdown') detailsDropdown: any;
    public locationFilterOn: boolean = false;
    sortCategory: any = {};
    clickedOnDots: boolean = false;
    dropdownActions: any = {};

    constructor(
        private mapsService: MapsService,
        private ref: ChangeDetectorRef,
        public elementRef: ElementRef,
        private detailsDataService: DetailsDataService,
        private modalService: ModalService,
        private dropdownService: DropDownService
    ) {}

    ngOnInit(): void {
        this.sortCategory = this.mapsService.sortCategory;

        this.mapsService.sortCategoryChange
            .pipe(takeUntil(this.destroy$))
            .subscribe((category) => {
                this.sortCategory = category;
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

        this.getDropdownActions();
    }

    selectCard() {
        if (this.clickedOnDots) {
            this.clickedOnDots = false;
            return false;
        }

        const selectId = this.isSelected ? 0 : this.item.id;
        this.mapsService.selectedMapListCard(selectId);
    }

    showMoreOptions() {
        this.clickedOnDots = true;
    }

    callBodyAction(action) {
        // if (action.type == 'delete' || action.type == 'delete-repair') {
        //     var name =
        //         this.type == 'repairShop'
        //             ? action.data.name
        //             : this.type == 'shipper'
        //             ? action.data.businessName
        //             : '';

        //     var shipperData = {
        //         id: action.id,
        //         type: 'delete-item',
        //         data: {
        //             ...action.data,
        //             name: name,
        //         },
        //     };

        //     this.modalService.openModal(
        //         ConfirmationModalComponent,
        //         { size: 'small' },
        //         {
        //             ...shipperData,
        //             template:
        //                 this.type == 'repairShop' ? 'repair shop' : 'shipper',
        //             type: 'delete',
        //         }
        //     );
        // } else {
        //     this.bodyActions.emit(action);
        // }

        if (action.type == 'view-details') {
            this.mapsService.goToDetails(this.item, this.type);
        } else {
            if (this.type == 'repairShop') {
                if (action.type == 'write-review') {
                    action.type = 'edit';
                    action.openedTab = 'Review';
                }

                this.dropdownService.dropActionsHeaderRepair(
                    action,
                    this.item,
                    action.id
                );
            } else if (this.type == 'shipper') {
                let eventType = '';
                if (
                    action.type == 'Contact' ||
                    action.type == 'edit' ||
                    action.type == 'Review'
                ) {
                    eventType = 'edit';
                } else {
                    eventType = action.type;
                }

                let eventObject = {
                    data: undefined,
                    id: action.id,
                    type: eventType,
                    openedTab: action.type,
                };
                setTimeout(() => {
                    this.dropdownService.dropActionsHeaderShipperBroker(
                        eventObject,
                        this.item,
                        'shipper'
                    );
                }, 100);
            }
        }
    }

    // RAITING
    onLike(event) {
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

    onDislike(event) {
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

    setSortCategory(category) {
        this.sortCategory = category;
    }

    addRemoveSelection(add) {
        this.isSelected = add;
        this.item.isSelected = add;

        if (add) {
            this.elementRef.nativeElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }

        this.ref.detectChanges();
    }

    onFavorite(event) {
        event.preventDefault();
        event.stopPropagation();

        this.bodyActions.emit({
            data: this.item,
            type: 'favorite',
        });
    }

    getDropdownActions() {
        this.dropdownActions = this.mapsService.getDropdownActions(
            this.item,
            this.type
        );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
