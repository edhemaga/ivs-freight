import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
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
import { CaInputComponent } from 'ca-components';

// Enums
import { ArrowActionsStringEnum } from '@shared/enums';

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

        // Pipes
        ThousandSeparatorPipe,
        MilesIconPipe,
    ],
})
export class MilesMapUnitListComponent implements OnInit, OnDestroy {
    @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;

    public sharedSvgRoutes = SharedSvgRoutes;

    public isStopListExpanded: boolean = false;
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
        this.milesStoreService.dispatchFollowingUnit(getFollowingUnitDirection);
    }

    public toogleStopList(): void {
        this.isStopListExpanded = !this.isStopListExpanded;
    }

    private manageScrollDebounce(): void {
        this.subscriptions.add(
            this.scrollSubject
                .pipe(debounceTime(300))
                .subscribe(() => this.onScroll())
        );
    }
    private manageSubscriptions(): void {
        // <!-- TODO:  Inside virtual sroll ticket -->
        // this.subscriptions.add(
        //     forkJoin([
        //         this.milesStoreService.isMilesDetailsLoadingSelector$,
        //         this.milesStoreService.isUserOnLastPageSelector$,
        //     ]).subscribe(([loading, isUserOnLastPage]) => {
        //         this.isLoading = loading;
        //         this.isUserOnLastPage = isUserOnLastPage;
        //     })
        // );

        this.manageScrollDebounce();
    }

    ngOnDestroy(): void {
        if (this.subscriptions) {
            this.subscriptions.unsubscribe();
        }
    }
}
