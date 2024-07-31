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
    ViewEncapsulation,
    AfterContentInit,
} from '@angular/core';


import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';


import { Subject, takeUntil } from 'rxjs';

// modules
// import { AgmCoreModule } from '@agm/core';
// import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

// icon
import { AngularSvgIconModule } from 'angular-svg-icon';

// icon
import { MapsService } from '@shared/services/maps.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';

// component
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-ta-map-list',
    templateUrl: './ta-map-list.component.html',
    styleUrls: ['./ta-map-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        // Modules
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
       // AgmCoreModule,
        AngularSvgIconModule,
        NgbPopoverModule,
       // AgmSnazzyInfoWindowModule,

        // Components
        TaInputComponent,
    ],
})
export class TaMapListComponent
    implements OnInit, OnChanges, OnDestroy, AfterContentInit
{
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
    public searchForm!: UntypedFormGroup;
    public sortDirection: string = 'desc';
    visibleColumns: any[] = [];
    pinedColumns: any[] = [];
    notPinedColumns: any[] = [];
    actionColumns: any[] = [];
    private tooltip: any;
    showExpandButton: boolean = false;
    activeSortType: any = {};
    searchIsActive: boolean = false;
    searchText: string = '';
    searchLoading: boolean = false;
    searchTimeout: any;
    searchResultsCount: number = 0;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private ref: ChangeDetectorRef,
        private mapsService: MapsService,
        private tableService: TruckassistTableService,
        private sanitizer: DomSanitizer,
        private elementRef: ElementRef
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.mapListContent) {
            this.checkResizeButton();

            this.mapListContent.map((data) => {
                if (data.actionAnimation == 'delete') {
                    this.deleteAnimation(data.id);
                }
            });
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

                clearTimeout(this.searchTimeout);
                this.searchTimeout = setTimeout(() => {
                    this.onSearch();
                }, 300);
            });

        this.mapsService.selectedMarkerChange
            .pipe(takeUntil(this.destroy$))
            .subscribe((id) => {
                this.listCards.map((card) => {
                    if (card.isSelected && card.item.id != id) {
                        card.addRemoveSelection(false);
                    }

                    if (card.item.id == id) {
                        card.addRemoveSelection(true);
                    }
                });
            });

        this.mapsService.searchLoadingChanged
            .pipe(takeUntil(this.destroy$))
            .subscribe((loading) => {
                this.searchLoading = loading;
            });

        this.mapsService.searchResultsCountChange
            .pipe(takeUntil(this.destroy$))
            .subscribe((count) => {
                this.searchResultsCount = count;
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

            if (this.mapListExpanded) {
                var mapListElement =
                    document.querySelectorAll<HTMLElement>('.map-list-body')[0];
                mapListElement.style.height = '';

                setTimeout(() => {
                    this.checkResizeButton();
                }, 100);
            } else {
                var mapListElement =
                    document.querySelectorAll<HTMLElement>('.map-list-body')[0];

                var childrenElements = mapListElement.children;

                var childElementHeight = childrenElements[0].clientHeight;
                var totalChildrenHeight =
                    childElementHeight * this.listCards.length;

                if (totalChildrenHeight < mapListElement.clientHeight) {
                    mapListElement.style.height = '';
                    this.mapListExpanded = true;

                    setTimeout(() => {
                        this.checkResizeButton();
                    }, 100);
                } else {
                    this.calculateMapListSize();
                }
            }
        });
    }

    resizeMapList() {
        this.mapListExpanded = !this.mapListExpanded;

        this.calculateMapListSize();
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
        this.sortTypes.map((data: any) => {
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

        this.ref.detectChanges();
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

        this.mapsService.sortChange.next(directionSort);
    }

    setSortTypes() {
        if (this.type == 'shipper') {
            this.sortTypes = [
                {
                    name: 'Business Name',
                    id: 1,
                    sortName: 'name',
                    isActive: true,
                },
                {
                    name: 'Location',
                    id: 2,
                    sortName: 'location',
                    isHidden: true,
                },
                { name: 'Rating', id: 3, sortName: 'rating' },
                { name: 'Date Added', id: 4, sortName: 'createdAt' },
                { name: 'Last Used Date', id: 5, sortName: 'updatedAt  ' },
                { name: 'Pickups', id: 6, sortName: 'pickups' },
                { name: 'Deliveries', id: 7, sortName: 'deliveries' },
                { name: 'Avg. Pickup Time', id: 8, sortName: 'avgPickupTime' },
                {
                    name: 'Avg. Delivery Time',
                    id: 9,
                    sortName: 'avgDeliveriesTime',
                },
            ];
        } else if (this.type == 'repairShop') {
            this.sortTypes = [
                {
                    name: 'Business Name',
                    id: 1,
                    sortName: 'name',
                    isActive: true,
                },
                {
                    name: 'Location',
                    id: 2,
                    sortName: 'location',
                    isHidden: true,
                },
                // { name: 'Favorites', id: 8, sortName: 'favorites' },
                { name: 'Available', id: 9, sortName: 'available' },
                { name: 'Rating', id: 3, sortName: 'rating' },
                { name: 'Date Added', id: 4, sortName: 'createdAt' },
                { name: 'Last Used Date', id: 5, sortName: 'updatedAt  ' },
                { name: 'Orders', id: 6, sortName: 'orders' },
                { name: 'Total Cost', id: 7, sortName: 'cost' },
            ];
        } else if (this.type == 'fuelStop') {
            this.sortTypes = [
                {
                    name: 'Business Name',
                    id: 1,
                    sortName: 'name',
                    isActive: true,
                },
                {
                    name: 'Location',
                    id: 2,
                    sortName: 'location',
                    isHidden: true,
                },
                // { name: 'Favorites', id: 8, sortName: 'favorites' },
                { name: 'Fuel Price', id: 9, sortName: 'fuelPrice' },
                { name: 'Last Used Date', id: 5, sortName: 'updatedAt  ' },
                { name: 'Transaction', id: 6, sortName: 'transaction' },
                { name: 'Total Cost', id: 7, sortName: 'cost' },
            ];
        } else if (this.type == 'accident') {
            this.sortTypes = [
                {
                    name: 'Report Number',
                    id: 1,
                    sortName: 'report',
                    isActive: true,
                },
                {
                    name: 'Location',
                    id: 2,
                    sortName: 'location',
                    isHidden: true,
                },
                { name: 'Inspection Results', id: 8, sortName: 'results' },
                { name: 'Inspection Weights', id: 9, sortName: 'weights' },
                { name: 'Date & Time', id: 3, sortName: 'date' },
                { name: 'Drivers Name', id: 4, sortName: 'driverName' },
                { name: 'Truck Unit', id: 5, sortName: 'truck' },
                { name: 'Trailer Unit', id: 6, sortName: 'trailer' },
            ];
        } else if (this.type == 'roadsideInspection') {
            this.sortTypes = [
                {
                    name: 'Report Number',
                    id: 1,
                    sortName: 'report',
                    isActive: true,
                },
                {
                    name: 'Location',
                    id: 2,
                    sortName: 'location',
                    isHidden: true,
                },
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

            this.highlightSearchedText();

            this.mapsService.searchLoadingChanged.next(true);

            this.mapsService.searchTextChanged(this.searchText);
        } else if (this.searchIsActive && this.searchText?.length < 3) {
            this.searchIsActive = false;

            this.highlightSearchedText();

            this.mapsService.searchLoadingChanged.next(true);

            this.mapsService.searchTextChanged('');
        }
    }

    highlightSearchedText() {
        document
            .querySelectorAll<HTMLElement>(
                '.map-list-card-container .title-text, .map-list-card-container .address-text'
            )
            .forEach((title: HTMLElement) => {
                var text = title.textContent;
                var addressElement = title.classList.contains('address-text');

                const regex = new RegExp(this.searchText, 'gi');
                const newText = text.replace(regex, (match: string) => {
                    if (match.length >= 3) {
                        var addressClass = addressElement
                            ? 'regular-weight'
                            : '';

                        return `<mark class='highlighted-text ${addressClass}'>${match}</mark>`;
                    } else {
                        return match;
                    }
                });
                const sanitzed = this.sanitizer.sanitize(
                    SecurityContext.HTML,
                    newText
                );

                title.innerHTML = sanitzed;
            });
    }

    clearSearchInput() {
        this.searchForm.get('search').patchValue('');
        this.searchText = '';
        this.mapsService.searchTextChanged('');
    }

    deleteAnimation(id) {
        const mapListCard: HTMLElement = document.querySelector(
            '[data-id="map-list-card-' + id + '"]'
        );

        if (mapListCard) {
            mapListCard.classList.add('delete-animation');
        }
    }

    calculateMapListSize() {
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
                mapListElement.style.height = containerHeight / 2 - 110 + 'px';
            }, 10);
        }
    }

    mapListScroll(event) {
        var element = event.target;
        if (
            Math.abs(
                element.scrollHeight - element.scrollTop - element.clientHeight
            ) <= 3.0
        ) {
            this.mapsService.mapListScroll(this.mapListContent);
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
