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
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

// icon
import { AngularSvgIconModule } from 'angular-svg-icon';

// icon
import { MapsService } from '@shared/services/maps.service';

// component
import { TaSearchV2Component } from '@shared/components/ta-search-v2/ta-search-v2.component';

// Svg Routes
import { MapListSvgRoutes } from '@shared/components/ta-map-list/utils/svg-routes';

@Component({
    selector: 'app-ta-map-list',
    templateUrl: './ta-map-list.component.html',
    styleUrls: ['./ta-map-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        // Modules
        CommonModule,
        AngularSvgIconModule,
        NgbPopoverModule,

        // Components
        TaSearchV2Component,
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
    @Output() searchEvent: EventEmitter<string> = new EventEmitter<string>();
    @Output() sortEvent: EventEmitter<string> = new EventEmitter<string>();
    @Output() headActions: EventEmitter<any> = new EventEmitter();
    @ContentChildren('listCard') listCards!: QueryList<any>;
    public mapListExpanded: boolean = true;
    public sortDirection: string = 'desc';
    visibleColumns: any[] = [];
    pinedColumns: any[] = [];
    notPinedColumns: any[] = [];
    actionColumns: any[] = [];
    public tooltip: any;
    showExpandButton: boolean = false;
    activeSortType: any = {};
    searchIsActive: boolean = false;
    searchLoading: boolean = false;
    searchTimeout: any;
    searchResultsCount: number = 0;
    public previousScrollTime = null;
    public searchValue: string | null = null;

    // Svg routes
    public mapListSvgRoutes: MapListSvgRoutes = MapListSvgRoutes;

    constructor(
        private ref: ChangeDetectorRef,
        private mapsService: MapsService,
        private sanitizer: DomSanitizer
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
        this.mapsService.searchLoadingChanged
            .pipe(takeUntil(this.destroy$))
            .subscribe((loading) => {
                this.searchLoading = loading;
            });

        this.setVisibleColumns();

        this.setSortTypes();

        setTimeout(() => {
            this.checkResizeButton();
        }, 100);
    }

    ngAfterContentInit(): void {
        this.listCards.changes.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.highlightSearchedText();

            if (this.mapListExpanded) {
                const mapListElement =
                    document.querySelectorAll<HTMLElement>('.map-list-body')[0];
                mapListElement.style.height = '';

                setTimeout(() => {
                    this.checkResizeButton();
                }, 100);
            } else {
                const mapListElement =
                    document.querySelectorAll<HTMLElement>('.map-list-body')[0];

                const childrenElements = mapListElement.children;

                const childElementHeight = childrenElements[0].clientHeight;
                const totalChildrenHeight =
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

    public resizeMapList(): void {
        this.mapListExpanded = !this.mapListExpanded;

        this.calculateMapListSize();
    }

    public openPopover(t2): void {
        t2.open();
        this.tooltip = t2;
    }

    public changeSortingDirection(): void {
        this.sortDirection = this.sortDirection == 'asc' ? 'desc' : 'asc';

        this.sortData();
    }

    public changeSortType(item): void {
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

    public setVisibleColumns(): void {
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

    public checkResizeButton(): void {
        const mapListContainer = document.querySelectorAll<HTMLElement>(
            '.map-list-container'
        )[0];
        const mapListElement =
            document.querySelectorAll<HTMLElement>('.map-list')[0];
        const mapListScrollElement =
            document.querySelectorAll<HTMLElement>('.map-list-body')[0];

        const mapListHeight = mapListContainer.clientHeight - 80; // total height - padding

        if (mapListElement.clientHeight > mapListHeight / 2) {
            this.showExpandButton = true;
            mapListScrollElement.style.height = 'max-content';
        } else {
            this.showExpandButton = false;
        }

        this.ref.detectChanges();
    }

    public sortData(): void {
        let sortType = this.sortTypes.find((b) => b.isActive === true);
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

        this.sortEvent.emit(directionSort);

        this.mapsService.sortChange.next(directionSort);
    }

    public setSortTypes(): void {
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

    public highlightSearchedText(): void {
        document
            .querySelectorAll<HTMLElement>(
                '.map-list-card-container .title-text, .map-list-card-container .address-text'
            )
            .forEach((title: HTMLElement) => {
                const text = title.textContent;
                const addressElement = title.classList.contains('address-text');

                const regex = new RegExp(this.searchValue, 'gi');
                const newText = text.replace(regex, (match: string) => {
                    if (match.length >= 3) {
                        const addressClass = addressElement
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

    public deleteAnimation(id: number): void {
        const mapListCard: HTMLElement = document.querySelector(
            '[data-id="map-list-card-' + id + '"]'
        );

        if (mapListCard) mapListCard.classList.add('delete-animation');
    }

    public calculateMapListSize(): void {
        const mapListElement =
            document.querySelectorAll<HTMLElement>('.map-list-body')[0];

        const mapListContainer = document.querySelectorAll<HTMLElement>(
            '.map-list-container'
        )[0];

        const containerHeight = mapListContainer.clientHeight; // total height - padding

        const mapListHeight = mapListElement.clientHeight;
        const expandedHeight = mapListElement.scrollHeight;
        mapListElement.style.height = mapListHeight + 'px';

        if (this.mapListExpanded)
            setTimeout(() => {
                mapListElement.style.height = expandedHeight + 'px';
            }, 10);
        else
            setTimeout(() => {
                mapListElement.style.height = containerHeight / 2 - 110 + 'px';
            }, 10);
    }

    public mapListScroll(event: Event): void {
        const element = event.target as HTMLElement;

        const isDoubleScroll =
            new Date().getTime() - this.previousScrollTime < 200;

        if (
            Math.abs(
                element?.scrollHeight -
                    element?.scrollTop -
                    element?.clientHeight
            ) <= 3.0 &&
            !isDoubleScroll
        ) {
            this.mapsService.mapListScroll(this.mapListContent);
            this.previousScrollTime = new Date().getTime();
        }
    }

    public handleSearchValue(searchValue: string): void {
        this.searchValue = searchValue;

        this.searchEvent.emit(searchValue);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
