import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  ElementRef,
  ContentChildren,
  QueryList,
  SecurityContext,
  ViewEncapsulation
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MapsService } from '../../../services/shared/maps.service';
import { TruckassistTableService } from '../../../services/truckassist-table/truckassist-table.service';
import { Subject, takeUntil } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-map-list',
  templateUrl: './map-list.component.html',
  styleUrls: ['./map-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MapListComponent implements OnInit, OnChanges, OnDestroy {
  private destroy$ = new Subject<void>();

  @Input() sortTypes: any[] = [];
  @Input() type: string = '';
  @Input() columns: any;
  @Input() mapListContent: any[] = [];
  @Output() changeSortCategory: EventEmitter<any> = new EventEmitter<any>();
  @Output() changeSortDirection: EventEmitter<any> = new EventEmitter<any>();
  @Output() searchData: EventEmitter<any> = new EventEmitter<any>();
  @Output() headActions: EventEmitter<any> = new EventEmitter();
  @ContentChildren('listCard') listCards!: QueryList<any>;
  public mapListExpanded: boolean = true;
  public searchForm!: FormGroup;
  public sortDirection: string = 'asc';
  visibleColumns: any[] = [];
  pinedColumns: any[] = [];
  notPinedColumns: any[] = [];
  actionColumns: any[] = [];
  private tooltip: any;
  showExpandButton: boolean = false;
  activeSortType: any = {};
  searchIsActive: boolean = false;
  searchText: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private ref: ChangeDetectorRef,
    private mapsService: MapsService,
    private tableService: TruckassistTableService,
    private sanitizer: DomSanitizer,
    private elementRef: ElementRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.mapListContent) {
      this.checkResizeButton();

      console.log('changes mapListContent', changes.mapListContent);

      this.mapListContent.map((data, index) => {
        console.log('data.actionAnimation', data.actionAnimation);

        if (
          (data.actionAnimation == 'delete')
        ) {
          this.deleteAnimation(data.id);
          console.log('delete shipper animation', data);
        }
      });

      //console.log('changes.mapListContent');
      // if ( this.searchForm?.get('search').value ) {
      //   setTimeout(() => {
      //     this.highlightSearchedText();
      //   }, 100);
      // }
    }
  }

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      search: '',
    });

    this.searchForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((changes) => {
        this.searchText = changes.search;
        this.onSearch();
      });

    this.setVisibleColumns();

    this.setSortTypes();

    setTimeout(() => {
      this.checkResizeButton();
    }, 100);
  }

  ngAfterContentInit() {
    this.listCards.changes.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.highlightSearchedText();
    });
  }

  resizeMapList() {
    this.mapListExpanded = !this.mapListExpanded;

    var mapListElement =
      document.querySelectorAll<HTMLElement>('.map-list-body')[0];

    var mapListContainer = document.querySelectorAll<HTMLElement>(
      '.map-list-container'
    )[0];

    var containerHeight = mapListContainer.clientHeight; // total height - padding

    var mapListHeight = mapListElement.clientHeight;
    var expandedHeight = mapListElement.scrollHeight;
    mapListElement.style.height = mapListHeight + 'px';

    if (this.mapListExpanded) {
      setTimeout(() => {
        mapListElement.style.height = expandedHeight + 'px';
      }, 10);
    } else {
      setTimeout(() => {
        mapListElement.style.height = ((containerHeight / 2) - 110) + 'px';
      }, 10);
    }
  }

  openPopover(t2) {
    t2.open();
    this.tooltip = t2;
  }

  changeSortingDirection() {
    this.sortDirection = this.sortDirection == 'asc' ? 'desc' : 'asc';

    this.sortData();
  }

  changeSortType(item) {
    this.sortTypes.map((data: any, index) => {
      if (data.isActive) {
        data.isActive = false;
      }
    });

    item.isActive = true;
    this.activeSortType = item;
    this.tooltip.close();

    this.mapsService.sortCategoryChange.next(this.activeSortType);

    this.sortData();
  }

  setVisibleColumns() {
    this.visibleColumns = [];
    this.pinedColumns = [];
    this.notPinedColumns = [];
    this.actionColumns = [];

    this.columns.map((column, index) => {
      if (!column.hasOwnProperty('isPined')) {
        column.isPined = false;
      }

      if (index === 0 || index === 1) {
        column.isPined = true;
      }

      if (!column.hidden) {
        this.visibleColumns.push(column);
      }
    });

    this.visibleColumns.map((v) => {
      /* Pined Columns */
      if (v.isPined) {
        this.pinedColumns.push(v);
      }

      /* Not Pined Columns */
      if (!v.isPined && !v.isAction) {
        this.notPinedColumns.push(v);
      }

      /* Action  Columns */
      if (v.isAction) {
        this.actionColumns.push(v);
      }
    });

    this.ref.detectChanges();
  }

  checkResizeButton() {
    var mapListContainer = document.querySelectorAll<HTMLElement>(
      '.map-list-container'
    )[0];
    var mapListElement =
      document.querySelectorAll<HTMLElement>('.map-list')[0];
    var mapListScrollElement =
      document.querySelectorAll<HTMLElement>('.map-list-body')[0];

    var mapListHeight = mapListContainer.clientHeight - 80; // total height - padding

    if (mapListElement.clientHeight > mapListHeight / 2) {
      this.showExpandButton = true;
      mapListScrollElement.style.height = 'max-content';
    } else {
      this.showExpandButton = false;
    }
  }

  sortData() {
    var sortType = this.sortTypes.find((b) => b.isActive === true);
    if (!sortType) {
      this.sortTypes[0].isActive = true;
      this.activeSortType = this.sortTypes[0];
      sortType = this.sortTypes[0];
    }

    const directionSort = this.sortDirection
      ? sortType.sortName +
        (this.sortDirection[0]?.toUpperCase() +
          this.sortDirection?.substr(1).toLowerCase())
      : '';

    this.headActions.emit({ action: 'sort', direction: directionSort });
  }

  setSortTypes() {
    if (this.type == 'shipper') {
      this.sortTypes = [
        { name: 'Business Name', id: 1, sortName: 'name', isActive: true },
        { name: 'Location', id: 2, sortName: 'location', isHidden: true },
        { name: 'Rating', id: 3, sortName: 'rating' },
        { name: 'Date Added', id: 4, sortName: 'createdAt' },
        { name: 'Last Used Date', id: 5, sortName: 'updatedAt  ' },
        { name: 'Pickups', id: 6, sortName: 'pickups' },
        { name: 'Deliveries', id: 7, sortName: 'deliveries' },
        { name: 'Avg. Pickup Time', id: 8, sortName: 'avgPickupTime' },
        { name: 'Avg. Delivery Time', id: 9, sortName: 'avgDeliveriesTime' },
      ];
    } else if (this.type == 'repairShop') {
      this.sortTypes = [
        { name: 'Business Name', id: 1, sortName: 'name', isActive: true },
        { name: 'Location', id: 2, sortName: 'location', isHidden: true },
        { name: 'Favorites', id: 8, sortName: 'favorites' },
        { name: 'Available', id: 9, sortName: 'available' },
        { name: 'Rating', id: 3, sortName: 'rating' },
        { name: 'Date Added', id: 4, sortName: 'createdAt' },
        { name: 'Last Used Date', id: 5, sortName: 'updatedAt  ' },
        { name: 'Orders', id: 6, sortName: 'orders' },
        { name: 'Total Cost', id: 7, sortName: 'cost' },
      ];
    } else if (this.type == 'fuelShop') {
      this.sortTypes = [
        { name: 'Business Name', id: 1, sortName: 'name', isActive: true },
        { name: 'Location', id: 2, sortName: 'location', isHidden: true },
        { name: 'Favorites', id: 8, sortName: 'favorites' },
        { name: 'Fuel Price', id: 9, sortName: 'fuelPrice' },
        { name: 'Last Used Date', id: 5, sortName: 'updatedAt  ' },
        { name: 'Purchase', id: 6, sortName: 'purchase' },
        { name: 'Total Cost', id: 7, sortName: 'cost' },
      ];
    } else if (this.type == 'accident') {
      this.sortTypes = [
        { name: 'Report Number', id: 1, sortName: 'report', isActive: true },
        { name: 'Location', id: 2, sortName: 'location', isHidden: true },
        { name: 'Inspection Results', id: 8, sortName: 'results' },
        { name: 'Inspection Weights', id: 9, sortName: 'weights' },
        { name: 'Date & Time', id: 3, sortName: 'date' },
        { name: 'Drivers Name', id: 4, sortName: 'driverName' },
        { name: 'Truck Unit', id: 5, sortName: 'truck' },
        { name: 'Trailer Unit', id: 6, sortName: 'trailer' },
      ];
    } else if (this.type == 'roadsideInspection') {
      this.sortTypes = [
        { name: 'Report Number', id: 1, sortName: 'report', isActive: true },
        { name: 'Location', id: 2, sortName: 'location', isHidden: true },
        { name: 'Inspection Results', id: 8, sortName: 'results' },
        { name: 'Inspection Weights', id: 9, sortName: 'weights' },
        { name: 'Date & Time', id: 3, sortName: 'date' },
        { name: 'Drivers Name', id: 4, sortName: 'driverName' },
        { name: 'Truck Unit', id: 5, sortName: 'truck' },
        { name: 'Trailer Unit', id: 6, sortName: 'trailer' },
        {
          name: 'Inspection Level',
          id: 7,
          sortName: 'inspectionLevel',
          isHidden: false,
        },
      ];
    }

    this.activeSortType = this.sortTypes[0];

    this.mapsService.sortCategoryChange.next(this.activeSortType);

    this.sortData();
  }

  onSearch() {
    if (this.searchText?.length >= 3) {
      this.searchIsActive = true;

      this.tableService.sendCurrentSearchTableData({
        chip: 'searchOne',
        search: this.searchText,
        searchType: 'tabel',
      });
    } else if (this.searchIsActive && this.searchText.length < 3) {
      this.searchIsActive = false;

      this.highlightSearchedText();

      this.tableService.sendCurrentSearchTableData({
        chip: 'searchOne',
        doReset: true,
        //all: true, - Returns to Table view
        searchType: 'tabel',
      });
    }
  }

  highlightSearchedText() {
    if (this.searchText?.length >= 3) {
      document
        .querySelectorAll<HTMLElement>(
          '.map-list-card-container .title-text, .map-list-card-container .address-text'
        )
        .forEach((title: HTMLElement, i) => {
          var text = title.textContent;

          const regex = new RegExp(this.searchText, 'gi');
          const newText = text.replace(regex, (match: string) => {
            return `<mark class='highlighted-text'>${match}</mark>`;
          });
          const sanitzed = this.sanitizer.sanitize(
            SecurityContext.HTML,
            newText
          );

          title.innerHTML = sanitzed;
        });
    }
  }

  deleteAnimation(id) {
    const mapListCard: HTMLElement = document.querySelector(
      '[data-id="map-list-card-' + id + '"]'
    );

    if ( mapListCard ) {
      var cardHeight = mapListCard.clientHeight;

      mapListCard.classList.add('delete-animation');

      // mapListCard.style.height = cardHeight + 'px';

      // setTimeout(() => {
      //   mapListCard.style.height = '0px';
      //   mapListCard.style.width = '0%';
      //   mapListCard.style.padding = '0px 6px';
      //   mapListCard.style.border = '0px';
      // }, 10);
    }

    console.log('delete animation', mapListCard);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
