import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
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
  @Output() clickedMarker: EventEmitter<string> = new EventEmitter<string>();
  @Output() bodyActions: EventEmitter<any> = new EventEmitter();
  public locationFilterOn: boolean = false;
  sortCategory: any = {};

  constructor(private mapsService: MapsService) {}

  ngOnInit(): void {
    if (!this.sortCategory?.name) {
      this.sortCategory = { name: 'Business Name', id: 1, sortName: 'name' };
    }

    // this.sortCategory = this.mapsService.sortCategory;

    this.mapsService.sortCategoryChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((category) => {
        this.sortCategory = category
      });
  }

  selectCard() {
    this.clickedMarker.emit(this.index);
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
    console.log('setSortCategory', this.sortCategory);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
