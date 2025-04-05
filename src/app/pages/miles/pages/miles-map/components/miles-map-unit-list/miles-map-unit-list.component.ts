import { CommonModule } from '@angular/common';
import {
    Component,
    OnInit,
    OnDestroy,
    ViewChild,
    ElementRef,
} from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {
    CdkVirtualScrollViewport,
    ScrollingModule,
} from '@angular/cdk/scrolling';

// Form
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';

// Services
import { MilesStoreService } from '@pages/miles/state/services/miles-store.service';

// Pipes
import { ThousandSeparatorPipe } from '@shared/pipes';
import { MilesIconPipe } from '@pages/miles/pipes/miles-icon.pipe';

// Svg routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

// Components
import { SvgIconComponent } from 'angular-svg-icon';
import { CaInputComponent, CaDetailsTitleCardComponent } from 'ca-components';

// Enums
import { ArrowActionsStringEnum } from '@shared/enums';

// Const
import { MilesStopsTable } from '@pages/miles/utils/constants';

// Interface
import { IMilesModel, IMilesState } from '@pages/miles/interface';

@Component({
    selector: 'app-miles-map-unit-list',
    templateUrl: './miles-map-unit-list.component.html',
    styleUrls: ['./miles-map-unit-list.component.scss'],
    standalone: true,
    imports: [
        // Modules
        CommonModule,
        ReactiveFormsModule,
        ScrollingModule,

        // Components
        SvgIconComponent,
        CaInputComponent,
        CaDetailsTitleCardComponent,

        // Pipes
        ThousandSeparatorPipe,
        MilesIconPipe,
    ],
})
export class MilesMapUnitListComponent implements OnInit, OnDestroy {
    @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;
    @ViewChild('minimalListViewport') minimalListViewport!: ElementRef;

    public sharedSvgRoutes = SharedSvgRoutes;
    public stopsConfig = MilesStopsTable.HEADER_CONFIG;
    public searchField = MilesStopsTable.SEARCH_FIELD;

    public isStopListWidthExpanded: boolean = false;
    public isStopListHeightExpanded: boolean = false;
    public isLoading: boolean = false;
    public isUserOnLastPage: boolean = false;
    public truckId: number;
    public ArrowActionsStringEnum = ArrowActionsStringEnum;

    private scrollSubject: Subject<void> = new Subject();
    private subscriptions: Subscription = new Subscription();

    public searchForm = this.formBuilder.group({
        search: null,
    });

    constructor(
        private formBuilder: UntypedFormBuilder,
        public milesStoreService: MilesStoreService
    ) {}

    ngOnInit(): void {
        this.manageSubscriptions();
    }

    public onScrollEvent(): void {
        if (this.isLoading || this.isUserOnLastPage) return;
        this.scrollSubject.next();
    }

    public onScroll(): void {
        const viewport = this.viewport;
        const scrollOffset = viewport.measureScrollOffset('bottom');
        const threshold = 100;

        if (scrollOffset < threshold) {
        }
    }

    public getTruckUnit(
        getFollowingUnitDirection: ArrowActionsStringEnum
    ): void {
        this.resetFormValue();
        this.milesStoreService.dispatchFollowingUnit(getFollowingUnitDirection);
    }

    public selectUnit(unit: IMilesModel): void {
        this.resetFormValue();
        this.milesStoreService.dispatchSelectUnit(unit);
    }

    public toogleStopListWidth(): void {
        this.isStopListWidthExpanded = !this.isStopListWidthExpanded;
    }

    public toogleStopListHeight(): void {
        this.isStopListHeightExpanded = !this.isStopListHeightExpanded;
    }

    public onSearchTextChange(text: string): void {
        this.milesStoreService.dispatchSearchMinimalUnitList(text);
    }

    public onMinimalListScroll(): void {
        const element = this.minimalListViewport.nativeElement;
        const scrollOffset = element.scrollHeight - element.scrollTop;
        const threshold = 100;

        if (scrollOffset <= element.clientHeight + threshold) {
            this.milesStoreService.loadNextMinimalListPage();
        }
    }

    private manageScrollDebounce(): void {
        this.subscriptions.add(
            this.scrollSubject
                .pipe(debounceTime(300))
                .subscribe(() => this.onScroll())
        );
    }
    private manageSubscriptions(): void {
        this.subscriptions.add(
            this.milesStoreService.selectedTab$.subscribe(() => {
                this.resetFormValue();
            })
        );

        this.manageScrollDebounce();

        this.onSeachFieldChange();
    }

    private onSeachFieldChange(): void {
        this.searchForm
            .get('search')
            ?.valueChanges.pipe(debounceTime(300))
            .subscribe((value) => {
                this.milesStoreService.dispatchSearchInputChanged(value);
            });
    }

    private resetFormValue(): void {
        this.searchForm.reset({}, { onlySelf: true, emitEvent: false });
    }

    ngOnDestroy(): void {
        if (this.subscriptions) {
            this.subscriptions.unsubscribe();
        }
    }
}
