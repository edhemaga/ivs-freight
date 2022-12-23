import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    OnDestroy,
    ChangeDetectorRef,
    ElementRef,
} from '@angular/core';
import { MapsService } from '../../../services/shared/maps.service';
import { Subject, takeUntil } from 'rxjs';
import { DetailsDataService } from '../../../services/details-data/details-data.service';
import { ConfirmationModalComponent } from '../../modals/confirmation-modal/confirmation-modal.component';
import { ModalService } from './../../shared/ta-modal/modal.service';

@Component({
    selector: 'app-map-list-card',
    templateUrl: './map-list-card.component.html',
    styleUrls: ['./map-list-card.component.scss'],
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
    @Input() dropdownActions: any[] = [];
    @Output() clickedMarker: EventEmitter<any> = new EventEmitter<any>();
    @Output() bodyActions: EventEmitter<any> = new EventEmitter();
    public locationFilterOn: boolean = false;
    sortCategory: any = {};
    clickedOnDots: boolean = false;

    constructor(
        private mapsService: MapsService,
        private ref: ChangeDetectorRef,
        public elementRef: ElementRef,
        private detailsDataService: DetailsDataService,
        private modalService: ModalService
    ) {}

    ngOnInit(): void {
        this.sortCategory = this.mapsService.sortCategory;

        this.mapsService.sortCategoryChange
            .pipe(takeUntil(this.destroy$))
            .subscribe((category) => {
                this.sortCategory = category;
            });

        if (this.mapsService.selectedMarkerId) {
            this.isSelected = this.mapsService.selectedMarkerId == this.item.id;
            this.item.isSelected =
                this.mapsService.selectedMarkerId == this.item.id;
        }
    }

    selectCard(event) {
        if (this.clickedOnDots) {
            this.clickedOnDots = false;
            return false;
        }

        this.clickedMarker.emit([this.item.id, false]);
    }

    showMoreOptions(event) {
        // event.preventDefault();
        // event.stopPropagation();
        this.clickedOnDots = true;
    }

    callBodyAction(action) {
        if (action.type == 'delete' || action.type == 'delete-repair') {
            var name =
                this.type == 'repairShop'
                    ? action.data.name
                    : this.type == 'shipper'
                    ? action.data.name
                    : '';

            var shipperData = {
                id: action.id,
                type: 'delete-item',
                data: {
                    ...action.data,
                    name: name,
                },
            };

            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: 'small' },
                {
                    ...shipperData,
                    template:
                        this.type == 'repairShop' ? 'repair shop' : 'shipper',
                    type: 'delete',
                }
            );
        } else {
            this.bodyActions.emit(action);
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

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
