import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import {
    ScrollingModule,
    CdkVirtualScrollViewport,
} from '@angular/cdk/scrolling';

// Form
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';

// Services
import { MilesStoreService } from '@pages/miles/state/services/miles-store.service';
// Pipes
import { ThousandSeparatorPipe } from '@shared/pipes';
import { MilesIconPipe } from '@pages/miles/pipes/miles-icon.pipe';

// Components
import { SvgIconComponent } from 'angular-svg-icon';
import { CaInputComponent } from 'ca-components';

@Component({
    selector: 'app-miles-map-unit-list',
    templateUrl: './miles-map-unit-list.component.html',
    styleUrl: './miles-map-unit-list.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ScrollingModule,
        ThousandSeparatorPipe,
        MilesIconPipe,
        SvgIconComponent,
        CaInputComponent,
    ],
})
export class MilesMapUnitListComponent implements OnInit, OnDestroy {
    @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;
    public isStopListExpanded: boolean = false;
    public isLoading: boolean = false;

    private loadingSubscription!: Subscription;

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

    private manageSubscriptions() {
        this.loadingSubscription =
            this.milesStoreService.isMilesDetailsLoadingSelector$.subscribe(
                (loading) => {
                    this.isLoading = loading;
                }
            );
    }

    public toogleStopList(): void {
        this.isStopListExpanded = !this.isStopListExpanded;
    }

    public onScroll(): void {
        if (this.isLoading) return;

        const viewport = this.viewport;
        const scrollOffset = viewport.measureScrollOffset('bottom');
        const threshold = 50;

        if (scrollOffset < threshold) {
            this.milesStoreService.dispatchGetNewList();
            console.log('Scrolled to bottom');
        }
    }

    ngOnDestroy(): void {
        if (this.loadingSubscription) {
            this.loadingSubscription.unsubscribe();
        }
    }
}
