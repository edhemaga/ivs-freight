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
import { RepairDropdownMenuActionsBase } from '@pages/repair/base-classes';

// modules
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

// services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { ModalService } from '@shared/services/modal.service';
import { RepairService } from '@shared/services/repair.service';

// enums
import { DropdownMenuStringEnum, TableStringEnum } from '@shared/enums';

// helpers
import { CardHelper } from '@shared/utils/helpers/card-helper';

// models
import { CardDetails } from '@shared/models/card-models/card-table-data.model';
import { CardRows } from '@shared/models/card-models/card-rows.model';
import {
    MappedRepair,
    MappedRepairShop,
} from '@pages/repair/pages/repair-table/models';
import { DropdownMenuOptionEmit } from '@ca-shared/components/ca-dropdown-menu/models';
import { DropdownMenuActionsHelper } from '@shared/utils/helpers/dropdown-menu-helpers';

@Component({
    selector: 'app-repair-card',
    templateUrl: './repair-card.component.html',
    styleUrls: ['./repair-card.component.scss'],
    providers: [CardHelper],
})
export class RepairCardComponent
    extends RepairDropdownMenuActionsBase
    implements OnInit, AfterViewInit, OnDestroy
{
    @ViewChild('parentElement', { read: ElementRef })
    private cardBodyElement!: ElementRef;

    @Input() set viewData(value: CardDetails[]) {
        this._viewData = value;

        this.getDescriptionSpecialStyleIndexes();
    }

    @Input() selectedTab: string;

    // card body endpoints
    @Input() cardTitle: string;
    @Input() rows: number[];
    @Input() displayRowsFront: CardRows[];
    @Input() displayRowsBack: CardRows[];
    @Input() cardTitleLink: string;

    public destroy$ = new Subject<void>();

    public _viewData: CardDetails[];

    public isCardFlippedCheckInCards: number[] = [];
    public isAllCardsFlipp: boolean = false;

    public elementWidth: number;

    get viewData() {
        return this._viewData;
    }

    constructor(
        // zone
        private ngZone: NgZone,

        // router
        protected router: Router,

        // services
        protected modalService: ModalService,
        protected repairService: RepairService,

        private tableService: TruckassistTableService,

        // helpers
        private cardHelper: CardHelper
    ) {
        super(router, modalService, repairService);
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

    private getDescriptionSpecialStyleIndexes(): void {
        this._viewData = this._viewData.map((repair) => {
            const { items } = repair;

            const pmItemsIndexArray = [];

            items.forEach(
                (item, index) =>
                    (item?.pmTruck || item?.pmTrailer) &&
                    pmItemsIndexArray.push(index)
            );

            return {
                ...repair,
                pmItemsIndexArray,
            };
        });
    }

    public onShowDescriptionDropdown(
        popover: NgbPopover,
        card: MappedRepair
    ): void {
        const { isRepairOrder, tableDescription, tableDescriptionDropTotal } =
            card;

        const repairItemsData = {
            isRepairOrder,
            descriptionItems: tableDescription,
            totalCost: tableDescriptionDropTotal,
        };

        popover.isOpen()
            ? popover.close()
            : popover.open({ data: repairItemsData });
    }

    public windowResizeUpdateDescriptionDropdown(): void {
        if (this.cardBodyElement) {
            const parentElement = this.cardBodyElement
                .nativeElement as HTMLElement;

            const resizeObserver = new ResizeObserver(() => {
                const width = parentElement.offsetWidth;

                this.ngZone.run(() => {
                    this.elementWidth = width;
                });
            });

            resizeObserver.observe(parentElement);
        }
    }

    public handleToggleDropdownMenuActions(
        event: DropdownMenuOptionEmit,
        cardData: MappedRepairShop
    ): void {
        const { type } = event;

        const emitEvent =
            DropdownMenuActionsHelper.createDropdownMenuActionsEmitEvent(
                type,
                cardData
            );

        this.handleDropdownMenuActions(
            emitEvent,
            this.selectedTab === TableStringEnum.REPAIR_SHOP
                ? DropdownMenuStringEnum.REPAIR_SHOP
                : DropdownMenuStringEnum.REPAIR
        );
    }

    public updateMapItem<T>(_: T): void {}

    public handleShowMoreAction(): void {}

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
