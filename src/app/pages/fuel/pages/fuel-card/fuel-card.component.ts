import {
    AfterViewInit,
    Component,
    ElementRef,
    Input,
    NgZone,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

// base classes
import { FuelDropdownMenuActionsBase } from '@pages/fuel/base-classes';

// modules
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

// helpers
import { CardHelper } from '@shared/utils/helpers/card-helper';
import { DropdownMenuActionsHelper } from '@shared/utils/helpers/dropdown-menu-helpers';

// enums
import { DropdownMenuStringEnum, TableStringEnum } from '@shared/enums';

// services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { ModalService } from '@shared/services/modal.service';
import { FuelService } from '@shared/services/fuel.service';

// svg routes
import { FuelCardSvgRoutes } from '@pages/fuel/pages/fuel-card/utils/svg-routes';

// models
import { CardRows } from '@shared/models/card-models/card-rows.model';
import { CardDetails } from '@shared/models/card-models/card-table-data.model';
import { MappedRepair } from '@pages/repair/pages/repair-table/models';
import { DropdownMenuOptionEmit } from '@ca-shared/components/ca-dropdown-menu/models';
import { FuelStopResponse, FuelTransactionResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-fuel-card',
    templateUrl: './fuel-card.component.html',
    styleUrls: ['./fuel-card.component.scss'],
    providers: [CardHelper],
})
export class FuelCardComponent
    extends FuelDropdownMenuActionsBase
    implements OnInit, AfterViewInit, OnDestroy
{
    @ViewChild('parentElement', { read: ElementRef })
    private cardBodyElement!: ElementRef;

    @Input() set viewData(value: CardDetails[]) {
        this._viewData = value;
    }

    @Input() selectedTab: string;

    // card body endpoints
    @Input() displayRowsFront: CardRows[];
    @Input() displayRowsBack: CardRows[];

    public destroy$ = new Subject<void>();

    public _viewData: CardDetails[];

    public isCardFlippedCheckInCards: number[] = [];
    public isAllCardsFlipp: boolean;

    public dropdownElementWidth: number;

    public fuelCardSvgRoutes = FuelCardSvgRoutes;

    constructor(
        // zone
        private ngZone: NgZone,

        // router
        protected router: Router,

        // services
        protected modalService: ModalService,
        protected fuelService: FuelService,

        private tableService: TruckassistTableService,

        // helpers
        private cardHelper: CardHelper
    ) {
        super();
    }

    ngOnInit() {
        this.flipAllCards();
    }

    ngAfterViewInit(): void {
        this.windowResizeUpdateDescriptionDropdown();
    }

    public trackCard(item: number): number {
        return item;
    }

    public flipCard(index: number): void {
        this.isCardFlippedCheckInCards = this.cardHelper.flipCard(index);
    }

    public flipAllCards(): void {
        this.tableService.isFlipedAllCards
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                this.isAllCardsFlipp = res;

                this.isCardFlippedCheckInCards = [];
                this.cardHelper.isCardFlippedArrayComparasion = [];
            });
    }

    public onCheckboxSelect(index: number, card: CardDetails): void {
        this._viewData[index].isSelected = !this._viewData[index].isSelected;

        const checkedCard = this.cardHelper.onCheckboxSelect(index, card);

        this.tableService.sendRowsSelected(checkedCard);
    }

    public onShowDescriptionDropdown(
        popover: NgbPopover,
        card: MappedRepair
    ): void {
        const { tableDescription, tableDescriptionDropTotal } = card;

        const fuelItemsData = {
            descriptionItems: tableDescription,
            totalCost: tableDescriptionDropTotal,
        };

        popover.isOpen()
            ? popover.close()
            : popover.open({ data: fuelItemsData });
    }

    public windowResizeUpdateDescriptionDropdown(): void {
        if (this.cardBodyElement) {
            const parentElement = this.cardBodyElement
                .nativeElement as HTMLElement;

            const resizeObserver = new ResizeObserver(() => {
                const width = parentElement.offsetWidth;

                this.ngZone.run(() => {
                    this.dropdownElementWidth = width;
                });
            });

            resizeObserver.observe(parentElement);
        }
    }

    public handleToggleDropdownMenuActions(
        action: DropdownMenuOptionEmit,
        cardData: FuelTransactionResponse | FuelStopResponse
    ): void {
        const { type } = action;

        const emitAction =
            DropdownMenuActionsHelper.createDropdownMenuActionsEmitAction(
                type,
                cardData
            );

        this.handleDropdownMenuActions(
            emitAction,
            this.selectedTab === TableStringEnum.FUEL_STOP
                ? DropdownMenuStringEnum.FUEL_STOP
                : DropdownMenuStringEnum.FUEL_TRANSACTION
        );
    }

    public handleShowMoreAction(): void {}

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
