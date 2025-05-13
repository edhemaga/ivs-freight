import { CommonModule } from '@angular/common';
import {
    Component,
    OnInit,
    OnDestroy,
    ViewChild,
    ElementRef,
} from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { Subscription, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

// Modules
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

// Form
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';

// Services
import { MilesStoreService } from '@pages/miles/state/services/miles-store.service';

// Pipes
import { MilesIconPipe } from '@pages/miles/pipes';

// Svg routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

// Components
import { SvgIconComponent } from 'angular-svg-icon';
import {
    CaInputComponent,
    CaDetailsTitleCardComponent,
    eStringPlaceholder,
    eGeneralActions,
} from 'ca-components';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

// Enums
import {
    ArrowActionsStringEnum,
    eThousandSeparatorFormat,
} from '@shared/enums';

// Const
import { MilesStopsTable } from '@pages/miles/utils/constants';

// Helpers
import { onHTMLElementScroll } from '@shared/utils/helpers/scroll-helper';

// Interfaces
import { MilesStopItemResponse } from 'appcoretruckassist';

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
        NgbTooltip,

        // Components
        SvgIconComponent,
        CaInputComponent,
        CaDetailsTitleCardComponent,
        TaAppTooltipV2Component,

        // Pipes
        MilesIconPipe,
    ],
})
export class MilesMapUnitListComponent implements OnInit, OnDestroy {
    @ViewChild('stopListViewport') stopListViewport!: ElementRef;
    @ViewChild('minimalListViewport') minimalListViewport!: ElementRef;

    @ViewChild('detailsTitleCard')
    detailsTitleCard: CaDetailsTitleCardComponent<unknown>;

    private destroy$ = new Subject<void>();

    // svg routes
    public sharedSvgRoutes = SharedSvgRoutes;

    // enums
    public eThousandSeparatorFormat = eThousandSeparatorFormat;

    // configs
    public stopsConfig = MilesStopsTable.HEADER_CONFIG;
    public searchField = MilesStopsTable.SEARCH_FIELD;

    public isStopListWidthExpanded: boolean = false;
    public isStopListHeightExpanded: boolean = false;
    public truckId: number;
    public ArrowActionsStringEnum = ArrowActionsStringEnum;
    public sekeletonSize = new Array(11);

    private scrollSubject: Subject<void> = new Subject();
    private subscriptions: Subscription = new Subscription();

    public searchForm = this.formBuilder.group({
        [eGeneralActions.SEARCH_LOWERCASE]: null,
    });

    constructor(
        private formBuilder: UntypedFormBuilder,
        public milesStoreService: MilesStoreService
    ) {}

    ngOnInit(): void {
        this.manageSubscriptions();
    }

    public onScrollEvent(): void {
        this.scrollSubject.next();
    }

    public onScroll(): void {
        onHTMLElementScroll(
            this.stopListViewport.nativeElement,
            MilesStopsTable.BOTTOM_SCROLL_THRESHOLD,
            () => this.milesStoreService.loadNextStopsPage()
        );
    }

    public getTruckUnit(unitId: string): void {
        this.resetFormValue();
        this.detailsTitleCard.dropdownPopover?.close();
        this.milesStoreService.navigateToMilesDetails(unitId);
    }

    public selectUnit(truckId: string): void {
        this.resetFormValue();
        this.milesStoreService.navigateToMilesDetails(truckId);
        this.detailsTitleCard.dropdownPopover?.close();
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
        onHTMLElementScroll(
            this.minimalListViewport.nativeElement,
            MilesStopsTable.BOTTOM_SCROLL_THRESHOLD,
            () => this.milesStoreService.loadNextMinimalListPage()
        );
    }

    public onClearInputEvent(): void {
        this.searchForm
            .get(eGeneralActions.SEARCH_LOWERCASE)
            .patchValue(eStringPlaceholder.EMPTY);
    }

    public onStopClick(
        stop: MilesStopItemResponse,
        isSelectedStop?: boolean
    ): void {
        if (isSelectedStop) this.milesStoreService.dispatchResetMapStopData();
        else this.milesStoreService.dispatchGetMapStopData(stop.id);
    }

    private manageScrollDebounce(): void {
        this.subscriptions.add(
            this.scrollSubject
                .pipe(takeUntil(this.destroy$), debounceTime(300))
                .subscribe(() => this.onScroll())
        );
    }
    private manageSubscriptions(): void {
        this.subscriptions.add(
            this.milesStoreService.selectedTab$
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => {
                    this.resetFormValue();
                })
        );

        this.manageScrollDebounce();

        this.onSeachFieldChange();
    }

    private onSeachFieldChange(): void {
        this.searchForm
            .get(eGeneralActions.SEARCH_LOWERCASE)
            ?.valueChanges.pipe(takeUntil(this.destroy$), debounceTime(300))
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

        this.destroy$.next();
        this.destroy$.complete();
    }
}
