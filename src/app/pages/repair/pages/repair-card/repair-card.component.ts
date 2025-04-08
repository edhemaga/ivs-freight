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
import { RepairService } from '@shared/services/repair.service';
import { ModalService } from '@shared/services/modal.service';
import { ConfirmationResetService } from '@shared/components/ta-shared-modals/confirmation-reset-modal/services/confirmation-reset.service';

// enums
import { eDropdownMenu, TableStringEnum } from '@shared/enums';

// helpers
import { CardHelper } from '@shared/utils/helpers/card-helper';
import { DropdownMenuActionsHelper } from '@shared/utils/helpers/dropdown-menu-helpers';

// models
import { CardDetails } from '@shared/models/card-models/card-table-data.model';
import { CardRows } from '@shared/models/card-models/card-rows.model';
import {
    MappedRepair,
    MappedRepairShop,
} from '@pages/repair/pages/repair-table/models';
import { IDropdownMenuOptionEmit } from '@ca-shared/components/ca-dropdown-menu/interfaces';

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
    @Input() displayRowsFront: CardRows[];
    @Input() displayRowsBack: CardRows[];

    public destroy$ = new Subject<void>();

    public _viewData: CardDetails[];

    public isCardFlippedCheckInCards: number[] = [];
    public isAllCardsFlipp: boolean = false;

    public dropdownElementWidth: number;

    public eDropdownMenu = eDropdownMenu;

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
        protected tableService: TruckassistTableService,
        protected confirmationResetService: ConfirmationResetService,

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

            items?.forEach(
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
                    this.dropdownElementWidth = width;
                });
            });

            resizeObserver.observe(parentElement);
        }
    }

    public handleToggleDropdownMenuActions(
        action: IDropdownMenuOptionEmit,
        cardData: MappedRepairShop
    ): void {
        const { type } = action;

        const emitAction =
            DropdownMenuActionsHelper.createDropdownMenuActionsEmitAction(
                type,
                cardData
            );

        this.handleDropdownMenuActions(
            emitAction,
            this.selectedTab === TableStringEnum.REPAIR_SHOP
                ? eDropdownMenu.REPAIR_SHOP
                : eDropdownMenu.REPAIR
        );
    }

    public handleShowMoreAction(): void {}

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
