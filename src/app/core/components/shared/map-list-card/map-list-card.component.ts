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
import { MapsService } from '../../../../shared/services/maps.service';
import { Subject, takeUntil } from 'rxjs';
import { DetailsDataService } from 'src/app/shared/services/details-data.service';
import { ModalService } from '../../../../shared/components/ta-modal/modal.service';
import { ThousandSeparatorPipe } from 'src/app/shared/pipes/thousand-separator.pipe';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DetailsDropdownComponent } from '../details-page-dropdown/details-dropdown';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ProfileImagesComponent } from '../profile-images/profile-images.component';
import { FormatDatePipe } from 'src/app/shared/pipes/format-date.pipe';
import { DropDownService } from 'src/app/shared/services/drop-down.service';

@Component({
    selector: 'app-map-list-card',
    templateUrl: './map-list-card.component.html',
    styleUrls: ['./map-list-card.component.scss'],
    providers: [ThousandSeparatorPipe],
    standalone: true,
    imports: [
        // Modules
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AngularSvgIconModule,

        // Components
        DetailsDropdownComponent,
        ProfileImagesComponent,

        // Pipes
        FormatDatePipe,
        ThousandSeparatorPipe,
    ],
})
export class MapListCardComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    @Input() isSelected: boolean = false;
    @Input() status: any = 1;
    @Input() title: string = '';
    @Input() address: any = {};
    @Input() rating: any = {};
    @Input() item: any = {};
    @Input() index: any = {};
    @Input() type: string = '';
    @Output() clickedMarker: EventEmitter<any> = new EventEmitter<any>();
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

        if (this.mapsService.selectedMarkerId) {
            this.isSelected = this.mapsService.selectedMarkerId == this.item.id;
            this.item.isSelected =
                this.mapsService.selectedMarkerId == this.item.id;
        }

        this.mapsService.selectedMarkerChange
            .pipe(takeUntil(this.destroy$))
            .subscribe((id) => {
                if (id != this.item.id && this.detailsDropdown?.tooltip) {
                    this.detailsDropdown.dropDownActive = -1;
                    this.detailsDropdown.tooltip.close();
                }
            });

        this.mapsService.selectedMapListCardChange
            .pipe(takeUntil(this.destroy$))
            .subscribe((id) => {
                if (id != this.item.id && this.detailsDropdown?.tooltip) {
                    this.detailsDropdown.dropDownActive = -1;
                    this.detailsDropdown.tooltip.close();
                }
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
