import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    OnDestroy,
    ChangeDetectorRef
} from '@angular/core';
import { MapsService } from '../../../services/shared/maps.service';
import { Subject, takeUntil } from 'rxjs';

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

    constructor(private mapsService: MapsService, private ref: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.sortCategory = this.mapsService.sortCategory;

        this.mapsService.sortCategoryChange
            .pipe(takeUntil(this.destroy$))
            .subscribe((category) => {
                this.sortCategory = category;
            });

        if ( this.mapsService.selectedMarkerId ) {
            this.isSelected = this.mapsService.selectedMarkerId == this.item.id;
            this.item.isSelected = this.mapsService.selectedMarkerId == this.item.id;
            console.log('selected card', this.mapsService.selectedMarkerId, this.item.id);
        }

        // this.mapsService.selectedMarkerChange
        //     .pipe(takeUntil(this.destroy$))
        //     .subscribe((id) => {
        //         this.item.isSelected = this.item.id == id;
        //         console.log('selectedMarkerChange', id);
        //         this.ref.detectChanges();
        //     });
    }

    selectCard() {
        this.clickedMarker.emit([this.item.id, false]);
    }

    showMoreOptions(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    callBodyAction(action) {
        this.bodyActions.emit(action);
    }

    // RAITING
    onLike(event) {
        event.preventDefault();
        event.stopPropagation();

        this.bodyActions.emit({
            data: this.item,
            type: 'raiting',
            subType: 'like',
        });
    }

    onDislike(event) {
        event.preventDefault();
        event.stopPropagation();

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
        this.ref.detectChanges();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
